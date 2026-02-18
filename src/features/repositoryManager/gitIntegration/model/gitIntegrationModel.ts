import { createEffect, createEvent, createStore, sample } from 'effector';

import { GitService } from '@shared/api/services';
import { GitRepoDto, GitRepoDtoAuthTypeEnum, GitRepoDtoTypeEnum } from '@shared/openapi';

// ===== Types =====

export type GitIntegrationFormData = {
  url: string;
  token: string;
};

// ===== Events =====

export const setUrl = createEvent<string>();
export const setToken = createEvent<string>();
export const resetForm = createEvent();
export const loadGitRepo = createEvent<GitRepoDto>();
export const submitForm = createEvent();

// ===== Stores =====

export const $url = createStore<string>('').reset(resetForm);
export const $token = createStore<string>('').reset(resetForm);
export const $editingRepoId = createStore<string | null>(null).reset(resetForm);
export const $editingRepoEnabled = createStore<boolean>(false).reset(resetForm);
export const $isSubmitting = createStore<boolean>(false);

export const $formData = sample({
  source: { url: $url, token: $token },
  fn: ({ token, url }): GitIntegrationFormData => ({ url, token }),
});

export const $isFormValid = $formData.map(({ token, url }) => url.trim().length > 0 && token.trim().length > 0);

// ===== Effects =====

export const saveGitRepoFx = createEffect(
  async (params: {
    formData: GitIntegrationFormData;
    editingId: string | null;
    enabled: boolean;
  }): Promise<GitRepoDto> => {
    const { editingId, enabled, formData } = params;

    const gitRepoDto: GitRepoDto = {
      url: formData.url,
      token: formData.token,
      authType: GitRepoDtoAuthTypeEnum.Token,
      type: GitRepoDtoTypeEnum.Documentation,
      status: 'OK',
      // New repos are disabled by default; editing preserves current state
      enabled: editingId ? enabled : false,
      // Legacy fields required by adapter (tracker settings are now stored separately)
      trackerUrl: '',
      trackerToken: '',
    };

    if (editingId) {
      const result = await GitService.updateRepo(editingId, gitRepoDto);
      return result as GitRepoDto;
    } else {
      const result = await GitService.createRepo(gitRepoDto);
      return result as GitRepoDto;
    }
  }
);

// ===== Logic =====

sample({
  clock: setUrl,
  target: $url,
});

sample({
  clock: setToken,
  target: $token,
});

sample({
  clock: loadGitRepo,
  fn: repo => repo.url ?? '',
  target: $url,
});

sample({
  clock: loadGitRepo,
  fn: repo => repo.token ?? '',
  target: $token,
});

sample({
  clock: loadGitRepo,
  fn: repo => repo.id ?? null,
  target: $editingRepoId,
});

sample({
  clock: loadGitRepo,
  fn: repo => repo.enabled ?? false,
  target: $editingRepoEnabled,
});

sample({
  clock: submitForm,
  source: { formData: $formData, editingId: $editingRepoId, enabled: $editingRepoEnabled },
  target: saveGitRepoFx,
});

sample({
  clock: saveGitRepoFx.pending,
  target: $isSubmitting,
});

// ===== Public API =====

export const gitIntegrationModel = {
  stores: {
    $url,
    $token,
    $editingRepoId,
    $isFormValid,
    $isSubmitting,
    $formData,
  },
  events: {
    setUrl,
    setToken,
    resetForm,
    loadGitRepo,
    submitForm,
  },
  api: {
    saveGitRepoFx,
  },
};
