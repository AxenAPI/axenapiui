import { useUnit } from 'effector-react';

import { documentSearchModel } from '../model/documentSearch.model';

export const useDocumentSearch = () => {
  const { searchCleared, searchQuery, searchQueryChanged } = useUnit({
    searchQuery: documentSearchModel.stores.$searchQuery,
    searchQueryChanged: documentSearchModel.events.searchQueryChanged,
    searchCleared: documentSearchModel.events.searchCleared,
  });

  return {
    searchQuery,
    onSearchChange: searchQueryChanged,
    onClear: searchCleared,
  };
};
