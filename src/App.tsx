import compose from 'compose-function';
import {FC} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {Route, Routes} from 'react-router-dom';

import {Layout} from '@/components/layout/Layout';
import {PATHS} from '@/constants/routes';
import {withQueryClient, withRouter, withTheme} from '@/hocs';
import {DocumentationPageComponent} from '@/pages/documentation/DocumentationPage';
import {ErrorPage} from '@/pages/error-page/ErrorPage';
import {JsonEditorPageComponent} from '@/pages/json-editor-page/JsonEditorPage';
import {ModelerPage} from '@/pages/modeler-page/ModelerPage';

/**
 * Root app routing.
 */
export const App: FC = compose(
  withQueryClient,
  withRouter,
  withTheme
)(() => {
  const logError = (error: Error, info: {componentStack: string}) => {
    console.error('Caught an error:', error, info);
  };

  return (
    <Layout>
      <ErrorBoundary FallbackComponent={ErrorPage} onError={logError}>
        <Routes>
          <Route path={PATHS.root} element={<ModelerPage />} />
          <Route path={PATHS.editor} element={<JsonEditorPageComponent />} />
          <Route path={PATHS.documentation} element={<DocumentationPageComponent />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
});
