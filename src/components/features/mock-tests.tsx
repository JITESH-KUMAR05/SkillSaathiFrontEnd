'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const MOCK_TESTS = {
  aptitude: {
    name: 'Aptitude Test',
    duration: 30,
    questions: [
      {
        id: '1',
        question: 'If 5 machines can produce 5 widgets in 5 minutes, how long would it take 100 machines to produce 100 widgets?',
        options: ['5 minutes', '100 minutes', '1 minute', '10 minutes'],
        correctAnswer: 0,
        explanation: 'Each machine produces 1 widget in 5 minutes. 100 machines would still take 5 minutes to produce 100 widgets.'
      },
      {
        id: '2',
        question: 'What comes next in the sequence: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '46'],
        correctAnswer: 1,
        explanation: 'The differences are 4, 6, 8, 10, so the next difference is 12, making it 30 + 12 = 42.'
      }
    ]
  },
  technical: {
    name: 'Technical Skills',
    duration: 45,
    questions: [
      {
        id: '1',
        question: 'Which of the following is NOT a JavaScript data type?',
        options: ['String', 'Boolean', 'Float', 'Undefined'],
        correctAnswer: 2,
        explanation: 'JavaScript uses Number for all numeric values, not separate Integer and Float types.'
      }
    ]
  },
  reasoning: {
    name: 'Logical Reasoning',
    duration: 25,
    questions: [
      {
        id: '1',
        question: 'All roses are flowers. Some flowers fade quickly. Therefore:',
        options: [
          'All roses fade quickly',
          'Some roses may fade quickly',
          'No roses fade quickly',
          'Only roses fade quickly'
        ],
        correctAnswer: 1,
        explanation: 'Since some flowers fade quickly and all roses are flowers, some roses may be among those that fade quickly.'
      }
    ]
  }
};

type TestState = 'selection' | 'instructions' | 'taking' | 'completed';

export function MockTests() {
  const [testState, setTestState] = useState<TestState>('selection');
  const [selectedTest, setSelectedTest] = useState<keyof typeof MOCK_TESTS | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testResults, setTestResults] = useState<{ score: number; total: number; correct: number } | null>(null);

  const currentTest = selectedTest ? MOCK_TESTS[selectedTest] : null;
  const currentQuestion = currentTest?.questions[currentQuestionIndex];

  const startTest = (testKey: keyof typeof MOCK_TESTS) => {
    setSelectedTest(testKey);
    setTestState('instructions');
  };

  const beginTest = () => {
    setTestState('taking');
    setTimeRemaining(currentTest!.duration * 60);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (!currentTest) return;
    
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeTest();
    }
  };

  const completeTest = () => {
    if (!currentTest) return;
    
    let correct = 0;
    currentTest.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / currentTest.questions.length) * 100);
    setTestResults({ score, total: currentTest.questions.length, correct });
    setTestState('completed');
  };

  const resetTest = () => {
    setTestState('selection');
    setSelectedTest(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestResults(null);
  };

  if (testState === 'selection') {
    return (
      <div className="h-full overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mock Tests</h1>
            <p className="text-gray-600">Practice with our comprehensive test suite to prepare for interviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(MOCK_TESTS).map(([key, test]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-sm border cursor-pointer"
                onClick={() => startTest(key as keyof typeof MOCK_TESTS)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ClipboardDocumentCheckIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{test.duration} minutes</span>
                    </div>
                    <div>{test.questions.length} questions</div>
                  </div>
                  <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
                    Start Test
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (testState === 'instructions') {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {currentTest?.name} - Instructions
            </h1>
            
            <div className="space-y-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Test Details</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Duration: {currentTest?.duration} minutes</li>
                  <li>• Questions: {currentTest?.questions.length}</li>
                  <li>• Type: Multiple Choice</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Instructions</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Read each question carefully</li>
                  <li>• Select the best answer from the given options</li>
                  <li>• You can review your answers before submitting</li>
                  <li>• The test will auto-submit when time expires</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setTestState('selection')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={beginTest}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2"
              >
                <PlayIcon className="w-5 h-5" />
                <span>Begin Test</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (testState === 'taking') {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{currentTest?.name}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {currentTest?.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600">Time Remaining</div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
                  {currentQuestion.question}
                </h2>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        answers[currentQuestion.id] === index
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion.id] === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion.id] === index && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-6">
                  <div className="text-sm text-gray-500">
                    Progress: {Object.keys(answers).length}/{currentTest?.questions.length} answered
                  </div>
                  <button
                    onClick={nextQuestion}
                    disabled={answers[currentQuestion.id] === undefined}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      answers[currentQuestion.id] !== undefined
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {currentQuestionIndex === (currentTest?.questions.length || 0) - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (testState === 'completed' && testResults) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrophyIcon className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Completed!</h1>
            <p className="text-gray-600 mb-8">Here are your results for {currentTest?.name}</p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{testResults.score}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{testResults.correct}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-1">{testResults.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={resetTest}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Take Another Test
              </button>
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                View Detailed Results
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
