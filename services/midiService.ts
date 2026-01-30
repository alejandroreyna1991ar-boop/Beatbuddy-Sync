// Define minimal Web MIDI types to avoid namespace errors and ensure compilation
export interface MIDIOutput {
  id: string;
  manufacturer?: string;
  name?: string;
  type: "input" | "output";
  version?: string;
  state: "connected" | "disconnected";
  connection: "open" | "closed" | "pending";
  send(data: number[] | Uint8Array, timestamp?: number): void;
  clear?(): void;
}

export interface MIDIAccess {
  inputs: Map<string, any>;
  outputs: Map<string, MIDIOutput>;
  sysexEnabled: boolean;
  onstatechange: ((event: any) => void) | null;
}

export class MidiService {
  private access: MIDIAccess | null = null;
  private output: MIDIOutput | null = null;

  async initialize(): Promise<boolean> {
    const nav = navigator as any;
    if (!nav.requestMIDIAccess) {
      console.warn("Web MIDI API not supported in this browser.");
      return false;
    }

    try {
      this.access = await nav.requestMIDIAccess();
      return true;
    } catch (err) {
      console.error("MIDI Access Failed", err);
      return false;
    }
  }

  getOutputs(): MIDIOutput[] {
    if (!this.access) return [];
    const outputs: MIDIOutput[] = [];
    this.access.outputs.forEach((output) => outputs.push(output));
    return outputs;
  }

  setOutput(id: string) {
    if (!this.access) return;
    this.output = this.access.outputs.get(id) || null;
  }

  /**
   * Sends Bank Select and Program Change to BeatBuddy.
   * BeatBuddy typically uses:
   * CC 0 (Bank Select MSB) = 0
   * CC 32 (Bank Select LSB) = Folder Number (0-based)
   * Program Change = Song Number (0-based)
   */
  sendSongSelect(folder: number, song: number, bpm: number) {
    if (!this.output) {
      console.warn("No MIDI Output selected. Simulating command: Folder", folder, "Song", song);
      return;
    }

    const channel = 0; // Usually channel 1 (0 in code)
    
    // MIDI Constants
    const CC = 0xB0 + channel;
    const PC = 0xC0 + channel;

    // 1. Bank Select MSB (0)
    this.output.send([CC, 0, 0]);
    
    // 2. Bank Select LSB (Folder)
    // Ensure folder is within 0-127
    const safeFolder = Math.min(Math.max(folder, 0), 127);
    this.output.send([CC, 32, safeFolder]);

    // 3. Program Change (Song)
    const safeSong = Math.min(Math.max(song, 0), 127);
    this.output.send([PC, safeSong]);

    // 4. (Optional) Send BPM via SysEx or MIDI Clock? 
    // BeatBuddy might not accept BPM via CC easily without specific firmware support,
    // but some users use specific CCs. 
    // Usually, MIDI clock is sent to sync tempo.
    // For this implementation, we will assume external sync is handled or manually set,
    // as sending a raw BPM value via standard MIDI is complex (requires Clock ticks).
    // However, some implementations use CC to specific controllers if mapped.
    
    console.log(`MIDI Sent: Folder ${safeFolder}, Song ${safeSong}, BPM ${bpm}`);
  }

  start() {
    if (this.output) {
      // MIDI Start (Realtime)
      this.output.send([0xFA]);
    }
  }

  stop() {
    if (this.output) {
      // MIDI Stop (Realtime)
      this.output.send([0xFC]);
    }
  }
}

export const midiService = new MidiService();