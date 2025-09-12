'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon,
  CheckCircleIcon,
  PlayIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  locked: boolean;
  progress: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  totalModules: number;
  completedModules: number;
  estimatedTime: string;
  modules: LearningModule[];
}

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'math-basics',
    title: 'Mathematics Fundamentals',
    description: 'Master the core concepts of mathematics from basics to advanced topics',
    category: 'Mathematics',
    totalModules: 8,
    completedModules: 3,
    estimatedTime: '6 weeks',
    modules: [
      {
        id: 'arithmetic',
        title: 'Basic Arithmetic',
        description: 'Addition, subtraction, multiplication, and division',
        duration: '2 hours',
        difficulty: 'Beginner',
        completed: true,
        locked: false,
        progress: 100
      },
      {
        id: 'algebra',
        title: 'Introduction to Algebra',
        description: 'Variables, equations, and basic algebraic concepts',
        duration: '3 hours',
        difficulty: 'Beginner',
        completed: true,
        locked: false,
        progress: 100
      },
      {
        id: 'geometry',
        title: 'Basic Geometry',
        description: 'Shapes, angles, and geometric principles',
        duration: '2.5 hours',
        difficulty: 'Intermediate',
        completed: true,
        locked: false,
        progress: 100
      },
      {
        id: 'quadratic',
        title: 'Quadratic Equations',
        description: 'Solving and graphing quadratic functions',
        duration: '4 hours',
        difficulty: 'Intermediate',
        completed: false,
        locked: false,
        progress: 65
      },
      {
        id: 'trigonometry',
        title: 'Trigonometry Basics',
        description: 'Sine, cosine, tangent, and their applications',
        duration: '5 hours',
        difficulty: 'Intermediate',
        completed: false,
        locked: true,
        progress: 0
      }
    ]
  },
  {
    id: 'hindi-literature',
    title: 'हिंदी साहित्य',
    description: 'Explore the rich heritage of Hindi literature and poetry',
    category: 'Literature',
    totalModules: 6,
    completedModules: 1,
    estimatedTime: '4 weeks',
    modules: [
      {
        id: 'kabir',
        title: 'संत कबीर के दोहे',
        description: 'Study the spiritual poetry of Sant Kabir',
        duration: '3 hours',
        difficulty: 'Beginner',
        completed: true,
        locked: false,
        progress: 100
      },
      {
        id: 'tulsidas',
        title: 'तुलसीदास की रामायण',
        description: 'Understanding Ramcharitmanas and its significance',
        duration: '6 hours',
        difficulty: 'Intermediate',
        completed: false,
        locked: false,
        progress: 25
      }
    ]
  }
];

export function LearningPath() {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(LEARNING_PATHS[0]);
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Paths Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Learning Paths</h2>
          <p className="text-sm text-gray-600">Choose your learning journey</p>
        </div>

        {/* Paths List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {LEARNING_PATHS.map((path) => {
            const progressPercentage = (path.completedModules / path.totalModules) * 100;
            const isSelected = selectedPath?.id === path.id;
            
            return (
              <motion.div
                key={path.id}
                onClick={() => setSelectedPath(path)}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-300 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{path.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{path.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{path.category}</span>
                      <span>{path.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{path.completedModules}/{path.totalModules}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Create New Path */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors">
            <BookOpenIcon className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">Create Custom Path</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedPath ? (
          <>
            {/* Path Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedPath.title}</h1>
                  <p className="text-gray-600 mb-4">{selectedPath.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <BookOpenIcon className="w-4 h-4" />
                      <span>{selectedPath.totalModules} modules</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{selectedPath.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrophyIcon className="w-4 h-4" />
                      <span>{selectedPath.completedModules} completed</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-teal-600 mb-1">
                    {Math.round((selectedPath.completedModules / selectedPath.totalModules) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl space-y-4">
                {selectedPath.modules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-xl p-6 border shadow-sm ${
                      module.locked ? 'opacity-60' : 'hover:shadow-md'
                    } transition-shadow`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Module Status */}
                      <div className="flex-shrink-0">
                        {module.completed ? (
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                          </div>
                        ) : module.locked ? (
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                            <PlayIcon className="w-6 h-6 text-teal-600" />
                          </div>
                        )}
                      </div>

                      {/* Module Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                            {module.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{module.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{module.duration}</span>
                          </div>
                          {module.progress > 0 && (
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-teal-500 h-2 rounded-full"
                                  style={{ width: `${module.progress}%` }}
                                />
                              </div>
                              <span>{module.progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        {!module.locked && (
                          <button 
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              module.completed
                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                : 'bg-teal-500 text-white hover:bg-teal-600'
                            }`}
                            onClick={() => setActiveModule(module)}
                          >
                            {module.completed ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Learning Path</h3>
              <p className="text-gray-600">Choose a path from the sidebar to start your learning journey</p>
            </div>
          </div>
        )}
      </div>

      {/* Module Detail Modal */}
      {activeModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{activeModule.title}</h2>
              <button
                onClick={() => setActiveModule(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-700">{activeModule.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-medium">{activeModule.duration}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Difficulty</div>
                  <div className="font-medium">{activeModule.difficulty}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Progress: {activeModule.progress}%</div>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2">
                  <span>{activeModule.progress > 0 ? 'Continue Learning' : 'Start Module'}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
