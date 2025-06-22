import React, { useState } from 'react';
import { useCompetitions } from '../hooks/useCompetitions';
import { useAuth } from '../hooks/useAuth';
import { Extracurricular } from '../lib/supabase';
import { X, Trophy } from 'lucide-react';

interface CreateCompetitionModalProps {
  extracurriculars: Extracurricular[];
  onClose: () => void;
}

const PLACEMENT_PRESETS = [
  { label: '1st Place', value: '1st Place', xp: 100 },
  { label: '2nd Place', value: '2nd Place', xp: 75 },
  { label: '3rd Place', value: '3rd Place', xp: 50 },
  { label: 'Finalist', value: 'Finalist', xp: 40 },
  { label: 'Semi-Finalist', value: 'Semi-Finalist', xp: 30 },
  { label: 'Quarter-Finalist', value: 'Quarter-Finalist', xp: 25 },
  { label: 'Participant', value: 'Participant', xp: 15 },
];

export function CreateCompetitionModal({ extracurriculars, onClose }: CreateCompetitionModalProps) {
  const { user } = useAuth();
  const { createCompetition } = useCompetitions(user?.id);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    extracurricular_id: '',
    placement: '',
    date: '',
    xp_reward: 50,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.extracurricular_id || !formData.name || !formData.placement || !formData.date) return;

    setLoading(true);
    try {
      await createCompetition(formData);
      onClose();
    } catch (error) {
      console.error('Error creating competition:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectPlacement = (preset: typeof PLACEMENT_PRESETS[0]) => {
    setFormData(prev => ({
      ...prev,
      placement: preset.value,
      xp_reward: preset.xp,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Competition</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Competition Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Competition Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="e.g., National Programming Contest"
              required
            />
          </div>

          {/* Activity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Related Activity
            </label>
            <select
              value={formData.extracurricular_id}
              onChange={(e) => setFormData(prev => ({ ...prev, extracurricular_id: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              required
            >
              <option value="">Select an activity</option>
              {extracurriculars.map((ext) => (
                <option key={ext.id} value={ext.id}>
                  {ext.icon} {ext.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Competition Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Placement Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Placement/Result
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {PLACEMENT_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => selectPlacement(preset)}
                  className={`p-3 border rounded-lg transition-all text-left ${
                    formData.placement === preset.value
                      ? 'border-yellow-500 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                      : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="font-medium text-sm">{preset.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">+{preset.xp} XP</div>
                </button>
              ))}
            </div>
            
            <input
              type="text"
              value={formData.placement}
              onChange={(e) => setFormData(prev => ({ ...prev, placement: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Or enter custom placement"
              required
            />
          </div>

          {/* XP Reward */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              XP Reward
            </label>
            <input
              type="number"
              value={formData.xp_reward}
              onChange={(e) => setFormData(prev => ({ ...prev, xp_reward: Math.max(1, parseInt(e.target.value) || 1) }))}
              min="1"
              max="1000"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Additional details about the competition..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.extracurricular_id || !formData.placement || !formData.date}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Trophy className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Adding...' : 'Add Competition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}