import { lazy } from 'react';

export const RepositoryManagerPageLazy = lazy(() =>
  import('./ui/RepositoryManagerPage').then(module => ({ default: module.RepositoryManagerPage }))
);
