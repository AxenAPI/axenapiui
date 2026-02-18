import { ThemeProvider, useTheme } from '@axenix/ui-kit';
import { ComponentType, createElement } from 'react';

import { createHoc } from './utilits/createHoc';

/**
 * HOC для подключения темы оформления.
 */
export const withTheme = createHoc('Theme', <P extends object>(WrappedComponent: ComponentType<P>) => (props: P) => {
  const { theme } = useTheme();

  return (
    // @ts-expect-error типы для ThemeProvider из @axenix/ui-kit некорректны
    <ThemeProvider theme={theme} hashPriority="high" shouldUseLayer>
      {createElement(WrappedComponent, props)}
    </ThemeProvider>
  );
});
