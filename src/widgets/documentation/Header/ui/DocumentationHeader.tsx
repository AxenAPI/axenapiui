import { Dots, ListDetails } from 'tabler-icons-react';

import { BranchSelect } from '@features/documentation/BranchSelect';
import { EditButton } from '@features/documentation/EditButton';
import { PublishButton } from '@features/documentation/PublishButton';

import { useDocumentationHeader } from '../hooks/useDocumentationHeader';

export function DocumentationHeader() {
  const { buttonsContainerClass, contextHandler, headerClass, isDocumentSelected } = useDocumentationHeader();

  return (
    <div className={headerClass}>
      {contextHandler}
      <BranchSelect />
      {isDocumentSelected && (
        <div className={buttonsContainerClass}>
          <ListDetails />
          <Dots />
          <EditButton />
          <PublishButton />
        </div>
      )}
    </div>
  );
}
