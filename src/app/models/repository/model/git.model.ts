import { createEffect } from 'effector';

import { GitService } from '@shared/api/services';

// Api
export const cloneRepositoryApi = createEffect(async () => {
  try {
    return await GitService.clone();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Clone documentation failed');
  }
});

export const addChangesToCommitApi = createEffect(async (body: string) => {
  try {
    return await GitService.addChanges(body);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Add documentation failed');
  }
});

export const commitDocumentationPostApi = createEffect(async () => {
  try {
    return await GitService.commit();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Commit documentation failed');
  }
});

export const createMRDocumentationPostApi = createEffect(async () => {
  try {
    const mrLink = await GitService.createMergeRequest();
    return mrLink;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Clone documentation failed');
  }
});

export const fetchGitRepositoriesApi = createEffect(async () => {
  try {
    return await GitService.getAllRepos();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Fetch repositories failed');
  }
});

export const getDocumentationInfoApi = createEffect(async (filePath: string) => {
  try {
    return await GitService.getDocumentationGitInfo(filePath);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Fetch documentation info failed');
  }
});

export const commitChangesApi = createEffect(async (body: string) => {
  try {
    await GitService.addChanges(body);
    await GitService.commit();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Commit changes failed');
  }
});

export const deleteGitRepositoryApi = createEffect(async (id: string) => {
  try {
    await GitService.deleteRepo(id);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Delete repository failed');
  }
});

export const updateRepositoryApi = createEffect(async () => {
  try {
    return await GitService.gitUpdate();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Update repository failed');
  }
});

export const indexDirectoryApi = createEffect(async (body: string) => {
  try {
    return await GitService.indexDirectory(body);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Index directory failed');
  }
});
