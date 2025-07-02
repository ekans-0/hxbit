import React, { useState } from 'react';
import { Extracurricular, Task, Internship } from '../lib/supabase';
import { X, Calendar, Clock, Target, Briefcase } from 'lucide-react';

interface CreateScheduleEventModalProps {
  extracurriculars: Extracurricular[];
  tasks: Task[];
  internships: Internship[];
  selectedDate: string;
  onClose: () => void;
  onCreate: (event: any) => Promise<any>;
}

const EVENT_TYPES = [
  { value: 'personal', label: 'Personal', icon: '👤', color: 'bg-gray-100 text-gray-800' },
  { value: 'fitness', label: 'Fitness', icon: '💪', color: 'bg-red-100 text-red-800' },
  { value: 'learning', label: 'Learning', icon: '📚', color: 'bg-blue-100 text-blue-800' },
  { value: 'mental', label: 'Mental', icon: '🧠', color: 'bg-purple-100 text-purple-800' },
  { value: 'social', label: 'Social', icon: '🤝', color: 'bg-green-100 text-green-800' },
  { value: 'career', label: 'Career', icon: '💼', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗', color: 'bg-orange-100 text-orange-800' },
  { value: 'task', label: 'Task', icon: '✅', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'internship', label: 'Internship', icon: '🏢', color: 'bg-cyan-100 text-cyan-800' },
];

export function CreateScheduleEventModal({ 
  extracurriculars, 
  tasks, 
  internships, 
  selectedDate, 
  onClose, 
  onCreate 
}: CreateScheduleEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDate,
    start_time: '09:00',
    duration: 60,
    event_type: 'personal',
    task_id: null as string | null,
    internship_id: null as string | null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.start_time) return;

    setLoading(true);
    try {
      await onCreate(formData);
      onClose();
    } catch (error) {
      console.error('Error creating schedule event:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectEventType = (eventType: string) => {
    setFormData(prev => ({
      ...prev,
      event_type: eventType,
      task_id: eventType === 'task' ? prev.task_id : null,
      internship_id: eventType === 'internship' ? prev.internship_id : null,
    }));
  };

  const selectTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setFormData(prev => ({
        ...prev,
        title: task.title,
        description: task.description,
        task_id: taskId,
        event_type: 'task',
      }));
    }
  };

  const selectInternship = (internshipId: string) => {
    const internship = internships.find(i => i.id === internshipId);
    if (internship) {
      setFormData(prev => ({
        ...prev,
        title: `${internship.position} at ${internship.company}`,
        description: 'Internship work session',
        internship_id: internshipId,
        event_type: 'internship',
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Event Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => selectEventType(type.value)}
                  className={`p-3 border-2 rounded-lg transition-all text-left ${
                    formData.event_type === type.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{type.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Task Selection */}
          {formData.event_type === 'task' && tasks.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Link to Task (Optional)
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {tasks.slice(0, 10).map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => selectTask(task.id)}
                    className={`w-full p-3 border rounded-lg text-left transition-all ${
                      formData.task_id === task.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Target className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">+{task.xp_reward} XP</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Internship Selection */}
          {formData.event_type === 'internship' && internships.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Link to Internship (Optional)
              </label>
              <div className="space-y-2">
                {internships.map((internship) => (
                  <button
                    key={internship.id}
                    type="button"
                    onClick={() => selectInternship(internship.id)}
                    className={`w-full p-3 border rounded-lg text-left transition-all ${
                      formData.internship_id === internship.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-4 h-4 text-cyan-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {internship.position}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{internship.company}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="e.g., Morning workout, Study session"
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Additional details about this event..."
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                min="5"
                max="480"
                step="5"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
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
              disabled={loading || !formData.title || !formData.date || !formData.start_time}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Calendar className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}