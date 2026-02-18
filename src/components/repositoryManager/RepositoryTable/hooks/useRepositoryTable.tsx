import { useUnit } from 'effector-react';

import { $tableData } from '../model/tableModel';

export const useRepositoryTable = () => {
  const data = useUnit($tableData);

  return {
    data,
  };
};
