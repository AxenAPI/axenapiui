import { FormItem as UIKitFormItem, Select as UIKitSelect, Switch } from '@axenix/ui-kit';
import { FC } from 'react';

import { behaviorOptions, defaultBooleanOptions } from '@/components/jsonEditor/constants';
import { useFormItemsHook } from '@/components/jsonEditor/hooks/useFormItemsHook';

interface BooleanContentProps {
  isSubType?: boolean;
}

export const BooleanContent: FC<BooleanContentProps> = ({ isSubType }) => {
  const { behaviorField, defaultBooleanField, deprecatedField } = useFormItemsHook(isSubType);

  return (
    <div className="grid grid-cols-2 gap-4">
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
      <UIKitFormItem label="Default">
        <UIKitSelect
          {...defaultBooleanField}
          className="min-w-[100%] [&>div]:rounded-[3px]"
          dropdownStyle={{ borderRadius: '3px' }}
          style={{ borderRadius: '3px' }}
          placeholder="Выберите значение"
          // @ts-expect-error Type mismatch between `field` and `options`
          options={defaultBooleanOptions}
        />
      </UIKitFormItem>

      {/* Deprecated */}
      <UIKitFormItem label="Deprecated">
        <Switch {...deprecatedField} />
      </UIKitFormItem>
    </div>
  );
};
