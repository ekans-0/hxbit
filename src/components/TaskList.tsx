import { Task, Extracurricular } from '../lib/supabase';
import { CheckCircle2, Circle, Zap, Trash2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  extracurriculars: Extracurricular[];
  onCompleteTask: (taskId: string, xpReward: number, extracurricularId: string) => Promise<unknown>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export function TaskList({ tasks, extracurriculars, onCompleteTask, onDeleteTask }: TaskListProps) {
  const getExtracurricular = (id: string) => {
    return extracurriculars.find(e => e.id === id);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDeleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <Circle className="w-12 h-12 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-slate-400">No tasks yet. Create your first task to start earning XP!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const extracurricular = getExtracurricular(task.extracurricular_id);
        
        return (
          <div
            key={task.id}
            className={`bg-white dark:bg-slate-800/50 backdrop-blur-xl border rounded-xl p-4 transition-all duration-200 group ${
              task.completed 
                ? 'border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/5' 
                : 'border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={() => !task.completed && onCompleteTask(task.id, task.xp_reward, task.extracurricular_id)}
                  disabled={task.completed}
                  className={`transition-colors duration-200 ${
                    task.completed 
                      ? 'text-green-600 dark:text-green-400 cursor-default' 
                      : 'text-gray-400 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 cursor-pointer'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className={`font-semibold ${
                      task.completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h3>
                    {extracurricular && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 flex items-center">
                        <span className="mr-1">{extracurricular.icon}</span>
                        {extracurricular.name}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-slate-400">{task.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <Zap className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{task.xp_reward} XP</span>
                </div>
                
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {task.completed && task.completed_at && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-slate-500">
                  Completed on {new Date(task.completed_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}