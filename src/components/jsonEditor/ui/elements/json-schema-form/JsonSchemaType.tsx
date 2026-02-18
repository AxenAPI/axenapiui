import { Button, Menu, Popover, Text } from '@axenix/ui-kit';
import { useUnit } from 'effector-react';
import { useCallback, useMemo, useState } from 'react';

import { TYPE_OPTIONS } from '@/components/jsonEditor/constants';
import { IS_READ_ONLY } from '@/constants/common';
import {
  getColorByType,
  getDeepUpdatedSchema,
  getInitialSchemaByType,
  getSchemaType,
  getTypeColor,
} from '@/helpers/json-editor';
import { $eventGraph } from '@/models/EventGraphModel';
import { selectMenuItem } from '@/models/JsonEditorModel';
import { TSchema, TSchemaObjectType } from '@/types/common';

interface IJsonSchemaTypeProps {
  jsonSchema: TSchema;
  mainSchema: TSchema;
  parentPath?: string;
  propertyKey?: string;
  onUpdateJsonSchema: (jsonSchema: TSchema) => void;
}

export const JsonSchemaType = ({
  jsonSchema,
  mainSchema,
  onUpdateJsonSchema,
  parentPath,
  propertyKey,
}: IJsonSchemaTypeProps) => {
  const eventGraph = useUnit($eventGraph);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const targetSchema = jsonSchema;
  const type = getSchemaType(targetSchema);
  const isNotRefTargetSchema = TYPE_OPTIONS.includes(type as TSchemaObjectType);

  const handleTypeChange = useCallback(
    (selectedType: TSchemaObjectType) => {
      if (IS_READ_ONLY) return;

      const newSchema = getInitialSchemaByType(selectedType);

      if (!parentPath || !propertyKey) {
        onUpdateJsonSchema(newSchema);
        return;
      }

      const updatedSchema = getDeepUpdatedSchema(mainSchema, parentPath, element => ({
        ...element,
        [propertyKey]: newSchema,
      }));

      onUpdateJsonSchema(updatedSchema);
      setPopoverOpen(false);
    },
    [mainSchema, parentPath, propertyKey, onUpdateJsonSchema]
  );

  const handleRefClick = useCallback(() => {
    if (IS_READ_ONLY) return;
    if (!isNotRefTargetSchema) {
      const selectedEventData = eventGraph?.events?.find(el => el?.name === type);
      if (selectedEventData) {
        selectMenuItem(selectedEventData);
      }
    }
  }, [isNotRefTargetSchema, eventGraph, type]);

  const popoverItems = useMemo(
    () =>
      TYPE_OPTIONS.map(typeEl => ({
        key: typeEl,
        label: <span style={{ color: getColorByType(typeEl) }}>{typeEl}</span>,
        onClick: () => handleTypeChange(typeEl),
      })),
    [handleTypeChange]
  );

  if (!isNotRefTargetSchema) {
    return (
      <Button type="link" onClick={handleRefClick}>
        {type}
      </Button>
    );
  }

  return (
    <Popover
      isOpen={popoverOpen}
      onOpenChange={setPopoverOpen}
      maxWidth={265}
      minWidth={265}
      content={!IS_READ_ONLY && <Menu items={popoverItems} style={{ maxWidth: '100%', borderRight: 'none' }} />}
      placement="right"
      trigger="click"
    >
      <Text style={{ color: getTypeColor(targetSchema) }}>{type}</Text>
    </Popover>
  );
};
