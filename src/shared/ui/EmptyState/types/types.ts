import { ReactNode } from 'react';

/** Свойства компонента пустого состояния */
export interface EmptyStateProps {
  title: string;
  description: string;
  action: {
    icon: ReactNode;
    label: string;
    onClick: () => void;
  };
}
