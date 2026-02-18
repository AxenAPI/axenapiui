import { Button } from '@axenix/ui-kit';
import { FC } from 'react';

import { usePublishButton } from '../hooks/usePublishButton';

export const PublishButton: FC = () => {
  const { handlePublish, isPending } = usePublishButton();

  return (
    <Button onClick={handlePublish} size="small" type="primary" isLoading={isPending} isDisabled={isPending}>
      Publish
    </Button>
  );
};
