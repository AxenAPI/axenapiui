import { Button } from '@axenix/ui-kit';
import { type FC, memo } from 'react';

import { useSearchResults } from '../hooks/useSearchResults';
import type { DocumentationSearchResult } from '../types/types';

import { EmptySearchResults } from './EmptySearchResults';
import { SearchResultItem } from './SearchResultItem';

interface SearchResultsListProps {
  onClearSearch: () => void;
  onResultSelect: (result: DocumentationSearchResult) => void;
}

/** Список результатов поиска по документации */
export const SearchResultsList: FC<SearchResultsListProps> = memo(({ onClearSearch, onResultSelect }) => {
  const { hasMore, isEmpty, isLoading, onLoadMore, results } = useSearchResults();

  if (isEmpty) {
    return <EmptySearchResults onClearSearch={onClearSearch} />;
  }

  return (
    <div className="flex flex-col gap-1">
      {results.map(result => (
        <SearchResultItem key={result.id} data={result} onClick={onResultSelect} />
      ))}

      {hasMore && (
        <Button type="default" size="small" isLoading={isLoading} onClick={onLoadMore} className="mt-2 w-full">
          Показать ещё
        </Button>
      )}
    </div>
  );
});

SearchResultsList.displayName = 'SearchResultsList';
