import { useUnit } from 'effector-react';
import { FC, useState } from 'react';

import { $availableTags, $nodeTagsContext, addNewTag, setTagToNode } from '../model/model';

import { EditMode } from './EditMode';
import { ViewMode } from './ViewMode';

/** Представление тегов нода */
export const NodeTags: FC = () => {
  const { availableTags, nodeTagsContext, onChange, onCreate } = useUnit({
    availableTags: $availableTags,
    nodeTagsContext: $nodeTagsContext,
    onChange: setTagToNode,
    onCreate: addNewTag,
  });

  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <EditMode
      tags={nodeTagsContext?.tags ?? []}
      availableTags={availableTags}
      onChange={onChange}
      onCreateNew={onCreate}
      onClose={() => setIsEditing(false)}
    />
  ) : (
    <ViewMode tags={nodeTagsContext?.tags ?? []} onStartEdit={() => setIsEditing(true)} />
  );
};
