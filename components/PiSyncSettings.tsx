import React, { useState } from 'react';
import { MOCK_PI_IP } from '../constants';
import { RefreshCw, Server, Wifi, WifiOff, HardDrive } from 'lucide-react';

export const PiSyncSettings: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'complete' | 'error'>('idle');
  const [offlineMode, setOfflineMode] = useState(false);

  const handleSync = () => {
    setSyncStatus('syncing');
    // Simulate network delay
    setTimeout(() => {
      setSyncStatus('complete');
    }, 2500);
  };

  return (
    <div className="flex-1 bg-gray-900 text-gray-100 p-6 md:p-10 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Phase 3: Offline Sync</h2>
          <p className="text-gray-400">Manage connections to your local Raspberry Pi server for offline redundancy.</p>
        </div>

        {/* Sync Card */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${syncStatus === 'complete' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  <Server size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Raspberry Pi Server</h3>
                  <p className="text-sm text-gray-400 font-mono mt-1">Detected IP: <span className="text-green-400">{MOCK_PI_IP}</span></p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-900 text-green-300 border border-green-700">
                ONLINE
              </div>
            </div>

            <div className="mt-8">
               <div className="flex justify-between text-sm text-gray-400 mb-2">
                 <span>Local Database Version: v2.1.0</span>
                 <span>Remote Cloud Version: v2.1.4</span>
               </div>
               <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                 <div 
                   className={`h-full bg-blue-500 transition-all duration-1000 ${syncStatus === 'syncing' ? 'w-3/4 animate-pulse' : syncStatus === 'complete' ? 'w-full bg-green-500' : 'w-0'}`} 
                 />
               </div>
               {syncStatus === 'complete' && <p className="text-green-400 text-sm mt-2">Sync completed successfully at {new Date().toLocaleTimeString()}</p>}
            </div>

            <div className="mt-8 flex space-x-4">
              <button 
                onClick={handleSync}
                disabled={syncStatus === 'syncing'}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-900/50 p-4 border-t border-gray-700 text-xs text-gray-500 flex items-center">
            <HardDrive size={14} className="mr-2" />
            <span>Storage: 4.2GB / 32GB Used</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 border border-gray-700 flex items-center justify-between">
           <div>
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
               {offlineMode ? <WifiOff size={24} className="text-red-400" /> : <Wifi size={24} className="text-green-400" />}
               <span>Network Mode</span>
             </h3>
             <p className="text-gray-400 mt-1">Force application to run from local Raspberry Pi cache.</p>
           </div>
           
           <button 
             onClick={() => setOfflineMode(!offlineMode)}
             className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${offlineMode ? 'bg-red-600' : 'bg-green-600'}`}
           >
             <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${offlineMode ? 'translate-x-7' : 'translate-x-1'}`} />
           </button>
        </div>
      </div>
    </div>
  );
};
