import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExtracurriculars } from '../hooks/useExtracurriculars';
import { useTasks } from '../hooks/useTasks';
import { useUserStats } from '../hooks/useUserStats';
import { ExtracurricularCard } from './ExtracurricularCard';
import { CreateExtracurricularModal } from './CreateExtracurricularModal';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskList } from './TaskList';
import { UserStats } from './UserStats';
import { Sidebar } from './Sidebar';
import { UnifiedDashboard } from './UnifiedDashboard';
import { CompetitionsTab } from './CompetitionsTab';
import { InternshipsTab } from './InternshipsTab';
import { CharacterStatsTab } from './CharacterStatsTab';
import { PhysicalDevelopmentTab } from './PhysicalDevelopmentTab';
import { MentalPerformanceTab } from './MentalPerformanceTab';
import { SocialMasteryTab } from './SocialMasteryTab';
import { CareerExcellenceTab } from './CareerExcellenceTab';
import { StrategicLearningTab } from './StrategicLearningTab';
import { ScheduleTab } from './ScheduleTab';
import { ActivitiesTab } from './ActivitiesTab';
import { ProfileTab } from './ProfileTab';
import { Plus, Trophy, Target, Zap } from 'lucide-react';
import { formatNumber } from '../utils/formatters';
import toast from 'react-hot-toast';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { extracurriculars, loading: extracurricularsLoading, createExtracurricular, deleteExtracurricular } = useExtracurriculars(user?.id);
  const { tasks, loading: tasksLoading, createTask, completeTask, deleteTask } = useTasks(user?.id);
  const { awardStatPoints } = useUserStats(user?.id);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCreateExtracurricular, setShowCreateExtracurricular] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedExtracurricular] = useState<string>('');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('See you next time, Player!', {
        icon: '👋',
        style: {
          background: '#1F2937',
          color: '#00D4FF',
          border: '1px solid #00D4FF',
        },
      });
    } catch (error: unknown) {
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

  if (extracurricularsLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your journey...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <UnifiedDashboard setActiveTab={setActiveTab} />;
      case 'tasks':
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Task Management</h1>
                <p className="text-gray-400 text-sm sm:text-base">Track and complete your daily objectives</p>
              </div>
              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center transition duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                New Task
              </button>
            </div>
            <TaskList
              tasks={tasks}
              extracurriculars={extracurriculars}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={deleteTask}
            />
          </div>
        );
      case 'activities':
        return <ActivitiesTab userId={user!.id} />;
      case 'competitions':
        return <CompetitionsTab userId={user!.id} />;
      case 'internships':
        return <InternshipsTab userId={user!.id} />;
      case 'stats':
        return <CharacterStatsTab userId={user!.id} />;
      case 'physical':
        return <PhysicalDevelopmentTab userId={user!.id} />;
      case 'mental':
        return <MentalPerformanceTab userId={user!.id} />;
      case 'social':
        return <SocialMasteryTab userId={user!.id} />;
      case 'career':
        return <CareerExcellenceTab userId={user!.id} />;
      case 'learning':
        return <StrategicLearningTab userId={user!.id} />;
      case 'schedule':
        return <ScheduleTab userId={user!.id} />;
      case 'profile':
        return <ProfileTab userId={user!.id} />;
      default:
        return (
          <main className="space-y-6 sm:space-y-8">
            {/* User Stats */}
            <UserStats user={user!} extracurriculars={extracurriculars} tasks={tasks} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <button
                onClick={() => setShowCreateExtracurricular(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center justify-center transition duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                New Activity
              </button>
              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center justify-center transition duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                New Task
              </button>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white">Active Activities</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{extracurriculars.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white">Completed Tasks</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{completedTasks.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white">Pending Tasks</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{pendingTasks.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Extracurriculars Grid */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Your Activities</h2>
              {extracurriculars.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">No activities yet</h3>
                  <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Create your first extracurricular activity to start leveling up!</p>
                  <button
                    onClick={() => setShowCreateExtracurricular(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center mx-auto transition duration-200 transform hover:scale-105 text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Create First Activity
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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

            {/* Recent Tasks */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Recent Tasks</h2>
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
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/3 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onSignOut={handleSignOut}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'} lg:${isCollapsed ? 'ml-16' : 'ml-64'} ${isCollapsed ? 'ml-16' : 'ml-0'} lg:ml-${isCollapsed ? '16' : '64'}`}>
          <div className="p-4 sm:p-6">
            {renderContent()}
          </div>
        </main>
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
    </div>
  );
}