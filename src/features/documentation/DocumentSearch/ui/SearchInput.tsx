import { Input } from '@axenix/ui-kit';
import { IconSearch } from '@tabler/icons-react';
import { type FC } from 'react';

import { useDocumentSearch } from '../hooks/useDocumentSearch';

/** Поисковое поле для документации */
export const SearchInput: FC = () => {
  const { onClear, onSearchChange, searchQuery } = useDocumentSearch();

  return (
    <Input
      value={searchQuery}
      onChange={e => onSearchChange(e.target.value)}
      onClear={onClear}
      isAllowClear
      placeholder="Search by name or page id"
      prefix={<IconSearch size={16} />}
    />
  );
};
