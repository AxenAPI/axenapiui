import { useUnit } from 'effector-react';
import { FC } from 'react';

import { GitRepoDtoTypeEnum } from '@shared/openapi';

import { RadioButtonGroup } from '@/components/commons/buttons/RadioGroupButton';
import { REPOSITORY_OPTIONS } from '@/constants/repositoryManagerMenu';

import { $repositoryType, setRepositoryTypeEvent } from '../model/RepositoryTypeModel';

export const RepositoryManagerHeader: FC = () => {
  const value = useUnit($repositoryType);

  return (
    <RadioButtonGroup
      options={REPOSITORY_OPTIONS}
      value={value}
      onChange={v => setRepositoryTypeEvent(v as GitRepoDtoTypeEnum)}
    />
  );
};
