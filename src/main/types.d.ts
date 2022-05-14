import { BrowserWindow } from 'electron';

declare module '@ffprobe-installer/ffprobe';

export interface SnakeCaseWord {
  word: string;
  duration: number;
  start_time: number; // TODO: change this to camel case before it touches TS
}

export interface JSONTranscription {
  confidence: number;
  words: SnakeCaseWord[];
}

// Context to be passed into the IPC handlers when they are initialised from main
export interface IpcContext {
  mainWindow: BrowserWindow;
}
