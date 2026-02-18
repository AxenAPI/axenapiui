import { DocumentationPageInfo } from '@shared/openapi';

export type TreeNode = {
  info: DocumentationPageInfo;
  childrenIds?: string[];
  isExpanded?: boolean;
  isLoading?: boolean;
  parentId?: string;
};

/**
 * Discriminated union для режима выбора элементов дерева
 * Если enabled === true, обязательны selectedIds и onToggle
 */
export type SelectionMode =
  | { enabled: false }
  | {
      enabled: true;
      selectedIds: Set<string>;
      onToggle: (id: string) => void;
    };

export interface TreeItemOptions {
  /**
   * Настройки отображения кнопок действий (add/delete)
   * По умолчанию обе кнопки отображаются
   */
  actions: {
    add: boolean;
    delete: boolean;
  };
  /**
   * Режим выбора элементов (чекбоксы)
   * По умолчанию выключен
   */
  selectionMode: SelectionMode;
  /**
   * Callback при клике на заголовок элемента
   * Если задан — вызывается вместо стандартного fileSelected
   */
  onTitleClick?: (pageInfo: DocumentationPageInfo) => void;
}

export interface IIndexDocumentTreeProps {
  treeItemOptions?: TreeItemOptions;
}
