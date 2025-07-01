import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExtracurriculars } from '../hooks/useExtracurriculars';
import { useTasks } from '../hooks/useTasks';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskList } from './TaskList';
import { 
  Users, 
  Plus, 
  Target, 
  CheckCircle2,
  Clock,
  Zap,
  MessageCircle,
  Heart
} from 'lucide-react';

interface SocialMasteryTabProps {
  userId: string;
}

const SOCIAL_TASK_TEMPLATES = [
  { title: 'Have a meaningful conversation', xp: 20, description: 'Connect deeply with someone today' },
  { title: 'Reach out to an old friend', xp: 25, description: 'Reconnect with someone from your past' },
  { title: 'Practice active listening', xp: 15, description: 'Focus on truly hearing others' },
  { title: 'Give someone a genuine compliment', xp: 10, description: 'Spread positivity and kindness' },
  { title: 'Network with a new person', xp: 30, description: 'Expand your professional or social circle' },
  { title: 'Help someone with a problem', xp: 25, description: 'Offer assistance and support' },
  { title: 'Practice public speaking', xp: 35, description: 'Improve communication and confidence' },
  { title: 'Join a social event or gathering', xp: 30, description: 'Engage in community activities' },
  { title: 'Express gratitude to someone', xp: 15, description: 'Show appreciation for others' },
  { title: 'Practice conflict resolution', xp: 40, description: 'Handle disagreements constructively' },
];

export function SocialMasteryTab({ userId }: SocialMasteryTabProps) {
  const { user } = useAuth();
  const { extracurriculars, createExtracurricular } = useExtracurriculars(userId);
  const { tasks, createTask, completeTask, deleteTask } = useTasks(userId);
  const [showCreateTask, setShowCreateTask] = useState(false);

  // Get or create Social Mastery activity
  const socialActivity = extracurriculars.find(ext => ext.name === 'Social Mastery');
  
  const createSocialActivity = async () => {
    if (!socialActivity) {
      await createExtracurricular({
        name: 'Social Mastery',
        description: 'Communication, networking, and relationships',
        icon: '🤝',
        color: '#059669',
      });
    }
  };

  // Filter tasks for social mastery
  const socialTasks = socialActivity 
    ? tasks.filter(task => task.extracurricular_id === socialActivity.id)
    : [];

  const completedTasks = socialTasks.filter(task => task.completed);
  const pendingTasks = socialTasks.filter(task => !task.completed);
  const requiredTasks = socialTasks.filter(task => task.is_required && !task.completed);

  const handleCompleteTask = async (taskId: string, xpReward: number, extracurricularId: string) => {
    try {
      await completeTask(taskId, xpReward, extracurricularId);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const createQuickTask = async (template: typeof SOCIAL_TASK_TEMPLATES[0]) => {
    if (!socialActivity) {
      await createSocialActivity();
      return;
    }

    await createTask({
      title: template.title,
      description: template.description,
      extracurricular_id: socialActivity.id,
      xp_reward: template.xp,
      is_required: false,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Social Mastery
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Build meaningful relationships and enhance your social skills
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Required</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{requiredTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Total XP</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedTasks.reduce((sum, task) => sum + task.xp_reward, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Task Templates */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Add Tasks</h2>
          <button
            onClick={() => setShowCreateTask(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Custom Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOCIAL_TASK_TEMPLATES.map((template, index) => (
            <button
              key={index}
              onClick={() => createQuickTask(template)}
              className="p-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl hover:shadow-lg transition-all duration-200 text-left group hover:border-green-300 dark:hover:border-green-600"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-green-600 dark:group-hover:text-green-400">
                  {template.title}
                </h3>
                <div className="flex items-center text-green-500">
                  <Zap className="w-3 h-3 mr-1" />
                  <span className="text-xs font-bold">{template.xp}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Social Mastery Tasks</h2>
        {socialTasks.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No social mastery tasks yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Start building your social skills by adding some tasks!
            </p>
            <button
              onClick={() => setShowCreateTask(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Task</span>
            </button>
          </div>
        ) : (
          <TaskList
            tasks={socialTasks}
            extracurriculars={extracurriculars}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={deleteTask}
          />
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          extracurriculars={extracurriculars}
          onClose={() => setShowCreateTask(false)}
          onCreate={createTask}
          selectedExtracurricular={socialActivity?.id}
        />
      )}
    </div>
  );
}