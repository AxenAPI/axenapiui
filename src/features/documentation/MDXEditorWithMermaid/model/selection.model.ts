import { sample } from 'effector';
import { spread } from 'patronum';

import { repositoryModel } from '@app/models/repository';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

// FIXME: cross-import feature → feature (technical debt)
import { documentationMetaModel } from '@features/documentation/DocumentationMeta';
import { editorModel } from '@features/documentation/MDXEditorWithMermaid';

import { documentStateModel } from './documentState.model';

// --- Selection logic ---
const fileSelectionProcessed = sample({
  clock: documentTreeModel.stores.$selectedFile,
  source: repositoryModel.stores.$repoPath,
  filter: (repoPath, selectedFile) => Boolean(repoPath && selectedFile),
  fn: (repoPath, selectedFile) => {
    const { pagePath, title } = selectedFile!;
    const normalizedRepoPath = repoPath.replace(/\\/g, '/');
    const fullPath = `${normalizedRepoPath + pagePath}`;

    return {
      fullPath,
      relativePath: pagePath,
      title,
    };
  },
});

sample({
  clock: documentTreeModel.stores.$selectedFile,
  target: editorModel.events.errorReset,
});

// When a document is selected, set the title in DocumentationMeta
sample({
  clock: fileSelectionProcessed,
  fn: ({ title }) => title,
  target: documentationMetaModel.events.documentTitleSet,
});

// When a document is selected, calculate and set the full and relative paths
sample({
  clock: fileSelectionProcessed,
  fn: ({ fullPath, relativePath }) => ({ fullPath, relativePath }),
  target: spread({
    fullPath: documentStateModel.events.fullPathChanged,
    relativePath: documentStateModel.events.relativePathForMRChanged,
  }),
});

// When a document is selected, trigger reading its content
sample({
  clock: fileSelectionProcessed,
  fn: ({ fullPath }) => fullPath,
  target: repositoryModel.effects.readFileContentFx,
});
