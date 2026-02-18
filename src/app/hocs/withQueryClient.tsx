import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ComponentType, createElement } from 'react';

import { createHoc } from './utilits/createHoc';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * HOC для подключения React Query.
 */
export const withQueryClient = createHoc(
  'QueryClient',
  <P extends object>(WrappedComponent: ComponentType<P>) =>
    (props: P) => (
      <QueryClientProvider client={queryClient}>{createElement(WrappedComponent, props)}</QueryClientProvider>
    )
);
