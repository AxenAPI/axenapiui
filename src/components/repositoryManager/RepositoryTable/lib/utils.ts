import { GitRepoDto, GitRepoDtoTypeEnum } from '@shared/openapi';

import { $tableData, activateGitRepositoryFX, activeRepositoryExists, cleanupRepository } from '../model/tableModel';

export const getFilteredRepos = (repos: GitRepoDto[], filterValue: string, type: GitRepoDtoTypeEnum) => {
  const filteredByType = repos.filter(item => item.type === type);
  return filterValue ? filteredByType.filter(item => item?.service?.includes(filterValue)) : filteredByType;
};

export const handleSwitchClick = (id: string, value: boolean) => {
  const activeDocumentationRepo = $tableData
    .getState()
    .find(repo => repo.type === GitRepoDtoTypeEnum.Documentation && repo.enabled);

  if (activeDocumentationRepo && activeDocumentationRepo.id !== id) {
    activeRepositoryExists();
    return;
  }

  if (value) {
    cleanupRepository();
  }
  activateGitRepositoryFX({ id, enabled: !value });
};
