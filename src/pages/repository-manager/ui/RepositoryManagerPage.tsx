import { useGate } from 'effector-react';
import { FC } from 'react';

import { IntegrationsDrawer } from '@widgets/integrations';

import { RepositoryManagerFilter, RepositoryManagerTable } from '@/components/repositoryManager';
import { DeleteRepositoryModal } from '@/components/repositoryManager/RepositoryDeleteModal/ui/DeleteRepositoryModal';

import { useColumns } from '../hooks/useColumns';
import { RepositoryManagerPageGate } from '../model/RepositoryManagerModel';

export const RepositoryManagerPage: FC = () => {
  useGate(RepositoryManagerPageGate);
  const columns = useColumns();
  return (
    <div className="h-full w-full p-6" data-testid="repository-manager-page">
      {/* TODO: Пока убрали */}
      {/* <div className="mb-4"> */}
      {/*  <RepositoryManagerHeader /> */}
      {/* </div> */}
      <div className="mb-4">
        <RepositoryManagerFilter />
      </div>
      <div>
        <RepositoryManagerTable columns={columns} />
      </div>
      <IntegrationsDrawer />
      <DeleteRepositoryModal />
    </div>
  );
};
