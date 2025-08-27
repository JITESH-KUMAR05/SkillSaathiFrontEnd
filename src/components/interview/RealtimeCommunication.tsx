'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Radio,
  WifiOff,
  Signal,
  Activity,
  Zap,
  MessageCircle,
  Brain,
  Eye,
  EyeOff,
  Settings,
  RotateCcw,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface AudioVisualizerProps {
  isActive: boolean
  volume: number
  className?: string
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, volume, className }) => {
  const bars = Array.from({ length: 12 }, (_, i) => i)
  
  return (
    <div className={cn("flex items-end gap-1 h-8", className)}>
      {bars.map((bar) => (
        <div
          key={bar}
          className={cn(
            "bg-gradient-to-t transition-all duration-100",
            isActive 
              ? "from-electric-500 to-electric-300 animate-pulse" 
              : "from-white/20 to-white/10"
          )}
          style={{
            width: '3px',
            height: isActive 
              ? `${Math.max(4, (volume * 32) + Math.random() * 8)}px`
              : '4px',
            animationDelay: `${bar * 50}ms`
          }}
        />
      ))}
    </div>
  )
}

interface ConnectionQualityProps {
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  latency: number
  bandwidth: number
  packetLoss: number
}

const ConnectionQuality: React.FC<ConnectionQualityProps> = ({ 
  quality, 
  latency, 
  bandwidth, 
  packetLoss 
}) => {
  const getQualityColor = () => {
    switch (quality) {
      case 'excellent': return 'text-emerald-400'
      case 'good': return 'text-green-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-white/50'
    }
  }

  const getSignalBars = () => {
    switch (quality) {
      case 'excellent': return 4
      case 'good': return 3
      case 'fair': return 2
      case 'poor': return 1
      default: return 0
    }
  }

  return (
    <Card variant="glass" className="p-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white flex items-center gap-2">
          <Signal className={cn("w-4 h-4", getQualityColor())} />
          Connection Quality
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Signal Strength */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-sm transition-all duration-300",
                  i < getSignalBars()
                    ? cn("bg-current", getQualityColor())
                    : "bg-white/20"
                )}
                style={{ height: `${(i + 1) * 3 + 4}px` }}
              />
            ))}
          </div>
          <span className={cn("text-xs font-medium", getQualityColor())}>
            {quality.toUpperCase()}
          </span>
        </div>

        {/* Metrics */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/70">Latency:</span>
            <span className={cn(
              latency < 50 ? "text-emerald-400" : 
              latency < 100 ? "text-yellow-400" : "text-red-400"
            )}>
              {latency}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Bandwidth:</span>
            <span className="text-white">{bandwidth.toFixed(1)} Mbps</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Packet Loss:</span>
            <span className={cn(
              packetLoss < 1 ? "text-emerald-400" : 
              packetLoss < 3 ? "text-yellow-400" : "text-red-400"
            )}>
              {packetLoss.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AIActivityIndicatorProps {
  isProcessing: boolean
  confidence: number
  lastResponse: string
}

const AIActivityIndicator: React.FC<AIActivityIndicatorProps> = ({ 
  isProcessing, 
  confidence, 
  lastResponse 
}) => {
  return (
    <Card variant="agent" agent="interview" className="p-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white flex items-center gap-2">
          <Brain className="w-4 h-4 text-electric-400" />
          AI Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Processing Indicator */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
            isProcessing 
              ? "bg-electric-400 animate-pulse" 
              : "bg-white/20"
          )} />
          <span className="text-sm text-white">
            {isProcessing ? 'Processing...' : 'Listening'}
          </span>
        </div>

        {/* Confidence Level */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/70">Confidence:</span>
            <span className="text-white">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-electric-400 to-electric-300 h-2 rounded-full transition-all duration-300"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Last Response Preview */}
        {lastResponse && (
          <div className="pt-2 border-t border-white/10">
            <div className="text-xs text-white/70 mb-1">Last Response:</div>
            <div className="text-xs text-white bg-white/5 rounded p-2 max-h-16 overflow-hidden">
              {lastResponse.substring(0, 100)}...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface VoiceControlsProps {
  isMuted: boolean
  onToggleMute: () => void
  volume: number
  onVolumeChange: (volume: number) => void
  noiseCancellation: boolean
  onNoiseToggle: () => void
  echoCancellation: boolean
  onEchoToggle: () => void
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isMuted,
  onToggleMute,
  volume,
  onVolumeChange,
  noiseCancellation,
  onNoiseToggle,
  echoCancellation,
  onEchoToggle
}) => {
  const [inputLevel, setInputLevel] = useState(0)
  const [outputLevel, setOutputLevel] = useState(0)

  useEffect(() => {
    // Simulate audio level monitoring
    const interval = setInterval(() => {
      if (!isMuted) {
        setInputLevel(Math.random() * 100)
        setOutputLevel(Math.random() * 80)
      } else {
        setInputLevel(0)
        setOutputLevel(0)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isMuted])

  return (
    <Card variant="glass" className="p-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Voice Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mute Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant={isMuted ? "secondary" : "primary"}
              size="sm"
              onClick={onToggleMute}
              className="p-2"
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <span className="text-sm text-white">
              {isMuted ? 'Unmute' : 'Mute'}
            </span>
          </div>
          <AudioVisualizer isActive={!isMuted} volume={inputLevel / 100} />
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white">Volume</span>
            <span className="text-xs text-white/70">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            className="w-full accent-electric-500 bg-white/10 rounded-lg"
          />
        </div>

        {/* Audio Enhancement */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <h4 className="text-sm text-white/70">Audio Enhancement</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Noise Cancellation</span>
            <button
              onClick={onNoiseToggle}
              className={cn(
                "w-10 h-5 rounded-full transition-all duration-200",
                noiseCancellation ? "bg-electric-500" : "bg-white/20"
              )}
            >
              <div className={cn(
                "w-4 h-4 bg-white rounded-full transition-transform duration-200",
                noiseCancellation ? "translate-x-5" : "translate-x-0.5"
              )} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Echo Cancellation</span>
            <button
              onClick={onEchoToggle}
              className={cn(
                "w-10 h-5 rounded-full transition-all duration-200",
                echoCancellation ? "bg-electric-500" : "bg-white/20"
              )}
            >
              <div className={cn(
                "w-4 h-4 bg-white rounded-full transition-transform duration-200",
                echoCancellation ? "translate-x-5" : "translate-x-0.5"
              )} />
            </button>
          </div>
        </div>

        {/* Audio Levels */}
        <div className="space-y-2 pt-3 border-t border-white/10">
          <div className="flex justify-between text-xs text-white/70">
            <span>Input Level</span>
            <span>{inputLevel.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1">
            <div 
              className={cn(
                "h-1 rounded-full transition-all duration-100",
                inputLevel > 80 ? "bg-red-400" :
                inputLevel > 60 ? "bg-yellow-400" : "bg-emerald-400"
              )}
              style={{ width: `${inputLevel}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { AudioVisualizer, ConnectionQuality, AIActivityIndicator, VoiceControls }
