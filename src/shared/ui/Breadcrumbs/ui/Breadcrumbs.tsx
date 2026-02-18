import { Breadcrumbs as UiBreadcrumbs } from '@axenix/ui-kit';
import { FC } from 'react';

import { urlToBreadcrumbs } from '../lib/urlToBreadcrumbs';
import { BreadcrumbsProps } from '../types/types';

/** Компонент для отображения хлебных крошек */
export const Breadcrumbs: FC<BreadcrumbsProps> = ({ path }) => {
  const items = urlToBreadcrumbs(path);

  return <UiBreadcrumbs items={items} />;
};
