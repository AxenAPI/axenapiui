import { createEffect } from 'effector';

import { DocumentationService } from '@shared/api/services/documentation.service';
import { DocumentationPageInfo, DocumentationTreeResponse } from '@shared/openapi';

// === Types ===
export interface ValidateFileParams {
  pagePath: string;
}

export interface ValidationResult {
  found: true;
  pageInfo: DocumentationPageInfo;
  pagePath: string;
}

export interface ValidationNotFoundResult {
  found: false;
  pageInfo: null;
  pagePath: string;
}

export type FileValidationResult = ValidationResult | ValidationNotFoundResult;

// === Effects ===
const validateFileExistenceFx = createEffect(
  async ({ pagePath }: ValidateFileParams): Promise<FileValidationResult> => {
    try {
      const response = await DocumentationService.getTreeByPath({ pagePath });
      const page = findPageInTree(response, pagePath);

      if (page) {
        return { found: true, pageInfo: page, pagePath };
      }
      return { found: false, pageInfo: null, pagePath };
    } catch {
      return { found: false, pageInfo: null, pagePath };
    }
  }
);

const findPageInTree = (data: DocumentationTreeResponse, targetPath: string) => {
  //TODO: вынести в shared
  const cleanTargetPath = targetPath.replace(/^[/\\]/, '').replace(/\\/g, '/');
  const pathParts = cleanTargetPath.split('/');
  const targetLevelPath = pathParts.slice(0, -2).join('/'); // убираем из пути файл и его папку для поиска левела
  const targetLevel = data.levels.find(level => level.levelPath === targetLevelPath);

  if (!targetLevel) return null;

  const foundPage = targetLevel.pages.find(page => {
    const normalizedPagePath = page.pagePath.replace(/^[/\\]/, '');
    return normalizedPagePath === cleanTargetPath;
  });

  return foundPage || null;
};

// === Exports ===
export const fileValidationModel = {
  api: {
    validateFileExistenceFx,
  },
};
