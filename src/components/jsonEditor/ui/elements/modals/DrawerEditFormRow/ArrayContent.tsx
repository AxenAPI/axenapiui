import { FormItem as UIKitFormItem, Select as UIKitSelect, Switch } from '@axenix/ui-kit';
import { InputNumberField } from '@axenix/ui-kit/rhf';
import { FC } from 'react';

import { behaviorOptions } from '@/components/jsonEditor/constants';
import { useFormItemsHook } from '@/components/jsonEditor/hooks/useFormItemsHook';

interface ArrayContentProps {
  isSubType?: boolean;
}

export const ArrayContent: FC<ArrayContentProps> = ({ isSubType }) => {
  const { behaviorField, maximumField, minimumField, uniqueItemsField } = useFormItemsHook(isSubType);

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
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
      </div>
      <div className="grid grid-cols-2 gap-4">
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

        {/* Deprecated */}
        <UIKitFormItem label="Deprecated">
          <Switch {...uniqueItemsField} />
        </UIKitFormItem>
      </div>
    </>
  );
};
