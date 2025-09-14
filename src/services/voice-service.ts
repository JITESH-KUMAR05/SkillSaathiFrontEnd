/**
 * Voice Service for Text-to-Speech functionality
 * Provides voice synthesis for agent responses
 */

export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
  language: string;
}

export class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private isSupported: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    this.synth = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
    this.isInitialized = true;
    this.loadVoices();
  }

  private ensureInitialized() {
    if (!this.isInitialized && typeof window !== 'undefined') {
      this.init();
    }
  }

  private loadVoices() {
    if (!this.isSupported || !this.synth) return;

    const loadVoicesOnce = () => {
      if (this.synth) {
        this.voices = this.synth.getVoices();
      }
    };

    // Chrome loads voices asynchronously
    if (this.synth.getVoices().length === 0) {
      this.synth.addEventListener('voiceschanged', loadVoicesOnce, { once: true });
    } else {
      loadVoicesOnce();
    }
  }

  /**
   * Get available voices filtered by language
   */
  getVoices(language?: string): SpeechSynthesisVoice[] {
    if (!this.isSupported) return [];
    
    if (!language) return this.voices;
    
    return this.voices.filter(voice => 
      voice.lang.startsWith(language) || voice.lang.startsWith(language.split('-')[0])
    );
  }

  /**
   * Get the best voice for Indian languages
   */
  getIndianVoice(): SpeechSynthesisVoice | null {
    const indianVoices = this.voices.filter(voice => 
      voice.lang.includes('hi') || // Hindi
      voice.lang.includes('en-IN') || // Indian English
      voice.name.toLowerCase().includes('india') ||
      voice.name.toLowerCase().includes('hindi')
    );

    // Prefer female voices for a friendlier tone
    const femaleVoice = indianVoices.find(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('veena') ||
      voice.name.toLowerCase().includes('kalpana')
    );

    return femaleVoice || indianVoices[0] || null;
  }

  /**
   * Speak text with custom settings
   */
  async speak(
    text: string, 
    settings: Partial<VoiceSettings> = {}
  ): Promise<void> {
    this.ensureInitialized();
    
    if (!this.isSupported || !this.synth || !text.trim()) {
      return Promise.reject(new Error('Speech synthesis not supported or empty text'));
    }

    // Stop any current speech
    this.stop();

    const defaultSettings: VoiceSettings = {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
      language: 'en-IN',
      voice: this.getIndianVoice() || undefined
    };

    const finalSettings = { ...defaultSettings, ...settings };

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = finalSettings.rate;
      utterance.pitch = finalSettings.pitch;
      utterance.volume = finalSettings.volume;
      utterance.lang = finalSettings.language;
      
      if (finalSettings.voice) {
        utterance.voice = finalSettings.voice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      utterance.onstart = () => {
        console.log('Voice synthesis started');
      };

      this.currentUtterance = utterance;
      if (this.synth) {
        this.synth.speak(utterance);
      }
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.isSupported && this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.isSupported && this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.isSupported && this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.isSupported && this.synth ? this.synth.speaking : false;
  }

  /**
   * Check if speech is paused
   */
  isPaused(): boolean {
    return this.isSupported && this.synth ? this.synth.paused : false;
  }

  /**
   * Check if voice synthesis is supported
   */
  isVoiceSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Agent-specific voice settings
   */
  getAgentVoiceSettings(agent: 'mitra' | 'guru' | 'parikshak'): Partial<VoiceSettings> {
    const baseSettings = {
      volume: 0.8,
      language: 'en-IN'
    };

    switch (agent) {
      case 'mitra':
        return {
          ...baseSettings,
          rate: 0.85,
          pitch: 1.1, // Slightly higher pitch for caring tone
        };
      
      case 'guru':
        return {
          ...baseSettings,
          rate: 0.9,
          pitch: 1.0, // Neutral pitch for educational content
        };
      
      case 'parikshak':
        return {
          ...baseSettings,
          rate: 0.95,
          pitch: 0.95, // Slightly lower pitch for professional tone
        };
      
      default:
        return baseSettings;
    }
  }

  /**
   * Speak agent response with appropriate voice settings
   */
  async speakAgentResponse(
    text: string, 
    agent: 'mitra' | 'guru' | 'parikshak'
  ): Promise<void> {
    const agentSettings = this.getAgentVoiceSettings(agent);
    return this.speak(text, agentSettings);
  }
}

// Create a singleton instance only on client side
let voiceServiceInstance: VoiceService | null = null;

export const getVoiceService = (): VoiceService => {
  if (typeof window === 'undefined') {
    // Return a dummy service for SSR
    return {
      speak: () => Promise.reject(new Error('Voice not available on server')),
      speakAgentResponse: () => Promise.reject(new Error('Voice not available on server')),
      stop: () => {},
      pause: () => {},
      resume: () => {},
      isSpeaking: () => false,
      isPaused: () => false,
      isVoiceSupported: () => false,
      getVoices: () => [],
    } as any;
  }
  
  if (!voiceServiceInstance) {
    voiceServiceInstance = new VoiceService();
  }
  return voiceServiceInstance;
};

export const voiceService = getVoiceService();

// Utility hook for React components
export function useVoice() {
  const service = getVoiceService();
  
  return {
    speak: service.speak.bind(service),
    speakAgentResponse: service.speakAgentResponse.bind(service),
    stop: service.stop.bind(service),
    pause: service.pause.bind(service),
    resume: service.resume.bind(service),
    isSpeaking: service.isSpeaking.bind(service),
    isPaused: service.isPaused.bind(service),
    isSupported: service.isVoiceSupported(),
    getVoices: service.getVoices.bind(service),
  };
}