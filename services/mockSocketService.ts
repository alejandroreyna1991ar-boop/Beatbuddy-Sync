type Listener = (songId: string) => void;

class MockSocket {
  private listeners: Set<Listener> = new Set();
  
  // Simulate receiving a message from the server
  subscribe(callback: Listener) {
    this.listeners.add(callback);
  }

  unsubscribe(callback: Listener) {
    this.listeners.delete(callback);
  }

  // Simulate sending a message to the server (which then broadcasts to others)
  broadcastSongChange(songId: string) {
    // In a real app, this sends to WS server.
    // Here, we simulate latency and "echo" it back or assume other tabs receive it via storage events if we wanted.
    // For this demo, we just log it as "Sent to Websocket".
    console.log(`[WebSocket Mock] Broadcasting song change: ${songId}`);
    
    // Optionally trigger listeners to simulate "Self-update" or test logic
    // setTimeout(() => {
    //   this.listeners.forEach(fn => fn(songId));
    // }, 100);
  }
}

export const MockSocketService = new MockSocket();
