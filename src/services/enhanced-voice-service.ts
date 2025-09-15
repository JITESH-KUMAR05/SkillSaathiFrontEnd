/**
 * Enhanced Voice Service for Siri-like Voice Conversation
 * Provides automatic voice input/output with Murf API integration
 */

import { apiService } from './api';
import type { VoiceRequest, AgentType } from '../types/modern';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    AudioContext: any;
    webkitAudioContext: any;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface VoiceSettings {
  autoPlay: boolean;
  speechRecognition: boolean;
  voiceActivation: boolean;
  language: string;
  agent: AgentType;
}

export interface VoiceInputEvent {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export class EnhancedVoiceService {
  private isListening: boolean = false;
  private recognition: SpeechRecognition | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private settings: VoiceSettings;
  private onVoiceInput?: (event: VoiceInputEvent) => void;
  private onVoiceStart?: () => void;
  private onVoiceEnd?: () => void;
  private onError?: (error: string) => void;
  private hasUserInteracted: boolean = false;
  private audioContext: AudioContext | null = null;

  constructor(settings: Partial<VoiceSettings> = {}) {
    this.settings = {
      autoPlay: false, // DISABLED: Don't auto-play by default
      speechRecognition: true,
      voiceActivation: false, // DISABLED: Don't auto-activate voice
      language: 'en-IN',
      agent: 'mitra',
      ...settings
    };
    
    this.initializeSpeechRecognition();
    this.setupUserInteractionDetection();
  }

  private setupUserInteractionDetection() {
    if (typeof window === 'undefined') return;

    const handleUserInteraction = () => {
      this.hasUserInteracted = true;
      
      // Initialize audio context on first user interaction
      if (!this.audioContext) {
        try {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
          console.warn('Could not create AudioContext:', error);
        }
      }
      
      // Remove listeners after first interaction
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });
  }

