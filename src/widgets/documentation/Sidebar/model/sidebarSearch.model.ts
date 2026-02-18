import { sample } from 'effector';

import { documentSearchResultsModel } from '@entities/documentation/DocumentSearchResults';

import { documentSearchModel } from '@features/documentation/DocumentSearch';

// Feature → Entity: debounced query запускает поиск
sample({
  clock: documentSearchModel.events.searchQueryDebounced,
  filter: query => query.length > 0,
  target: documentSearchResultsModel.events.searchStarted,
});

// Clear search → очистить результаты
sample({
  clock: documentSearchModel.events.searchCleared,
  target: documentSearchResultsModel.events.resultsCleared,
});

// Empty query → очистить результаты (вернуться к дереву)
sample({
  clock: documentSearchModel.events.searchQueryDebounced,
  filter: query => query.length === 0,
  target: documentSearchResultsModel.events.resultsCleared,
});
