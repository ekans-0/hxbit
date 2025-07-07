import React, { useState } from 'react';
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
  GraduationCap,
  Activity,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, category: 'main' },
    { id: 'tasks', label: 'Tasks', icon: Target, category: 'main' },
    { id: 'activities', label: 'Activities', icon: Activity, category: 'main' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, category: 'main' },
    { id: 'competitions', label: 'Competitions', icon: Trophy, category: 'activities' },
    { id: 'internships', label: 'Internships', icon: Briefcase, category: 'activities' },
    { id: 'physical', label: 'Physical Development', icon: Dumbbell, category: 'development' },
    { id: 'mental', label: 'Mental Performance', icon: Brain, category: 'development' },
    { id: 'social', label: 'Social Mastery', icon: Users, category: 'development' },
    { id: 'career', label: 'Career Excellence', icon: DollarSign, category: 'development' },
    { id: 'learning', label: 'Strategic Learning', icon: GraduationCap, category: 'development' },
    { id: 'stats', label: 'Character Stats', icon: TrendingUp, category: 'system' },
    { id: 'profile', label: 'Profile', icon: User, category: 'system' },
  ];

  const categories = {
    main: 'Core',
    activities: 'Activities',
    development: 'Development',
    system: 'System'
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  // Mobile menu overlay
  const MobileMenuOverlay = () => (
    <div className={`lg:hidden fixed inset-0 z-50 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <h1 className="text-xl font-bold text-white">HXBIT</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          {Object.entries(categories).map(([categoryKey, categoryLabel]) => (
            <div key={categoryKey} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                {categoryLabel}
              </h3>
              <div className="space-y-1">
                {navItems
                  .filter(item => item.category === categoryKey)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="ml-3 text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Footer */}
        <div className="border-t border-gray-800 p-2">
          <div className="space-y-1">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
              <span className="ml-3 text-sm font-medium">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
            <button
              onClick={onSignOut}
              className="w-full flex items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay />

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50 flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <h1 className="text-xl font-bold text-white">HXBIT</h1>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation - Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="p-2">
            {Object.entries(categories).map(([categoryKey, categoryLabel]) => (
              <div key={categoryKey} className="mb-6">
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
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
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'text-gray-300 hover:bg-gray-800'
                          } ${isCollapsed ? 'justify-center' : ''}`}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <span className="ml-3 text-sm font-medium whitespace-nowrap">{item.label}</span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-gray-800 p-2 flex-shrink-0">
          <div className="space-y-1">
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
            >
              {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium whitespace-nowrap">
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </button>
            <button
              onClick={onSignOut}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? 'Sign Out' : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium whitespace-nowrap">Sign Out</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}