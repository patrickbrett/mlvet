import { MapCallback, roundToMs } from '../util';
import { Transcription, Word } from '../../sharedTypes';
import { JSONTranscription, SnakeCaseWord } from '../types';
import punctuate from './punctuate';

type PartialWord = Pick<Word, 'word' | 'startTime' | 'duration'>;

/**
 * Replace the start_time attribute with startTime (can be generalised further but shouldn't
 * need this once python outputs camelcase anyway)
 * @param word snake cased partial word
 * @returns camel cased partial word
 *
 */
const camelCase: MapCallback<SnakeCaseWord, PartialWord> = (word) => ({
  word: word.word,
  duration: word.duration,
  startTime: word.start_time,
});

/**
 * Injects extra attributes into a PartialWord to make it a full Word -
 * @param word the word to fill attributes for
 * @param i index of the word in the transcript
 * @returns full Word object
 */
const injectAttributes: (fileName: string) => MapCallback<PartialWord, Word> =
  (fileName: string) => (word, i) => {
    return {
      ...word,
      outputStartTime: word.startTime,
      key: i.toString(),
      deleted: false,
      fileName,
    };
  };

const constructWord: (
  word: string,
  startTime: number,
  duration: number,
  outputStartTime: number,
  key: string,
  fileName: string
) => Word = (word, startTime, duration, outputStartTime, key, fileName) => ({
  word,
  startTime: roundToMs(startTime),
  duration: roundToMs(duration),
  outputStartTime: roundToMs(outputStartTime),
  deleted: false,
  key,
  fileName,
});

/**
 * Adds spaces between words which represent the silence between each word
 * @param result The output being constructed
 * @param word The current element of words
 * @param index The index of word in words
 * @param words The list of words being reduced
 * @returns The updated transcript with a silence after word
 */
const addSpaces: (totalDuration: number) => MapCallback<Word, Word[]> =
  (totalDuration: number) => (word, index, words) => {
    const spaceChar = ' ';
    const wordAndSilence: Word[] = [];
    const { fileName } = word;

    // is the first word
    if (index === 0) {
      wordAndSilence.push(
        constructWord(
          spaceChar,
          0,
          words[index].startTime,
          0,
          index.toString(),
          fileName
        )
      );
    }

    const isLastWord = index === words.length - 1;
    const endTime = isLastWord ? totalDuration : words[index + 1].startTime;
    const silenceDuration = endTime - word.startTime - word.duration;

    // index*2 is used because we are mapping 1 Word to 2 Words and want the key to represent the index of the each Word in the processed Transcript.
    // +1 is to account for the first element in the words array being a silence to pad the beginning of the transcript.
    word.key = (index * 2 + 1).toString();
    wordAndSilence.push(word);
    wordAndSilence.push(
      constructWord(
        spaceChar,
        word.startTime + word.duration,
        silenceDuration,
        word.startTime + word.duration,
        // +2 is to account for the first element in the words array being a silence to pad the beginning of the transcript AND the Word preceeding this silence
        (index * 2 + 2).toString(),
        fileName
      )
    );

    return wordAndSilence;
  };

const calculateAverageSilenceDuration = (
  jsonTranscription: JSONTranscription,
  totalDuration: number
): number => {
  let silenceSum = 0;
  for (let i = 0; i < jsonTranscription.words.length - 1; i += 1) {
    const endTime = jsonTranscription.words[i + 1].start_time;
    const silenceDuration =
      endTime -
      jsonTranscription.words[i].start_time -
      jsonTranscription.words[i].duration;
    silenceSum += silenceDuration;
  }
  return jsonTranscription.words.length !== 0
    ? silenceSum / jsonTranscription.words.length
    : totalDuration;
};

/**
 * Pre processes a JSON transcript from python for use in the front end
 * @param jsonTranscript the JSON transcript input (technically a JS object but with some fields missing)
 * @param duration duration of the input media file
 * @returns formatted Transcript object
 */
const preProcessTranscript = (
  jsonTranscript: JSONTranscription,
  duration: number,
  fileName: string
): Transcription => {
  const averageSilenceDuration: number = calculateAverageSilenceDuration(
    jsonTranscript,
    duration
  );
  return {
    confidence: jsonTranscript.confidence,
    words: jsonTranscript.words
      .map(camelCase)
      .map(punctuate(duration, averageSilenceDuration))
      .map(injectAttributes(fileName))
      .map(addSpaces(duration))
      .flat(),
  };
};

export default preProcessTranscript;
