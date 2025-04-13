import {FC, useState} from 'react';
import {Icon} from 'tabler-icons-react';

import {EMPTY_CHAR} from '@/constants/common';

type RadioOption = {
  value: string;
  label?: string;
  icon?: Icon;
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
        const inputId = `${option.value}`;
        const TablerIcon = option.icon;

        return (
          <div key={option.value} className="relative">
            <input
              id={inputId}
              type="radio"
              value={option.value}
              checked={currentValue === option.value}
              onChange={() => handleChange(option.value)}
              className="sr-only"
            />
            <label
              htmlFor={inputId}
              className={`flex h-[32px] cursor-pointer items-center justify-center rounded-[2px] border border-gray-300 px-4 py-2 transition-all duration-200 ${
                currentValue === option.value
                  ? 'text-[#F37022]'
                  : 'bg-transparent hover:border-[#F37022] hover:text-[#F37022]'
              } `}
              style={currentValue === option.value ? {borderColor: '#F37022'} : {}}
            >
              {option.label ? <span className="text-center">{option.label}</span> : <TablerIcon />}
            </label>
          </div>
        );
      })}
    </div>
  );
};
