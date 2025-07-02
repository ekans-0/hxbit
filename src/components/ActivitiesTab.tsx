import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExtracurriculars } from '../hooks/useExtracurriculars';
import { useTasks } from '../hooks/useTasks';
import { ExtracurricularCard } from './ExtracurricularCard';
import { CreateExtracurricularModal } from './CreateExtracurricularModal';
import { 
  Activity, 
  Plus, 
  Trophy,
  Target,
  Zap
} from 'lucide-react';

interface ActivitiesTabProps {
  userId: string;
}

export function ActivitiesTab({ userId }: ActivitiesTabProps) {
  const { user } = useAuth();
  const { extracurriculars, loading: extracurricularsLoading, createExtracurricular, deleteExtracurricular } = useExtracurriculars(userId);
  const { tasks } = useTasks(userId);
  const [showCreateExtracurricular, setShowCreateExtracurricular] = useState(false);

  const handleDeleteExtracurricular = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity? This will also delete all associated tasks.')) {
      try {
        await deleteExtracurricular(id);
      } catch (error) {
        console.error('Error deleting extracurricular:', error);
      }
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  if (extracurricularsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Activities
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your extracurricular activities and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Active Activities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{extracurriculars.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingTasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowCreateExtracurricular(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-6 h-6" />
          <span className="text-lg font-semibold">Create New Activity</span>
        </button>
      </div>

      {/* Activities Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Activities</h2>
        {extracurriculars.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No activities yet</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">Create your first extracurricular activity to start leveling up!</p>
            <button
              onClick={() => setShowCreateExtracurricular(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center mx-auto transition duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Activity
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extracurriculars.map((extracurricular) => (
              <ExtracurricularCard
                key={extracurricular.id}
                extracurricular={extracurricular}
                tasks={tasks.filter(t => t.extracurricular_id === extracurricular.id)}
                onDelete={handleDeleteExtracurricular}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateExtracurricular && (
        <CreateExtracurricularModal
          onClose={() => setShowCreateExtracurricular(false)}
          onCreate={createExtracurricular}
        />
      )}
    </div>
  );
}