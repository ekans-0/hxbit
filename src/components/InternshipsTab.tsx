import React, { useState } from 'react';
import { useInternships } from '../hooks/useInternships';
import { useExtracurriculars } from '../hooks/useExtracurriculars';
import { Briefcase, Plus, Calendar, Building, Trash2, Clock } from 'lucide-react';
import { CreateInternshipModal } from './CreateInternshipModal';

interface InternshipsTabProps {
  userId: string;
}

export function InternshipsTab({ userId }: InternshipsTabProps) {
  const { internships, loading, deleteInternship } = useInternships(userId);
  const { extracurriculars } = useExtracurriculars(userId);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getExtracurricular = (id: string) => {
    return extracurriculars.find(e => e.id === id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMonths > 0) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else if (diffWeeks > 0) {
      return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
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
            Internship Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your professional experience and skill development
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add Internship</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Internships</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{internships.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Building className="w-6 h-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Companies</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(internships.map(i => i.company)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {internships.filter(i => !i.end_date).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {internships.reduce((sum, i) => sum + i.xp_reward, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Internships List */}
      <div className="space-y-4">
        {internships.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No internships yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Start tracking your professional experience and skill development!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Internship</span>
            </button>
          </div>
        ) : (
          internships.map((internship) => {
            const extracurricular = getExtracurricular(internship.extracurricular_id);
            const duration = calculateDuration(internship.start_date, internship.end_date);
            const isActive = !internship.end_date;
            
            return (
              <div
                key={internship.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Briefcase className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {internship.position}
                        </h3>
                        <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
                          {internship.company}
                        </p>
                      </div>
                      {isActive && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {extracurricular && (
                        <span className="flex items-center">
                          <span className="mr-1">{extracurricular.icon}</span>
                          {extracurricular.name}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(internship.start_date)} - {internship.end_date ? formatDate(internship.end_date) : 'Present'}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {duration}
                      </span>
                    </div>

                    {internship.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {internship.description}
                      </p>
                    )}

                    {internship.skills_gained && internship.skills_gained.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Skills Gained:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {internship.skills_gained.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center text-purple-500">
                      <span className="font-semibold">+{internship.xp_reward} XP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteInternship(internship.id)}
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

      {/* Create Internship Modal */}
      {showCreateModal && (
        <CreateInternshipModal
          extracurriculars={extracurriculars}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}