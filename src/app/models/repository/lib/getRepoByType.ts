import { GitRepoDto, GitRepoDtoTypeEnum } from '@shared/openapi';

export const getReposByType = (repos: GitRepoDto[], type: GitRepoDtoTypeEnum, enabledOnly: boolean = false) =>
  repos.filter(repo => repo.type === type && (!enabledOnly || repo.enabled));
