import { useState } from 'react';
import { useCompetitions } from '../hooks/useCompetitions';
import { useExtracurriculars } from '../hooks/useExtracurriculars';
import { Trophy, Plus, Calendar, Award, Trash2, Medal } from 'lucide-react';
import { CreateCompetitionModal } from './CreateCompetitionModal';

interface CompetitionsTabProps {
  userId: string;
}

export function CompetitionsTab({ userId }: CompetitionsTabProps) {
  const { competitions, loading, deleteCompetition } = useCompetitions(userId);
  const { extracurriculars } = useExtracurriculars(userId);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getExtracurricular = (id: string) => {
    return extracurriculars.find(e => e.id === id);
  };

  const getPlacementColor = (placement: string) => {
    const lower = placement.toLowerCase();
    if (lower.includes('1st') || lower.includes('first') || lower.includes('winner') || lower.includes('champion')) {
      return 'from-yellow-500 to-yellow-600';
    }
    if (lower.includes('2nd') || lower.includes('second') || lower.includes('runner')) {
      return 'from-gray-400 to-gray-500';
    }
    if (lower.includes('3rd') || lower.includes('third')) {
      return 'from-orange-600 to-orange-700';
    }
    return 'from-blue-500 to-blue-600';
  };

  const getPlacementIcon = (placement: string) => {
    const lower = placement.toLowerCase();
    if (lower.includes('1st') || lower.includes('first') || lower.includes('winner') || lower.includes('champion')) {
      return '🥇';
    }
    if (lower.includes('2nd') || lower.includes('second') || lower.includes('runner')) {
      return '🥈';
    }
    if (lower.includes('3rd') || lower.includes('third')) {
      return '🥉';
    }
    return '🏆';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Competition Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your competitive achievements and victories
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add Competition</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Competitions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{competitions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Medal className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Gold Medals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {competitions.filter(c => 
                  c.placement.toLowerCase().includes('1st') || 
                  c.placement.toLowerCase().includes('first') || 
                  c.placement.toLowerCase().includes('winner')
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Award className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total XP Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {competitions.reduce((sum, c) => sum + c.xp_reward, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">This Year</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {competitions.filter(c => 
                  new Date(c.date).getFullYear() === new Date().getFullYear()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Competitions List */}
      <div className="space-y-4">
        {competitions.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No competitions yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Start tracking your competitive achievements and victories!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Competition</span>
            </button>
          </div>
        ) : (
          competitions.map((competition) => {
            const extracurricular = getExtracurricular(competition.extracurricular_id);
            const placementColor = getPlacementColor(competition.placement);
            const placementIcon = getPlacementIcon(competition.placement);
            
            return (
              <div
                key={competition.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{placementIcon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {competition.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          {extracurricular && (
                            <span className="flex items-center">
                              <span className="mr-1">{extracurricular.icon}</span>
                              {extracurricular.name}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(competition.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${placementColor} text-white text-sm font-semibold`}>
                        {competition.placement}
                      </div>
                      <div className="flex items-center text-blue-500">
                        <Award className="w-4 h-4 mr-1" />
                        <span className="font-semibold">+{competition.xp_reward} XP</span>
                      </div>
                    </div>

                    {competition.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {competition.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteCompetition(competition.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Competition Modal */}
      {showCreateModal && (
        <CreateCompetitionModal
          extracurriculars={extracurriculars}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}