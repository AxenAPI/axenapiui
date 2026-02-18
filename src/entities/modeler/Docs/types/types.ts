import { DocumentationPageByUuidResponse } from '@shared/openapi';

import { DocFetchError, DocFetchResult } from '../model/api.model';

export interface DocsListProps {
  onViewDocument?: (uuid: string) => void;
}

export interface DocItemProps {
  data: DocFetchResult;
  onViewDocument?: (uuid: string) => void;
}

export interface DocTitleProps {
  data: DocumentationPageByUuidResponse;
  onViewDocument?: (uuid: string) => void;
}

export interface DocErrorProps {
  data: DocFetchError;
}
