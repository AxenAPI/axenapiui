import { useUnit } from 'effector-react';

import { documentSearchResultsModel } from '../model/documentSearchResults.model';

export const useSearchResults = () => {
  const { hasMore, isEmpty, isLoading, loadMoreRequested, results } = useUnit({
    hasMore: documentSearchResultsModel.stores.$hasMore,
    isEmpty: documentSearchResultsModel.stores.$isEmpty,
    isLoading: documentSearchResultsModel.stores.$isLoading,
    loadMoreRequested: documentSearchResultsModel.events.loadMoreRequested,
    results: documentSearchResultsModel.stores.$results,
  });

  return {
    results,
    isLoading,
    hasMore,
    isEmpty,
    onLoadMore: loadMoreRequested,
  };
};
