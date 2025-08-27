'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { VideoStream, ScreenShareControls, VideoQualityControls } from './VideoComponents'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Grid3X3, 
  Square, 
  Maximize2,
  PictureInPicture,
  SplitSquareHorizontal,
  Layout,
  Zap,
  MonitorSpeaker,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  MoreVertical,
  MessageSquare,
  FileText,
  Clock,
  Activity
} from 'lucide-react'

interface Participant {
  id: string
  name: string
  isAI?: boolean
  isLocal?: boolean
  isMuted?: boolean
  isVideoEnabled?: boolean
  isScreenSharing?: boolean
  connectionQuality?: 'excellent' | 'good' | 'fair' | 'poor'
  streamType?: 'camera' | 'screen' | 'ai'
}

interface VideoLayoutProps {
  participants: Participant[]
  currentUser: string
  onParticipantAction?: (participantId: string, action: string) => void
  layoutMode?: 'grid' | 'speaker' | 'presentation' | 'sidebar'
  onLayoutChange?: (mode: string) => void
}

interface ConferenceStats {
  duration: string
  participantCount: number
  activeSpeaker: string
  recordingStatus: 'recording' | 'paused' | 'stopped'
  networkQuality: 'excellent' | 'good' | 'fair' | 'poor'
}

const VideoConferenceLayout: React.FC<VideoLayoutProps> = ({
  participants,
  currentUser,
  onParticipantAction,
  layoutMode = 'grid',
  onLayoutChange
}) => {
  const [conferenceStats, setConferenceStats] = useState<ConferenceStats>({
    duration: '00:00:00',
    participantCount: participants.length,
    activeSpeaker: '',
    recordingStatus: 'stopped',
    networkQuality: 'excellent'
  })

  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [shareType, setShareType] = useState<'screen' | 'window' | 'tab'>('screen')
  const [videoQuality, setVideoQuality] = useState('high')
  const [adaptiveQuality, setAdaptiveQuality] = useState(true)
  const [showControls, setShowControls] = useState(true)

  // Layout configurations
  const getLayoutClasses = () => {
    switch (layoutMode) {
      case 'grid':
        return {
          container: 'grid gap-4',
          gridCols: participants.length <= 2 ? 'grid-cols-1 lg:grid-cols-2' :
                   participants.length <= 4 ? 'grid-cols-2' :
                   participants.length <= 6 ? 'grid-cols-2 lg:grid-cols-3' :
                   'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          videoSize: 'aspect-video'
        }
      case 'speaker':
        return {
          container: 'flex flex-col gap-4',
          mainVideo: 'h-[60vh] w-full',
          thumbnails: 'flex gap-2 h-24'
        }
      case 'presentation':
        return {
          container: 'grid grid-cols-1 lg:grid-cols-4 gap-4',
          mainArea: 'lg:col-span-3',
          sidebar: 'lg:col-span-1 space-y-4'
        }
      case 'sidebar':
        return {
          container: 'grid grid-cols-1 lg:grid-cols-5 gap-4',
          mainArea: 'lg:col-span-4',
          sidebar: 'lg:col-span-1 space-y-2'
        }
      default:
        return { container: 'grid gap-4', gridCols: 'grid-cols-2' }
    }
  }

  const layoutClasses = getLayoutClasses()

  const renderGridLayout = () => (
    <div className={cn(layoutClasses.container, layoutClasses.gridCols)}>
      {participants.map((participant) => (
        <div key={participant.id} className={layoutClasses.videoSize}>
          <VideoStream
            streamType={participant.streamType || 'camera'}
            isLocal={participant.isLocal}
            isMuted={participant.isMuted}
            isVideoEnabled={participant.isVideoEnabled}
            participantName={participant.name}
            className="h-full"
          />
        </div>
      ))}
    </div>
  )

  const renderSpeakerLayout = () => {
    const mainSpeaker = participants.find(p => !p.isLocal) || participants[0]
    const others = participants.filter(p => p.id !== mainSpeaker?.id)

    return (
      <div className={layoutClasses.container}>
        {/* Main Speaker */}
        <div className={layoutClasses.mainVideo}>
          <VideoStream
            streamType={mainSpeaker?.streamType || 'camera'}
            isLocal={mainSpeaker?.isLocal}
            isMuted={mainSpeaker?.isMuted}
            isVideoEnabled={mainSpeaker?.isVideoEnabled}
            participantName={mainSpeaker?.name}
            className="h-full"
          />
        </div>
        
        {/* Thumbnails */}
        {others.length > 0 && (
          <div className={layoutClasses.thumbnails}>
            {others.map((participant) => (
              <div key={participant.id} className="flex-1 min-w-32">
                <VideoStream
                  streamType={participant.streamType || 'camera'}
                  isLocal={participant.isLocal}
                  isMuted={participant.isMuted}
                  isVideoEnabled={participant.isVideoEnabled}
                  participantName={participant.name}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderPresentationLayout = () => {
    const presenter = participants.find(p => p.isScreenSharing)
    const others = participants.filter(p => !p.isScreenSharing)

    return (
      <div className={layoutClasses.container}>
        {/* Main Presentation Area */}
        <div className={layoutClasses.mainArea}>
          {presenter ? (
            <VideoStream
              streamType="screen"
              isLocal={presenter.isLocal}
              participantName={`${presenter.name} is presenting`}
              className="h-full"
            />
          ) : (
            <div className="h-full glass-light backdrop-blur-20 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <MonitorSpeaker className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">No active presentation</p>
              </div>
            </div>
          )}
        </div>

        {/* Participants Sidebar */}
        <div className={layoutClasses.sidebar}>
          {others.map((participant) => (
            <VideoStream
              key={participant.id}
              streamType={participant.streamType || 'camera'}
              isLocal={participant.isLocal}
              isMuted={participant.isMuted}
              isVideoEnabled={participant.isVideoEnabled}
              participantName={participant.name}
              className="aspect-video"
            />
          ))}
        </div>
      </div>
    )
  }

  const renderSidebarLayout = () => {
    const aiParticipant = participants.find(p => p.isAI)
    const humanParticipants = participants.filter(p => !p.isAI)

    return (
      <div className={layoutClasses.container}>
        {/* Main Content Area */}
        <div className={layoutClasses.mainArea}>
          {aiParticipant && (
            <VideoStream
              streamType="ai"
              participantName={aiParticipant.name}
              className="h-full"
            />
          )}
        </div>

        {/* Sidebar with participants */}
        <div className={layoutClasses.sidebar}>
          {humanParticipants.map((participant) => (
            <VideoStream
              key={participant.id}
              streamType={participant.streamType || 'camera'}
              isLocal={participant.isLocal}
              isMuted={participant.isMuted}
              isVideoEnabled={participant.isVideoEnabled}
              participantName={participant.name}
              className="aspect-square"
            />
          ))}
        </div>
      </div>
    )
  }

  const renderCurrentLayout = () => {
    switch (layoutMode) {
      case 'speaker':
        return renderSpeakerLayout()
      case 'presentation':
        return renderPresentationLayout()
      case 'sidebar':
        return renderSidebarLayout()
      default:
        return renderGridLayout()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Conference Header */}
      <div className="flex items-center justify-between p-4 glass-light backdrop-blur-20 border-b border-white/10">
        {/* Conference Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Live Interview</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {conferenceStats.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {conferenceStats.participantCount}
            </div>
            <div className="flex items-center gap-1">
              <Activity className={cn(
                "w-4 h-4",
                conferenceStats.networkQuality === 'excellent' && "text-emerald-400",
                conferenceStats.networkQuality === 'good' && "text-green-400",
                conferenceStats.networkQuality === 'fair' && "text-yellow-400",
                conferenceStats.networkQuality === 'poor' && "text-red-400"
              )} />
              {conferenceStats.networkQuality}
            </div>
          </div>
        </div>

        {/* Layout Controls */}
        <div className="flex items-center gap-2">
          {[
            { mode: 'grid', icon: Grid3X3, label: 'Grid View' },
            { mode: 'speaker', icon: Square, label: 'Speaker View' },
            { mode: 'presentation', icon: MonitorSpeaker, label: 'Presentation' },
            { mode: 'sidebar', icon: SplitSquareHorizontal, label: 'Sidebar' }
          ].map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              variant={layoutMode === mode ? 'primary' : 'glass'}
              size="sm"
              onClick={() => onLayoutChange?.(mode)}
              className="p-2"
              title={label}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-4">
        {renderCurrentLayout()}
      </div>

      {/* Conference Controls */}
      <div className="p-4 glass-light backdrop-blur-20 border-t border-white/10">
        <div className="flex items-center justify-between">
          {/* Primary Controls */}
          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" className="p-3">
              <Mic className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="sm" className="p-3">
              <Camera className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="sm" className="p-3">
              <MonitorSpeaker className="w-5 h-5" />
            </Button>
            <Button variant="secondary" size="sm" className="p-3 bg-red-600 hover:bg-red-700">
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button variant="glass" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </Button>
            <Button variant="glass" size="sm" className="p-2">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="glass" size="sm" className="p-2">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Controls Panel (when visible) */}
      {showControls && (
        <div className="absolute bottom-20 right-4 w-80 space-y-4">
          <ScreenShareControls
            isSharing={isScreenSharing}
            onStartShare={() => setIsScreenSharing(true)}
            onStopShare={() => setIsScreenSharing(false)}
            shareType={shareType}
            onShareTypeChange={setShareType}
          />
          
          <VideoQualityControls
            currentQuality={videoQuality}
            onQualityChange={setVideoQuality}
            bandwidth={2.4}
            adaptiveQuality={adaptiveQuality}
            onAdaptiveToggle={() => setAdaptiveQuality(!adaptiveQuality)}
          />
        </div>
      )}
    </div>
  )
}

export default VideoConferenceLayout
