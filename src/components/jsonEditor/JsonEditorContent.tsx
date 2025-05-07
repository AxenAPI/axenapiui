import {Button, Menu, Row, Tag, Text, MultipleSelect as UIKitMultipleSelect} from '@axenix/ui-kit';
import {useUnit} from 'effector-react';
import React, {FC, useEffect, useState} from 'react';
import {Code, List, Plus, X} from 'tabler-icons-react';

import {JsonDataExampleContent} from '@/components/jsonEditor/JsonDataExampleContent';
import {JsonSchemaContent} from '@/components/jsonEditor/JsonSchemaContent';
import {DrawerGenerateFromJson} from '@/components/jsonEditor/modals/DrawerGenerateFromJson';
import {openDrawerGenerateFromJson} from '@/components/jsonEditor/model/generateFromJson/GenerateFromJsonModel';
import {StatusBar} from '@/components/jsonEditor/StatusBar';
import {EMPTY_CHAR} from '@/constants/common';
import {SimpleValues} from '@/helpers/SimpleValues';
import {useJsonEditorNotification} from '@/hooks/useJsonEditorNotification';
import {$eventGraph, addTag, addTagToEvent, editEvent} from '@/models/EventGraphModel';
import {$selectedMenuItem, fetchJsonDataExapmleFx} from '@/models/JsonEditorModel';

/**
 * Компонент контента для эвентов.
 */
export const JsonEditorContent: FC = () => {
  const currentEvent = useUnit($selectedMenuItem);
  const eventGraph = useUnit($eventGraph);
  // Отобранный эвент из графа на основе выбранного эвента.
  const selectedEventData = eventGraph?.events?.find(el => el?.id === currentEvent?.id);

  const tagOptions = eventGraph && eventGraph.tags ? new SimpleValues(...eventGraph.tags) : [];
  // Отфильтрованные теги для отображения в выпадающем списке
  const filteredTagOptions = tagOptions?.filter(el => !selectedEventData?.tags?.includes(el.label));

  const {contextHandler: jsonEditorNotificationContextHandler} = useJsonEditorNotification();
  const [schema, setSchema] = useState<string>(selectedEventData?.schema);
  const [isEditorChosen, setIsEditorChosen] = useState<boolean>(true);
  const [isDataExampleChosen, setIsDataExampleChosen] = useState<boolean>(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState<boolean>(false);

  const [example, setExample] = useState<string>('');

  useEffect(() => {
    if (!schema) return setExample(EMPTY_CHAR);

    fetchJsonDataExapmleFx({jsonSchema: schema}).then(result =>
      setExample(JSON.stringify(JSON.parse(result.data.jsonExample), null, 2))
    );
  }, [schema]);

  // Проверка наличия элемента с соответствующим id
  const eventDataHasSelected = eventGraph?.events?.some(event => event?.id === selectedEventData?.id);

  const handleSchemaChange = (value: string | undefined) => {
    setSchema(value);
  };

  const handleSaveSchema = () => {
    editEvent({id: selectedEventData?.id, updates: {schema}});
  };

  const handleOpenGenerateFromJson = () => {
    openDrawerGenerateFromJson();
  };

  useEffect(() => {
    setSchema(selectedEventData?.schema);
  }, [selectedEventData]);

  return (
    eventDataHasSelected && (
      <React.Fragment>
        {jsonEditorNotificationContextHandler}
        <div
          data-testid="json-editor-content"
          className="scrollbar flex h-full w-full flex-col gap-8 overflow-y-scroll scroll-auto px-10 pb-10"
        >
          <div className="flex min-h-[160px] w-full justify-between pt-10">
            <div className="flex h-full flex-col items-start justify-between">
              <Text style={{fontSize: '24px'}} isStrong>
                {selectedEventData?.name}
              </Text>

              <Row className="flex cursor-pointer items-center gap-2">
                {selectedEventData?.tags?.map(tag => (
                  <Tag
                    className="mr-0"
                    icon={
                      <X
                        size={10}
                        onClick={() => {
                          editEvent({
                            id: selectedEventData?.id,
                            updates: {tags: selectedEventData?.tags.filter(el => el !== tag)},
                          });
                        }}
                      />
                    }
                  >
                    {tag}
                  </Tag>
                ))}

                {!isAddTagOpen && (
                  <div className="flex items-center" onClick={() => setIsAddTagOpen(true)}>
                    <Tag icon={<Plus size={16} />}>Add tag</Tag>
                  </div>
                )}

                {isAddTagOpen && (
                  <UIKitMultipleSelect
                    className="max-h-[32px] min-w-[302px] [&>div]:rounded-[3px]"
                    dropdownStyle={{borderRadius: '3px'}}
                    isAllowClear
                    maxTagTextLength={8}
                    maxTagCount={2}
                    mode="multiple"
                    style={{borderRadius: '3px'}}
                    options={filteredTagOptions}
                    onAddOption={addTag}
                    data-testid="add-tag-select"
                    isAddOption
                    onChange={value => {
                      addTagToEvent({id: selectedEventData?.id, newTag: value});
                      setIsAddTagOpen(false);
                    }}
                  />
                )}
              </Row>

              <Text className="text-[#A1A1A1]">
                {selectedEventData?.eventDescription ? selectedEventData?.eventDescription : 'Event description'}
              </Text>
            </div>

            <Row className="flex h-10 gap-6">
              <StatusBar />
              <Menu
                items={[
                  {
                    icon: <List />,
                    key: 'form',
                    label: 'Form',
                    onClick: () => {
                      setIsEditorChosen(false);
                    },
                  },
                  {
                    icon: <Code />,
                    key: 'code',
                    label: 'Code',
                    onClick: () => {
                      setIsEditorChosen(true);
                    },
                  },
                ]}
                mode="horizontal"
                defaultSelectedKeys={['code']}
              />
            </Row>
          </div>

          <Row className="flex items-center justify-between gap-6 border-b-1 border-[#D9D9D9] px-4">
            <Menu
              items={[
                {
                  key: 'schema',
                  label: 'Schema',
                  onClick: () => setIsDataExampleChosen(false),
                },
                {
                  key: 'example',
                  label: 'Data example',
                  onClick: () => setIsDataExampleChosen(true),
                },
              ]}
              mode="horizontal"
              defaultSelectedKeys={['schema']}
            />

            <Button type="text" onClick={handleOpenGenerateFromJson}>
              <Code size={16} />
              Generate from JSON
            </Button>
          </Row>

          {isDataExampleChosen ? (
            <JsonDataExampleContent example={example} />
          ) : (
            <JsonSchemaContent
              isEditorChosen={isEditorChosen}
              schema={schema}
              onChange={handleSchemaChange}
              onSave={handleSaveSchema}
            />
          )}
        </div>

        <DrawerGenerateFromJson setSchema={setSchema} selectedEventData={selectedEventData} />
      </React.Fragment>
    )
  );
};
