import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExtracurriculars } from '../hooks/useExtracurriculars';
import { useTasks } from '../hooks/useTasks';
import { useUserStats } from '../hooks/useUserStats';
import { ExtracurricularCard } from './ExtracurricularCard';
import { CreateExtracurricularModal } from './CreateExtracurricularModal';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskList } from './TaskList';
import { UserStats } from './UserStats';
import { Navigation } from './Navigation';
import { CompetitionsTab } from './CompetitionsTab';
import { InternshipsTab } from './InternshipsTab';
import { SelfImprovementTab } from './SelfImprovementTab';
import { Plus, Trophy, Target, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { extracurriculars, loading: extracurricularsLoading, createExtracurricular } = useExtracurriculars(user?.id);
  const { tasks, loading: tasksLoading, createTask, completeTask, deleteTask } = useTasks(user?.id);
  const { awardStatPoints } = useUserStats(user?.id);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateExtracurricular, setShowCreateExtracurricular] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedExtracurricular, setSelectedExtracurricular] = useState<string>('');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('See you next time, Hunter!', {
        icon: '👋',
        style: {
          background: '#1F2937',
          color: '#00D4FF',
          border: '1px solid #00D4FF',
        },
      });
    } catch (error: any) {
      toast.error('Failed to sign out');
    }
  };

  const handleCompleteTask = async (taskId: string, xpReward: number, extracurricularId: string) => {
    try {
      const result = await completeTask(taskId, xpReward, extracurricularId);
      
      // Award stat points for significant XP gains
      if (xpReward >= 50) {
        await awardStatPoints(1);
      } else if (xpReward >= 100) {
        await awardStatPoints(2);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  if (extracurricularsLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-white text-lg">Loading your journey...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'competitions':
        return <CompetitionsTab userId={user!.id} />;
      case 'internships':
        return <InternshipsTab userId={user!.id} />;
      case 'stats':
        return <SelfImprovementTab userId={user!.id} />;
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
              <p className="text-gray-600 dark:text-gray-400">Profile management coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* User Stats */}
            <UserStats user={user!} extracurriculars={extracurriculars} tasks={tasks} />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => setShowCreateExtracurricular(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center transition duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Activity
              </button>
              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center transition duration-200 transform hover:scale-105"
              >
                <Target className="w-5 h-5 mr-2" />
                New Task
              </button>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-slate-400">Active Activities</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{extracurriculars.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-slate-400">Completed Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-slate-400">Pending Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingTasks.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Extracurriculars Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Activities</h2>
              {extracurriculars.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mb-2">No activities yet</h3>
                  <p className="text-gray-500 dark:text-slate-500 mb-6">Create your first extracurricular activity to start leveling up!</p>
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
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Tasks */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Tasks</h2>
              <TaskList
                tasks={tasks.slice(0, 10)}
                extracurriculars={extracurriculars}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={deleteTask}
              />
            </div>

            {/* Modals */}
            {showCreateExtracurricular && (
              <CreateExtracurricularModal
                onClose={() => setShowCreateExtracurricular(false)}
                onCreate={createExtracurricular}
              />
            )}

            {showCreateTask && (
              <CreateTaskModal
                extracurriculars={extracurriculars}
                onClose={() => setShowCreateTask(false)}
                onCreate={createTask}
                selectedExtracurricular={selectedExtracurricular}
              />
            )}
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      {/* Background effects for dark mode */}
      <div className="absolute inset-0 overflow-hidden dark:block hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/3 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onSignOut={handleSignOut} 
        />
        {renderContent()}
      </div>
    </div>
  );
}