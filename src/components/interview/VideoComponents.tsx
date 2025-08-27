'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  Camera, 
  CameraOff,
  Wifi,
  WifiOff,
  Zap,
  Eye,
  EyeOff,
  RotateCcw,
  Settings2,
  MonitorSpeaker,
  Presentation,
  FileVideo,
  Download,
  Upload,
  Share2
} from 'lucide-react'

interface VideoStreamProps {
  streamType: 'camera' | 'screen' | 'ai'
  isLocal?: boolean
  isMuted?: boolean
  isVideoEnabled?: boolean
  participantName?: string
  className?: string
}

const VideoStream: React.FC<VideoStreamProps> = ({
  streamType,
  isLocal = false,
  isMuted = false,
  isVideoEnabled = true,
  participantName,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (streamType === 'camera' || streamType === 'screen') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
    }
  }, [streamType])

  return (
    <div className={cn(
      "relative group rounded-2xl overflow-hidden",
      "glass-light backdrop-blur-20 border border-white/10",
      "transition-all duration-300 hover:glass-medium",
      className
    )}>
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted || isLocal}
        playsInline
        className={cn(
          "w-full h-full object-cover bg-dark-900",
          !isVideoEnabled && "opacity-0"
        )}
      />

      {/* Video Disabled Overlay */}
      {!isVideoEnabled && (
        <div className="absolute inset-0 bg-dark-800 flex items-center justify-center">
          <div className="text-center">
            <CameraOff className="w-12 h-12 text-white/50 mx-auto mb-2" />
            <p className="text-white/70 text-sm">Video disabled</p>
          </div>
        </div>
      )}

      {/* AI Visualization for AI streams */}
      {streamType === 'ai' && (
        <div className="absolute inset-0 bg-gradient-interview flex items-center justify-center">
          <div className="floating-element text-center">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-16 flex items-center justify-center mb-4 animate-pulse-glow">
              <Zap className="w-12 h-12 text-electric-400" />
            </div>
            <div className="text-white font-medium">AI Interviewer</div>
            <div className="text-white/70 text-sm">Processing...</div>
          </div>
          
          {/* AI Activity Indicators */}
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="w-2 h-2 bg-electric-400 rounded-full animate-ping" />
            <div className="w-2 h-2 bg-electric-400 rounded-full animate-ping animation-delay-200" />
            <div className="w-2 h-2 bg-electric-400 rounded-full animate-ping animation-delay-400" />
          </div>
        </div>
      )}

      {/* Participant Info */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="glass-medium backdrop-blur-16 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            {isMuted && <VolumeX className="w-4 h-4 text-red-400" />}
            <span className="text-white text-sm font-medium">
              {participantName || (streamType === 'ai' ? 'AI Agent' : 'You')}
            </span>
          </div>
        </div>

        {/* Connection Quality Indicator */}
        <div className="glass-medium backdrop-blur-16 rounded-lg px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Wifi className={cn("w-3 h-3", getQualityColor())} />
            <span className={getQualityColor()}>
              {connectionStats.latency}ms
            </span>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="glass"
          size="sm"
          onClick={toggleFullscreen}
          className="p-2"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="glass"
          size="sm"
          className="p-2"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Quality Badge */}
      <div className="absolute top-4 left-4">
        <div className={cn(
          "px-2 py-1 rounded text-xs font-medium",
          quality === '4k' && "bg-electric-500/20 text-electric-400",
          quality === 'high' && "bg-emerald-500/20 text-emerald-400",
          quality === 'medium' && "bg-gold-500/20 text-gold-400",
          quality === 'low' && "bg-red-500/20 text-red-400"
        )}>
          {quality.toUpperCase()}
        </div>
      </div>

      {/* Recording Indicator */}
      {streamType !== 'ai' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 glass-medium backdrop-blur-16 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-white text-xs">REC</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Advanced Screen Sharing Component
interface ScreenShareControlsProps {
  isSharing: boolean
  onStartShare: () => void
  onStopShare: () => void
  shareType: 'screen' | 'window' | 'tab'
  onShareTypeChange: (type: 'screen' | 'window' | 'tab') => void
}

const ScreenShareControls: React.FC<ScreenShareControlsProps> = ({
  isSharing,
  onStartShare,
  onStopShare,
  shareType,
  onShareTypeChange
}) => {
  return (
    <Card variant="glass" className="p-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white flex items-center gap-2">
          <MonitorSpeaker className="w-4 h-4" />
          Screen Sharing Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Share Type Selection */}
        <div className="space-y-2">
          <label className="text-xs text-white/70">Share Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'screen', label: 'Entire Screen', icon: MonitorSpeaker },
              { type: 'window', label: 'Window', icon: Presentation },
              { type: 'tab', label: 'Browser Tab', icon: FileVideo }
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => onShareTypeChange(type as any)}
                className={cn(
                  "p-2 rounded-lg text-xs transition-all duration-200",
                  shareType === type
                    ? "bg-electric-500/20 text-electric-400 border border-electric-500/30"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isSharing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onStartShare}
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Start Sharing
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onStopShare}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Stop Sharing
            </Button>
          )}
        </div>

        {/* Recording Controls */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="text-xs text-white/70">Recording</label>
          <div className="flex gap-2">
            <Button variant="glass" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Save Recording
            </Button>
            <Button variant="glass" size="sm" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Video Quality Settings Component
interface VideoQualityControlsProps {
  currentQuality: string
  onQualityChange: (quality: string) => void
  bandwidth: number
  adaptiveQuality: boolean
  onAdaptiveToggle: () => void
}

const VideoQualityControls: React.FC<VideoQualityControlsProps> = ({
  currentQuality,
  onQualityChange,
  bandwidth,
  adaptiveQuality,
  onAdaptiveToggle
}) => {
  const qualityOptions = [
    { value: 'low', label: '480p', bitrate: '500 Kbps' },
    { value: 'medium', label: '720p HD', bitrate: '1.5 Mbps' },
    { value: 'high', label: '1080p FHD', bitrate: '3 Mbps' },
    { value: '4k', label: '4K UHD', bitrate: '8 Mbps' }
  ]

  return (
    <Card variant="glass" className="p-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Video Quality
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adaptive Quality Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Adaptive Quality</span>
          <button
            onClick={onAdaptiveToggle}
            className={cn(
              "w-10 h-5 rounded-full transition-all duration-200",
              adaptiveQuality ? "bg-electric-500" : "bg-white/20"
            )}
          >
            <div className={cn(
              "w-4 h-4 bg-white rounded-full transition-transform duration-200",
              adaptiveQuality ? "translate-x-5" : "translate-x-0.5"
            )} />
          </button>
        </div>

        {/* Quality Selection */}
        <div className="space-y-2">
          <label className="text-xs text-white/70">Manual Quality</label>
          <div className="space-y-1">
            {qualityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onQualityChange(option.value)}
                disabled={adaptiveQuality}
                className={cn(
                  "w-full p-2 rounded-lg text-left transition-all duration-200",
                  currentQuality === option.value && !adaptiveQuality
                    ? "bg-electric-500/20 text-electric-400 border border-electric-500/30"
                    : "bg-white/5 text-white/70 hover:bg-white/10",
                  adaptiveQuality && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm">{option.label}</span>
                  <span className="text-xs text-white/50">{option.bitrate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bandwidth Info */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/70">Available Bandwidth</span>
            <span className="text-xs text-emerald-400">{bandwidth.toFixed(1)} Mbps</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { VideoStream, ScreenShareControls, VideoQualityControls }
