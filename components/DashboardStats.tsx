import React from 'react';
import { Song } from '../types';
import { Music, Activity, Clock } from 'lucide-react';

interface StatsProps {
  songs: Song[];
}

export const DashboardStats: React.FC<StatsProps> = ({ songs }) => {
  const totalSongs = songs.length;
  const avgBpm = totalSongs > 0 
    ? Math.round(songs.reduce((acc, curr) => acc + curr.bpm, 0) / totalSongs) 
    : 0;
  const lastAdded = totalSongs > 0 
    ? new Date(Math.max(...songs.map(s => s.createdAt))).toLocaleDateString() 
    : 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center space-x-4">
        <div className="p-3 bg-blue-600/20 rounded-full text-blue-400">
           <Music size={24} />
        </div>
        <div>
           <p className="text-sm text-gray-400">Total Songs</p>
           <p className="text-2xl font-bold text-white">{totalSongs}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center space-x-4">
        <div className="p-3 bg-green-600/20 rounded-full text-green-400">
           <Activity size={24} />
        </div>
        <div>
           <p className="text-sm text-gray-400">Avg Tempo</p>
           <p className="text-2xl font-bold text-white">{avgBpm} <span className="text-sm font-normal text-gray-500">BPM</span></p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center space-x-4">
        <div className="p-3 bg-purple-600/20 rounded-full text-purple-400">
           <Clock size={24} />
        </div>
        <div>
           <p className="text-sm text-gray-400">Last Update</p>
           <p className="text-xl font-bold text-white">{lastAdded}</p>
        </div>
      </div>
    </div>
  );
};
