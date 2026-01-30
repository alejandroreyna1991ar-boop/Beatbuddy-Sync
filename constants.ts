import { Song } from './types';

export const INITIAL_SONGS: Song[] = [
  {
    id: '1',
    title: 'Sweet Home Alabama',
    artist: 'Lynyrd Skynyrd',
    folder: 0,
    program: 1,
    bpm: 98,
    createdAt: Date.now(),
    content: `
      <h2>Sweet Home Alabama</h2>
      <p><strong>[Intro]</strong></p>
      <p>D C G (x4)</p>
      <br/>
      <p><strong>[Verse 1]</strong></p>
      <p>Big wheels keep on turning</p>
      <p>Carry me home to see my kin</p>
      <p>Singing songs about the Southland</p>
      <p>I miss Alabamy once again</p>
      <p>And I think its a sin, yes</p>
    `
  },
  {
    id: '2',
    title: 'Hotel California',
    artist: 'Eagles',
    folder: 0,
    program: 2,
    bpm: 72,
    createdAt: Date.now(),
    content: `
      <h2>Hotel California</h2>
      <p><strong>[Intro]</strong></p>
      <p>Bm F# A E G D Em F#</p>
      <br/>
      <p><strong>[Verse 1]</strong></p>
      <p>On a dark desert highway, cool wind in my hair</p>
      <p>Warm smell of colitas, rising up through the air</p>
    `
  },
  {
    id: '3',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    folder: 1,
    program: 5,
    bpm: 115,
    createdAt: Date.now(),
    content: `
       <h2>Uptown Funk</h2>
       <p><strong>[Intro]</strong></p>
       <p>Doh, doh doh doh, doh doh doh, doh doh</p>
       <br/>
       <p><strong>[Verse 1]</strong></p>
       <p>This hit, that ice cold</p>
       <p>Michelle Pfeiffer, that white gold</p>
    `
  }
];

export const MOCK_PI_IP = "192.168.1.42";
