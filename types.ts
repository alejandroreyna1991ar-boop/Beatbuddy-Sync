export interface Song {
  id: string;
  title: string;
  artist?: string;
  folder: number; // MIDI Bank Select LSB (0-127)
  program: number; // MIDI Program Change (0-127)
  bpm: number;
  content: string; // The "Word" doc content (simplified as text/html for this demo)
  createdAt: number;
}

export interface MidiDevice {
  id: string;
  name: string;
  manufacturer?: string;
  state: string;
  type: 'input' | 'output';
}

export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}