import { FC } from 'react';

import { TruncatedTag } from './Tags';

/** Режим просмотра тегов */
export const TagsView: FC<{ tags: string[] }> = ({ tags }) => (
  <div className="flex flex-wrap py-4">
    {tags.map(tag => (
      <TruncatedTag key={tag} text={tag} />
    ))}
  </div>
);
