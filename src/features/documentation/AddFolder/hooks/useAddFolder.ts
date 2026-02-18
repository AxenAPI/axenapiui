import { documentTreeModel } from '@entities/documentation/DocumentTree/model/documentTree.model';

export function useAddFolder() {
  const handleAddFolder = () => {
    documentTreeModel.api.addChildFx({});
  };

  return { handleAddFolder };
}
