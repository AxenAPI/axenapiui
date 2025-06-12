import {ThemeProvider, useTheme} from '@axenix/ui-kit';
import {FC} from 'react';

/**
 * Хок подключения темы.
 */
export const withTheme =
  <P,>(WrappedComponent: FC<P>) =>
  (props: P) => {
    const {theme} = useTheme();

    return (
      <ThemeProvider theme={theme} hashPriority="high" shouldUseLayer>
        {/** @ts-ignore */}
        <WrappedComponent {...props} />
      </ThemeProvider>
    );
  };
