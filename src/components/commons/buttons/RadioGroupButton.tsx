import { FC, useId, useState } from 'react';
import { Icon } from 'tabler-icons-react';

import { EMPTY_CHAR } from '@/constants/common';

export type RadioOption = {
  value: string;
  label?: string;
  icon?: Icon;
  isDisabled?: boolean;
};

interface RadioButtonGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const RadioButtonGroup: FC<RadioButtonGroupProps> = ({
  className = EMPTY_CHAR,
  defaultValue = EMPTY_CHAR,
  onChange,
  options,
  value,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const groupId = useId(); // Добавляем уникальные ключи, чтобы 2 компонента с одинаковыми опциями не конфликтовали

  const currentValue = value !== undefined ? value : selectedValue;

  const handleChange = (val: string) => {
    if (value === undefined) {
      // Если компонент не контролируется — обновляем внутренний стейт
      setSelectedValue(val);
    }
    onChange?.(val);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map(option => {
        const inputId = `${groupId}-${option.value}`;
        const TablerIcon = option.icon;

        return (
          <div key={option.value} className="relative">
            <input
              id={inputId}
              name={groupId} // Группируем по уникальному айди
              type="radio"
              disabled={option?.isDisabled ?? false}
              value={option.value}
              checked={currentValue === option.value}
              onChange={() => !option?.isDisabled && handleChange(option.value)}
              className="sr-only"
            />
            <label
              htmlFor={inputId}
              className={`flex h-[32px] items-center justify-center rounded-[2px] border border-gray-300 px-4 py-2 transition-all duration-200 ${
                option?.isDisabled
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400 opacity-60'
                  : `cursor-pointer ${
                      currentValue === option.value
                        ? 'text-[#F37022]'
                        : 'bg-transparent hover:border-[#F37022] hover:text-[#F37022]'
                    }`
              }`}
              style={!option?.isDisabled && currentValue === option.value ? { borderColor: '#F37022' } : {}}
            >
              {option.label ? <span className="text-center">{option.label}</span> : TablerIcon && <TablerIcon />}
            </label>
          </div>
        );
      })}
    </div>
  );
};
