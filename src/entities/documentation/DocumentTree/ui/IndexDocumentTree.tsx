import { useUnit } from 'effector-react';
import { FC, memo } from 'react';

import { documentTreeModel } from '../model/documentTree.model';
import { IIndexDocumentTreeProps } from '../type';

import { DeleteTreeNodeModal } from './elements/DeleteTreeNodeModal';
import { TreeItem } from './elements/TreeItem';

export const IndexDocumentTree: FC<IIndexDocumentTreeProps> = memo(({ treeItemOptions }) => {
  const rootIds = useUnit(documentTreeModel.stores.$rootIds);

  const renderRoot = () => rootIds.map(id => <TreeItem key={id} pageId={id} options={treeItemOptions} />);

  return (
    <div className="w-full">
      {rootIds.length ? renderRoot() : null}
      <DeleteTreeNodeModal />
    </div>
  );
});
