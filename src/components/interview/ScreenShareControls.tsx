'use client'

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
  onShareTypeChange,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={isSharing ? onStopShare : onStartShare}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {isSharing ? 'Stop Sharing' : 'Start Sharing'}
      </button>
      <select
        value={shareType}
        onChange={(e) => onShareTypeChange(e.target.value as 'screen' | 'window' | 'tab')}
        className="bg-gray-800 text-white py-2 px-4 rounded"
      >
        <option value="screen">Entire Screen</option>
        <option value="window">Window</option>
        <option value="tab">Browser Tab</option>
      </select>
    </div>
  )
}

export { ScreenShareControls }