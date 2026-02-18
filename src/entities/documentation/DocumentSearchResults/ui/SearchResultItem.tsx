import { Button } from '@axenix/ui-kit';
import { type FC, memo } from 'react';

import type { SearchResultItemProps } from '../types/types';

/** Элемент списка результатов поиска */
export const SearchResultItem: FC<SearchResultItemProps> = memo(({ data, onClick }) => {
  const handleClick = () => onClick(data);

  return (
    <div className="my-4">
      <Button title={data.title} type="text" onClick={handleClick}>
        {data.title}
      </Button>
    </div>
  );
});
