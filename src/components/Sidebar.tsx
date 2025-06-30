import React from 'react';
import { 
  Home, 
  Trophy, 
  Briefcase, 
  TrendingUp, 
  User, 
  Sun, 
  Moon, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Target,
  Calendar,
  BookOpen,
  Dumbbell,
  Brain,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, onSignOut, isCollapsed, setIsCollapsed }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, category: 'main' },
    { id: 'tasks', label: 'Tasks', icon: Target, category: 'main' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, category: 'main' },
    { id: 'competitions', label: 'Competitions', icon: Trophy, category: 'activities' },
    { id: 'internships', label: 'Internships', icon: Briefcase, category: 'activities' },
    { id: 'learning', label: 'Learning', icon: BookOpen, category: 'development' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, category: 'development' },
    { id: 'mental', label: 'Mental', icon: Brain, category: 'development' },
    { id: 'social', label: 'Social', icon: Users, category: 'development' },
    { id: 'career', label: 'Career', icon: DollarSign, category: 'development' },
    { id: 'stats', label: 'Character Stats', icon: TrendingUp, category: 'system' },
    { id: 'profile', label: 'Profile', icon: User, category: 'system' },
  ];

  const categories = {
    main: 'Core',
    activities: 'Activities',
    development: 'Development',
    system: 'System'
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 transition-all duration-300 z-50 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Hxbit</h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        {Object.entries(categories).map(([categoryKey, categoryLabel]) => (
          <div key={categoryKey} className="mb-6">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
                {categoryLabel}
              </h3>
            )}
            <div className="space-y-1">
              {navItems
                .filter(item => item.category === categoryKey)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5" />
                      {!isCollapsed && (
                        <span className="ml-3 text-sm font-medium">{item.label}</span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-slate-700 p-2">
        <div className="space-y-1">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
          <button
            onClick={onSignOut}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">Sign Out</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}