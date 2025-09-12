'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  PlayIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const WELLNESS_CATEGORIES = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: SparklesIcon,
    color: 'bg-purple-100 text-purple-600',
    tips: [
      {
        title: '5-Minute Breathing Exercise',
        description: 'Take 5 deep breaths, holding each for 4 seconds',
        duration: '5 min',
        type: 'exercise'
      },
      {
        title: 'Body Scan Meditation',
        description: 'Focus on each part of your body from head to toe',
        duration: '10 min',
        type: 'meditation'
      },
      {
        title: 'Mindful Walking',
        description: 'Walk slowly and focus on each step and breath',
        duration: '15 min',
        type: 'activity'
      }
    ]
  },
  {
    id: 'stress',
    name: 'Stress Relief',
    icon: SunIcon,
    color: 'bg-yellow-100 text-yellow-600',
    tips: [
      {
        title: 'Progressive Muscle Relaxation',
        description: 'Tense and release muscle groups systematically',
        duration: '10 min',
        type: 'exercise'
      },
      {
        title: 'Journaling',
        description: 'Write down 3 things you\'re grateful for today',
        duration: '5 min',
        type: 'writing'
      },
      {
        title: 'Nature Sounds',
        description: 'Listen to calming sounds while closing your eyes',
        duration: '8 min',
        type: 'audio'
      }
    ]
  },
  {
    id: 'sleep',
    name: 'Better Sleep',
    icon: MoonIcon,
    color: 'bg-blue-100 text-blue-600',
    tips: [
      {
        title: 'Digital Sunset',
        description: 'Turn off screens 1 hour before bedtime',
        duration: '1 hour',
        type: 'habit'
      },
      {
        title: 'Sleep Story',
        description: 'Listen to a calming bedtime story',
        duration: '15 min',
        type: 'audio'
      },
      {
        title: 'Bedroom Preparation',
        description: 'Create a cool, dark, and quiet environment',
        duration: '5 min',
        type: 'environment'
      }
    ]
  },
  {
    id: 'energy',
    name: 'Energy Boost',
    icon: HeartIcon,
    color: 'bg-red-100 text-red-600',
    tips: [
      {
        title: 'Quick Workout',
        description: '10 jumping jacks and 10 pushups',
        duration: '3 min',
        type: 'exercise'
      },
      {
        title: 'Power Nap',
        description: 'Short 10-20 minute rest to recharge',
        duration: '15 min',
        type: 'rest'
      },
      {
        title: 'Energizing Snack',
        description: 'Eat nuts, fruits, or yogurt for sustained energy',
        duration: '2 min',
        type: 'nutrition'
      }
    ]
  }
];

const DAILY_AFFIRMATIONS = [
  "I am capable of handling whatever comes my way today",
  "मैं आज जो भी चुनौती आए, उससे निपट सकता/सकती हूँ",
  "I choose to focus on what I can control",
  "मैं अपने मन की शांति को प्राथमिकता देता/देती हूँ",
  "I am worthy of love, respect, and happiness",
  "मैं अपनी खुशी के लिए जिम्मेदार हूँ"
];

export function WellnessTips() {
  const [activeCategory, setActiveCategory] = useState('mindfulness');
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  const activeWellnessCategory = WELLNESS_CATEGORIES.find(cat => cat.id === activeCategory);

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % DAILY_AFFIRMATIONS.length);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wellness Center</h1>
          <p className="text-gray-600">Personalized tips and exercises for your mental wellbeing</p>
        </div>

        {/* Daily Affirmation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-6 text-white text-center"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center justify-center space-x-2">
            <SparklesIcon className="w-5 h-5" />
            <span>Daily Affirmation</span>
          </h2>
          
          <motion.p
            key={currentAffirmation}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-medium mb-4 leading-relaxed"
          >
            "{DAILY_AFFIRMATIONS[currentAffirmation]}"
          </motion.p>
          
          <button
            onClick={nextAffirmation}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
          >
            Next Affirmation
          </button>
        </motion.div>

        {/* Category Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Choose a Wellness Focus</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WELLNESS_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isActive
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.tips.length} exercises available
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Wellness Tips */}
        {activeWellnessCategory && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <activeWellnessCategory.icon className="w-5 h-5 text-red-500" />
              <span>{activeWellnessCategory.name} Exercises</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeWellnessCategory.tips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{tip.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {tip.duration}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {tip.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize">
                      {tip.type}
                    </span>
                    <button className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
                      <PlayIcon className="w-3 h-3" />
                      <span>Start</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BookOpenIcon className="w-5 h-5 text-red-500" />
              <span>Recommended Reading</span>
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">The Power of Now</h4>
                <p className="text-sm text-gray-600">Mindfulness and present moment awareness</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Atomic Habits</h4>
                <p className="text-sm text-gray-600">Building positive daily routines</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">मानसिक स्वास्थ्य</h4>
                <p className="text-sm text-gray-600">Mental health in Hindi literature</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Support</h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Crisis Helpline</h4>
                <p className="text-sm text-red-700 mb-2">
                  If you're experiencing thoughts of self-harm, please reach out:
                </p>
                <div className="text-sm font-medium text-red-800">
                  National: 1-800-SUICIDE<br/>
                  India: +91-9152987821
                </div>
              </div>
              
              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors">
                Talk to Crisis Counselor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
