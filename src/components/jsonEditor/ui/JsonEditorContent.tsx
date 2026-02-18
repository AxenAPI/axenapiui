import { Button, Menu, MultipleSelect as UIKitMultipleSelect, Row, Tag, Text } from '@axenix/ui-kit';
import { FC } from 'react';
import { Code, List, Plus, X } from 'tabler-icons-react';

import { useJsonEditor } from '@/components/jsonEditor/hooks/useJsonEditor';
import { DrawerGenerateFromJson } from '@/components/jsonEditor/ui/elements/modals/DrawerGenerateFromJson';
import { JsonDataExampleContent } from '@/components/jsonEditor/ui/JsonDataExampleContent';
import { JsonSchemaContent } from '@/components/jsonEditor/ui/JsonSchemaContent';
import { StatusBar } from '@/components/jsonEditor/ui/StatusBar';
import { IS_READ_ONLY } from '@/constants/common';

/**
 * Компонент контента для эвентов.
 */
export const JsonEditorContent: FC = () => {
  const {
    addTag,
    example,
    filteredTagOptions,
    handleAddTag,
    handleOpenGenerateFromJson,
    handleRemoveTag,
    handleSchemaChange,
    isAddTagOpen,
    isDataExampleChosen,
    isEditorChosen,
    jsonEditorNotificationContextHandler,
    schema,
    selectedEventData,
    setIsAddTagOpen,
    setIsDataExampleChosen,
    setIsEditorChosen,
    setSchema,
  } = useJsonEditor();

  if (!selectedEventData) {
    return null;
  }

  return (
    <>
      {jsonEditorNotificationContextHandler}
      <div
        data-testid="json-editor-content"
        className="scrollbar flex h-full w-full flex-col gap-8 overflow-y-scroll scroll-auto px-10 pb-10"
      >
        <div className="flex min-h-[160px] w-full justify-between pt-10">
          <div className="flex h-full flex-col items-start justify-between">
            <Text style={{ fontSize: '24px' }} isStrong>
              {selectedEventData.name}
            </Text>

            <Row className="flex cursor-pointer items-center gap-2">
              {selectedEventData.tags?.map(tag => (
                <Tag
                  key={tag}
                  className="mr-0"
                  icon={!IS_READ_ONLY && <X size={10} onClick={() => handleRemoveTag(tag)} />}
                >
                  {tag}
                </Tag>
              ))}

              {!isAddTagOpen && !IS_READ_ONLY && (
                <div className="flex items-center" onClick={() => setIsAddTagOpen(true)}>
                  <Tag icon={<Plus size={16} />}>Add tag</Tag>
                </div>
              )}

              {isAddTagOpen && !IS_READ_ONLY && (
                <UIKitMultipleSelect
                  className="max-h-[32px] min-w-[302px] [&>div]:rounded-[3px]"
                  dropdownStyle={{ borderRadius: '3px' }}
                  isAllowClear
                  maxTagTextLength={8}
                  maxTagCount={2}
                  mode="multiple"
                  style={{ borderRadius: '3px' }}
                  options={filteredTagOptions}
                  onAddOption={addTag}
                  data-testid="add-tag-select"
                  isAddOption
                  onChange={handleAddTag}
                />
              )}
            </Row>

            <Text className="text-[#A1A1A1]">
              {selectedEventData.eventDescription ? selectedEventData.eventDescription : 'Event description'}
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

          {!IS_READ_ONLY && (
            <Button type="text" onClick={handleOpenGenerateFromJson}>
              <Code size={16} />
              Generate from JSON
            </Button>
          )}
        </Row>

        {isDataExampleChosen ? (
          <JsonDataExampleContent example={example} />
        ) : (
          <JsonSchemaContent isEditorChosen={isEditorChosen} schema={schema} onChange={handleSchemaChange} />
        )}
      </div>

      <DrawerGenerateFromJson setSchema={setSchema} selectedEventData={selectedEventData} />
    </>
  );
};
