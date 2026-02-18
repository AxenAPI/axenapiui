import { combine, createEvent, createStore, sample } from 'effector';

import { logger } from '@shared/lib/logger';
import type { DocumentationSearchResult, PageDocumentationSearchResult } from '@shared/openapi/api';

import { searchDocumentsFx } from './api.model';

const PAGE_SIZE = 20;

// Events
const searchStarted = createEvent<string>();
const resultsReceived = createEvent<PageDocumentationSearchResult>();
const loadMoreRequested = createEvent();
const resultsCleared = createEvent();

// Stores
const $searchQuery = createStore('')
  .on(searchStarted, (_, query) => query.trim())
  .reset(resultsCleared);

const $results = createStore<DocumentationSearchResult[]>([])
  .on(resultsReceived, (state, response) => [...state, ...(response.content || [])])
  .reset([resultsCleared, searchStarted]);

const $hasMore = createStore(false)
  .on(resultsReceived, (_, response) => (response.number || 0) + 1 < (response.totalPages || 1))
  .reset([resultsCleared, searchStarted]);

const $currentPage = createStore(-1)
  .on(resultsReceived, (_, response) => response.number ?? 0)
  .reset([resultsCleared, searchStarted]);

const $isLoading = createStore(false)
  .on(searchDocumentsFx, () => true)
  .on(searchDocumentsFx.finally, () => false)
  .reset(resultsCleared);

// Derived stores
const $isEmpty = combine($results, $isLoading, (results, isLoading) => results.length === 0 && !isLoading);

// API connections
sample({
  clock: searchStarted,
  fn: query => ({ query: query.trim(), page: 0, pageSize: PAGE_SIZE }),
  target: searchDocumentsFx,
});

sample({
  clock: loadMoreRequested,
  source: { query: $searchQuery, currentPage: $currentPage, hasMore: $hasMore, isLoading: $isLoading },
  filter: ({ hasMore, isLoading }) => hasMore && !isLoading,
  fn: ({ currentPage, query }) => ({ query, page: currentPage + 1, pageSize: PAGE_SIZE }),
  target: searchDocumentsFx,
});

sample({
  clock: searchDocumentsFx.doneData,
  target: resultsReceived,
});

sample({
  clock: searchDocumentsFx.fail,
  fn: ({ error }) => {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('[DocumentSearch] Search failed:', message);
  },
});

export const documentSearchResultsModel = {
  stores: {
    $searchQuery,
    $results,
    $isLoading,
    $hasMore,
    $isEmpty,
  },
  events: {
    searchStarted,
    loadMoreRequested,
    resultsCleared,
  },
};
