import { useStoreMap } from 'effector-react';
import { MouseEvent } from 'react';

import { deleteTreeNodeModalModel } from '../../model/DeleteTreeNodeModal.model';
import { documentTreeModel } from '../../model/documentTree.model';

export function useTreeItem(pageId: string, parentId?: string) {
  const node = useStoreMap({
    store: documentTreeModel.stores.$nodesById,
    keys: [pageId],
    fn: (nodes, [id]) => nodes[id],
  });

  const info = node?.info;
  const childrenIds = node?.childrenIds || [];
  const isExpanded = !!node?.isExpanded;
  const isFolder = !!(info?.has_children || childrenIds.length > 0);

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    if (!isFolder || !info) return;
    if (isExpanded) {
      documentTreeModel.events.toggleExpanded({ expanded: false, id: info.id });
      return;
    }
    if (!childrenIds.length) {
      documentTreeModel.api.expandNodeFx({ id: info.id, pagePath: info.pagePath });
    } else {
      documentTreeModel.events.toggleExpanded({ expanded: true, id: info.id });
    }
  };

  const handleClick = () => {
    if (!info) return;
    documentTreeModel.events.fileSelected(info);
  };

  const handleAdd = (e: MouseEvent) => {
    e.stopPropagation();
    if (!info) return;
    documentTreeModel.api.addChildFx({ parent: info });
  };

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    if (!info) return;
    deleteTreeNodeModalModel.events.openDeleteTreeNodeModal({ child: info, parentId });
  };

  return { info, childrenIds, isExpanded, isFolder, handleToggle, handleClick, handleAdd, handleRemove };
}
