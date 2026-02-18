import { useUnit } from 'effector-react';

import { importButtonModel } from '../model/import.model';

export function useImportButton() {
  const model = useUnit({
    isLoading: importButtonModel.stores.$isLoading,
    handleImport: importButtonModel.events.importButtonClicked,
  });

  return { ...model };
}
