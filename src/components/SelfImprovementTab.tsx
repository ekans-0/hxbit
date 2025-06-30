import { useState } from 'react';
import { useUserStats } from '../hooks/useUserStats';
import { useExtracurriculars } from '../hooks/useExtracurriculars';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { CreateTaskModal } from './CreateTaskModal';
import { CreateExtracurricularModal } from './CreateExtracurricularModal';
import { TaskList } from './TaskList';
import { 
  Zap, 
  Plus, 
  TrendingUp, 
  Dumbbell, 
  Heart, 
  Brain, 
  Sparkles, 
  Target, 
  CheckCircle2,
  BookOpen,
  Users,
  DollarSign,
  Calendar,
  Clock
} from 'lucide-react';

interface SelfImprovementTabProps {
  userId: string;
  initialSection?: string;
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

const DEVELOPMENT_AREAS = {
  stats: {
    title: 'Character Stats',
    description: 'Level up your core attributes',
    icon: TrendingUp,
    color: 'from-blue-500 to-purple-500'
  },
  fitness: {
    title: 'Physical Development',
    description: 'Fitness, nutrition, and body optimization',
    icon: Dumbbell,
    color: 'from-red-500 to-pink-500'
  },
  mental: {
    title: 'Mental Performance',
    description: 'Learning, focus, and cognitive enhancement',
    icon: Brain,
    color: 'from-blue-500 to-indigo-500'
  },
  social: {
    title: 'Social Mastery',
    description: 'Communication, networking, and relationships',
    icon: Users,
    color: 'from-green-500 to-emerald-500'
  },
  career: {
    title: 'Career Excellence',
    description: 'Professional development and financial growth',
    icon: DollarSign,
    color: 'from-purple-500 to-violet-500'
  },
  learning: {
    title: 'Strategic Learning',
    description: 'Skill acquisition and knowledge mastery',
    icon: BookOpen,
    color: 'from-indigo-500 to-blue-500'
  }
};

const FITNESS_ACTIVITIES = [
  {
    name: 'Strength Training',
    icon: '💪',
    color: '#DC2626',
    description: 'Build muscle mass and physical power',
    stats: ['strength', 'endurance'],
    tasks: [
      { title: 'Push-ups (3 sets of 10)', xp: 15 },
      { title: 'Pull-ups (3 sets of 5)', xp: 20 },
      { title: 'Squats (3 sets of 15)', xp: 15 },
      { title: 'Deadlifts (3 sets of 8)', xp: 25 },
      { title: 'Bench Press (3 sets of 10)', xp: 20 },
      { title: 'Full body workout (45 min)', xp: 40 },
    ]
  },
  {
    name: 'Cardio Training',
    icon: '🏃',
    color: '#059669',
    description: 'Improve cardiovascular health and endurance',
    stats: ['agility', 'endurance', 'vitality'],
    tasks: [
      { title: 'Morning run (20 minutes)', xp: 20 },
      { title: 'HIIT workout (15 minutes)', xp: 25 },
      { title: 'Cycling (30 minutes)', xp: 20 },
      { title: 'Swimming (30 minutes)', xp: 30 },
      { title: '10,000 steps daily', xp: 15 },
      { title: 'Stair climbing (10 minutes)', xp: 15 },
    ]
  },
  {
    name: 'Flexibility & Mobility',
    icon: '🧘',
    color: '#7C3AED',
    description: 'Enhance flexibility and joint mobility',
    stats: ['agility', 'vitality'],
    tasks: [
      { title: 'Morning stretching (10 min)', xp: 10 },
      { title: 'Yoga session (30 min)', xp: 25 },
      { title: 'Foam rolling (15 min)', xp: 15 },
      { title: 'Dynamic warm-up', xp: 10 },
      { title: 'Evening mobility routine', xp: 15 },
      { title: 'Full body stretch session', xp: 20 },
    ]
  },
  {
    name: 'Mental Wellness',
    icon: '🧠',
    color: '#2563EB',
    description: 'Improve mental health and cognitive function',
    stats: ['intelligence', 'sense', 'perception'],
    tasks: [
      { title: 'Meditation (10 minutes)', xp: 15 },
      { title: 'Deep breathing exercises', xp: 10 },
      { title: 'Journaling session', xp: 15 },
      { title: 'Mindfulness practice', xp: 15 },
      { title: 'Read for 30 minutes', xp: 20 },
      { title: 'Digital detox (2 hours)', xp: 25 },
    ]
  },
  {
    name: 'Skincare & Grooming',
    icon: '✨',
    color: '#EC4899',
    description: 'Maintain healthy skin and appearance',
    stats: ['hygiene', 'charisma'],
    tasks: [
      { title: 'Morning skincare routine', xp: 10 },
      { title: 'Evening skincare routine', xp: 10 },
      { title: 'Face mask treatment', xp: 15 },
      { title: 'Exfoliate skin', xp: 15 },
      { title: 'Moisturize full body', xp: 10 },
      { title: 'Weekly grooming session', xp: 20 },
    ]
  },
  {
    name: 'Nutrition & Hydration',
    icon: '🥗',
    color: '#16A34A',
    description: 'Fuel your body with proper nutrition',
    stats: ['vitality', 'strength'],
    tasks: [
      { title: 'Drink 8 glasses of water', xp: 10 },
      { title: 'Eat 5 servings of fruits/vegetables', xp: 15 },
      { title: 'Prepare healthy meal', xp: 20 },
      { title: 'Take daily vitamins', xp: 5 },
      { title: 'Avoid processed foods today', xp: 20 },
      { title: 'Track calorie intake', xp: 15 },
    ]
  }
];

export function SelfImprovementTab({ userId, initialSection = 'stats' }: SelfImprovementTabProps) {
  const { user } = useAuth();
  const { userStats, loading, upgradeStat } = useUserStats(userId);
  const { extracurriculars, createExtracurricular } = useExtracurriculars(userId);
  const { tasks, createTask, completeTask, deleteTask } = useTasks(userId);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateActivity, setShowCreateActivity] = useState(false);

