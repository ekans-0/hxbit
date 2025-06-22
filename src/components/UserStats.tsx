import { User, Extracurricular, Task } from '../lib/supabase';
import { Star, Zap, Trophy, Target } from 'lucide-react';

interface UserStatsProps {
  user: User;
  extracurriculars: Extracurricular[];
  tasks: Task[];
}

export function UserStats({ user, extracurriculars, tasks }: UserStatsProps) {
  const xpToNextLevel = 500 - (user.total_xp % 500);
  const currentLevelXp = user.total_xp % 500;
  const progressPercentage = (currentLevelXp / 500) * 100;

  const completedTasks = tasks.filter(task => task.completed);
  completedTasks.reduce((sum, task) => sum + task.xp_reward, 0);
  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-slate-400">Ready to level up your skills?</p>
        </div>
        <div className="text-right">
          <div className="flex items-center mb-2">
            <Star className="w-8 h-8 text-yellow-400 mr-2" />
            <span className="text-3xl font-bold text-white">Level {user.level}</span>
          </div>
          <p className="text-slate-400">{xpToNextLevel} XP to next level</p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Level Progress</span>
          <span className="text-sm text-slate-400">{currentLevelXp} / 500 XP</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-3">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{user.total_xp.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Total XP</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3">
            <Trophy className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{extracurriculars.length}</p>
          <p className="text-sm text-slate-400">Activities</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-3">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{completedTasks.length}</p>
          <p className="text-sm text-slate-400">Tasks Done</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-full mx-auto mb-3">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {extracurriculars.reduce((sum, e) => sum + e.level, 0)}
          </p>
          <p className="text-sm text-slate-400">Total Levels</p>
        </div>
      </div>
    </div>
  );
}