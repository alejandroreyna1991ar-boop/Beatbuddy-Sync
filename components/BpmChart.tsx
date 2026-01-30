import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getSongs } from '../services/storageService';

export const BpmChart: React.FC = () => {
  const songs = getSongs();

  const data = useMemo(() => {
    // Bucket songs into BPM ranges
    const buckets = {
      'Slow (<80)': 0,
      'Mid (80-110)': 0,
      'Fast (110-140)': 0,
      'Rapid (>140)': 0
    };

    songs.forEach(s => {
      if (s.bpm < 80) buckets['Slow (<80)']++;
      else if (s.bpm < 110) buckets['Mid (80-110)']++;
      else if (s.bpm < 140) buckets['Fast (110-140)']++;
      else buckets['Rapid (>140)']++;
    });

    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [songs]);

  const COLORS = ['#60A5FA', '#34D399', '#FBBF24', '#F87171'];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 12}} />
          <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 12}} allowDecimals={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
            cursor={{fill: 'rgba(255,255,255,0.05)'}}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
