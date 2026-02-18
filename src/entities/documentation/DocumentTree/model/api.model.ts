import { createEffect } from 'effector';

import { DocumentationService } from '@shared/api/services';
import { DocumentationPageInfo } from '@shared/openapi';

import { getDirectoryPath } from '../helpers/getDirectoryPath';
import { getNewChildName } from '../helpers/getNewChildName';

export const getTreeApi = createEffect((pagePath: string) => DocumentationService.getTreeByPath({ pagePath }));

export const expandNodeFx = createEffect(async ({ id, pagePath }: { id: string; pagePath: string }) => {
  const levelPath = getDirectoryPath(pagePath);
  const data = await DocumentationService.getTreeLevel({ levelPath });
  return { id, pages: data.pages as DocumentationPageInfo[] };
});

export const addChildFx = createEffect(async ({ parent }: { parent?: DocumentationPageInfo }) => {
  const targetDirectory = parent ? getDirectoryPath(parent.pagePath) : '.';
  const pageName = getNewChildName();
  const newPage = await DocumentationService.createPage({ targetDirectory, pageName }).then(d => d);
  return { newPage, parentId: parent?.id };
});

export const removeNodeFx = createEffect(
  async ({ child, parentId }: { child: DocumentationPageInfo; parentId?: string }) => {
    const relativePath = getDirectoryPath(child.pagePath);
    await DocumentationService.deletePage({ relativePath });
    return { childId: child.id, parentId };
  }
);

export const renamePageFx = createEffect(
  async ({ id, newTitle, relativePath }: { id: string; newTitle: string; relativePath: string }) => {
    const relativePagePath = getDirectoryPath(relativePath);
    const data = await DocumentationService.renamePage({
      page: { relativePath: relativePagePath, id },
      newName: newTitle,
    });
    return { id, newTitle, relativePath: data?.relativePath };
  }
);

export const treeApi = {
  getTreeApi,
  expandNodeFx,
  addChildFx,
  removeNodeFx,
  renamePageFx,
};
