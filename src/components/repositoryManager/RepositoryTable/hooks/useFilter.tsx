import { useUnit } from 'effector-react';
import { ChangeEvent } from 'react';

import { $filterValue, setFilterValue } from '../model/tableModel';

export const useFilter = () => {
  const filterValue = useUnit($filterValue);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  return { filterValue, handleChange };
};
