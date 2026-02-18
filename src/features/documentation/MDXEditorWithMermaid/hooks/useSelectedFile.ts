import { useUnit } from 'effector-react';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

/**
 * Хук для получения текущего выбранного файла документации.
 * Инкапсулирует знание о том, какой файл сейчас отображается в редакторе.
 */
export const useSelectedFile = () => {
  const selectedFile = useUnit(documentTreeModel.stores.$selectedFile);

  return selectedFile;
};
