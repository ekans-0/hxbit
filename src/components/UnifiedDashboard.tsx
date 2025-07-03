import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExtracurriculars } from '../hooks/useExtracurriculars';
import { useTasks } from '../hooks/useTasks';
import { useUserStats } from '../hooks/useUserStats';
import { useCompetitions } from '../hooks/useCompetitions';
import { useInternships } from '../hooks/useInternships';
import { 
  Trophy, 
  Target, 
  Briefcase, 
  TrendingUp, 
  Plus, 
  Calendar,
  BookOpen,
  Dumbbell,
  Brain,
  Users,
  DollarSign,
  Zap,
  Star,
  Award,
  CheckCircle2,
  Clock,
  BarChart3
} from 'lucide-react';

interface UnifiedDashboardProps {
  setActiveTab: (tab: string) => void;
}

export function UnifiedDashboard({ setActiveTab }: UnifiedDashboardProps) {
  const { user } = useAuth();
  const { extracurriculars } = useExtracurriculars(user?.id);
  const { tasks } = useTasks(user?.id);
  const { userStats } = useUserStats(user?.id);
  const { competitions } = useCompetitions(user?.id);
  const { internships } = useInternships(user?.id);

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const activeInternships = internships.filter(i => !i.end_date);

  const totalStats = userStats ? Object.entries(userStats)
    .filter(([key]) => !['id', 'user_id', 'stat_points', 'created_at', 'updated_at'].includes(key))
    .reduce((sum, [, value]) => sum + (value as number), 0) : 0;

  const xpToNextLevel = user ? 500 - (user.total_xp % 500) : 0;
  const currentLevelXp = user ? user.total_xp % 500 : 0;
  const progressPercentage = user ? (currentLevelXp / 500) * 100 : 0;

  const dashboardCards = [
    {
      title: 'Character Level',
      value: user?.level || 1,
      subtitle: `${xpToNextLevel} XP to next level`,
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      onClick: () => setActiveTab('stats')
    },
    {
      title: 'Total XP',
      value: user?.total_xp?.toLocaleString() || '0',
      subtitle: 'Experience Points',
      icon: Zap,
      color: 'from-blue-500 to-purple-500',
      onClick: () => setActiveTab('stats')
    },
    {
      title: 'Stat Points',
      value: userStats?.stat_points || 0,
      subtitle: 'Available to spend',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      onClick: () => setActiveTab('stats')
    },
    {
      title: 'Total Stats',
      value: totalStats,
      subtitle: 'Character attributes',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-500',
      onClick: () => setActiveTab('stats')
    }
  ];

  const activityCards = [
    {
      title: 'Active Tasks',
      value: pendingTasks.length,
      subtitle: `${completedTasks.length} completed`,
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      onClick: () => setActiveTab('tasks')
    },
    {
      title: 'Activities',
      value: extracurriculars.length,
      subtitle: 'Extracurriculars',
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-500',
      onClick: () => setActiveTab('dashboard')
    },
    {
      title: 'Competitions',
      value: competitions.length,
      subtitle: 'Achievements',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      onClick: () => setActiveTab('competitions')
    },
    {
      title: 'Internships',
      value: internships.length,
      subtitle: `${activeInternships.length} active`,
      icon: Briefcase,
      color: 'from-green-500 to-teal-500',
      onClick: () => setActiveTab('internships')
    }
  ];

  const developmentAreas = [
    {
      title: 'Physical Development',
      description: 'Fitness, nutrition, and body optimization',
      icon: Dumbbell,
      color: 'from-red-500 to-pink-500',
      onClick: () => setActiveTab('physical'),
      stats: ['strength', 'agility', 'endurance', 'vitality']
    },
    {
      title: 'Mental Performance',
      description: 'Learning, focus, and cognitive enhancement',
      icon: Brain,
      color: 'from-blue-500 to-indigo-500',
      onClick: () => setActiveTab('mental'),
      stats: ['intelligence', 'perception', 'sense']
    },
    {
      title: 'Social Mastery',
      description: 'Communication, networking, and relationships',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      onClick: () => setActiveTab('social'),
      stats: ['charisma', 'luck']
    },
    {
      title: 'Career Excellence',
      description: 'Professional development and financial growth',
      icon: DollarSign,
      color: 'from-purple-500 to-violet-500',
      onClick: () => setActiveTab('career'),
      stats: ['intelligence', 'charisma', 'endurance']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, Player {user?.username}
            </h1>
            <p className="text-blue-100 text-lg">Ready to level up your life?</p>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-2">
              <Star className="w-8 h-8 text-yellow-300 mr-2" />
              <span className="text-3xl font-bold">Level {user?.level}</span>
            </div>
            <p className="text-blue-100">{xpToNextLevel} XP to next level</p>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-100">Level Progress</span>
            <span className="text-sm text-blue-200">{currentLevelXp} / 500 XP</span>
          </div>
          <div className="w-full bg-blue-500/30 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Stats Overview */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Character Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={card.onClick}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} bg-opacity-20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                    <p className="text-sm text-gray-400">{card.subtitle}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Overview */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Activity Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activityCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={card.onClick}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} bg-opacity-20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                    <p className="text-sm text-gray-400">{card.subtitle}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* Development Areas */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Development Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {developmentAreas.map((area) => {
            const Icon = area.icon;
            const relevantStats = area.stats.map(stat => ({
              name: stat,
              value: userStats?.[stat as keyof typeof userStats] || 0
            }));
            
            return (
              <div
                key={area.title}
                onClick={area.onClick}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${area.color} bg-opacity-20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <button className="p-2 rounded-lg bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {area.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {area.description}
                </p>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Related Stats
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {relevantStats.map((stat) => (
                      <span
                        key={stat.name}
                        className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                      >
                        {stat.name}: {stat.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('tasks')}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105"
          >
            <Target className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Task</span>
          </button>
          
          <button
            onClick={() => setActiveTab('schedule')}
            className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
          >
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Schedule</span>
          </button>
          
          <button
            onClick={() => setActiveTab('competitions')}
            className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
          >
            <Trophy className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Win</span>
          </button>
          
          <button
            onClick={() => setActiveTab('stats')}
            className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Upgrade Stats</span>
          </button>
        </div>
      </div>
    </div>
  );
}