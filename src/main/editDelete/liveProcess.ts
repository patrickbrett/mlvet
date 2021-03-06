import { Transcription, Word } from 'sharedTypes';

/**
 * calculateTime calculates the outputStartTimes of a word based on the
 * current state of all words in a Transcript. It takes into account edits/deletes
 * @param word word in Transcript
 * @param i the current index position in the words array
 * @param words an array of words from Transcript
 * @returns the updated outputStartTime
 */

const calculateTime = (word: Word, i: number, words: Word[]): number => {
  // if the word is deleted, don't do anything
  if (word.deleted) {
    return word.outputStartTime;
  }

  // if the word is the first of the array, the outputStartTime should be 0
  if (i === 0) {
    return 0;
  }
  // if the word is later in the array, calculate outputStartTime using the closest non-deleted word before the current word
  let nextNotDeleted = i - 1;

  // keeping going back until there are no more words or an un-deleted word is found
  while (nextNotDeleted > -1 && words[nextNotDeleted].deleted) {
    nextNotDeleted -= 1;
  }

  // if no un-deleted words are found, the current word becomes the starting word
  if (nextNotDeleted === -1) {
    return 0;

    // otherwise, use the closest un-deleted word
  }
  return words[nextNotDeleted].outputStartTime + words[nextNotDeleted].duration;
};

/**
 * processWord processes a single word in the Transcript object
 * @param word word in Transcript
 * @param i the current index position in the words array
 * @param words an array of words from Transcript
 * @returns the updated word
 */
const processWord = (word: Word, i: number, words: Word[]): Word => {
  word.outputStartTime = calculateTime(word, i, words);
  return word;
};

/**
 * Processes a Transcript so that all words have the correct outputStartTime
 * @param transcript The original Transcript object
 * @returns The Transcript object with updated outputStartTime for all words
 */
const liveProcessTranscript = (transcript: Transcription): Transcription => {
  return {
    confidence: transcript.confidence,
    words: transcript.words.map(processWord),
  };
};

export default liveProcessTranscript;
