import { useUnit } from 'effector-react';
import { useEffect, useState } from 'react';

import { openDrawerGenerateFromJson } from '@/components/jsonEditor/model/GenerateFromJsonModel';
import { EMPTY_CHAR } from '@/constants/common';
import { createSimpleOptions } from '@/helpers/SimpleValues';
import { useJsonEditorNotification } from '@/hooks/useJsonEditorNotification';
import { $eventGraph, addTag, addTagToEvent, editEvent, triggerDebounceEdit } from '@/models/EventGraphModel';
import { $selectedMenuItem, fetchJsonDataExapmleFx } from '@/models/JsonEditorModel';

export const useJsonEditor = () => {
  const { currentEvent, eventGraph } = useUnit({
    currentEvent: $selectedMenuItem,
    eventGraph: $eventGraph,
  });
  const { contextHandler: jsonEditorNotificationContextHandler } = useJsonEditorNotification();
  const [schema, setSchema] = useState<string>('');
  const [isEditorChosen, setIsEditorChosen] = useState<boolean>(true);
  const [isDataExampleChosen, setIsDataExampleChosen] = useState<boolean>(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState<boolean>(false);
  const [example, setExample] = useState<string>('');

  const selectedEventData = eventGraph.events.find(el => el?.id === currentEvent?.id);

  useEffect(() => {
    if (selectedEventData?.schema) {
      setSchema(selectedEventData.schema);
    }
  }, [selectedEventData]);

  useEffect(() => {
    if (!schema) {
      setExample(EMPTY_CHAR);
      return;
    }

    fetchJsonDataExapmleFx({ jsonSchema: schema }).then(result => {
      if (result.jsonExample) {
        setExample(JSON.stringify(JSON.parse(result.jsonExample), null, 2));
      }
    });
  }, [schema]);

  const tagOptions = eventGraph && eventGraph.tags ? createSimpleOptions(...eventGraph.tags) : [];
  const filteredTagOptions = tagOptions?.filter(el => !selectedEventData?.tags?.includes(el.label));

  const handleSchemaChange = (value: string | undefined) => {
    if (!value || !selectedEventData) return;
    triggerDebounceEdit({ id: selectedEventData.id, updates: { schema: value } });
    setSchema(value);
  };

  const handleOpenGenerateFromJson = () => {
    openDrawerGenerateFromJson();
  };

  const handleAddTag = (newTags: string[]) => {
    if (!selectedEventData) return;

    const oldTags = selectedEventData.tags || [];
    // Находим новый тег, которого не было в старом списке
    const newTag = newTags.find(tag => !oldTags.includes(tag));

    if (newTag) {
      addTagToEvent({ id: selectedEventData.id, newTag });
    }
    setIsAddTagOpen(false);
  };

  const handleRemoveTag = (tag: string) => {
    if (!selectedEventData) return;
    editEvent({
      id: selectedEventData.id,
      updates: { tags: selectedEventData.tags?.filter(el => el !== tag) },
    });
  };

  return {
    jsonEditorNotificationContextHandler,
    schema,
    isEditorChosen,
    setIsEditorChosen,
    isDataExampleChosen,
    setIsDataExampleChosen,
    isAddTagOpen,
    setIsAddTagOpen,
    example,
    selectedEventData,
    filteredTagOptions,
    handleSchemaChange,
    handleOpenGenerateFromJson,
    handleAddTag,
    handleRemoveTag,
    addTag,
    setSchema,
  };
};
