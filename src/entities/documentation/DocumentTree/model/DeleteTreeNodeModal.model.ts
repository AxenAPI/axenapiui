import { createEvent, createStore, sample } from 'effector';

import { DocumentationPageInfo } from '@shared/openapi';

type DeleteModalState = {
  isOpen: boolean;
  child?: DocumentationPageInfo;
  parentId?: string;
};

const openDeleteTreeNodeModal = createEvent<{ child: DocumentationPageInfo; parentId?: string }>();
const closeDeleteTreeNodeModal = createEvent();

const $deleteTreeNodeModal = createStore<DeleteModalState>({ isOpen: false });

sample({
  clock: openDeleteTreeNodeModal,
  source: $deleteTreeNodeModal,
  fn: (state, payload) => ({
    ...state,
    isOpen: true,
    child: payload.child,
    parentId: payload.parentId,
  }),
  target: $deleteTreeNodeModal,
});

sample({
  clock: closeDeleteTreeNodeModal,
  source: $deleteTreeNodeModal,
  fn: state => ({ ...state, isOpen: false, child: undefined, parentId: undefined }),
  target: $deleteTreeNodeModal,
});

export const deleteTreeNodeModalModel = {
  events: {
    closeDeleteTreeNodeModal,
    openDeleteTreeNodeModal,
  },
  stores: {
    $deleteTreeNodeModal,
  },
};
