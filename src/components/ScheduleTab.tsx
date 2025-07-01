import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExtracurriculars } from '../hooks/useExtracurriculars';
import { useTasks } from '../hooks/useTasks';
import { useInternships } from '../hooks/useInternships';
import { useSchedule } from '../hooks/useSchedule';
import { CreateScheduleEventModal } from './CreateScheduleEventModal';
import { 
  Calendar, 
  Plus, 
  Clock, 
  Target,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical
} from 'lucide-react';

interface ScheduleTabProps {
  userId: string;
}

const SCHEDULE_TEMPLATES = [
  {
    name: 'Morning Routine',
    events: [
      { title: 'Wake up & Hydrate', time: '06:00', duration: 15, type: 'personal' },
      { title: 'Morning Workout', time: '06:15', duration: 45, type: 'fitness' },
      { title: 'Shower & Get Ready', time: '07:00', duration: 30, type: 'personal' },
      { title: 'Healthy Breakfast', time: '07:30', duration: 30, type: 'nutrition' },
    ]
  },
  {
    name: 'Study Block',
    events: [
      { title: 'Review Notes', time: '09:00', duration: 30, type: 'learning' },
      { title: 'Deep Work Session', time: '09:30', duration: 90, type: 'learning' },
      { title: 'Break', time: '11:00', duration: 15, type: 'personal' },
      { title: 'Practice Problems', time: '11:15', duration: 45, type: 'learning' },
    ]
  },
  {
    name: 'Evening Wind Down',
    events: [
      { title: 'Dinner', time: '18:00', duration: 45, type: 'nutrition' },
      { title: 'Reflection & Journaling', time: '19:00', duration: 20, type: 'mental' },
      { title: 'Light Reading', time: '19:30', duration: 30, type: 'learning' },
      { title: 'Prepare for Tomorrow', time: '20:00', duration: 15, type: 'personal' },
    ]
  }
];

export function ScheduleTab({ userId }: ScheduleTabProps) {
  const { user } = useAuth();
  const { extracurriculars } = useExtracurriculars(userId);
  const { tasks } = useTasks(userId);
  const { internships } = useInternships(userId);
  const { scheduleEvents, createScheduleEvent, updateScheduleEvent, deleteScheduleEvent } = useSchedule(userId);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const applyTemplate = async (template: typeof SCHEDULE_TEMPLATES[0]) => {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    for (const event of template.events) {
      await createScheduleEvent({
        title: event.title,
        description: `Part of ${template.name} template`,
        date: dateStr,
        start_time: event.time,
        duration: event.duration,
        event_type: event.type,
        task_id: null,
        internship_id: null,
      });
    }
  };

  const getTodaysEvents = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    return scheduleEvents
      .filter(event => event.date === dateStr)
      .filter(event => filterType === 'all' || event.event_type === filterType)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      personal: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600',
      fitness: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-600',
      learning: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600',
      mental: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600',
      social: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600',
      career: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-600',
      nutrition: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-600',
      task: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600',
      internship: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 border-cyan-300 dark:border-cyan-600',
    };
    return colors[type as keyof typeof colors] || colors.personal;
  };

  const todaysEvents = getTodaysEvents();
  const pendingTasks = tasks.filter(task => !task.completed);
  const activeInternships = internships.filter(i => !i.end_date);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Schedule & Planning
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your time and maximize productivity
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Today's Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{todaysEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Active Internships</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeInternships.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {todaysEvents.reduce((sum, event) => sum + event.duration, 0) / 60}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Templates */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SCHEDULE_TEMPLATES.map((template, index) => (
            <button
              key={index}
              onClick={() => applyTemplate(template)}
              className="p-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl hover:shadow-lg transition-all duration-200 text-left group hover:border-blue-300 dark:hover:border-blue-600"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {template.events.length} events • {template.events.reduce((sum, e) => sum + e.duration, 0)} min
              </p>
              <div className="space-y-1">
                {template.events.slice(0, 3).map((event, eventIndex) => (
                  <div key={eventIndex} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(event.time)} - {event.title}
                  </div>
                ))}
                {template.events.length > 3 && (
                  <div className="text-xs text-gray-400">+{template.events.length - 3} more...</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:shadow-md transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {formatDate(currentDate)}
          </h2>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:shadow-md transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="all">All Events</option>
            <option value="personal">Personal</option>
            <option value="fitness">Fitness</option>
            <option value="learning">Learning</option>
            <option value="mental">Mental</option>
            <option value="social">Social</option>
            <option value="career">Career</option>
            <option value="task">Tasks</option>
            <option value="internship">Internships</option>
          </select>

          {/* View Mode Toggle */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-1 border border-gray-300 dark:border-slate-700">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                viewMode === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                viewMode === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Events */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Today's Schedule</h2>
        {todaysEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No events scheduled
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Start planning your day by adding some events or using a template!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Event</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${getEventTypeColor(event.event_type)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center text-sm font-medium">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(event.start_time)} ({event.duration} min)
                      </div>
                      <span className="text-xs px-2 py-1 bg-white/50 dark:bg-black/20 rounded-full">
                        {event.event_type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm opacity-80">{event.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteScheduleEvent(event.id)}
                    className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateScheduleEventModal
          extracurriculars={extracurriculars}
          tasks={pendingTasks}
          internships={activeInternships}
          selectedDate={currentDate.toISOString().split('T')[0]}
          onClose={() => setShowCreateModal(false)}
          onCreate={createScheduleEvent}
        />
      )}
    </div>
  );
}