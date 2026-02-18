import { sample } from 'effector';
import { createGate } from 'effector-react';

import { repositoryModel } from '@app/models/repository';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

import { documentationMetaModel } from '@features/documentation/DocumentationMeta';
import { importButtonModel } from '@features/documentation/ImportButton';
import { editorModel } from '@features/documentation/MDXEditorWithMermaid';
import { yandexViewModel } from '@features/documentation/YandexView';
import './actions.model';
import './branching.model';
import './refreshDocumentation.model';
import './refreshDocumentationTriggers.model';

// Models moved to @features/documentation/MDXEditorWithMermaid
import '@features/documentation/MDXEditorWithMermaid/model/editorPage.model';
import '@features/documentation/MDXEditorWithMermaid/model/selection.model';

// Gate
export const DocumentationPageGate = createGate('DocumentationPageGate');

// Logics

// When the page is opened, trigger a fetch for repo info
sample({
  clock: DocumentationPageGate.open,
  target: repositoryModel.api.fetchGitRepositoriesApi,
});

sample({
  clock: repositoryModel.api.fetchGitRepositoriesApi.done,
  source: repositoryModel.stores.$documentationInfo,
  fn: docInfo => {
    if (docInfo === null || docInfo.localRepositoryPath === null) {
      return '';
    }

    return docInfo.localRepositoryPath;
  },
  target: repositoryModel.api.getDocumentationInfoApi,
});

// When the page is opened, trigger a fetch for initial document tree
sample({
  clock: DocumentationPageGate.open,
  source: {
    selectedFile: documentTreeModel.stores.$selectedFile,
    hasDocumentationActive: repositoryModel.stores.$hasDocumentationActive,
  },
  filter: ({ hasDocumentationActive }) => Boolean(hasDocumentationActive),
  fn: ({ selectedFile }) => (selectedFile ? selectedFile.pagePath : ''),
  target: documentTreeModel.api.getTreeApi,
});

// When the repo info is fetched, trigger a check for stored repository
// Don't check if there is no active documentation repository
sample({
  clock: repositoryModel.api.getDocumentationInfoApi.done,
  source: { gateStatus: DocumentationPageGate.status, repo: repositoryModel.stores.$hasDocumentationActive },
  filter: ({ gateStatus, repo }) => Boolean(repo) && gateStatus,
  target: repositoryModel.events.checkStoredRepository,
});

sample({
  clock: importButtonModel.events.importButtonClicked,
  target: yandexViewModel.events.openYandexViewDrawer,
});

sample({
  clock: DocumentationPageGate.close,
  target: [
    documentTreeModel.events.dataReset,
    repositoryModel.events.dataReset,
    documentationMetaModel.events.dataReset,
    editorModel.events.errorReset,
  ],
});

export const documentPageModel = {
  gate: DocumentationPageGate,
};
