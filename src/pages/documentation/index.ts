import { lazy } from 'react';

export const DocumentationPageLazy = lazy(() =>
  import('./ui/DocumentationPage').then(module => ({ default: module.DocumentationPage }))
);
