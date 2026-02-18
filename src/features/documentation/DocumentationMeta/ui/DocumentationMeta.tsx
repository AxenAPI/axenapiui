import { Button, Dropdown } from '@axenix/ui-kit';
import { Plus, UserCircle } from 'tabler-icons-react';

import { useDocumentationMeta } from '../hooks/useDocumentationMeta';

export const DocumentationMeta = () => {
  const {
    authorClass,
    authorTextClass,
    handleChange,
    handleEdit,
    handleKeyDown,
    handleSave,
    isEditing,
    linkedNodeElements,
    metaContainerClass,
    metaInfoClass,
    newTitle,
    renderDropdownMenu,
    title,
    titleClass,
    updatedClass,
  } = useDocumentationMeta();

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
                  onBlur={handleSave}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={titleClass}
                />
                <button onClick={handleSave}>Save</button>
              </div>
            ) : (
              <button className={titleClass} onClick={handleEdit} type="button">
                {title}
              </button>
            )}
          </div>
          {/* FIX: нужна дата */}
          <p className={updatedClass}>Updated 15 juli 2025 13:32</p>
          <div className="flex flex-wrap gap-1">
            {linkedNodeElements}
            <Dropdown isArrow isAutoAdjustOverflow dropdownRender={renderDropdownMenu} placement="bottomLeft">
              <Button>
                <Plus size={16} /> Link object
              </Button>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};
