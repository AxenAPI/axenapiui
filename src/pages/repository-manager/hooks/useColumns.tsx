import { useUnit } from 'effector-react';
import { useMemo } from 'react';

import { $repositoryType } from '@features/repositoryManager/RepositoryType';

import { GitRepoDtoTypeEnum } from '@shared/openapi';

import { columns } from '@/components/repositoryManager/RepositoryTable/config/Columns';

export const useColumns = () => {
  const repositoryType = useUnit($repositoryType);
  const isDocumentation = repositoryType === GitRepoDtoTypeEnum.Documentation;

  return useMemo(() => (isDocumentation ? columns.filter(col => col.title !== 'Service') : columns), [isDocumentation]);
};
