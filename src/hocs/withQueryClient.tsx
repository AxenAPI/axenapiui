import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {FC} from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Хок подключения React Query.
 */
export const withQueryClient = <P,>(WrappedComponent: FC<P>) =>
  (props: P) => (
    <QueryClientProvider client={queryClient}>
      {/** @ts-ignore */}
      <WrappedComponent {...props} />
    </QueryClientProvider>
  );
