import {
  Project,
  ProjectMetadata,
  RecentProject,
  Transcription,
} from '../../sharedTypes';
import { Action, ApplicationPage, Op } from './helpers';
import { DoPayload, UndoPayload } from './opPayloads';

export const PROJECT_CREATED = 'PROJECT_CREATED';
export const PROJECT_OPENED = 'PROJECT_OPENED';
export const PROJECT_NAME_SUBMITTED = 'PROJECT_NAME_SUBMITTED';
export const CURRENT_PROJECT_CLOSED = 'CURRENT_PROJECT_CLOSED';
export const RECENT_PROJECT_ADDED = 'RECENT_PROJECT_ADDED';
export const TRANSCRIPTION_CREATED = 'TRANSCRIPTION_CREATED';
export const PAGE_CHANGED = 'PAGE_CHANGED';
export const RECENT_PROJECTS_LOADED = 'RECENT_PROJECTS_LOADED';
export const PROJECT_SAVED = 'PROJECT_SAVED';
export const PROJECT_SAVED_FIRST_TIME = 'PROJECT_SAVED_FIRST_TIME';

export const START_EXPORT = 'START_EXPORT';
export const EXPORT_PROGRESS_UPDATE = 'EXPORT_PROGRESS_UPDATE';
export const FINISH_EXPORT = 'FINISH_UPDATE';

export const UNDO_STACK_PUSHED = 'UNDO_STACK_PUSHED';
export const UNDO_STACK_POPPED = 'UNDO_STACK_POPPED';
export const OP_REDONE = 'OP_REDONE';

export const projectCreated: (project: Project) => Action<Project> = (
  project
) => ({
  type: PROJECT_CREATED,
  payload: project,
});

export const projectOpened: (
  project: Project,
  filePath: string | null
) => Action<{ project: Project; filePath: string | null }> = (
  project,
  filePath
) => ({
  type: PROJECT_OPENED,
  payload: { project, filePath },
});

export const projectSaved: (
  projectId: string,
  filePath: string
) => Action<{
  projectId: string;
  filePath: string;
}> = (projectId, filePath) => ({
  type: PROJECT_SAVED,
  payload: { projectId, filePath },
});

export const projectSavedFirstTime: (
  project: Project,
  metadata: ProjectMetadata,
  filePath: string
) => Action<{
  project: Project;
  metadata: ProjectMetadata;
  filePath: string;
}> = (project, metadata, filePath) => ({
  type: PROJECT_SAVED_FIRST_TIME,
  payload: { project, metadata, filePath },
});

export const currentProjectClosed: () => Action<null> = () => ({
  type: CURRENT_PROJECT_CLOSED,
  payload: null,
});

export const recentProjectAdded: (
  project: RecentProject
) => Action<RecentProject> = (project) => ({
  type: RECENT_PROJECT_ADDED,
  payload: project,
});

export const transcriptionCreated: (
  transcription: Transcription
) => Action<Transcription> = (transcription) => ({
  type: TRANSCRIPTION_CREATED,
  payload: transcription,
});

export const pageChanged: (page: ApplicationPage) => Action<ApplicationPage> = (
  page
) => ({
  type: PAGE_CHANGED,
  payload: page,
});

export const recentProjectsLoaded: (
  recentProjects: RecentProject[]
) => Action<RecentProject[]> = (recentProjects) => ({
  type: RECENT_PROJECTS_LOADED,
  payload: recentProjects,
});

export const undoStackPushed: <T extends DoPayload, U extends UndoPayload>(
  op: Op<T, U>
) => Action<Op<T, U>> = (undoAction) => ({
  type: UNDO_STACK_PUSHED,
  payload: undoAction,
});

export const undoStackPopped: () => Action<null> = () => ({
  type: UNDO_STACK_POPPED,
  payload: null,
});

export const opRedone: () => Action<null> = () => ({
  type: OP_REDONE,
  payload: null,
});

export const startExport: () => Action<null> = () => ({
  type: START_EXPORT,
  payload: null,
});

export const updateExportProgress: (progress: number) => Action<number> = (
  progress
) => ({
  type: EXPORT_PROGRESS_UPDATE,
  payload: progress,
});

export const finishExport: () => Action<null> = () => ({
  type: FINISH_EXPORT,
  payload: null,
});
