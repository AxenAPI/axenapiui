import { PageSpinner } from '@axenix/ui-kit';
import compose from 'compose-function';
import { ComponentType, ErrorInfo, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';

import { DocumentationPageLazy } from '@pages/documentation';
import { ErrorPage } from '@pages/error-page/ErrorPage';
import { JsonEditorPageLazy } from '@pages/json-editor-page';
import { ModelerPageLazy } from '@pages/modeler-page';
import { RepositoryManagerPageLazy } from '@pages/repository-manager';

import { logger } from '@shared/lib/logger';

import { Layout } from '@/components/layout/Layout';
import { PATHS } from '@/constants/routes';

import { withNotification, withQueryClient, withRouter, withTheme } from './hocs';

/**
 * Корневой компонент приложения.
 * Содержит маршрутизацию и глобальные провайдеры.
 */
function AppBase() {
  const handleError = (error: Error, info: ErrorInfo) => {
    logger.error('Caught an error:', error, info.componentStack);
  };

  return (
    <Layout>
      <ErrorBoundary FallbackComponent={ErrorPage} onError={handleError}>
        <Suspense fallback={<PageSpinner isFullscreen />}>
          <Routes>
            <Route path={PATHS.root} element={<ModelerPageLazy />} />
            <Route path={PATHS.editor} element={<JsonEditorPageLazy />} />
            <Route path={PATHS.documentation} element={<DocumentationPageLazy />} />
            <Route path={PATHS.repositoryManager} element={<RepositoryManagerPageLazy />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

const ComposedApp = compose(withQueryClient, withRouter, withTheme, withNotification)(AppBase);

export const App = ComposedApp as ComponentType;
