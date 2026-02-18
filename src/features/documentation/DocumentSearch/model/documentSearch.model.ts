import { createEvent, createStore } from 'effector';
import { debounce } from 'patronum';

const SEARCH_DEBOUNCE_MS = 300;

// Events
const searchQueryChanged = createEvent<string>();
const searchCleared = createEvent();

// Stores
const $searchQuery = createStore('')
  .on(searchQueryChanged, (_, query) => query)
  .reset(searchCleared);

// Debounced event for external consumption (page model integration)
const searchQueryDebounced = debounce({
  source: searchQueryChanged,
  timeout: SEARCH_DEBOUNCE_MS,
});

export const documentSearchModel = {
  stores: {
    $searchQuery,
  },
  events: {
    searchQueryChanged,
    searchCleared,
    searchQueryDebounced,
  },
};
