import React, { useState } from 'react';
import { Song } from '../types';
import { Search, Music2, FolderOpen } from 'lucide-react';

interface SongListProps {
  songs: Song[];
  activeSong: Song | null;
  onSelect: (song: Song) => void;
}

export const SongList: React.FC<SongListProps> = ({ songs, activeSong, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search setlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredSongs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Music2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No songs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {filteredSongs.map(song => (
              <button
                key={song.id}
                onClick={() => onSelect(song)}
                className={`w-full text-left p-4 hover:bg-gray-700/50 transition-colors flex items-center group ${
                  activeSong?.id === song.id 
                    ? 'bg-blue-900/20 border-l-4 border-blue-500' 
                    : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${activeSong?.id === song.id ? 'text-blue-400' : 'text-gray-200'}`}>
                    {song.title}
                  </h3>
                  {song.artist && (
                    <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                  )}
                  <div className="flex items-center mt-1 text-xs text-gray-600 space-x-3">
                    <span className="flex items-center">
                      <FolderOpen className="w-3 h-3 mr-1" />
                      {song.folder} : {song.program}
                    </span>
                    <span className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
                      {song.bpm} BPM
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-2 bg-gray-900 border-t border-gray-700 text-center text-xs text-gray-600">
        {songs.length} songs loaded
      </div>
    </div>
  );
};
