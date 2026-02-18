import { Button } from '@axenix/ui-kit';
import { FC } from 'react';

import { EmptyStateProps } from '../types/types';

/** Компонент для отображения пустого состояния в табах */
export const EmptyState: FC<EmptyStateProps> = ({ action, description, title }) => (
  <div className="text-center" style={{ marginTop: '32px' }}>
    <h3 className="heading-5 my-[4px]">{title}</h3>
    <p className="mb-[24px]">{description}</p>
    <Button size="small" type="default" onClick={action.onClick} icon={action.icon}>
      {action.label}
    </Button>
  </div>
);
