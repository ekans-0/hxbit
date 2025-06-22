import React from 'react';
import { Extracurricular, Task } from '../lib/supabase';
import { Trophy, Target, Star } from 'lucide-react';

interface ExtracurricularCardProps {
  extracurricular: Extracurricular;
  tasks: Task[];
}

export function ExtracurricularCard({ extracurricular, tasks }: ExtracurricularCardProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  
  const xpToNextLevel = 100 - (extracurricular.xp % 100);
  const currentLevelXp = extracurricular.xp % 100;
  const progressPercentage = (currentLevelXp / 100) * 100;

  return (
    <div 
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
      style={{
        backgroundImage: `linear-gradient(135deg, ${extracurricular.color}15 0%, transparent 50%)`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{extracurricular.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{extracurricular.name}</h3>
            <p className="text-sm text-slate-400">{extracurricular.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-yellow-400 mb-1">
            <Star className="w-4 h-4 mr-1" />
            <span className="font-bold">Lv.{extracurricular.level}</span>
          </div>
          <p className="text-xs text-slate-400">{xpToNextLevel} XP to next</p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-300">Level Progress</span>
          <span className="text-xs text-slate-400">{currentLevelXp} / 100 XP</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out relative"
            style={{ 
              width: `${progressPercentage}%`,
              background: `linear-gradient(90deg, ${extracurricular.color}80, ${extracurricular.color})`
            }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full mx-auto mb-2">
            <Trophy className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-lg font-bold text-white">{completedTasks.length}</p>
          <p className="text-xs text-slate-400">Completed</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full mx-auto mb-2">
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-lg font-bold text-white">{pendingTasks.length}</p>
          <p className="text-xs text-slate-400">Pending</p>
        </div>
      </div>

      {/* Recent Task Preview */}
      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2">Recent Task:</p>
          <div className="flex items-center">
            <div 
              className={`w-2 h-2 rounded-full mr-2 ${
                tasks[0].completed ? 'bg-green-400' : 'bg-yellow-400'
              }`}
            ></div>
            <p className="text-sm text-slate-300 truncate">{tasks[0].title}</p>
          </div>
        </div>
      )}
    </div>
  );
}