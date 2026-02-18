import { createEvent, createStore, sample } from 'effector';

import { repositoryModel } from '@app/models/repository';

import { DocumentationPageInfo, DocumentationTreeLevel, DocumentationTreeResponse } from '@shared/openapi';

import { treeApi } from './api.model';

const fileSelected = createEvent<DocumentationPageInfo | null>();
const dataReset = createEvent();

const $selectedFile = createStore<DocumentationPageInfo | null>(null).reset(dataReset);

type TreeNode = {
  info: DocumentationPageInfo;
  childrenIds?: string[];
  isExpanded?: boolean;
  isLoading?: boolean;
  parentId?: string;
};

const $nodesById = createStore<Record<string, TreeNode>>({}).reset(dataReset);

// Helper function to get sorted IDs by order field from DocumentationPageInfo array
const getIdsSortedByOrder = (pages: DocumentationPageInfo[]): string[] =>
  [...pages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(page => page.id);

// Computed store для корневых узлов (без parentId), отсортированных по order
const $rootIds = $nodesById.map(nodes => {
  const rootPages = Object.entries(nodes)
    .filter(([, node]) => !node.parentId)
    .map(([, node]) => node.info);
  return getIdsSortedByOrder(rootPages);
});

const initFromLevels = createEvent<DocumentationTreeResponse>();
const toggleExpanded = createEvent<{ expanded: boolean; id: string }>();

sample({
  clock: fileSelected,
  filter: Boolean,
  target: $selectedFile,
});

// Init tree structure directly from API result
sample({
  clock: treeApi.getTreeApi.doneData,
  filter: (levels): levels is DocumentationTreeResponse => Boolean(levels?.levels?.length),
  target: initFromLevels,
});

// Normalize initial tree from levels to single source of truth
sample({
  clock: initFromLevels,
  fn: payload => {
    const next: Record<string, TreeNode> = {};
    const levels = payload.levels as DocumentationTreeLevel[];
    if (!levels?.length) return next;

    // Root level
    const rootLevel = levels[0];
    if (rootLevel?.pages) {
      rootLevel.pages.forEach(page => {
        const existing = next[page.id];
        next[page.id] = {
          ...existing,
          info: page,
          parentId: undefined,
          isExpanded: existing?.isExpanded ?? false,
          childrenIds: existing?.childrenIds,
        };
      });
    }

    // Nested levels
    for (let i = 1; i < levels.length; i++) {
      const level = levels[i];
      const parentId = level.parentPageUUID;

      if (parentId) {
        level.pages.forEach(page => {
          const existing = next[page.id];
          next[page.id] = {
            ...existing,
            info: page,
            parentId,
            isExpanded: existing?.isExpanded ?? false,
            childrenIds: existing?.childrenIds,
          };
        });

        if (next[parentId]) {
          next[parentId] = {
            ...next[parentId],
            childrenIds: getIdsSortedByOrder(level.pages),
            isExpanded: true,
          };
        }
      }
    }

    return next;
  },
  target: $nodesById,
});

sample({
  clock: toggleExpanded,
  source: $nodesById,
  fn: (state, { expanded, id }) => {
    if (!state[id]) return state;
    return { ...state, [id]: { ...state[id], isExpanded: expanded } };
  },
  target: $nodesById,
});

sample({
  clock: treeApi.expandNodeFx.done,
  source: $nodesById,
  fn: (state, { params, result }) => {
    const { id } = params;
    const { pages } = result;
    const next = { ...state };
    for (const child of pages) {
      const existing = next[child.id];
      next[child.id] = {
        ...existing,
        info: child,
        parentId: id,
        isExpanded: existing?.isExpanded ?? false,
        childrenIds: existing?.childrenIds,
      };
    }
    next[id] = { ...next[id], childrenIds: getIdsSortedByOrder(pages), isExpanded: true };
    return next;
  },
  target: $nodesById,
});

sample({
  clock: treeApi.addChildFx.done,
  source: $nodesById,
  fn: (state, { result }) => {
    const { newPage, parentId } = result;
    const next = { ...state };
    next[newPage.id] = {
      ...(next[newPage.id] ?? {}),
      info: newPage,
      parentId: parentId ?? undefined,
      isExpanded: false,
    };

    if (parentId && next[parentId]) {
      const parent = next[parentId];
      const children = parent.childrenIds ? [...parent.childrenIds] : [];
      children.push(newPage.id);
      next[parentId] = {
        ...parent,
        childrenIds: children,
        isExpanded: true,
        // поле с бэка
        // eslint-disable-next-line camelcase
        info: { ...parent.info, has_children: true },
      };
    }
    return next;
  },
  target: $nodesById,
});

sample({
  clock: treeApi.removeNodeFx.done,
  source: $nodesById,
  fn: (state, { result }) => {
    const { childId, parentId } = result;
    const next = { ...state };
    const node = next[childId];
    if (!node) return state;

    delete next[childId];

    if (parentId && next[parentId]) {
      const parent = next[parentId];
      const children = (parent.childrenIds || []).filter(id => id !== childId);
      next[parentId] = {
        ...parent,
        childrenIds: children,
        // поле с бэка
        // eslint-disable-next-line camelcase
        info: { ...parent.info, has_children: children.length > 0 },
      };
    }
    return next;
  },
  target: $nodesById,
});

// Clear selected file if deleted page was selected
sample({
  clock: treeApi.removeNodeFx.done,
  source: $selectedFile,
  fn: (selected, { result }) => {
    if (!selected || selected.id !== result.childId) return selected;
    return null;
  },
  target: $selectedFile,
});

sample({
  clock: treeApi.renamePageFx.done,
  source: $nodesById,
  fn: (state, { result }) => {
    const { id, newTitle } = result;
    if (!state[id]) return state;
    const next = { ...state };
    const current = next[id];
    next[id] = {
      ...current,
      info: {
        ...current.info,
        title: newTitle,
      },
    };
    return next;
  },
  target: $nodesById,
});

// Update selected file info when page is renamed
sample({
  clock: treeApi.renamePageFx.done,
  source: $selectedFile,
  fn: (selected, { result }) => {
    if (!selected || selected.id !== result.id) return selected;
    return {
      ...selected,
      title: result.newTitle,
    };
  },
  target: $selectedFile,
});

// After a page is renamed via API, add changes to commit
sample({
  clock: treeApi.renamePageFx.done,
  source: repositoryModel.stores.$repoPath,
  fn: (repoPath, { params }) => {
    const normalizedRepoPath = repoPath.replace(/\\/g, '/');
    return `${normalizedRepoPath}/${params.relativePath}`;
  },
  target: repositoryModel.api.commitChangesApi,
});

export const documentTreeModel = {
  api: treeApi,
  stores: {
    $selectedFile,
    $nodesById,
    $rootIds,
  },
  events: {
    fileSelected,
    dataReset,
    initFromLevels,
    toggleExpanded,
  },
};
