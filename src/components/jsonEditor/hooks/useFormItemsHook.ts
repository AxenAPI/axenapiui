import { useController, useFormContext } from 'react-hook-form';

export const useFormItemsHook = (isSubType?: boolean) => {
  const methods = useFormContext();
  const { control } = methods;

  const arrayName = isSubType ? 'items.' : '';

  const { field: behaviorField } = useController({
    control,
    name: `${arrayName}behavior`,
  });

  const { field: deprecatedField } = useController({
    control,
    name: `${arrayName}deprecated`,
  });

  const { field: uniqueItemsField } = useController({
    control,
    name: `${arrayName}uniquieItems`,
  });

  const { field: formatField } = useController({
    control,
    name: `${arrayName}format`,
  });

  const { field: exclusiveMinField } = useController({
    control,
    name: `${arrayName}exclusiveMin`,
  });

  const { field: exclusiveMaxField } = useController({
    control,
    name: `${arrayName}exclusiveMax`,
  });

  const { field: allowAdditionalPropertiesField } = useController({
    control,
    name: `${arrayName}allowAdditionalProperties`,
  });

  const { field: defaultBooleanField } = useController({
    control,
    name: `${arrayName}default`,
  });
  const minimumField = `${arrayName}minimum`;
  const maximumField = `${arrayName}maximum`;

  return {
    uniqueItemsField,
    behaviorField,
    deprecatedField,
    formatField,
    exclusiveMaxField,
    exclusiveMinField,
    minimumField,
    maximumField,
    allowAdditionalPropertiesField,
    defaultBooleanField,
    arrayName,
  };
};
