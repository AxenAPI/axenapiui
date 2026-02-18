import { IconFileText } from '@tabler/icons-react';

import { DocsList, DocsListProps } from '@entities/modeler/Docs';

/** Вкладка документов нода */
export const getDocsTab = (props?: DocsListProps) => ({
  children: <DocsList {...props} />,
  key: 'Docs',
  icon: <IconFileText />,
  label: 'Docs',
});
