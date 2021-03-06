export interface Project {
  id: string; // UUID
  schemaVersion: number;
  name: string;
  projectFilePath: string | null;
  exportFilePath: string | null;
  audioExtractFilePath: string | null;
  mediaFilePath: string | null;
  transcription: Transcription | null;
  mediaType: 'audio' | 'video';
  mediaFileExtension: AudioFileExtension | VideoFileExtension;
  thumbnailFilePath: string | null;
  isEdited: boolean;
}

export interface ProjectMetadata {
  dateModified: Date | null;
  mediaSize: number | null; // bytes
}

export type RecentProject = Pick<
  Project,
  'id' | 'name' | 'projectFilePath' | 'mediaFilePath' | 'thumbnailFilePath'
> &
  ProjectMetadata;

export type AudioFileExtension = 'mp3';
export type VideoFileExtension = 'mp4';

export interface Transcription {
  confidence: number;
  words: Word[];
}

export interface Word {
  word: string;
  startTime: number;
  duration: number;
  outputStartTime: number;
  deleted: boolean;
  key: string;
  fileName: string;
}

export interface Cut {
  startTime: number;
  duration: number;
  outputStartTime: number;
  index: number;
}

export type MediaFileExtension = AudioFileExtension | VideoFileExtension;

export enum OperatingSystems {
  MACOS = 'darwin',
  WINDOWS = 'win32',
  LINUX = 'linux',
}

export enum AsyncState {
  READY = 'READY',
  LOADING = 'LOADING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}
