import { Button } from '@axenix/ui-kit';
import { FC } from 'react';

import { useEditButton } from '../hooks/useEditButton';

export const EditButton: FC = () => {
  const { handleToggleEditMode, isEditing } = useEditButton();

  return (
    <Button size="small" type="default" onClick={handleToggleEditMode}>
      {isEditing ? 'Close' : 'Edit'}
    </Button>
  );
};
