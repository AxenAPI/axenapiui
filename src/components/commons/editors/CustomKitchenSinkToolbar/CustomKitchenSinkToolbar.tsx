import { ConditionalContents, DiffSourceToggleWrapper, MDXEditorMethods } from '@mdxeditor/editor';
import { FC, RefObject } from 'react';

import { options } from './config';

type CustomKitchenSinkToolbarProps = {
  editorRef: RefObject<MDXEditorMethods>;
};

/**
    Компонент настройка над KitchenSinkToolbar. Из панели были исключены InsertImage и InsertSandpack
 */
export const CustomKitchenSinkToolbar: FC<CustomKitchenSinkToolbarProps> = ({ editorRef }) => (
  <DiffSourceToggleWrapper>
    <ConditionalContents options={options(editorRef)} />
  </DiffSourceToggleWrapper>
);
