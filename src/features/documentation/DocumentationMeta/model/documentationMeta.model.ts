import { createEffect, createEvent, createStore, sample } from 'effector';

import { DocumentationService } from '@shared/api/services';
import { DocumentationApiDocumentationPagesLinkPostRequest, EventDTO, NodeDTO } from '@shared/openapi';

import { EMPTY_CHAR } from '@/constants/common';

// Events
const documentTitleSet = createEvent<string>();
const newTitleChanged = createEvent<string>();

const renameRequested = createEvent<string>();
const editModeToggled = createEvent();

const setMenuFilterValue = createEvent<string>();

const openLinkedObjectDrawer = createEvent();
const passDataToDrawer = createEvent<NodeDTO | EventDTO>();

const dataReset = createEvent();

// Effects
const linkDocumentationPageApi = createEffect(async (data: DocumentationApiDocumentationPagesLinkPostRequest) => {
  try {
    return await DocumentationService.linkDocumentationPage(data);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'An unknown error occurred');
  }
});

// Stores
const $isEditing = createStore<boolean>(false).reset(dataReset);
const $newTitle = createStore<string>('').reset(dataReset);
const $title = createStore<string>('').reset(dataReset);
const $menuFilterValue = createStore<string>('').reset(dataReset);

// Logic
sample({
  clock: documentTitleSet,
  target: $title,
});

sample({
  clock: editModeToggled,
  source: $isEditing,
  fn: isEditing => !isEditing,
  target: $isEditing,
});

// When a rename is requested, exit editing mode
sample({
  clock: renameRequested,
  fn: () => false,
  target: $isEditing,
});

// When editing mode is entered, copy the current title to the input
sample({
  clock: editModeToggled,
  source: { title: $title, isEditing: $isEditing },
  filter: ({ isEditing }) => isEditing,
  fn: ({ title }) => title,
  target: $newTitle,
});

sample({
  clock: newTitleChanged,
  target: $newTitle,
});

// Reset the input value when editing mode is exited
sample({
  clock: $isEditing,
  filter: isEditing => !isEditing,
  fn: () => EMPTY_CHAR,
  target: $newTitle,
});

sample({
  clock: setMenuFilterValue,
  target: $menuFilterValue,
});

export const documentationMetaModel = {
  api: {
    linkDocumentationPageApi,
  },
  events: {
    documentTitleSet,
    renameRequested,
    newTitleChanged,
    editModeToggled,
    setMenuFilterValue,
    openLinkedObjectDrawer,
    passDataToDrawer,
    dataReset,
  },
  stores: {
    $isEditing,
    $newTitle,
    $title,
    $menuFilterValue,
  },
};
