import type { DocumentationSearchResult } from '@shared/openapi/api';

export type { DocumentationSearchResult };

export interface SearchResultItemProps {
  data: DocumentationSearchResult;
  onClick: (result: DocumentationSearchResult) => void;
}
