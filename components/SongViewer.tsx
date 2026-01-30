import React, { useEffect, useState } from 'react';
import { Song, MidiDevice } from '../types';
import { midiService } from '../services/midiService';
import { Play, Square, Wifi, RefreshCcw } from 'lucide-react';

interface SongViewerProps {
  song: Song;
}

export const SongViewer: React.FC<SongViewerProps> = ({ song }) => {
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Attempt to initialize MIDI
    const initMidi = async () => {
      const allowed = await midiService.initialize();
      if (allowed) {
        const outputs = midiService.getOutputs().map(o => ({
          id: o.id,
          name: o.name || 'Unknown Device',
          state: o.state,
          type: 'output' as const
        }));
        setMidiDevices(outputs);
        if (outputs.length > 0) {
          setSelectedOutput(outputs[0].id);
          midiService.setOutput(outputs[0].id);
        }
      }
    };
    initMidi();
  }, []);

  // Send MIDI command when song changes or output device changes
  useEffect(() => {
    if (selectedOutput) {
       midiService.setOutput(selectedOutput);
       midiService.sendSongSelect(song.folder, song.program, song.bpm);
       // Reset playing state on song change? Optional.
       setIsPlaying(false);
    }
  }, [song, selectedOutput]);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOutput(e.target.value);
  };

  const togglePlay = () => {
    if (isPlaying) {
      midiService.stop();
    } else {
      midiService.start();
    }
    setIsPlaying(!isPlaying);
  };

  const resync = () => {
    midiService.sendSongSelect(song.folder, song.program, song.bpm);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* Control Bar */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
        <div>
           <h2 className="text-2xl font-bold text-white leading-tight">{song.title}</h2>
           {song.artist && <p className="text-gray-400">{song.artist} <span className="mx-2 text-gray-600">•</span> <span className="text-blue-400">{song.bpm} BPM</span></p>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center space-x-2 bg-gray-900 p-1.5 rounded-lg border border-gray-700">
              <Wifi size={16} className={midiDevices.length > 0 ? "text-green-500" : "text-red-500"} />
              <select 
                value={selectedOutput} 
                onChange={handleDeviceChange}
                className="bg-transparent text-sm text-gray-300 focus:outline-none border-none max-w-[150px]"
                disabled={midiDevices.length === 0}
              >
                {midiDevices.length === 0 && <option>No MIDI Devices</option>}
                {midiDevices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
           </div>

           <button 
             onClick={resync}
             className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
             title="Resend MIDI Data"
           >
             <RefreshCcw size={20} />
           </button>

           <button 
             onClick={togglePlay}
             className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold transition-all shadow-lg active:scale-95 ${
               isPlaying 
               ? 'bg-red-600 hover:bg-red-700 text-white' 
               : 'bg-green-600 hover:bg-green-700 text-white'
             }`}
           >
             {isPlaying ? (
               <><Square size={20} fill="currentColor" /> <span>STOP</span></>
             ) : (
               <><Play size={20} fill="currentColor" /> <span>START</span></>
             )}
           </button>
        </div>
      </div>

      {/* Lyric / Word Doc Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-900 relative">
        <div className="max-w-4xl mx-auto bg-white text-gray-900 p-8 md:p-12 shadow-2xl rounded-sm min-h-[800px]">
          {/* Simulated Word Doc Styles */}
          <div 
            className="prose prose-lg max-w-none font-serif leading-relaxed"
            dangerouslySetInnerHTML={{ __html: song.content }}
          />
        </div>
      </div>
    </div>
  );
};
