import { FormItem as UIKitFormItem, Switch } from '@axenix/ui-kit';
import { InputNumberField } from '@axenix/ui-kit/rhf';
import { FC } from 'react';

import { useFormItemsHook } from '@/components/jsonEditor/hooks/useFormItemsHook';

interface ObjectContentProps {
  isSubType?: boolean;
}

export const ObjectContent: FC<ObjectContentProps> = ({ isSubType }) => {
  const { allowAdditionalPropertiesField, arrayName, deprecatedField } = useFormItemsHook(isSubType);
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* minProperties */}
      <InputNumberField
        fieldName={`${arrayName}minProperties`}
        label="minProperties"
        type="number"
        className="min-w-[100%] [&>div]:rounded-[3px]"
        style={{ borderRadius: '3px' }}
        placeholder=">=0"
      />

      {/* maxProperties */}
      <InputNumberField
        fieldName={`${arrayName}maxProperties`}
        label="maxProperties"
        type="number"
        className="min-w-[100%] [&>div]:rounded-[3px]"
        style={{ borderRadius: '3px' }}
        placeholder=">=0"
      />

      {/* Allow Additional Properties */}
      <UIKitFormItem label="Allow Additional Properties">
        <Switch {...allowAdditionalPropertiesField} />
      </UIKitFormItem>

      {/* Deprecated */}
      <UIKitFormItem label="Deprecated">
        <Switch {...deprecatedField} />
      </UIKitFormItem>
    </div>
  );
};
