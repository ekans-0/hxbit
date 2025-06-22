import React from 'react';
import { useUserStats } from '../hooks/useUserStats';
import { Zap, Plus, TrendingUp } from 'lucide-react';

interface SelfImprovementTabProps {
  userId: string;
}

const STAT_INFO = {
  strength: {
    icon: '💪',
    name: 'Strength',
    description: 'Physical power and muscle development',
    color: 'from-red-500 to-red-600',
    benefits: ['Better athletic performance', 'Increased confidence', 'Improved health']
  },
  agility: {
    icon: '🏃',
    name: 'Agility',
    description: 'Speed, reflexes, and coordination',
    color: 'from-green-500 to-green-600',
    benefits: ['Faster reaction times', 'Better sports performance', 'Enhanced mobility']
  },
  intelligence: {
    icon: '🧠',
    name: 'Intelligence',
    description: 'Cognitive ability and problem-solving',
    color: 'from-blue-500 to-blue-600',
    benefits: ['Better academic performance', 'Improved decision making', 'Enhanced creativity']
  },
  vitality: {
    icon: '❤️',
    name: 'Vitality',
    description: 'Health, energy, and life force',
    color: 'from-pink-500 to-pink-600',
    benefits: ['More energy throughout day', 'Better immune system', 'Faster recovery']
  },
  sense: {
    icon: '👁️',
    name: 'Sense',
    description: 'Awareness and intuition',
    color: 'from-purple-500 to-purple-600',
    benefits: ['Better situational awareness', 'Enhanced intuition', 'Improved focus']
  },
  charisma: {
    icon: '✨',
    name: 'Charisma',
    description: 'Social influence and leadership',
    color: 'from-yellow-500 to-yellow-600',
    benefits: ['Better social interactions', 'Leadership opportunities', 'Increased influence']
  },
  luck: {
    icon: '🍀',
    name: 'Luck',
    description: 'Fortune and serendipity',
    color: 'from-emerald-500 to-emerald-600',
    benefits: ['Better opportunities', 'Favorable outcomes', 'Unexpected benefits']
  },
  endurance: {
    icon: '🏔️',
    name: 'Endurance',
    description: 'Stamina and persistence',
    color: 'from-orange-500 to-orange-600',
    benefits: ['Longer work sessions', 'Better stress tolerance', 'Improved resilience']
  },
  hygiene: {
    icon: '🧼',
    name: 'Hygiene',
    description: 'Cleanliness and self-care',
    color: 'from-cyan-500 to-cyan-600',
    benefits: ['Better health', 'Improved confidence', 'Social acceptance']
  },
  perception: {
    icon: '🔍',
    name: 'Perception',
    description: 'Observation and detail recognition',
    color: 'from-indigo-500 to-indigo-600',
    benefits: ['Notice important details', 'Better pattern recognition', 'Enhanced learning']
  }
};

export function SelfImprovementTab({ userId }: SelfImprovementTabProps) {
  const { userStats, loading, upgradeStat } = useUserStats(userId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Failed to load stats</p>
      </div>
    );
  }

  const totalStats = Object.entries(STAT_INFO).reduce((sum, [key]) => {
    return sum + (userStats[key as keyof typeof STAT_INFO] || 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Self-Improvement System
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Level up your real-life attributes like a true hunter
        </p>
      </div>

      {/* Stats Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Stats</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-3">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.stat_points}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Available Points</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-3">
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.floor(totalStats / 10)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mastery Level</p>
          </div>
        </div>
      </div>

      {/* Stat Points Info */}
      {userStats.stat_points > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                You have {userStats.stat_points} stat points to spend!
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Click the + button next to any stat to upgrade it
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(STAT_INFO).map(([key, info]) => {
          const statValue = userStats[key as keyof typeof STAT_INFO] || 0;
          const progressPercentage = Math.min((statValue / 100) * 100, 100);
          
          return (
            <div
              key={key}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{info.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{info.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{info.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statValue}</p>
                  <button
                    onClick={() => upgradeStat(key as keyof typeof STAT_INFO)}
                    disabled={userStats.stat_points <= 0}
                    className="mt-1 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${info.color} transition-all duration-700`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Level {Math.floor(statValue / 10)} • {statValue % 10}/10 to next level
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Benefits:</h4>
                <ul className="space-y-1">
                  {info.benefits.map((benefit, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-3">💡 How to Earn Stat Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <p className="font-medium mb-1">• Complete challenging tasks</p>
            <p className="font-medium mb-1">• Win competitions</p>
            <p className="font-medium mb-1">• Finish internships</p>
          </div>
          <div>
            <p className="font-medium mb-1">• Level up extracurriculars</p>
            <p className="font-medium mb-1">• Achieve major milestones</p>
            <p className="font-medium mb-1">• Maintain consistent progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}