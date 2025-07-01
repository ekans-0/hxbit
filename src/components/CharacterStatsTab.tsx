import { useState } from 'react';
import { useUserStats } from '../hooks/useUserStats';
import { 
  TrendingUp, 
  Plus, 
  Zap,
  Star
} from 'lucide-react';

interface CharacterStatsTabProps {
  userId: string;
}

const STAT_INFO = {
  // Physical Stats
  strength: {
    icon: '💪',
    name: 'Strength',
    description: 'Physical power and muscle development',
    color: 'from-red-500 to-red-600',
    category: 'Physical',
    benefits: ['Better athletic performance', 'Increased confidence', 'Improved health']
  },
  agility: {
    icon: '🏃',
    name: 'Agility',
    description: 'Speed, reflexes, and coordination',
    color: 'from-green-500 to-green-600',
    category: 'Physical',
    benefits: ['Faster reaction times', 'Better sports performance', 'Enhanced mobility']
  },
  endurance: {
    icon: '🏔️',
    name: 'Endurance',
    description: 'Stamina and persistence',
    color: 'from-orange-500 to-orange-600',
    category: 'Physical',
    benefits: ['Longer work sessions', 'Better stress tolerance', 'Improved resilience']
  },
  vitality: {
    icon: '❤️',
    name: 'Vitality',
    description: 'Health, energy, and life force',
    color: 'from-pink-500 to-pink-600',
    category: 'Physical',
    benefits: ['More energy throughout day', 'Better immune system', 'Faster recovery']
  },
  
  // Mental Stats
  intelligence: {
    icon: '🧠',
    name: 'Intelligence',
    description: 'Cognitive ability and problem-solving',
    color: 'from-blue-500 to-blue-600',
    category: 'Mental',
    benefits: ['Better academic performance', 'Improved decision making', 'Enhanced creativity']
  },
  perception: {
    icon: '🔍',
    name: 'Perception',
    description: 'Observation and detail recognition',
    color: 'from-indigo-500 to-indigo-600',
    category: 'Mental',
    benefits: ['Notice important details', 'Better pattern recognition', 'Enhanced learning']
  },
  sense: {
    icon: '👁️',
    name: 'Sense',
    description: 'Awareness and intuition',
    color: 'from-purple-500 to-purple-600',
    category: 'Mental',
    benefits: ['Better situational awareness', 'Enhanced intuition', 'Improved focus']
  },
  
  // Social Stats
  charisma: {
    icon: '✨',
    name: 'Charisma',
    description: 'Social influence and leadership',
    color: 'from-yellow-500 to-yellow-600',
    category: 'Social',
    benefits: ['Better social interactions', 'Leadership opportunities', 'Increased influence']
  },
  luck: {
    icon: '🍀',
    name: 'Luck',
    description: 'Fortune and serendipity',
    color: 'from-emerald-500 to-emerald-600',
    category: 'Social',
    benefits: ['Better opportunities', 'Favorable outcomes', 'Unexpected benefits']
  },
  
  // General Stats
  hygiene: {
    icon: '🧼',
    name: 'Hygiene',
    description: 'Cleanliness and self-care',
    color: 'from-cyan-500 to-cyan-600',
    category: 'General',
    benefits: ['Better health', 'Improved confidence', 'Social acceptance']
  },
  
  // Career Stats
  leadership: {
    icon: '👑',
    name: 'Leadership',
    description: 'Ability to guide and inspire others',
    color: 'from-amber-500 to-amber-600',
    category: 'Career',
    benefits: ['Team management skills', 'Career advancement', 'Influence and respect']
  },
  creativity: {
    icon: '🎨',
    name: 'Creativity',
    description: 'Innovation and artistic expression',
    color: 'from-rose-500 to-rose-600',
    category: 'Career',
    benefits: ['Problem-solving abilities', 'Artistic skills', 'Innovation mindset']
  },
  discipline: {
    icon: '⚡',
    name: 'Discipline',
    description: 'Self-control and consistency',
    color: 'from-slate-500 to-slate-600',
    category: 'Career',
    benefits: ['Better habits', 'Goal achievement', 'Personal mastery']
  }
};

const STAT_CATEGORIES = {
  Physical: ['strength', 'agility', 'endurance', 'vitality'],
  Mental: ['intelligence', 'perception', 'sense'],
  Social: ['charisma', 'luck'],
  General: ['hygiene'],
  Career: ['leadership', 'creativity', 'discipline']
};

export function CharacterStatsTab({ userId }: CharacterStatsTabProps) {
  const { userStats, loading, upgradeStat } = useUserStats(userId);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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

  const getFilteredStats = () => {
    if (selectedCategory === 'All') {
      return Object.entries(STAT_INFO);
    }
    const categoryStats = STAT_CATEGORIES[selectedCategory as keyof typeof STAT_CATEGORIES] || [];
    return Object.entries(STAT_INFO).filter(([key]) => categoryStats.includes(key));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Character Stats
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Level up your real-life attributes and unlock your potential
        </p>
      </div>

      {/* Stats Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-300 dark:border-slate-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Total Stats</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-3">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.stat_points}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Available Points</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-3">
              <Star className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.floor(totalStats / 10)}
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Mastery Level</p>
          </div>
        </div>
      </div>

      {/* Stat Points Info */}
      {userStats.stat_points > 0 && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-300 dark:border-yellow-800 rounded-xl p-4 mb-8">
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

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-1 border border-gray-300 dark:border-slate-700 flex flex-wrap gap-1">
          {['All', ...Object.keys(STAT_CATEGORIES)].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredStats().map(([key, info]) => {
          const statValue = userStats[key as keyof typeof STAT_INFO] || 0;
          const progressPercentage = Math.min((statValue / 100) * 100, 100);
          
          return (
            <div
              key={key}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{info.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{info.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{info.description}</p>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full">
                      {info.category}
                    </span>
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
    </div>
  );
}