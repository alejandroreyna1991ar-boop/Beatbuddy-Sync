import React, { useState, useRef } from 'react';
import { Song } from '../types';
import { saveSong, deleteSong } from '../services/storageService';
import { Save, Trash2, FileText, Sparkles, UploadCloud } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { DashboardStats } from './DashboardStats'; // Re-use stats if needed, or import recharts direct.

// We will use a simplified chart here for the admin view
import { BpmChart } from './BpmChart';

interface AdminPanelProps {
  onSongsUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSongsUpdated }) => {
  const [formData, setFormData] = useState<Partial<Song>>({
    title: '',
    artist: '',
    folder: 0,
    program: 0,
    bpm: 120,
    content: ''
  });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'stats'>('edit');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'folder' || name === 'program' || name === 'bpm' ? Number(value) : value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate reading a word doc by reading text content (for prototype)
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // In a real app, this would use a backend parser. 
      // Here we just dump text into content, and maybe auto-fill title from filename
      setFormData(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
        content: `<h3>${file.name}</h3><pre>${text.slice(0, 500)}...</pre><p>(Content truncated for demo)</p>`
      }));
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (!formData.title) return alert("Title is required");
    
    const newSong: Song = {
      id: formData.id || Date.now().toString(),
      title: formData.title || 'Untitled',
      artist: formData.artist,
      folder: formData.folder || 0,
      program: formData.program || 0,
      bpm: formData.bpm || 120,
      content: formData.content || '<p>No content provided.</p>',
      createdAt: formData.createdAt || Date.now()
    };
    
    saveSong(newSong);
    onSongsUpdated();
    alert('Song Saved Successfully!');
    setFormData({ title: '', artist: '', folder: 0, program: 0, bpm: 120, content: '' });
  };

  // Gemini Integration: Smart Extract
  const handleSmartExtract = async () => {
    if (!process.env.API_KEY) {
      alert("API Key not found in environment. Cannot use AI features.");
      return;
    }
    
    if (!formData.content && !formData.title) {
      alert("Please enter a Title or some Content (lyrics) for the AI to analyze.");
      return;
    }

    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Analyze the following song info and lyrics. 
        Return a JSON object with: 
        - "bpm" (estimated integer), 
        - "artist" (best guess if missing), 
        - "folder" (suggest a midi bank index 0-127 based on genre: 0=Rock, 1=Pop, 2=Country, 3=Funk),
        - "summary" (short description).
        
        Title: ${formData.title}
        Content Snippet: ${formData.content?.substring(0, 200)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      
      const jsonText = response.text;
      if (jsonText) {
        const result = JSON.parse(jsonText);
        setFormData(prev => ({
          ...prev,
          bpm: result.bpm || prev.bpm,
          artist: result.artist || prev.artist,
          folder: result.folder !== undefined ? result.folder : prev.folder
        }));
      }
    } catch (e) {
      console.error(e);
      alert("AI Analysis failed. See console.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-900 text-gray-100 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-blue-400">Administration & Upload</h2>
        
        <div className="flex space-x-4 mb-6 border-b border-gray-700">
           <button 
             onClick={() => setActiveTab('edit')} 
             className={`pb-2 px-4 ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}
           >
             Song Editor
           </button>
           <button 
             onClick={() => setActiveTab('stats')} 
             className={`pb-2 px-4 ${activeTab === 'stats' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}
           >
             Analytics
           </button>
        </div>

        {activeTab === 'stats' && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <h3 className="text-xl font-bold mb-4">Setlist Analytics</h3>
             <BpmChart />
          </div>
        )}

        {activeTab === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Upload Word File (Simulated)</label>
                  <div className="flex items-center space-x-2">
                    <label className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 border-2 border-dashed border-gray-500 rounded-lg p-4 text-center transition-colors">
                      <UploadCloud className="mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-300">Click to select .doc/.txt file</span>
                      <input type="file" onChange={handleFileUpload} className="hidden" accept=".txt,.doc,.docx" />
                    </label>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Song Title</label>
                    <input 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500" 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Artist</label>
                    <input 
                      name="artist" 
                      value={formData.artist} 
                      onChange={handleInputChange} 
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500" 
                    />
                 </div>
               </div>

               <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Folder (MSB 0, LSB)</label>
                    <input 
                      type="number" 
                      name="folder" 
                      value={formData.folder} 
                      onChange={handleInputChange} 
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500" 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Song (PC)</label>
                    <input 
                      type="number" 
                      name="program" 
                      value={formData.program} 
                      onChange={handleInputChange} 
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500" 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">BPM</label>
                    <input 
                      type="number" 
                      name="bpm" 
                      value={formData.bpm} 
                      onChange={handleInputChange} 
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-blue-500" 
                    />
                 </div>
               </div>

               <button 
                  onClick={handleSmartExtract}
                  disabled={isAiLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-700 hover:bg-purple-600 text-white p-2 rounded transition-colors"
               >
                 {isAiLoading ? <span className="animate-pulse">Thinking...</span> : <><Sparkles size={18} /> <span>AI Auto-Detect Parameters</span></>}
               </button>
            </div>
          </div>

          {/* Content Editor Section */}
          <div className="flex flex-col h-full space-y-4">
             <div className="flex-1 bg-white text-gray-900 rounded-lg overflow-hidden flex flex-col">
               <div className="bg-gray-100 p-2 border-b border-gray-300 flex items-center space-x-2 text-sm text-gray-600">
                  <FileText size={16} />
                  <span>Document Editor</span>
               </div>
               <textarea 
                 name="content"
                 value={formData.content}
                 onChange={handleInputChange}
                 className="flex-1 p-4 focus:outline-none resize-none font-serif text-lg"
                 placeholder="Paste lyrics or content here..."
               />
             </div>

             <div className="flex justify-end space-x-3">
               <button 
                 onClick={handleSave} 
                 className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-transform active:scale-95"
               >
                 <Save size={20} />
                 <span>Save Song</span>
               </button>
             </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
