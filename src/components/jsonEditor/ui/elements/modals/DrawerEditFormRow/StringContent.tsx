import { FormItem as UIKitFormItem, Select as UIKitSelect, Switch } from '@axenix/ui-kit';
import { InputField, InputNumberField } from '@axenix/ui-kit/rhf';
import { FC } from 'react';

import { behaviorOptions, formatStringOptions } from '@/components/jsonEditor/constants';
import { useFormItemsHook } from '@/components/jsonEditor/hooks/useFormItemsHook';

interface StringContentProps {
  isSubType?: boolean;
}

export const StringContent: FC<StringContentProps> = ({ isSubType }) => {
  const { arrayName, behaviorField, deprecatedField, formatField } = useFormItemsHook(isSubType);
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Format */}
      <UIKitFormItem label="Format">
        <UIKitSelect
          {...formatField}
          className="min-w-[100%] [&>div]:rounded-[3px]"
          dropdownStyle={{ borderRadius: '3px' }}
          style={{ borderRadius: '3px' }}
          placeholder="Выберите значение"
          options={formatStringOptions}
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
      <InputField
        fieldName={`${arrayName}default`}
        label="Default"
        className="min-w-[100%] [&>div]:rounded-[3px]"
        style={{ borderRadius: '3px' }}
        placeholder="Введите значение"
      />

      {/* Example */}
      <InputField
        fieldName={`${arrayName}example`}
        label="Example"
        className="min-w-[100%] [&>div]:rounded-[3px]"
        style={{ borderRadius: '3px' }}
        placeholder="Введите значение"
      />

      {/* Pattern (full width) */}
      <div className="col-span-2">
        <InputField
          fieldName={`${arrayName}pattern`}
          label="Pattern"
          className="min-w-[100%] [&>div]:rounded-[3px]"
          style={{ borderRadius: '3px' }}
          placeholder="^[A-Za-z0-9_-]+"
        />
      </div>

      {/* minLength */}
      <InputNumberField
        fieldName={`${arrayName}minLength`}
        label="minLength"
        type="number"
        className="min-w-[100%] [&>div]:rounded-[3px]"
        style={{ borderRadius: '3px' }}
        placeholder=">= 0"
      />

      {/* maxLength */}
      <InputNumberField
        fieldName={`${arrayName}maxLength`}
        label="maxLength"
        type="number"
        className="min-w-[100%] [&>div]:rounded-[3px]"
        style={{ borderRadius: '3px' }}
        placeholder=">= 0"
      />

      {/* Deprecated */}
      <UIKitFormItem label="Deprecated">
        <Switch {...deprecatedField} />
      </UIKitFormItem>
    </div>
  );
};
