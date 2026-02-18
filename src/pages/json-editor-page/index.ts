import { lazy } from 'react';

export const JsonEditorPageLazy = lazy(() =>
  import('./JsonEditorPage').then(module => ({ default: module.JsonEditorPageComponent }))
);
