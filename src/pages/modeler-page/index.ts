import { lazy } from 'react';

export const ModelerPageLazy = lazy(() => import('./ModelerPage').then(module => ({ default: module.ModelerPage })));
