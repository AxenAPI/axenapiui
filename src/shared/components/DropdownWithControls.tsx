import { DownOutlined, UpOutlined } from '@ant-design/icons'; // используем иконки из ant-design (или замените на свои)
import { Button, Divider, Dropdown } from '@axenix/ui-kit';
import { FC, ReactNode, useMemo, useState } from 'react';
import { Plus } from 'tabler-icons-react';

type TOption = {
  label: string;
  value: string;
};

interface DropdownWithControlsProps {
  options: TOption[];
  value?: string;
  placeholder?: string;
  buttonPlacehoder: string;
  onChange: (value: string) => void;
  onCreateClick: () => void;
  emptyText?: string;
}

type MenuItem = {
  key: string;
  label: ReactNode;
  disabled?: boolean;
};

export const DropdownWithControls: FC<DropdownWithControlsProps> = ({
  buttonPlacehoder,
  emptyText,
  onChange,
  onCreateClick,
  options,
  placeholder = 'Выберите значение',
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = useMemo(() => {
    const items: MenuItem[] = options.map(opt => ({
      key: opt.value,
      label: opt.label,
    }));

    if (items.length === 0) {
      items.push({
        key: '__emptyEvents',
        label: <span className="text-[#A6A6A6]">{emptyText}</span>,
      });
    }

    items.push(
      {
        key: '__divider__',
        label: <Divider className="m-0 p-0" />,
      },
      {
        key: '__create_event__',
        disabled: true,
        label: (
          <Button
            iconPosition="start"
            icon={<Plus size={16} className="flex items-center" />}
            type="primary"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onCreateClick();
              setIsOpen(false);
            }}
          >
            {buttonPlacehoder}
          </Button>
        ),
      }
    );

    return items;
  }, [options, onCreateClick, buttonPlacehoder, emptyText]);

  const selectedLabel = useMemo(() => {
    const selected = options.find(opt => opt.value === value);
    return selected?.label || placeholder;
  }, [value, options, placeholder]);

  return (
    <div className="mt-3 w-full">
      <Dropdown
        isOpen={isOpen}
        onOpenChange={open => setIsOpen(open)}
        trigger={['click']}
        menu={{
          items: menuItems,
          onClick: ({ key }) => {
            // Игнорируем технические ключи
            if (key === '__create_event__' || key === '__divider__' || key === '__emptyEvents') {
              return;
            }

            onChange(key);
            setIsOpen(false);
          },
        }}
      >
        <Button type="default" className="w-[420px]">
          <div className="flex w-[380px] justify-between align-middle">
            <span>{selectedLabel}</span>
            {isOpen ? <UpOutlined /> : <DownOutlined />}
          </div>
        </Button>
      </Dropdown>
    </div>
  );
};
