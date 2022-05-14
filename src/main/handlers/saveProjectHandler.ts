import { IpcContext } from '../types';
import { Project } from '../../sharedTypes';
import { getSaveFilePath, saveProjectToFile } from './helpers/saveUtils';

type HandleSaveProject = (
  ipcContext: IpcContext,
  project: Project
) => Promise<string>;

const handleSaveProject: HandleSaveProject = async (ipcContext, project) => {
  const { mainWindow } = ipcContext;

  const filePath =
    project.projectFilePath === null
      ? await getSaveFilePath(mainWindow, project.name)
      : project.projectFilePath;

  await saveProjectToFile(filePath, { ...project, projectFilePath: filePath });

  return filePath;
};

export default handleSaveProject;
