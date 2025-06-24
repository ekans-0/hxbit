import React, { useState } from 'react';
import { Task, Extracurricular } from '../lib/supabase';
import { X, Zap } from 'lucide-react';

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

export function CreateTaskModal({ extracurriculars, onClose, onCreate, selectedExtracurricular }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [extracurricularId, setExtracurricularId] = useState(selectedExtracurricular || '');
  const [xpReward, setXpReward] = useState(25);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extracurricularId) return;

    setLoading(true);

    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        extracurricular_id: extracurricularId,
        xp_reward: xpReward,
      });
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md h-fit max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Activity Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Activity
              </label>
              <select
                value={extracurricularId}
                onChange={(e) => setExtracurricularId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="e.g., Practice scales for 30 minutes"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 resize-none"
                placeholder="Add more details about this task..."
              />
            </div>

            {/* XP Reward */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                XP Reward
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {XP_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setXpReward(preset.value)}
                    className={`p-3 border rounded-lg transition-all text-left ${
                      xpReward === preset.value
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{preset.label}</span>
                      <div className="flex items-center text-blue-400">
                        <Zap className="w-3 h-3 mr-1" />
                        <span className="text-xs font-bold">{preset.value}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">{preset.description}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Custom XP Amount</label>
                <input
                  type="number"
                  value={xpReward}
                  onChange={(e) => setXpReward(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="1000"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim() || !extracurricularId}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}