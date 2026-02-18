import { useNotification } from '@axenix/ui-kit';
import { useGate } from 'effector-react';

import { useSelectedFile } from '@features/documentation/MDXEditorWithMermaid';

import { documentationHeaderModel } from '../model/documentationHeader.model';

export const useDocumentationHeader = () => {
  const [api, contextHandler] = useNotification();
  useGate(documentationHeaderModel.gate, api);

  const selectedFile = useSelectedFile();

  const headerClass = 'flex min-h-[40px] w-full items-center justify-between border-b border-gray-200 px-6 py-2 gap-2';
  const buttonsContainerClass = 'flex gap-2 items-center';

  return { isDocumentSelected: !!selectedFile, headerClass, buttonsContainerClass, contextHandler };
};
