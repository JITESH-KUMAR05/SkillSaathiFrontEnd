'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaceSmileIcon,
  FaceFrownIcon,
  HeartIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const MOODS = [
  { id: 'excited', emoji: '😄', label: 'Excited', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-100 text-green-800' },
  { id: 'content', emoji: '😌', label: 'Content', color: 'bg-blue-100 text-blue-800' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-100 text-gray-800' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-100 text-blue-800' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: 'bg-red-100 text-red-800' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-purple-100 text-purple-800' },
  { id: 'stressed', emoji: '😫', label: 'Stressed', color: 'bg-orange-100 text-orange-800' },
];

const ACTIVITIES = [
  'Work/Study', 'Family Time', 'Exercise', 'Social Media', 'Reading', 
  'Music', 'Movies/TV', 'Outdoor Activities', 'Meditation', 'Sleep'
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleSaveMood = () => {
    if (!selectedMood) return;
    
    const moodEntry = {
      mood: selectedMood,
      activities: selectedActivities,
      notes,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Saving mood entry:', moodEntry);
    // Here you would save to your backend/local storage
    
    // Reset form
    setSelectedMood(null);
    setSelectedActivities([]);
    setNotes('');
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">How are you feeling today?</h1>
          <p className="text-gray-600">Track your emotions to better understand your mental wellness patterns</p>
        </div>

        {/* Mood Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FaceSmileIcon className="w-5 h-5 text-red-500" />
            <span>Select Your Mood</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MOODS.map((mood) => (
              <motion.button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMood === mood.id
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="text-sm font-medium text-gray-900">{mood.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-red-500" />
            <span>What influenced your mood?</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {ACTIVITIES.map((activity) => (
              <button
                key={activity}
                onClick={() => {
                  setSelectedActivities(prev =>
                    prev.includes(activity)
                      ? prev.filter(a => a !== activity)
                      : [...prev, activity]
                  );
                }}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  selectedActivities.includes(activity)
                    ? 'bg-red-100 text-red-800 border-2 border-red-300'
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <HeartIcon className="w-5 h-5 text-red-500" />
            <span>Additional Notes (Optional)</span>
          </h2>
          
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share any additional thoughts about your mood today..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSaveMood}
            disabled={!selectedMood}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              selectedMood
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save Mood Entry
          </button>
        </div>

        {/* Weekly Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <ChartBarIcon className="w-5 h-5 text-red-500" />
            <span>This Week's Mood Patterns</span>
          </h2>
          
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
                <div className="w-full h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  {index < 4 ? (
                    <span className="text-lg">
                      {['😊', '😌', '😐', '😢'][index]}
                    </span>
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Insight:</strong> You've been feeling mostly positive this week! 
              Your mood tends to improve when you engage in outdoor activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
