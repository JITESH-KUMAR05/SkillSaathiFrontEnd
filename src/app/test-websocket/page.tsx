'use client'

import { useState, useEffect } from 'react'
import { useAgentChat } from '@/lib/useAgentChat'

export default function TestWebSocketPage() {
  const [testResult, setTestResult] = useState<string>('Not tested')
  const [wsUrl, setWsUrl] = useState('ws://localhost:8000/ws')
  
  const { messages, connected, error, loading, send } = useAgentChat({
    agentId: 'test',
    voice: 'en',
    wsUrl,
    autoReconnect: false
  })

  const runConnectionTest = () => {
    setTestResult('Testing connection...')
    
    // Test basic WebSocket connection
    const testWs = new WebSocket(wsUrl)
    
    testWs.onopen = () => {
      setTestResult('✅ WebSocket connection opened successfully')
      testWs.send(JSON.stringify({ type: 'ping', test: true }))
    }
    
    testWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setTestResult(prev => prev + `\n📨 Received: ${JSON.stringify(data)}`)
      } catch (e) {
        setTestResult(prev => prev + `\n📨 Received raw: ${event.data}`)
      }
    }
    
    testWs.onerror = (error) => {
      setTestResult(prev => prev + `\n❌ WebSocket error: ${JSON.stringify(error)}`)
    }
    
    testWs.onclose = (event) => {
      setTestResult(prev => prev + `\n🔌 Connection closed: Code ${event.code}, Reason: ${event.reason}`)
    }
    
    // Close after 3 seconds
    setTimeout(() => {
      if (testWs.readyState === WebSocket.OPEN) {
        testWs.close()
      }
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">WebSocket Connection Test</h1>
        
        {/* Connection Settings */}
        <div className="bg-dark-900/50 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Connection Settings</h2>
          <div className="flex gap-4 items-center">
            <label className="text-white/70">WebSocket URL:</label>
            <input
              type="text"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
            />
            <button
              onClick={runConnectionTest}
              className="bg-electric-500 hover:bg-electric-600 text-white px-4 py-2 rounded"
            >
              Test Connection
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-dark-900/50 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Test Results</h2>
          <pre className="bg-dark-800 p-4 rounded text-sm text-white/80 whitespace-pre-wrap">
            {testResult}
          </pre>
        </div>

        {/* Agent Chat Test */}
        <div className="bg-dark-900/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Agent Chat Test</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className="text-sm text-white/70">Connected: {connected ? 'Yes' : 'No'}</div>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${loading ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
              <div className="text-sm text-white/70">Loading: {loading ? 'Yes' : 'No'}</div>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <div className="text-sm text-white/70">Error: {error || 'None'}</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded p-3 mb-4">
              <div className="text-red-300 text-sm">Error: {error}</div>
            </div>
          )}

          <div className="bg-dark-800 p-4 rounded max-h-60 overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <div className="text-white/50 text-sm">No messages yet...</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="mb-2 text-sm">
                  <span className="text-white/50">[{new Date(msg.createdAt).toLocaleTimeString()}]</span>
                  <span className={`ml-2 ${
                    msg.role === 'system' ? 'text-yellow-400' :
                    msg.role === 'agent' ? 'text-blue-400' : 'text-white'
                  }`}>
                    {msg.role}: {msg.content}
                  </span>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => send('Hello, this is a test message!')}
            disabled={!connected}
            className="bg-electric-500 hover:bg-electric-600 disabled:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Send Test Message
          </button>
        </div>
      </div>
    </div>
  )
}
