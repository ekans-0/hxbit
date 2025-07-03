import { Task, Extracurricular } from '../lib/supabase';
import { CheckCircle2, Circle, Zap, Trash2, AlertTriangle, Calendar } from 'lucide-react';

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

  const isOverdue = (task: Task) => {
    if (!task.due_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.due_date < today && !task.completed;
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays === -1) return 'Due yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `Due in ${diffDays} days`;
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <Circle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500">No tasks yet. Create your first task to start earning XP!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const extracurricular = getExtracurricular(task.extracurricular_id);
        const overdue = isOverdue(task);
        
        return (
          <div
            key={task.id}
            className={`bg-gray-900 border rounded-xl p-4 transition-all duration-200 group ${
              task.completed 
                ? 'border-green-500/30 bg-green-500/5' 
                : overdue
                ? 'border-red-500/50 bg-red-500/5'
                : task.is_required
                ? 'border-yellow-500/50 bg-yellow-500/5'
                : 'border-gray-800 hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={() => !task.completed && onCompleteTask(task.id, task.xp_reward, task.extracurricular_id)}
                  disabled={task.completed}
                  className={`transition-colors duration-200 ${
                    task.completed 
                      ? 'text-green-400 cursor-default' 
                      : 'text-gray-400 hover:text-green-400 cursor-pointer'
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
                      task.completed ? 'text-green-300 line-through' : 'text-white'
                    }`}>
                      {task.title}
                    </h3>
                    
                    {/* Task Type Indicators */}
                    <div className="flex items-center space-x-2">
                      {task.is_required && (
                        <span className="flex items-center text-xs px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded-full">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Required
                        </span>
                      )}
                      
                      {extracurricular && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 flex items-center">
                          <span className="mr-1">{extracurricular.icon}</span>
                          {extracurricular.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-400 mb-1">{task.description}</p>
                  )}
                  
                  {/* Due Date */}
                  {task.due_date && (
                    <div className={`flex items-center text-xs ${
                      overdue ? 'text-red-400' : 'text-gray-500'
                    }`}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDueDate(task.due_date)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center text-blue-400">
                  <Zap className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{task.xp_reward} XP</span>
                </div>
                
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-400 p-1 rounded-full hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {task.completed && task.completed_at && (
              <div className="mt-2 pt-2 border-t border-gray-800">
                <p className="text-xs text-gray-500">
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