  const handleCompleteTask = async (taskId: string, xpReward: number, extracurricularId: string) => {
    try {
      await completeTask(taskId, xpReward, extracurricularId);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const createDevelopmentActivity = async (activityData: any, section: string) => {
    try {
      const newActivity = await createExtracurricular({
        name: activityData.name,
        description: activityData.description,
        icon: activityData.icon,
        color: activityData.color,
      });

      // Create sample tasks for the activity
      const tasksToCreate = activityData.tasks?.slice(0, 3) || [];
      for (const taskData of tasksToCreate) {
        await createTask({
          title: taskData.title,
          description: `Complete this ${section} task to earn XP and improve your skills.`,
          extracurricular_id: newActivity.id,
          xp_reward: taskData.xp,
        });
      }
    } catch (error) {
      console.error('Error creating development activity:', error);
    }
  };

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

  const renderStatsSection = () => (
    <>
      {/* Stats Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 mb-8">
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
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8">
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
    </>
  );

  const renderDevelopmentSection = (sectionKey: string) => {
    const section = DEVELOPMENT_AREAS[sectionKey as keyof typeof DEVELOPMENT_AREAS];
    const sectionExtracurriculars = extracurriculars.filter(ext => 
      ext.name.toLowerCase().includes(sectionKey) || 
      FITNESS_ACTIVITIES.some(activity => activity.name === ext.name)
    );
    const sectionTasks = tasks.filter(task => 
      sectionExtracurriculars.some(ext => ext.id === task.extracurricular_id)
    );

    return (
      <div className="space-y-8">
        {/* Section Overview */}
        <div className={`bg-gradient-to-r ${section.color} bg-opacity-10 dark:bg-opacity-20 border border-gray-200 dark:border-slate-700 rounded-2xl p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${section.color} rounded-full mx-auto mb-3`}>
                <section.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sectionExtracurriculars.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Programs</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sectionTasks.filter(t => t.completed).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-3">
                <Target className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sectionTasks.filter(t => !t.completed).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-3">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sectionTasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp_reward, 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        {sectionKey === 'fitness' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fitness Programs</h2>
              <button
                onClick={() => setShowCreateTask(true)}
                className={`bg-gradient-to-r ${section.color} text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {FITNESS_ACTIVITIES.map((activity) => {
                const existingActivity = sectionExtracurriculars.find(ext => ext.name === activity.name);
                const activityTasks = existingActivity ? sectionTasks.filter(t => t.extracurricular_id === existingActivity.id) : [];
                const completedTasks = activityTasks.filter(t => t.completed).length;
                
                return (
                  <div
                    key={activity.name}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">{activity.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{activity.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{activity.description}</p>
                      </div>
                    </div>

                    {existingActivity ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {completedTasks}/{activityTasks.length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-700"
                            style={{ 
                              width: `${activityTasks.length > 0 ? (completedTasks / activityTasks.length) * 100 : 0}%`,
                              background: `linear-gradient(90deg, ${activity.color}, ${activity.color}dd)`
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Level {existingActivity.level}
                          </span>
                          <span className="text-xs font-semibold" style={{ color: activity.color }}>
                            {existingActivity.xp} XP
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Start this program to unlock tasks
                          </p>
                          <button
                            onClick={() => createDevelopmentActivity(activity, 'fitness')}
                            className="w-full py-2 px-4 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${activity.color}, ${activity.color}dd)` }}
                          >
                            Start Program
                          </button>
                        </div>
                        <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sample tasks:</p>
                          <ul className="space-y-1">
                            {activity.tasks.slice(0, 3).map((task, index) => (
                              <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                                {task.title} (+{task.xp} XP)
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        {sectionTasks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent {section.title} Tasks</h2>
            <TaskList
              tasks={sectionTasks.slice(0, 10)}
              extracurriculars={sectionExtracurriculars}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={deleteTask}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Life Optimization System
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Level up your real-life attributes and skills like a true hunter
        </p>
      </div>

      {/* Section Toggle */}
      <div className="flex justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-1 border border-gray-200 dark:border-slate-700 flex flex-wrap gap-1">
          {Object.entries(DEVELOPMENT_AREAS).map(([key, area]) => {
            const Icon = area.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeSection === key
                    ? `bg-gradient-to-r ${area.color} text-white shadow-lg`
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{area.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeSection === 'stats' ? renderStatsSection() : renderDevelopmentSection(activeSection)}

      {/* Modals */}
      {showCreateTask && (
        <CreateTaskModal
          extracurriculars={extracurriculars}
          onClose={() => setShowCreateTask(false)}
          onCreate={createTask}
        />
      )}

      {showCreateActivity && (
        <CreateExtracurricularModal
          onClose={() => setShowCreateActivity(false)}
          onCreate={createExtracurricular}
        />
      )}
    </div>
  );
}