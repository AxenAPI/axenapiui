import { Button } from '@axenix/ui-kit';
import { FileImport } from 'tabler-icons-react';

import { useImportButton } from '../hooks/useImportButton';

export function ImportButton() {
  const { handleImport, isLoading } = useImportButton();

  return (
    <Button className="border-0" onClick={handleImport} disabled={isLoading}>
      <FileImport />
    </Button>
  );
}
