import { Button } from '@axenix/ui-kit';
import { Plus } from 'tabler-icons-react';

import { useAddFolder } from '../hooks/useAddFolder';

export const AddFolder = () => {
  const { handleAddFolder } = useAddFolder();

  return (
    <Button className="border-0" onClick={handleAddFolder}>
      <Plus />
    </Button>
  );
};
