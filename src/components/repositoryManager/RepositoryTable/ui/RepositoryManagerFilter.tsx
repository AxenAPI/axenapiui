import { Button, InputSearch } from '@axenix/ui-kit';
import { FC } from 'react';
import { Filter, Plus } from 'tabler-icons-react';

import { IS_READ_ONLY } from '@/constants/common';

import { useFilter } from '../hooks/useFilter';
import { openRepositoryDrawer } from '../model/tableModel';

export const RepositoryManagerFilter: FC = () => {
  const { filterValue, handleChange } = useFilter();
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <InputSearch
          value={filterValue}
          style={{ width: '150px' }}
          placeholder="Search object"
          onChange={handleChange}
        />
        <Button icon={<Filter />}>Filter</Button>
      </div>

      {!IS_READ_ONLY && (
        <Button icon={<Plus />} onClick={() => openRepositoryDrawer()}>
          New repository
        </Button>
      )}
    </div>
  );
};
