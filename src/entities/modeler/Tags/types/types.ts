export interface ViewModeProps {
  /** Текущие теги сущности */
  tags: string[];
  /** Перейти в режим редактирования */
  onStartEdit: () => void;
}

export interface EditModeProps {
  /** Текущие теги сущности */
  tags: string[];
  /** Справочник тегов для autocomplete */
  availableTags: string[];
  /** Изменить теги сущности */
  onChange: (tags: string[]) => void;
  /** Создать новый тег в справочнике (опционально) */
  onCreateNew?: (tag: string) => void;
  /** Закрыть режим редактирования */
  onClose: () => void;
}
