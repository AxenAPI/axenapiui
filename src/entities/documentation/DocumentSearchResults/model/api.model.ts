import { createEffect } from 'effector';

import { DocumentationService } from '@shared/api/services/documentation.service';
import type { PageDocumentationSearchResult } from '@shared/openapi/api';

interface SearchParams {
  query: string;
  page: number;
  pageSize: number;
}

/**
 * Поиск документов по запросу
 */
export const searchDocumentsFx = createEffect<SearchParams, PageDocumentationSearchResult>(
  async ({ page, pageSize, query }) => {
    const response = await DocumentationService.searchPages(query, page, pageSize);
    return response;
  }
);

export const searchApi = {
  searchDocumentsFx,
};
