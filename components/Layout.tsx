import React from 'react';
import { Menu, Music, Settings, Upload, MonitorSmartphone, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'admin' | 'sync';
  onChangeView: (view: 'dashboard' | 'admin' | 'sync') => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onChangeView, 
  isSidebarOpen, 
  toggleSidebar 
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-4 shrink-0 z-30 shadow-md">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-700 rounded-md text-gray-300 md:hidden"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <Music className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hidden sm:block">
              BeatBuddy Sync
            </h1>
          </div>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-2 bg-gray-900/50 p-1 rounded-lg">
          <NavButton 
            active={currentView === 'dashboard'} 
            onClick={() => onChangeView('dashboard')}
            icon={<MonitorSmartphone size={18} />}
            label="Live"
          />
          <NavButton 
            active={currentView === 'admin'} 
            onClick={() => onChangeView('admin')}
            icon={<Upload size={18} />}
            label="Manage"
          />
          <NavButton 
            active={currentView === 'sync'} 
            onClick={() => onChangeView('sync')}
            icon={<Settings size={18} />}
            label="Sync"
          />
        </nav>
      </header>

      {/* Main Area */}
      <main className="flex-1 overflow-hidden relative flex">
        {children}
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="hidden sm:inline text-sm font-medium">{label}</span>
  </button>
);
