import { sample } from 'effector';
import { debounce } from 'patronum';

import { repositoryModel } from '@app/models/repository';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

// FIXME: cross-import feature → feature (technical debt)
import { editButtonModel } from '@features/documentation/EditButton';

import { SAVE_DELAY_MS } from '@/constants/common';

import { documentStateModel } from './documentState.model';
import { editorModel } from './editor.model';

// Set loading state when file reading starts
sample({
  clock: repositoryModel.effects.readFileContentFx,
  fn: () => true,
  target: documentStateModel.events.loadingChanged,
});

// When the file content is read, update markdown
sample({
  clock: repositoryModel.effects.readFileContentFx.doneData,
  fn: response => response.content ?? '',
  target: documentStateModel.events.markdownChanged,
});

// Reset the dirty flag after file content is loaded
sample({
  clock: repositoryModel.effects.readFileContentFx.doneData,
  fn: () => false,
  target: documentStateModel.events.dirtyChanged,
});

// Reset loading state after file content is loaded
sample({
  clock: repositoryModel.effects.readFileContentFx.doneData,
  fn: () => false,
  target: documentStateModel.events.loadingChanged,
});

// Reset loading state on error
sample({
  clock: repositoryModel.effects.readFileContentFx.failData,
  fn: () => false,
  target: documentStateModel.events.loadingChanged,
});

// --- MDX Editor Integration ---

// Debounced auto-save logic
const debouncedMarkdownChanged = debounce({
  source: documentStateModel.events.markdownChanged,
  timeout: SAVE_DELAY_MS,
});

// 1. Start the save chain by writing the file locally
sample({
  clock: [debouncedMarkdownChanged, editorModel.events.markdownBlurred],
  source: {
    isDirty: documentStateModel.stores.$dirty,
    fullPath: documentStateModel.stores.$fullPath,
    content: documentStateModel.stores.$markdown,
  },
  filter: ({ isDirty }) => isDirty,
  fn: ({ content, fullPath }) => ({ path: fullPath, content }),
  target: repositoryModel.effects.writeFileLocallyFx,
});

// 2. After local write, reset dirty flag and start git process in parallel
sample({
  clock: repositoryModel.effects.writeFileLocallyFx.done,
  fn: () => false,
  target: documentStateModel.events.dirtyChanged,
});

sample({
  clock: repositoryModel.effects.writeFileLocallyFx.done,
  source: documentStateModel.stores.$relativePathForMR,
  target: repositoryModel.api.commitChangesApi,
});

sample({
  clock: documentTreeModel.stores.$selectedFile,
  fn: (): void => undefined,
  target: editButtonModel.events.editModeDisabled,
});
