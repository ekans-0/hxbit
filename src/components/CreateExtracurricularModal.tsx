import React, { useState } from 'react';
import { Extracurricular } from '../lib/supabase';
import { X } from 'lucide-react';

interface CreateExtracurricularModalProps {
  onClose: () => void;
  onCreate: (extracurricular: Omit<Extracurricular, 'id' | 'user_id' | 'level' | 'xp' | 'created_at'>) => Promise<Extracurricular>;
}

const PRESET_ACTIVITIES = [
  { name: 'Programming', icon: '💻', color: '#3B82F6', description: 'Coding projects and software development' },
  { name: 'Music', icon: '🎵', color: '#8B5CF6', description: 'Musical instruments and performance' },
  { name: 'Sports', icon: '⚽', color: '#10B981', description: 'Athletic activities and fitness' },
  { name: 'Art', icon: '🎨', color: '#F59E0B', description: 'Visual arts and creative projects' },
  { name: 'Science', icon: '🔬', color: '#EF4444', description: 'Research and scientific exploration' },
  { name: 'Debate', icon: '🗣️', color: '#06B6D4', description: 'Public speaking and argumentation' },
  { name: 'Volunteering', icon: '🤝', color: '#84CC16', description: 'Community service and social impact' },
  { name: 'Leadership', icon: '👥', color: '#F97316', description: 'Student government and club leadership' },
  { name: 'Writing', icon: '📝', color: '#6366F1', description: 'Creative writing and journalism' },
  { name: 'Theater', icon: '🎭', color: '#EC4899', description: 'Drama, acting, and stage performance' },
];

export function CreateExtracurricularModal({ onClose, onCreate }: CreateExtracurricularModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📚');
  const [color, setColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        icon,
        color,
      });
      onClose();
    } catch (error) {
      console.error('Error creating extracurricular:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectPreset = (preset: typeof PRESET_ACTIVITIES[0]) => {
    setName(preset.name);
    setDescription(preset.description);
    setIcon(preset.icon);
    setColor(preset.color);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Create New Activity</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Quick Presets */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Quick Start</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PRESET_ACTIVITIES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => selectPreset(preset)}
                  className="p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">{preset.icon}</span>
                    <span className="font-medium text-white text-sm">{preset.name}</span>
                  </div>
                  <p className="text-xs text-slate-400">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Activity Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="e.g., Programming, Piano, Soccer"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="Describe your activity goals and what you'll track..."
                required
              />
            </div>

            {/* Icon and Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Icon
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                  placeholder="🏆"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        color === c ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <p className="text-sm text-slate-400 mb-2">Preview:</p>
              <div className="flex items-center">
                <span className="text-2xl mr-3">{icon}</span>
                <div>
                  <h4 className="font-semibold text-white">{name || 'Activity Name'}</h4>
                  <p className="text-sm text-slate-400">{description || 'Activity description'}</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !name.trim() || !description.trim()}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Activity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}