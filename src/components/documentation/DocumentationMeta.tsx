import {useUnit} from 'effector-react';
import {useState} from 'react';
import {UserCircle} from 'tabler-icons-react';

import {$documentationBreadcrumbs, $repoPath} from '@/models/DocumentationModel';
import {renameFileWithAddToCommit} from '@/utils/renameFile';

export const DocumentationMeta = () => {
  const repoPath = useUnit($repoPath);
  const breadcrumbs = useUnit($documentationBreadcrumbs);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(breadcrumbs[1]?.title || '');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSave = async () => {
    setIsEditing(false);
    renameFileWithAddToCommit(newTitle, breadcrumbs, repoPath);
  };

  const metaContainerClass = 'flex flex-col px-6 pb-16';
  const metaInfoClass = 'flex flex-col gap-4 pt-8 pb-8';
  const authorClass = 'flex items-center gap-2';
  const authorTextClass = 'text-[16px] text-[#1F1F1F]';
  const titleClass = 'text-[24px] text-[#1F1F1F]';
  const updatedClass = 'text-[12px] text-[#A6A6A6]';

  return (
    <div className={metaContainerClass}>
      <div className={metaInfoClass}>
        <div className={authorClass}>
          <UserCircle />
          <p className={authorTextClass}>Anonim</p>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            {isEditing ? (
              <div className="center flex">
                <input
                  type="text"
                  value={newTitle}
                  onChange={handleChange}
                  onBlur={handleSave}
                  className={titleClass}
                />
                <button onClick={handleSave}>Save</button>
              </div>
            ) : (
              <button className={titleClass} onClick={handleEdit} type="button">
                {breadcrumbs[1]?.title}
              </button>
            )}
          </div>
          <p className={updatedClass}>Updated 15 juli 2025 13:32</p>
        </div>
      </div>
    </div>
  );
};
