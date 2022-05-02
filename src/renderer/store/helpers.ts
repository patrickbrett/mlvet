import { Project } from 'sharedTypes';

const transcription = require('../../../assets/SampleTranscript.json');

export enum ApplicationPage {
  HOME = 'HOME',
  PROJECT = 'PROJECT',
}

export type Action<T> = {
  type: string;
  payload: T;
};

export interface ApplicationStore {
  currentProject: Project | null;
  recentProjects: Project[];
  currentPage: ApplicationPage;
}

const baseMockProject: Project = {
  schemaVersion: 1,
  mediaType: 'video',
  filePath: 'fakepath',
  fileExtension: 'mp4',
  transcription: transcription.transcripts[0],
  name: 'name',
  savePath: '',
};

export const initialStore: ApplicationStore = {
  currentProject: baseMockProject,
  recentProjects: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'].map(
    (name) => ({ ...baseMockProject, name: `${name} Project` })
  ),
  currentPage: ApplicationPage.PROJECT, // Changed from home page to increase load speed
};
