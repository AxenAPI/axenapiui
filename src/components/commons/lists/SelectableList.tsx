import {FC, useState} from 'react';

type SelectableItem = {
  id: string;
  label: string;
};

interface SelectableListProps {
  items: SelectableItem[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export const SelectableList: FC<SelectableListProps> = ({items, onSelectionChange}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(items.map(item => item.id));

  const handleToggle = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter(itemId => itemId !== id)
      : [...selectedIds, id];

    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const handleToggleAll = (isSelected: boolean) => {
    const newSelectedIds = isSelected ? items.map(item => item.id) : [];
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  return (
    <div>
      <button
        type="button"
        className="mb-3 flex w-full items-center border-b border-gray-200 py-2 text-left"
        onClick={() => handleToggleAll(selectedIds.length !== items.length)}
      >
        <div className="relative">
          <input
            type="checkbox"
            checked={selectedIds.length === items.length}
            readOnly
            className="absolute h-4 w-4 opacity-0"
            aria-label="Select all"
          />
          <div
            className={`flex h-4 w-4 items-center justify-center rounded border ${selectedIds.length === items.length ? 'border-[#F37022] bg-[#F37022]' : 'border-gray-300'}`}
          >
            {selectedIds.length === items.length && (
              <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
        <span className="ml-2 font-medium">Select All</span>
      </button>

      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center">
            <button
              type="button"
              className="flex w-full items-center rounded py-2 text-left hover:bg-gray-50"
              onClick={() => handleToggle(item.id)}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  checked={selectedIds.includes(item.id)}
                  readOnly
                  className="absolute h-4 w-4 opacity-0"
                  aria-labelledby={`label-${item.id}`}
                />
                <div
                  className={`mr-3 flex h-4 w-4 items-center justify-center rounded border ${selectedIds.includes(item.id) ? 'border-[#F37022] bg-[#F37022]' : 'border-gray-300'}`}
                >
                  {selectedIds.includes(item.id) && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span id={`label-${item.id}`}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
