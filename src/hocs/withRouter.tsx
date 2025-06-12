import {FC} from 'react';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';

import {checkIsDesktopMode} from '@/helpers/utils';

/**
 * HOC for react router connection (MemoryRouter for desktop version, BrowserRouter for web).
 */
export const withRouter =
  <P extends object>(WrappedComponent: FC<P>) =>
  (props: P) =>
    checkIsDesktopMode() ? (
      <MemoryRouter>
        {/* @ts-ignore */}
        <WrappedComponent {...props} />
      </MemoryRouter>
    ) : (
      <BrowserRouter>
        {/* @ts-ignore */}
        <WrappedComponent {...props} />
      </BrowserRouter>
    );
