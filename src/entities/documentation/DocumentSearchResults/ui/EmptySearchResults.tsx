import { IconX } from '@tabler/icons-react';
import { type FC } from 'react';

import { EmptyState } from '@shared/ui/EmptyState/ui/EmptyState';

interface EmptySearchResultsProps {
  onClearSearch: () => void;
}

/** Состояние "Ничего не найдено" для результатов поиска */
export const EmptySearchResults: FC<EmptySearchResultsProps> = ({ onClearSearch }) => (
  <EmptyState
    title="Ничего не найдено"
    description="Попробуйте изменить поисковый запрос"
    action={{
      icon: <IconX size={16} />,
      label: 'Очистить поиск',
      onClick: onClearSearch,
    }}
  />
);
