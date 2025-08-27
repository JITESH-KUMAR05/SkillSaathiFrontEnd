'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const InterviewPage = () => {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to Parikshak agent page since interview is now integrated there
    router.push('/agents/parikshak')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Redirecting to Interview Coach...</h1>
        <p className="text-white/70">Interview functionality is now integrated with Parikshak agent.</p>
      </div>
    </div>
  )
}

export default InterviewPage