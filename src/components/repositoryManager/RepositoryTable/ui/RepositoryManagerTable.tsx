import { Button, NColumns, Table } from '@axenix/ui-kit';
import { FC } from 'react';
import { Pencil, Trash } from 'tabler-icons-react';

import { GitRepoDto } from '@shared/openapi';

import { IS_READ_ONLY } from '@/constants/common';

import { useRepositoryTable } from '../hooks/useRepositoryTable';
import { editRepositoryDrawer, openDeleteModal } from '../model/tableModel';

export const RepositoryManagerTable: FC<{ columns: NColumns.TColumnsType<GitRepoDto> }> = ({ columns }) => {
  const { data } = useRepositoryTable();

  return (
    <>
      <Table
        columns={columns}
        rowSelection={!IS_READ_ONLY ? { type: 'checkbox' } : undefined}
        isNeedToShowSettingsCell={!IS_READ_ONLY}
        renderAction={
          !IS_READ_ONLY
            ? record => [
                {
                  render: () => (
                    <Button
                      icon={<Pencil size={16} />}
                      size="middle"
                      variant="outlined"
                      onClick={() => editRepositoryDrawer(record)}
                      tooltip="Edit repository"
                    />
                  ),
                  actionKey: 'edit',
                  description: 'Edit repository',
                },
                {
                  render: () => (
                    <Button
                      icon={<Trash size={16} />}
                      size="middle"
                      variant="outlined"
                      onClick={() => openDeleteModal(record)}
                      tooltip="Delete repository"
                    />
                  ),
                  actionKey: 'delete',
                  description: 'Delete repository',
                },
              ]
            : undefined
        }
        data={data}
      />
    </>
  );
};
