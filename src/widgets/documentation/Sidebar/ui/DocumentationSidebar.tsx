import { clsx } from 'clsx';
import { useUnit } from 'effector-react';
import { FC } from 'react';

import { DocumentationSearchResult, SearchResultsList } from '@entities/documentation/DocumentSearchResults';
import { IndexDocumentTree } from '@entities/documentation/DocumentTree';

import { documentSearchModel, SearchInput } from '@features/documentation/DocumentSearch';
import { selectDocumentForViewModel } from '@features/modeler/SelectDocumentForView';

// Активация sample-связей
import '../model/sidebarSearch.model';

export const DocumentationSidebar: FC = () => {
  const { clearSearch, navigateToDocument, searchQuery } = useUnit({
    clearSearch: documentSearchModel.events.searchCleared,
    navigateToDocument: selectDocumentForViewModel.events.navigateToDocument,
    searchQuery: documentSearchModel.stores.$searchQuery,
  });

  const isSearchMode = searchQuery.length > 0;

  const handleResultSelect = (result: DocumentationSearchResult) => {
    if (!result.id || !result.pagePath) {
      return;
    }

    navigateToDocument({ id: result.id, pagePath: result.pagePath });
  };

  const containerClassName = clsx(
    'h-full w-[20rem] bg-white shrink-0 min-h-0 flex flex-col row-start-2 col-start-1',
    'side-bar'
  );
  const scrollAreaClassName = clsx('w-full h-full border-r border-gray-200 min-h-0 overflow-y-auto scrollbar pt-2');

  return (
    <div className={containerClassName} data-testid="documentation-sidebar">
      <SearchInput />
      <div className={scrollAreaClassName}>
        {isSearchMode ? (
          <SearchResultsList onClearSearch={clearSearch} onResultSelect={handleResultSelect} />
        ) : (
          <IndexDocumentTree />
        )}
      </div>
    </div>
  );
};
