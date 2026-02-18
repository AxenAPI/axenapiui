import { createEvent, createStore } from 'effector';

export type ParseErrorType = 'error' | 'info';

export interface ParseErrorData {
  message: string;
  type: ParseErrorType;
}

const markdownBlurred = createEvent();
const errorReset = createEvent();
const parseErrorOccurred = createEvent<ParseErrorData | null>();

const $parseError = createStore<ParseErrorData | null>(null)
  .on(parseErrorOccurred, (_, error) => error)
  .reset(errorReset);

export const editorModel = {
  stores: {
    $parseError,
  },
  events: {
    markdownBlurred,
    errorReset,
    parseErrorOccurred,
  },
};
