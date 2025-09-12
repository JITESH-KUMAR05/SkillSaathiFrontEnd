'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  VideoCameraIcon,
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  CameraIcon,
  SpeakerWaveIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in seconds
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: '1',
    question: 'Tell me about yourself and your background.',
    category: 'Personal',
    difficulty: 'Easy',
    timeLimit: 120
  },
  {
    id: '2',
    question: 'आप अपनी सबसे बड़ी ताकत और कमजोरी क्या मानते हैं?',
    category: 'Self Assessment',
    difficulty: 'Medium',
    timeLimit: 180
  },
  {
    id: '3',
    question: 'Describe a challenging project you worked on and how you overcame the obstacles.',
    category: 'Technical',
    difficulty: 'Hard',
    timeLimit: 240
  },
  {
    id: '4',
    question: 'Where do you see yourself in 5 years?',
    category: 'Career Goals',
    difficulty: 'Medium',
    timeLimit: 150
  },
  {
    id: '5',
    question: 'How do you handle stress and pressure in the workplace?',
    category: 'Behavioral',
    difficulty: 'Medium',
    timeLimit: 180
  }
];

type InterviewState = 'setup' | 'recording' | 'reviewing' | 'completed';

export function VideoInterview() {
  const [interviewState, setInterviewState] = useState<InterviewState>('setup');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState<{ questionId: string; duration: number; feedback?: string }[]>([]);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [selectedRole, setSelectedRole] = useState('Software Developer');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    if (interviewState === 'recording' && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && interviewState === 'recording') {
      handleStopRecording();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, interviewState]);

  const startInterview = () => {
    setInterviewState('recording');
    setCurrentQuestionIndex(0);
    setTimeRemaining(currentQuestion.timeLimit);
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Record the answer
    setRecordedAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      duration: currentQuestion.timeLimit - timeRemaining,
      feedback: 'AI feedback will be generated after analysis...'
    }]);

    // Move to next question or complete
    if (currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeRemaining(INTERVIEW_QUESTIONS[currentQuestionIndex + 1].timeLimit);
        setIsRecording(true);
      }, 2000);
    } else {
      setInterviewState('completed');
    }
  };

  const resetInterview = () => {
    setInterviewState('setup');
    setCurrentQuestionIndex(0);
    setRecordedAnswers([]);
    setTimeRemaining(0);
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (interviewState === 'setup') {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <VideoCameraIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Video Interview</h1>
              <p className="text-gray-600">
                Practice your interview skills with our AI-powered interview system
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Interview Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Software Developer">Software Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Customer Support">Customer Support</option>
              </select>
            </div>

            {/* Camera/Mic Setup */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Device Setup</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CameraIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">Camera</span>
                  </div>
                  <button
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                      cameraEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      cameraEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MicrophoneIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">Microphone</span>
                  </div>
                  <button
                    onClick={() => setMicrophoneEnabled(!microphoneEnabled)}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                      microphoneEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      microphoneEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Interview Preview */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Interview Overview</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{INTERVIEW_QUESTIONS.length}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(INTERVIEW_QUESTIONS.reduce((acc, q) => acc + q.timeLimit, 0) / 60)}
                    </div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">AI</div>
                    <div className="text-sm text-gray-600">Powered</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={startInterview}
              disabled={!cameraEnabled || !microphoneEnabled}
              className={`w-full py-4 rounded-xl font-medium transition-all ${
                cameraEnabled && microphoneEnabled
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Start Interview
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (interviewState === 'recording') {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Recording</span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {INTERVIEW_QUESTIONS.length}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
                <ClockIcon className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <button
                onClick={handleStopRecording}
                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                <StopIcon className="w-4 h-4" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Interview Area */}
        <div className="flex-1 flex">
          {/* Video Area */}
          <div className="flex-1 relative">
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <VideoCameraIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Your video feed would appear here</p>
                <p className="text-sm opacity-70">Camera: {cameraEnabled ? 'On' : 'Off'}</p>
              </div>
            </div>
            
            {/* Recording Indicator */}
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              ● REC
            </div>
          </div>

          {/* Question Panel */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {currentQuestion.category}
                </span>
              </div>
              
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Current Question
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                {currentQuestion.question}
              </p>
              
              <div className="text-sm text-gray-500">
                Time allotted: {formatTime(currentQuestion.timeLimit)}
              </div>
            </div>

            {/* Progress */}
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Progress</h3>
              <div className="space-y-2">
                {INTERVIEW_QUESTIONS.map((question, index) => (
                  <div key={question.id} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < currentQuestionIndex ? 'bg-green-100 text-green-600' :
                      index === currentQuestionIndex ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {index < currentQuestionIndex ? (
                        <CheckCircleIcon className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-sm ${
                      index === currentQuestionIndex ? 'text-gray-900 font-medium' : 'text-gray-600'
                    }`}>
                      {question.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (interviewState === 'completed') {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Interview Completed!</h1>
              <p className="text-gray-600">
                Great job! Here's your performance summary and feedback.
              </p>
            </div>

            {/* Results Overview */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">8.5/10</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {Math.round(recordedAnswers.reduce((acc, answer) => acc + answer.duration, 0) / 60)}m
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
                <div className="text-sm text-gray-600">Confidence Level</div>
              </div>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-900">Question Breakdown</h3>
              {recordedAnswers.map((answer, index) => {
                const question = INTERVIEW_QUESTIONS.find(q => q.id === answer.questionId);
                return (
                  <div key={answer.questionId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          Q{index + 1}: {question?.question}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question?.difficulty || 'Easy')}`}>
                            {question?.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">
                            Duration: {formatTime(answer.duration)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">8.{index + 3}/10</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {answer.feedback}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={resetInterview}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Download Report
              </button>
              <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                Schedule Real Interview
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
