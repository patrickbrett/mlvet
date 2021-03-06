import {
  useRef,
  useImperativeHandle,
  Ref,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { Cut } from 'sharedTypes';
import convertTranscriptToCuts from 'main/processing/transcriptToCuts';
import { useSelector } from 'react-redux';
import { ApplicationStore } from 'renderer/store/sharedHelpers';
import { clamp } from 'main/timeUtils';
import { Buffer } from 'buffer';
import VideoPreview, { VideoPreviewRef } from '.';

export interface Clock {
  hasRunBefore: boolean;
  time: number;
  isRunning: boolean;
  intervalRef: null | any;
  prevIntervalEndTime: number;
  intervalStartTime: number;
}

export interface VideoPreviewControllerRef {
  play: () => void;
  pause: () => void;
  setPlaybackTime: (time: number) => void;
  seekForward: () => void;
  seekBack: () => void;
}

interface Props {
  setTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

type GetCutFromSystemTime = (systemTime: number, cuts: Cut[]) => Cut;
const getCutFromSystemTime: GetCutFromSystemTime = (systemTime, cuts) => {
  const foundCut = cuts.find(
    (cut) =>
      cut.outputStartTime <= systemTime &&
      cut.outputStartTime + cut.duration >= systemTime
  );
  return foundCut ?? cuts[cuts.length - 1];
};

const getPerformanceTime = () => performance.now() * 0.001;

const VideoPreviewControllerBase = (
  { setTime, setIsPlaying }: Props,
  ref: Ref<VideoPreviewControllerRef>
) => {
  const skip = useRef(10);
  const framesPerSecond = 30;
  const videoPreviewRef = useRef<VideoPreviewRef>(null);

  const currentProject = useSelector(
    (store: ApplicationStore) => store?.currentProject
  );

  const cuts = useRef<Cut[]>([]);
  const outputVideoLength = useRef<number>(0);
  const [encodedVideoSrc, setEncodedVideoSrc] = useState<string>('');

  const clampSystemTime = (time: number) =>
    clamp(time, 0, outputVideoLength.current);

  const clockRef = useRef<Clock>({
    hasRunBefore: false,
    isRunning: false,
    intervalRef: null,
    prevIntervalEndTime: getPerformanceTime(),
    intervalStartTime: getPerformanceTime(),
    time: 0,
  });

  const currentCutRef = useRef<Cut>({
    index: 0,
    outputStartTime: 0,
    startTime: 0,
    duration: 1,
  });

  // Stops timer
  const stopTimer = () => {
    clearInterval(clockRef.current.intervalRef);
    clockRef.current.intervalRef = null;
    clockRef.current.isRunning = false;
    clockRef.current.prevIntervalEndTime = getPerformanceTime();
  };

  // Stops video, timer & UI
  const pause = () => {
    videoPreviewRef?.current?.pause();
    setIsPlaying(false);
    stopTimer();
  };

  // Called on every frame (by timer setInterval)
  const onFrame = () => {
    if (clockRef.current.isRunning) {
      clockRef.current.time =
        getPerformanceTime() - clockRef.current.intervalStartTime;

      setTime(clockRef.current.time);
      // TODO: Update UI to reflect changing time

      // Has cut finished
      if (
        clockRef.current.time >=
        currentCutRef.current?.outputStartTime + currentCutRef.current?.duration
      ) {
        // If last put - pause
        // If not - update video
        if (currentCutRef.current.index + 1 >= cuts.current.length) {
          pause();
        } else {
          currentCutRef.current = cuts.current[currentCutRef.current.index + 1];
          videoPreviewRef?.current?.setCurrentTime(
            currentCutRef.current.startTime
          );
        }
      }
    }
  };

  // Start timer (setInterval)
  const startTimer = () => {
    if (!clockRef.current.hasRunBefore) {
      clockRef.current.hasRunBefore = true;
      clockRef.current.prevIntervalEndTime = getPerformanceTime();
      clockRef.current.intervalStartTime = getPerformanceTime();
    }
    clockRef.current.intervalRef = setInterval(
      onFrame,
      Math.floor(1000 / framesPerSecond)
    );
    clockRef.current.intervalStartTime +=
      getPerformanceTime() - clockRef.current.prevIntervalEndTime;
    clockRef.current.isRunning = true;
  };

  // Starts video, timer & UI
  const play = () => {
    if (!clockRef.current.isRunning) {
      if (clockRef.current.time < outputVideoLength.current) {
        videoPreviewRef?.current?.play();
        startTimer();
        setIsPlaying(true);
      }
    }
  };

  // Sets the video, timer & UI playback time
  const setPlaybackTime = (time: number) => {
    const { isRunning } = clockRef.current;
    if (isRunning) stopTimer();

    const newSystemTime = clampSystemTime(time);
    currentCutRef.current = getCutFromSystemTime(
      newSystemTime,
      cuts.current ?? []
    );

    clockRef.current.intervalStartTime -= newSystemTime - clockRef.current.time;

    clockRef.current.time = newSystemTime;
    setTime(clockRef.current.time);

    if (newSystemTime < outputVideoLength.current) {
      const inCutStartTime =
        currentCutRef.current.startTime +
        (clockRef.current.time - currentCutRef.current.outputStartTime);
      videoPreviewRef?.current?.setCurrentTime(inCutStartTime);

      if (isRunning) {
        startTimer();
      }
    } else {
      pause();
    }
  };

  // Skips forward 'n' seconds
  const seekForward = () => {
    setPlaybackTime(clockRef.current.time + skip.current);
  };

  // Skips backward 'n' seconds
  const seekBack = () => {
    setPlaybackTime(clockRef.current.time - skip.current);
  };

  useImperativeHandle(ref, () => ({
    play,
    pause,
    setPlaybackTime,
    seekForward,
    seekBack,
  }));

  useEffect(() => {
    if (currentProject?.transcription != null) {
      cuts.current = convertTranscriptToCuts(currentProject.transcription);
      const lastCut = cuts.current[cuts.current.length - 1];
      outputVideoLength.current = lastCut.outputStartTime + lastCut.duration;
      setPlaybackTime(clockRef.current.time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject?.transcription]);

  useEffect(() => {
    setEncodedVideoSrc(
      Buffer.from(currentProject?.mediaFilePath ?? '', 'utf-8').toString(
        'base64'
      )
    );
  }, [currentProject?.mediaFilePath]);

  return (
    <VideoPreview
      src={
        encodedVideoSrc ? `http://localhost:5556/video/${encodedVideoSrc}` : ''
      }
      ref={videoPreviewRef}
    />
  );
};

const VideoPreviewController = forwardRef(VideoPreviewControllerBase);

export default VideoPreviewController;
