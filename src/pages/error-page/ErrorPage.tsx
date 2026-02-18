import { Button, Empty } from '@axenix/ui-kit';
import { FallbackProps } from 'react-error-boundary';

import { EmptyState } from '@shared/ui/icons/EmptyState';

import { reloadApp } from '@/helpers/reload-app';

export const ErrorPage = ({ error }: FallbackProps) => (
  <div className="flex h-full w-full flex-col items-center justify-center">
    <Empty
      image={<EmptyState />}
      description=""
      imageStyle={{ width: '13.25rem', height: '10.166rem' }}
      style={{ width: '17.5rem', height: '12.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    />
    <div className="text-center">
      <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
      <p className="text-gray-600">Please, try to reload the app</p>
      <pre className="mt-2 text-sm whitespace-pre-wrap text-red-500">{error.message}</pre>
    </div>

    <Button className="mt-3" type="primary" onClick={reloadApp}>
      Reload app
    </Button>
  </div>
);
