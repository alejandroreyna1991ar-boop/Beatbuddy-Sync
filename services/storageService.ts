import { Song } from '../types';
import { INITIAL_SONGS } from '../constants';

const STORAGE_KEY = 'beatbuddy_songs';

export const getSongs = (): Song[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Seed initial data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SONGS));
    return INITIAL_SONGS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse songs", e);
    return [];
  }
};

export const saveSong = (song: Song): void => {
  const songs = getSongs();
  const existingIndex = songs.findIndex(s => s.id === song.id);
  
  if (existingIndex >= 0) {
    songs[existingIndex] = song;
  } else {
    songs.push(song);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
};

export const deleteSong = (id: string): void => {
  const songs = getSongs();
  const filtered = songs.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