  private initializeSpeechRecognition() {
    if (typeof window === 'undefined') return;

    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    
    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.settings.language;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onVoiceStart?.();
        console.log('🎤 Voice recognition started');
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          this.onVoiceInput?.({
            text: finalTranscript.trim(),
            confidence: event.results[event.results.length - 1][0].confidence || 0.9,
            isFinal: true
          });
        } else if (interimTranscript) {
          this.onVoiceInput?.({
            text: interimTranscript.trim(),
            confidence: 0.5,
            isFinal: false
          });
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Voice recognition error:', event.error);
        this.onError?.(`Voice recognition error: ${event.error}`);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onVoiceEnd?.();
        console.log('🎤 Voice recognition ended');
        
        // Auto-restart if voice activation is enabled
        if (this.settings.voiceActivation) {
          setTimeout(() => this.startListening(), 1000);
        }
      };
    }
  }

  /**
   * Start listening for voice input
   */
  startListening(): boolean {
    if (!this.recognition) {
      this.onError?.('Speech recognition not available');
      return false;
    }

    if (this.isListening) {
      console.log('Already listening...');
      return true;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.onError?.('Failed to start voice recognition');
      return false;
    }
  }

  /**
   * Stop listening for voice input
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Generate speech using Murf API and auto-play
   */
  async speakText(text: string, autoPlay: boolean = true): Promise<boolean> {
    try {
      console.log('🔊 Generating speech with Murf API:', text.substring(0, 50) + '...');
      
      // Stop any currently playing audio
      this.stopCurrentAudio();

      const voiceRequest: VoiceRequest = {
        text: text,
        agent: this.settings.agent,
        language: this.settings.language || 'en-IN',
        quality: 'good',
        format: 'mp3'
      };

      // Generate speech using backend Murf API with timeout
      const audioBlob = await Promise.race([
        apiService.generateVoice(voiceRequest),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
      ]);
      
      if (!audioBlob) {
        throw new Error('No audio data received from Murf API');
      }

      // Create audio URL from blob
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Configure audio playback
      audio.preload = 'auto';
      this.currentAudio = audio;

      // Only auto-play if user has interacted and autoplay is enabled
      if (autoPlay && this.settings.autoPlay && this.hasUserInteracted) {
        try {
          await this.playAudio(audio);
          console.log('✅ Speech generated and played successfully');
        } catch (playError) {
          console.warn('Auto-play failed, user needs to click play button:', playError);
          // Don't throw error, just log warning - audio is ready to play manually
        }
      } else if (!this.hasUserInteracted) {
        console.log('🔇 Audio ready but waiting for user interaction to enable autoplay');
      }

      return true;

    } catch (error) {
      console.error('Failed to generate/play speech:', error);
      this.onError?.(`Failed to generate speech: ${error}`);
      return false;
    }
  }

  /**
   * Play audio with proper error handling
   */
  private async playAudio(audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audio.src);
        resolve();
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(audio.src);
        reject(new Error('Audio playback failed'));
      };

      audio.play().catch(error => {
        URL.revokeObjectURL(audio.src);
        reject(error);
      });
    });
  }

  /**
   * Manually play the current audio (for when autoplay is blocked)
   */
  async playCurrentAudio(): Promise<boolean> {
    if (!this.currentAudio) {
      console.warn('No audio to play');
      return false;
    }

    try {
      await this.playAudio(this.currentAudio);
      return true;
    } catch (error) {
      console.error('Failed to play current audio:', error);
      return false;
    }
  }

  /**
   * Stop currently playing audio
   */
  stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      if (this.currentAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(this.currentAudio.src);
      }
      this.currentAudio = null;
    }
  }

  /**
   * Check if there's audio ready to play
   */
  hasAudioReady(): boolean {
    return this.currentAudio !== null;
  }

  /**
   * Toggle voice activation mode (continuous listening)
   */
  toggleVoiceActivation() {
    this.settings.voiceActivation = !this.settings.voiceActivation;
    
    if (this.settings.voiceActivation) {
      this.startListening();
    } else {
      this.stopListening();
    }
    
    return this.settings.voiceActivation;
  }

  /**
   * Set event handlers
   */
  setEventHandlers({
    onVoiceInput,
    onVoiceStart,
    onVoiceEnd,
    onError
  }: {
    onVoiceInput?: (event: VoiceInputEvent) => void;
    onVoiceStart?: () => void;
    onVoiceEnd?: () => void;
    onError?: (error: string) => void;
  }) {
    this.onVoiceInput = onVoiceInput;
    this.onVoiceStart = onVoiceStart;
    this.onVoiceEnd = onVoiceEnd;
    this.onError = onError;
  }

  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    
    // Update recognition language if changed
    if (this.recognition && newSettings.language) {
      this.recognition.lang = newSettings.language;
    }
  }

  /**
   * Get current settings
   */
  getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  /**
   * Check if voice features are supported
   */
  isSupported(): {
    speechRecognition: boolean;
    audioPlayback: boolean;
  } {
    return {
      speechRecognition: !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition,
      audioPlayback: typeof Audio !== 'undefined'
    };
  }

  /**
   * Get listening status
   */
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  /**
   * Cleanup resources
   */
  dispose() {
    this.stopListening();
    this.stopCurrentAudio();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.recognition = null;
    this.audioContext = null;
  }
}

// Create singleton instance
export const voiceService = new EnhancedVoiceService();

// Voice Activity Detection Helper
export class VoiceActivityDetection {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private isDetecting: boolean = false;
  private threshold: number = 50; // Voice detection threshold
  private onVoiceActivity?: (isActive: boolean) => void;

  async initialize(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (this.audioContext) {
        this.analyser = this.audioContext.createAnalyser();
        this.microphone = this.audioContext.createMediaStreamSource(stream);
        
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;
        this.microphone.connect(this.analyser);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize voice activity detection:', error);
      return false;
    }
  }

  startDetection(onVoiceActivity: (isActive: boolean) => void) {
    if (!this.analyser || this.isDetecting) return;
    
    this.onVoiceActivity = onVoiceActivity;
    this.isDetecting = true;
    this.detectVoiceActivity();
  }

  private detectVoiceActivity() {
    if (!this.analyser || !this.isDetecting) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    const sum = dataArray.reduce((acc, value) => acc + value, 0);
    const average = sum / bufferLength;

    const isVoiceActive = average > this.threshold;
    this.onVoiceActivity?.(isVoiceActive);

    // Continue detection
    requestAnimationFrame(() => this.detectVoiceActivity());
  }

  stopDetection() {
    this.isDetecting = false;
  }

  setThreshold(threshold: number) {
    this.threshold = Math.max(0, Math.min(255, threshold));
  }

  dispose() {
    this.stopDetection();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export const vadService = new VoiceActivityDetection();