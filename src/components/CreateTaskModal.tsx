import React, { useState } from 'react';
import { Task, Extracurricular } from '../lib/supabase';
import { X, Zap, Plus } from 'lucide-react';

interface CreateTaskModalProps {
  extracurriculars: Extracurricular[];
  onClose: () => void;
  onCreate: (task: Omit<Task, 'id' | 'user_id' | 'completed' | 'completed_at' | 'created_at'>) => Promise<Task>;
  selectedExtracurricular?: string;
}

const XP_PRESETS = [
  { label: 'Small Task', value: 10, description: 'Quick practice or simple activity' },
  { label: 'Medium Task', value: 25, description: 'Regular practice session or assignment' },
  { label: 'Large Task', value: 50, description: 'Major milestone or significant achievement' },
  { label: 'Epic Task', value: 100, description: 'Competition, performance, or major project' },
];

const STAT_CATEGORIES = {
  physical: ['strength', 'agility', 'endurance', 'vitality'],
  mental: ['intelligence', 'perception', 'sense'],
  social: ['charisma', 'luck'],
  general: ['hygiene']
};

export function CreateTaskModal({ extracurriculars, onClose, onCreate, selectedExtracurricular }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    extracurricular_id: selectedExtracurricular || '',
    xp_reward: 25,
    stat_rewards: {} as Record<string, number>
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.extracurricular_id) return;

    setLoading(true);

    try {
      await onCreate({
        title: formData.title.trim(),
        description: formData.description.trim(),
        extracurricular_id: formData.extracurricular_id,
        xp_reward: formData.xp_reward,
      });
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatReward = (stat: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      stat_rewards: {
        ...prev.stat_rewards,
        [stat]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl mx-auto my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Activity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Activity
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

          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="e.g., Practice scales for 30 minutes"
              required
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              placeholder="Add more details about this task..."
            />
          </div>

          {/* XP Reward */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              XP Reward
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {XP_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, xp_reward: preset.value }))}
                  className={`p-3 border rounded-lg transition-all text-left ${
                    formData.xp_reward === preset.value
                      ? 'border-blue-500 bg-blue-500/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{preset.label}</span>
                    <div className="flex items-center text-blue-500">
                      <Zap className="w-3 h-3 mr-1" />
                      <span className="text-xs font-bold">{preset.value}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{preset.description}</p>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Custom XP Amount</label>
              <input
                type="number"
                value={formData.xp_reward}
                onChange={(e) => setFormData(prev => ({ ...prev, xp_reward: Math.max(1, parseInt(e.target.value) || 1) }))}
                min="1"
                max="1000"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Stat Rewards */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Stat Bonuses (Optional)
            </label>
            <div className="space-y-4">
              {Object.entries(STAT_CATEGORIES).map(([category, stats]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 capitalize">
                    {category} Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat) => (
                      <div key={stat} className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300 capitalize flex-1">
                          {stat}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={formData.stat_rewards[stat] || 0}
                          onChange={(e) => updateStatReward(stat, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.extracurricular_id}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}