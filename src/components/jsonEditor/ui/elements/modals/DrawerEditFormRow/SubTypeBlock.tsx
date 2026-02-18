import { Divider, Text } from '@axenix/ui-kit';
import { useUnit } from 'effector-react';
import { FC } from 'react';

import { RadioButtonGroup } from '@/components/commons/buttons/RadioGroupButton';
import { typeRadioOptions } from '@/components/jsonEditor/constants';
import { $subTypeValue, setSubTypeValue } from '@/components/jsonEditor/model/EditFormRowModel';

import { ArrayContent } from './ArrayContent';
import { BooleanContent } from './BooleanContent';
import { IntegerContent } from './IntegerContent';
import { ObjectContent } from './ObjectContent';
import { StringContent } from './StringContent';

export const SubTypeBlock: FC = () => {
  const subTypeValue = useUnit($subTypeValue);

  return (
    <>
      <Divider />
      <Text className="mb-2 text-sm font-medium text-gray-700">Subtype</Text>
      <RadioButtonGroup options={typeRadioOptions} value={subTypeValue} onChange={setSubTypeValue} className="mb-4" />
      {subTypeValue === 'string' && <StringContent isSubType />}
      {subTypeValue === 'array' && <ArrayContent isSubType />}
      {subTypeValue === 'boolean' && <BooleanContent isSubType />}
      {subTypeValue === 'object' && <ObjectContent isSubType />}
      {(subTypeValue === 'integer' || subTypeValue === 'number') && <IntegerContent isSubType />}
    </>
  );
};
