import { Checkbox } from '@axenix/ui-kit';
import { FC, memo, useCallback } from 'react';

import { TreeItemOptions } from '../../type';
import { useTreeItem } from '../hooks/useTreeItem';

interface ITreeItemProps {
  pageId: string;
  parentId?: string;
  options?: TreeItemOptions;
}

// Дефолтные опции: add/delete включены, selection выключен
const defaultOptions: TreeItemOptions = {
  actions: {
    add: true,
    delete: true,
  },
  selectionMode: { enabled: false },
};

export const TreeItem: FC<ITreeItemProps> = memo(({ options = defaultOptions, pageId, parentId }) => {
  const { childrenIds, handleAdd, handleClick, handleRemove, handleToggle, info, isExpanded, isFolder } = useTreeItem(
    pageId,
    parentId
  );

  const { onTitleClick, selectionMode } = options;

  // Обработчик клика на заголовок — вызывает кастомный callback или стандартный handleClick
  const handleTitleClick = useCallback(() => {
    if (!info) return;
    if (onTitleClick) {
      onTitleClick(info);
    } else {
      handleClick();
    }
  }, [info, onTitleClick, handleClick]);

  // Обработчик изменения чекбокса
  const handleSelectionChange = useCallback(() => {
    if (selectionMode.enabled) {
      selectionMode.onToggle(pageId);
    }
  }, [selectionMode, pageId]);

  // Проверка выбран ли элемент
  const isSelected = selectionMode.enabled && selectionMode.selectedIds.has(pageId);

  if (!info) return null;

  return (
    <div className="w-full">
      <div
        className="group flex cursor-pointer items-center rounded-lg px-3 py-2 transition-colors select-none hover:bg-[#F0F0F0]"
        onClick={handleTitleClick}
      >
        {isFolder && (
          <span className="mr-2 transform transition-transform" onClick={handleToggle}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}

        <span className="flex-1 truncate">{info.title}</span>

        {/* Чекбокс выбора — всегда видим в режиме selection */}
        {selectionMode.enabled && (
          <Checkbox
            name="select-item"
            isChecked={isSelected}
            onChange={handleSelectionChange}
            onClick={e => e.stopPropagation()}
          />
        )}

        {/* Кнопки add/delete — видны только при hover */}
        <div className="ml-2 flex opacity-0 transition-opacity group-hover:opacity-100">
          {options.actions.add && (
            <button
              onClick={handleAdd}
              className="flex h-5 w-5 items-center justify-center rounded text-sm font-bold text-black hover:bg-gray-200"
              title="Добавить"
            >
              +
            </button>
          )}
          {options.actions.delete && (
            <button
              onClick={handleRemove}
              className="flex h-5 w-5 items-center justify-center rounded text-sm font-bold text-black hover:bg-gray-200"
              title="Удалить"
            >
              −
            </button>
          )}
        </div>
      </div>

      {isFolder && isExpanded && (
        <div className="ml-2">
          {(childrenIds || []).map(childId => (
            <TreeItem key={childId} pageId={childId} parentId={info.id} options={options} />
          ))}
        </div>
      )}
    </div>
  );
});
