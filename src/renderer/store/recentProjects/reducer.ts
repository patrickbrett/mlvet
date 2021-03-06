import { Reducer } from 'redux';
import makeRecentProject from '../../../sharedUtils';
import { Project, ProjectMetadata, RecentProject } from '../../../sharedTypes';
import {
  PROJECT_DELETED,
  RECENT_PROJECTS_LOADED,
  RECENT_PROJECT_ADDED,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';
import { PROJECT_OPENED, PROJECT_SAVED } from '../currentProject/actions';

const recentProjectsReducer: Reducer<
  ApplicationStore['recentProjects'],
  Action<any>
> = (recentProjects = initialStore.recentProjects, action) => {
  if (action.type === RECENT_PROJECT_ADDED) {
    return [action.payload as RecentProject, ...recentProjects];
  }

  if (action.type === RECENT_PROJECTS_LOADED) {
    return action.payload as RecentProject[];
  }

  if (action.type === PROJECT_OPENED) {
    const { project: openedProject, filePath } = action.payload as {
      project: Project;
      filePath: string;
    };

    return recentProjects.map((project) =>
      project.id === openedProject.id
        ? { ...project, projectFilePath: filePath }
        : project
    );
  }

  if (action.type === PROJECT_SAVED) {
    const { project, metadata, filePath } = action.payload as {
      project: Project;
      metadata: ProjectMetadata;
      filePath: string;
    };

    const recentProject: RecentProject = makeRecentProject(
      project,
      metadata,
      filePath
    );

    // Append project to recent projects immutably
    return recentProjects.concat([recentProject]);
  }

  if (action.type === PROJECT_DELETED) {
    const { id } = action.payload as { id: string };

    return recentProjects.filter((project) => project.id !== id);
  }

  return recentProjects;
};

export default recentProjectsReducer;
