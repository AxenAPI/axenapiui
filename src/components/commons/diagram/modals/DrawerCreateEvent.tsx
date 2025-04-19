import {
  Button as UIKitButton,
  Drawer as UIKitDrawer,
  Form as UIKitForm,
  FormItem as UIKitFormItem,
  Input as UIKitInput,
  MultipleSelect as UIKitMultipleSelect,
  TextArea as UIKitTextArea,
  Icon as UIKitIcon,
  NodeSkeleton as UIKitSkeleton,
} from '@axenix/ui-kit';
import {Editor} from '@monaco-editor/react';
import {useUnit} from 'effector-react';
import {FC, useEffect} from 'react';
import {useController, useForm} from 'react-hook-form';
import {Copy, ExternalLink} from 'tabler-icons-react';

import {
  $drawerCreateEvent,
  closeDrawerCreateEvent,
} from '@/components/commons/diagram/model/modals-models/drawer-create-event/DrawerCreateEventModel';
import {EMPTY_ARRAY, EMPTY_CHAR} from '@/constants/common';
import {copyToClipboard} from '@/helpers/copy-to-clipboard';
import {SimpleValues} from '@/helpers/SimpleValues';
import {$eventGraph, addEvent, addTag, editEvent} from '@/models/EventGraphModel';
import {EventDTO} from '@/shared/api/event-graph-api';

export const DrawerCreateEvent: FC = () => {
  const drawerCreateEvent = useUnit($drawerCreateEvent);
  const eventGraph = useUnit($eventGraph);
  const {eventId, isOpen} = drawerCreateEvent;

  const eventToEdit = eventGraph?.events?.find(item => item.id === eventId);
  const tagOptions = eventGraph && eventGraph.tags ? new SimpleValues(...eventGraph.tags) : [];

  const {
    control,
    formState: {errors},
    handleSubmit,
    reset,
    watch,
  } = useForm<EventDTO>({
    defaultValues: {
      name: EMPTY_CHAR,
      eventDescription: EMPTY_CHAR,
      tags: EMPTY_ARRAY,
      schema: EMPTY_CHAR,
    },
    mode: 'onSubmit',
  });

  const isEditing = Boolean(eventToEdit);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: eventToEdit?.name || EMPTY_CHAR,
        eventDescription: eventToEdit?.eventDescription || EMPTY_CHAR,
        tags: eventToEdit?.tags || EMPTY_ARRAY,
        schema: eventToEdit?.schema || EMPTY_CHAR,
      });
    }
  }, [eventToEdit, isOpen, reset]);

  const {field: nameField} = useController({
    control,
    name: 'name',
    rules: {
      required: 'Name is required',
    },
  });

  const {field: eventDescriptionField} = useController({
    control,
    name: 'eventDescription',
  });

  const {field: tagsField} = useController({
    control,
    name: 'tags',
  });

  const {field: schemaField} = useController({
    control,
    name: 'schema',
  });

  const handleClose = () => {
    reset({
      name: EMPTY_CHAR,
      eventDescription: EMPTY_CHAR,
      tags: EMPTY_ARRAY,
      schema: EMPTY_CHAR,
    });
    closeDrawerCreateEvent();
  };

  const handleSave = (data: EventDTO) => {
    if (isEditing && eventToEdit) {
      const updatedEvent = {
        ...eventToEdit,
        ...data,
      };
      editEvent({id: eventId, updates: updatedEvent});
    } else {
      addEvent(data);
    }
    handleClose();
  };

  const handleCopySchema = () => {
    copyToClipboard(watch('schema'));
  };

  return (
    <UIKitDrawer
      size="500px"
      width={500}
      isResizable
      isDestroyOnClose
      isOpen={isOpen}
      onClose={handleClose}
      placement="right"
      title={isEditing ? 'Edit event' : 'New event'}
      customFooter={
        <div className="flex h-[100%] flex-row gap-2 py-2.5">
          <UIKitButton type="primary" onClick={handleSubmit(handleSave)} style={{borderRadius: '3px'}}>
            {isEditing ? 'Save' : 'Create'}
          </UIKitButton>
          <UIKitButton type="default" onClick={handleClose} style={{borderRadius: '3px'}}>
            Cancel
          </UIKitButton>
        </div>
      }
      classNames={{
        body: 'scrollbar',
      }}
    >
      <UIKitForm name="wrap" labelAlign="left" labelWrap colon layout="vertical">
        <UIKitFormItem label="Name" isRequired validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
          <UIKitInput
            {...nameField}
            className="min-w-[302px] [&>div]:rounded-[3px]"
            style={{borderRadius: '3px'}}
            placeholder="Введите значение"
            data-testid="event-drawer-name-input"
          />
        </UIKitFormItem>
        <UIKitFormItem label="Description">
          <UIKitTextArea
            {...eventDescriptionField}
            className="min-w-[302px] [&>div]:rounded-[3px]"
            style={{borderRadius: '3px '}}
            placeholder="Enter description"
          />
        </UIKitFormItem>
        <UIKitFormItem label="Tags">
          <UIKitMultipleSelect
            {...tagsField}
            className="max-h-[32px] min-w-[302px] [&>div]:rounded-[3px]"
            dropdownStyle={{borderRadius: '3px'}}
            isAllowClear
            maxTagTextLength={8}
            maxTagCount={2}
            mode="multiple"
            style={{borderRadius: '3px '}}
            options={tagOptions}
            onAddOption={addTag}
            isAddOption
          />
        </UIKitFormItem>
        <UIKitFormItem>
          <div className="flex w-full justify-between">
            <div>JSON Code</div>
            <div className="flex items-center gap-2">
              <UIKitButton
                size="small"
                type="text"
                icon={<UIKitIcon icon={<Copy size={16} />} size={16} />}
                onClick={handleCopySchema}
              />
              {/* TODO редирект на JSON editor по клику */}
              <UIKitButton size="small" type="text" icon={<UIKitIcon icon={<ExternalLink size={16} />} size={16} />} />
            </div>
          </div>
          <Editor
            {...schemaField}
            loading={<UIKitSkeleton className="h-[100px] w-full" isActive />}
            className="h-fit min-h-[400px]"
            defaultLanguage="json"
            options={{
              minimap: {enabled: false},
              stickyScroll: {enabled: false},
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
          />
        </UIKitFormItem>
      </UIKitForm>
    </UIKitDrawer>
  );
};
