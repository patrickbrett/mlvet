import path from 'path';

import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

type ExtractThumbnail = (absolutePathToVideoFile: string) => Promise<string>;

const extractThumbnail: ExtractThumbnail = (absolutePathToMediaFile) => {
  const pathToSaveMedia = path.join(process.cwd(), 'assets', 'thumbnails');

  console.log('Started thumbnail extraction');

  const filename = 'thumbnail.png';

  // By Default the image is picked from the middle of the video.
  const command = ffmpeg(absolutePathToMediaFile).thumbnails({
    count: 1,
    filename,
    folder: pathToSaveMedia,
  });

  return new Promise((resolve, reject) => {
    command.on('end', (stdout: string, stderr: string) => {
      if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
      if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

      resolve(path.join(pathToSaveMedia, filename));
    });
    command.on('error', (stdout: string, stderr: string) => {
      if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
      if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

      reject(stderr);
    });
  });
};

export default extractThumbnail;
