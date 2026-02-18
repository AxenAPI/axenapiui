import { MultipleSelect as UIKitMultipleSelect } from '@axenix/ui-kit';
import { FC, useMemo } from 'react';

/** Режим редактирования тегов */
export const TagsEdit: FC<{
  /** Текущие теги сущности */
  tags: string[];
  /** Справочник тегов для autocomplete */
  availableTags: string[];
  /** Изменить теги сущности */
  onChange: (tags: string[]) => void;
  /** Создать новый тег в справочнике (опционально) */
  onCreateNew?: (tag: string) => void;
}> = ({ availableTags, onChange, onCreateNew, tags }) => {
  // Опции для выпадающего списка
  const options = useMemo(() => availableTags?.map(value => ({ label: value, value })) ?? [], [availableTags]);

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <UIKitMultipleSelect
        className="max-h-[32px] min-w-[302px] [&>div]:rounded-[3px]"
        dropdownStyle={{ borderRadius: '3px' }}
        isAllowClear
        maxTagTextLength={8}
        maxTagCount={2}
        mode="multiple"
        style={{ borderRadius: '3px' }}
        options={options}
        value={tags}
        onAddOption={onCreateNew}
        isAddOption={Boolean(onCreateNew)}
        onChange={onChange}
      />
    </div>
  );
};
