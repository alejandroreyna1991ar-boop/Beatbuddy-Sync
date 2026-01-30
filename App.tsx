import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SongList } from './components/SongList';
import { SongViewer } from './components/SongViewer';
import { AdminPanel } from './components/AdminPanel';
import { PiSyncSettings } from './components/PiSyncSettings';
import { DashboardStats } from './components/DashboardStats';
import { Song } from './types';
import { getSongs } from './services/storageService';
import { MockSocketService } from './services/mockSocketService';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'admin' | 'sync'>('dashboard');
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize data and socket simulation
  useEffect(() => {
    const loadData = () => {
      const storedSongs = getSongs();
      setSongs(storedSongs);
    };

    loadData();

    // Listen for remote song changes (Simulated WebSocket)
    const handleRemoteChange = (songId: string) => {
      const song = getSongs().find(s => s.id === songId);
      if (song) {
        setActiveSong(song);
        // Show a temporary toast or indicator could be added here
      }
    };

    MockSocketService.subscribe(handleRemoteChange);

    return () => {
      MockSocketService.unsubscribe(handleRemoteChange);
    };
  }, []);

  const handleSongSelect = (song: Song) => {
    setActiveSong(song);
    // Notify "other users"
    MockSocketService.broadcastSongChange(song.id);
  };

  const refreshSongs = () => {
    setSongs(getSongs());
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      {currentView === 'dashboard' && (
        <div className="flex h-full w-full overflow-hidden relative">
          {/* Song List Sidebar */}
          <div className={`${isSidebarOpen ? 'w-full md:w-80 lg:w-96' : 'w-0'} transition-all duration-300 bg-gray-800 border-r border-gray-700 flex flex-col absolute md:relative z-20 h-full`}>
            <SongList 
              songs={songs} 
              activeSong={activeSong} 
              onSelect={handleSongSelect} 
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full bg-gray-900 relative overflow-hidden">
             {activeSong ? (
               <SongViewer song={activeSong} />
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 p-8">
                 <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-300 mb-2">Ready to Rock?</h2>
                    <p>Select a song from the list to send MIDI commands to BeatBuddy and view lyrics.</p>
                 </div>
                 <div className="w-full max-w-2xl mt-8">
                   <DashboardStats songs={songs} />
                 </div>
               </div>
             )}
          </div>
        </div>
      )}

      {currentView === 'admin' && (
        <AdminPanel onSongsUpdated={refreshSongs} />
      )}

      {currentView === 'sync' && (
        <PiSyncSettings />
      )}
    </Layout>
  );
}