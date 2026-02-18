import { sample } from 'effector';

import { globalBlockerModel } from '@shared/components/GlobalBlocker';
import { GitRepoDto, GitRepoDtoTypeEnum } from '@shared/openapi';

import * as common from './common.model';
import * as file from './file.model';
import * as git from './git.model';

// --- Cross-module Logic ---

// When the path is set (either from storage or clone)...
sample({
  clock: common.repositoryPathSet,
  target: common.$repoPath,
});

// ...update the store after cloning is done.
sample({
  clock: git.cloneRepositoryApi.doneData,
  target: common.repositoryPathSet,
});

sample({
  clock: git.fetchGitRepositoriesApi.doneData,
  // TODO: GitRepoDto подставлен для временного решения
  fn: data => data as GitRepoDto[],
  target: common.$gitReposList,
});

sample({
  clock: git.fetchGitRepositoriesApi.doneData,
  source: common.$hasDocumentationActive,
  filter: Boolean,
  fn: (_, gitReps) => {
    const activeDocRepo = gitReps.find(repo => repo.type === GitRepoDtoTypeEnum.Documentation && repo.enabled);
    return activeDocRepo?.localPath ?? '';
  },
  target: common.repositoryPathSet,
});

sample({
  clock: git.getDocumentationInfoApi.doneData,
  target: common.$documentationInfo,
});

// --- Re-fetch folder structure after operations ---

sample({
  clock: git.updateRepositoryApi,
  target: globalBlockerModel.events.blockUI,
});

sample({
  clock: git.updateRepositoryApi.finally,
  target: globalBlockerModel.events.unblockUI,
});

sample({
  clock: git.getDocumentationInfoApi,
  target: globalBlockerModel.events.blockUI,
});

sample({
  clock: git.getDocumentationInfoApi.finally,
  target: globalBlockerModel.events.unblockUI,
});

// --- Export final model ---

export const repositoryModel = {
  stores: {
    $repoPath: common.$repoPath,
    $hasRepository: common.$hasRepository,
    $gitReposList: common.$gitReposList,
    $documentationInfo: common.$documentationInfo,
    $hasDocumentation: common.$hasDocumentation,
    $hasDocumentationActive: common.$hasDocumentationActive,
    $hasCode: common.$hasCode,
    $hasCodeActive: common.$hasCodeActive,
  },
  events: {
    checkStoredRepository: common.checkStoredRepository,
    repositoryPathSet: common.repositoryPathSet,
    dataReset: common.dataReset,
  },
  api: {
    cloneRepositoryApi: git.cloneRepositoryApi,
    addChangesToCommitApi: git.addChangesToCommitApi,
    commitDocumentationPostApi: git.commitDocumentationPostApi,
    commitChangesApi: git.commitChangesApi,
    createMRDocumentationPostApi: git.createMRDocumentationPostApi,
    fetchGitRepositoriesApi: git.fetchGitRepositoriesApi,
    getDocumentationInfoApi: git.getDocumentationInfoApi,
    deleteGitRepositoryApi: git.deleteGitRepositoryApi,
    updateRepositoryApi: git.updateRepositoryApi,
    indexDirectoryApi: git.indexDirectoryApi,
  },
  effects: {
    ...file,
  },
};
