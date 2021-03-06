import { ipcMain } from 'electron';

import { IpcContext } from './types';

// Everything between the START GENERATED CODE and END GENERATED CODE comments will be replaced with the injected handler invocations when 'yarn gen' is run

// START GENERATED CODE PART 1
import extractAudio from './handlers/audioExtract';
import closeWindow from './handlers/closeWindow';
import deleteProject from './handlers/deleteProject';
import exportProject from './handlers/exportProjectHandler';
import getFileNameWithExtension from './handlers/getFileNameWithExtension';
import openProject from './handlers/openProjectHandler';
import handleOsQuery from './handlers/osQuery';
import retrieveProjectMetadata from './handlers/projectMetadataHandler';
import readRecentProjects from './handlers/readRecentProjects';
import requestMediaDialog from './handlers/requestMediaDialog';
import returnToHome from './handlers/returnToHomeHandler';
import saveAsProject from './handlers/saveAsProjectHandler';
import saveProject from './handlers/saveProjectHandler';
import setFileRepresentation from './handlers/setFileRepresentation';
import setHomeEnabled from './handlers/setHomeEnabled';
import setSaveEnabled from './handlers/setSaveEnabled';
import setUndoRedoEnabled from './handlers/setUndoRedoEnabled';
import showConfirmation from './handlers/showConfirmation';
import extractThumbnail from './handlers/thumbnailExtract';
import requestTranscription from './handlers/transcriptionHandler';
import writeRecentProjects from './handlers/writeRecentProjects';
// END GENERATED CODE PART 1

const initialiseIpcHandlers: (ipcContext: IpcContext) => void = (
  ipcContext
) => {
  // START GENERATED CODE PART 2
  ipcMain.handle('extract-audio', async (_event, project) =>
    extractAudio(project)
  );

  ipcMain.handle('close-window', async () => closeWindow(ipcContext));

  ipcMain.handle('delete-project', async (_event, project) =>
    deleteProject(project)
  );

  ipcMain.handle('export-project', async (_event, project) =>
    exportProject(ipcContext, project)
  );

  ipcMain.handle('get-file-name-with-extension', async (_event, filePath) =>
    getFileNameWithExtension(filePath)
  );

  ipcMain.handle('open-project', async (_event, filePath) =>
    openProject(ipcContext, filePath)
  );

  ipcMain.handle('handle-os-query', async () => handleOsQuery());

  ipcMain.handle('retrieve-project-metadata', async (_event, project) =>
    retrieveProjectMetadata(project)
  );

  ipcMain.handle('read-recent-projects', async () => readRecentProjects());

  ipcMain.handle('request-media-dialog', async () =>
    requestMediaDialog(ipcContext)
  );

  ipcMain.handle('return-to-home', async (_event, project) =>
    returnToHome(ipcContext, project)
  );

  ipcMain.handle('save-as-project', async (_event, project) =>
    saveAsProject(ipcContext, project)
  );

  ipcMain.handle('save-project', async (_event, project) =>
    saveProject(ipcContext, project)
  );

  ipcMain.handle(
    'set-file-representation',
    async (_event, representedFilePath, isEdited) =>
      setFileRepresentation(ipcContext, representedFilePath, isEdited)
  );

  ipcMain.handle('set-home-enabled', async (_event, homeEnabled) =>
    setHomeEnabled(ipcContext, homeEnabled)
  );

  ipcMain.handle(
    'set-save-enabled',
    async (_event, saveEnabled, saveAsEnabled) =>
      setSaveEnabled(ipcContext, saveEnabled, saveAsEnabled)
  );

  ipcMain.handle(
    'set-undo-redo-enabled',
    async (_event, undoEnabled, redoEnabled) =>
      setUndoRedoEnabled(ipcContext, undoEnabled, redoEnabled)
  );

  ipcMain.handle('show-confirmation', async (_event, message, detail) =>
    showConfirmation(ipcContext, message, detail)
  );

  ipcMain.handle('extract-thumbnail', async (_event, absolutePathToMediaFile) =>
    extractThumbnail(absolutePathToMediaFile)
  );

  ipcMain.handle('request-transcription', async (_event, project) =>
    requestTranscription(project)
  );

  ipcMain.handle('write-recent-projects', async (_event, recentProjects) =>
    writeRecentProjects(recentProjects)
  );
  // END GENERATED CODE PART 2
};

export default initialiseIpcHandlers;
