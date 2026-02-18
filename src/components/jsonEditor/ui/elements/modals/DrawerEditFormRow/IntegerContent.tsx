import { FormItem as UIKitFormItem, Select as UIKitSelect, Switch } from '@axenix/ui-kit';
import { InputNumberField } from '@axenix/ui-kit/rhf';
import { useUnit } from 'effector-react';
import { FC } from 'react';

import { behaviorOptions, formatIntegerOptions, formatNumberOptions } from '@/components/jsonEditor/constants';
import { useFormItemsHook } from '@/components/jsonEditor/hooks/useFormItemsHook';
import { $drawerData } from '@/components/jsonEditor/model/EditFormRowModel';

interface IntegerContentProps {
  isSubType?: boolean;
}

export const IntegerContent: FC<IntegerContentProps> = ({ isSubType }) => {
  const {
    arrayName,
    behaviorField,
    deprecatedField,
    exclusiveMaxField,
    exclusiveMinField,
    formatField,
    maximumField,
    minimumField,
  } = useFormItemsHook(isSubType);
  const { type } = useUnit($drawerData);
  const formatOptions = type === 'integer' ? formatIntegerOptions : formatNumberOptions;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {/* Format */}
        <UIKitFormItem label="Format">
          <UIKitSelect
            {...formatField}
            className="min-w-[100%] [&>div]:rounded-[3px]"
            dropdownStyle={{ borderRadius: '3px' }}
            style={{ borderRadius: '3px' }}
            placeholder="Выберите значение"
            options={formatOptions}
          />
        </UIKitFormItem>

        {/* Behavior */}
        <UIKitFormItem label="Behavior">
          <UIKitSelect
            {...behaviorField}
            className="min-w-[100%] [&>div]:rounded-[3px]"
            dropdownStyle={{ borderRadius: '3px' }}
            style={{ borderRadius: '3px' }}
            placeholder="Выберите значение"
            defaultValue={behaviorOptions[0].label}
            options={behaviorOptions}
          />
        </UIKitFormItem>

        {/* Default */}
        <InputNumberField
          fieldName={`${arrayName}default`}
          label="Default"
          type="number"
          className="min-w-[100%] [&>div]:rounded-[3px]"
          style={{ borderRadius: '3px' }}
          placeholder="Введите значение"
        />

        {/* Example */}
        <InputNumberField
          fieldName={`${arrayName}example`}
          label="Example"
          type="number"
          className="min-w-[100%] [&>div]:rounded-[3px]"
          style={{ borderRadius: '3px' }}
          placeholder="Введите значение"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {/* Minimum */}
        <InputNumberField
          fieldName={minimumField}
          label="Minimum"
          type="number"
          className="min-w-[100%] [&>div]:rounded-[3px]"
          style={{ borderRadius: '3px' }}
          placeholder=">= 0"
        />

        {/* Maximum */}
        <InputNumberField
          fieldName={maximumField}
          label="Maximum"
          type="number"
          className="min-w-[100%] [&>div]:rounded-[3px]"
          style={{ borderRadius: '3px' }}
          placeholder=">= 0"
        />

        {/* MultipleOf */}
        <InputNumberField
          fieldName={`${arrayName}multipleOf`}
          label="MultipleOf"
          type="number"
          className="min-w-[100%] [&>div]:rounded-[3px]"
          style={{ borderRadius: '3px' }}
          placeholder=">= 0"
        />

        {/* ExclusiveMin */}
        <UIKitFormItem label="ExclusiveMin">
          <Switch {...exclusiveMinField} />
        </UIKitFormItem>

        {/* ExclusiveMax */}
        <UIKitFormItem label="ExclusiveMax">
          <Switch {...exclusiveMaxField} />
        </UIKitFormItem>

        {/* Deprecated */}
        <UIKitFormItem label="Deprecated">
          <Switch {...deprecatedField} />
        </UIKitFormItem>
      </div>
    </>
  );
};
