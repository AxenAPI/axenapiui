import { Button as UIKitButton, Drawer as UIKitDrawer, Form as UIKitForm } from '@axenix/ui-kit';
import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { $drawerData, $isDrawerOpen, toggleDrawer } from '@/components/jsonEditor/model/EditFormRowModel';

import { ArrayComponent } from './ArrayComponent';
import { BooleanContent } from './BooleanContent';
import { IntegerContent } from './IntegerContent';
import { ObjectContent } from './ObjectContent';
import { StringContent } from './StringContent';

export const DrawerEditFormRow: FC = () => {
  // TODO: Все InputNumber и InputNumberField не принимают значение больше 999, если поставлен проп
  // type="number". Без этого пропа можно вводить любые значения и строки в том числе.
  const { isOpen } = useUnit($isDrawerOpen);
  const { exclusiveMaximum, exclusiveMinimum, onSave, property, readOnly, type, writeOnly, ...rest } =
    useUnit($drawerData);

  const behavior = (readOnly && 'readOnly') || (writeOnly && 'writeOnly') || undefined;

  const methods = useForm<Record<string, unknown>>({
    defaultValues: {
      type,
      ...rest,
      behavior,
      exclusiveMin: !!exclusiveMinimum,
      exclusiveMax: !!exclusiveMaximum,
      ...(exclusiveMinimum ? { minimum: exclusiveMinimum } : {}),
      ...(exclusiveMinimum ? { maximum: exclusiveMaximum } : {}),
    },
  });

  const { handleSubmit } = methods;

  const handleClose = () => {
    toggleDrawer();
  };

  const handleSave = () => {
    const values = methods.getValues();
    if (onSave) {
      onSave({ ...values });
    }
    toggleDrawer();
  };

  // При открытии обновляем данные формы
  useEffect(() => {
    if (isOpen) {
      methods.reset({
        type,
        ...rest,
        behavior,
        exclusiveMin: !!exclusiveMinimum,
        exclusiveMax: !!exclusiveMaximum,
        ...(exclusiveMinimum ? { minimum: exclusiveMinimum } : {}),
        ...(exclusiveMaximum ? { maximum: exclusiveMaximum } : {}),
      });
    }
  }, [isOpen, type, rest, behavior, exclusiveMinimum, exclusiveMaximum, methods]);

  return (
    isOpen && (
      <UIKitDrawer
        width={500}
        isResizable
        isDestroyOnClose
        isOpen
        onClose={handleClose}
        placement="right"
        title={property}
        customFooter={
          <div className="flex h-[100%] flex-row gap-2 py-2.5">
            <UIKitButton type="primary" onClick={handleSubmit(handleSave)} style={{ borderRadius: '3px' }}>
              Save
            </UIKitButton>
            <UIKitButton type="default" onClick={handleClose} style={{ borderRadius: '3px' }}>
              Cancel
            </UIKitButton>
          </div>
        }
      >
        <FormProvider {...methods}>
          <UIKitForm name="wrap" labelAlign="left" labelWrap colon layout="vertical">
            {type === 'string' && <StringContent />}
            {type === 'array' && <ArrayComponent />}
            {type === 'boolean' && <BooleanContent />}
            {type === 'object' && <ObjectContent />}
            {/* {(type as string) === 'dictionary' && <SubTypeBlock />} */}
            {(type === 'integer' || type === 'number') && <IntegerContent />}
          </UIKitForm>
        </FormProvider>
      </UIKitDrawer>
    )
  );
};
