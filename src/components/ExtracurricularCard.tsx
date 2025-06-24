import { Extracurricular, Task } from '../lib/supabase';
import { Trophy, Target, Star, Trash2 } from 'lucide-react';

interface ExtracurricularCardProps {
  extracurricular: Extracurricular;
  tasks: Task[];
  onDelete?: (id: string) => void;
}

export function ExtracurricularCard({ extracurricular, tasks, onDelete }: ExtracurricularCardProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  
  const xpToNextLevel = 100 - (extracurricular.xp % 100);
  const currentLevelXp = extracurricular.xp % 100;
  const progressPercentage = (currentLevelXp / 100) * 100;

  return (
    <div 
      className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 relative group"
      style={{
        backgroundImage: `linear-gradient(135deg, ${extracurricular.color}15 0%, transparent 50%)`,
      }}
    >
      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={() => onDelete(extracurricular.id)}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{extracurricular.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{extracurricular.name}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">{extracurricular.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-yellow-600 dark:text-yellow-400 mb-1">
            <Star className="w-4 h-4 mr-1" />
            <span className="font-bold">Lv.{extracurricular.level}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400">{xpToNextLevel} XP to next</p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700 dark:text-slate-300">Level Progress</span>
          <span className="text-xs text-gray-500 dark:text-slate-400">{currentLevelXp} / 100 XP</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
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
            <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{completedTasks.length}</p>
          <p className="text-xs text-gray-600 dark:text-slate-400">Completed</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full mx-auto mb-2">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{pendingTasks.length}</p>
          <p className="text-xs text-gray-600 dark:text-slate-400">Pending</p>
        </div>
      </div>

      {/* Recent Task Preview */}
      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Recent Task:</p>
          <div className="flex items-center">
            <div 
              className={`w-2 h-2 rounded-full mr-2 ${
                tasks[0].completed ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            ></div>
            <p className="text-sm text-gray-700 dark:text-slate-300 truncate">{tasks[0].title}</p>
          </div>
        </div>
      )}
    </div>
  );
}