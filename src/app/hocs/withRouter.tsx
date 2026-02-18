import { ComponentType, createElement } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import { checkIsDesktopMode } from '@/helpers/utils';

import { createHoc } from './utilits/createHoc';

/**
 * HOC для подключения react-router.
 * Использует MemoryRouter для desktop-версии, BrowserRouter — для web.
 */
export const withRouter = createHoc('Router', <P extends object>(WrappedComponent: ComponentType<P>) => (props: P) => {
  const Router = checkIsDesktopMode() ? MemoryRouter : BrowserRouter;
  return <Router>{createElement(WrappedComponent, props)}</Router>;
});
