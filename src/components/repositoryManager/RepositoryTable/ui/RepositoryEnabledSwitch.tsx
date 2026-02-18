import { Switch } from '@axenix/ui-kit';
import { useUnit } from 'effector-react';
import { FC } from 'react';

import { handleSwitchClick } from '../lib/utils';
import { activateGitRepositoryFX } from '../model/tableModel';

interface RepositoryEnabledSwitchProps {
  id: string;
  value: boolean;
}

export const RepositoryEnabledSwitch: FC<RepositoryEnabledSwitchProps> = ({ id, value }) => {
  const isPending = useUnit(activateGitRepositoryFX.pending);

  return (
    <Switch value={value} onClick={() => handleSwitchClick(id, value)} isDisabled={isPending} isLoading={isPending} />
  );
};
