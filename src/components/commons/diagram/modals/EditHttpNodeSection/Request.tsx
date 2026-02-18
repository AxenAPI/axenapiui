import { Button, Input, Label, NodeSkeleton, Row, Select, Tag } from '@axenix/ui-kit';
import { Editor } from '@monaco-editor/react';
import { IconTrash } from '@tabler/icons-react';
import { useUnit } from 'effector-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { Plus, X } from 'tabler-icons-react';

import { DropdownWithControls } from '@shared/components/DropdownWithControls';
import {
  EventDTO,
  HttpContentBody,
  HttpContentDTO,
  HttpContentTypeEnum,
  HttpParameterDTO,
  HttpStatusCodeEnum,
} from '@shared/openapi';

import { RadioButtonGroup } from '@/components/commons/buttons/RadioGroupButton';

import { openDrawerCreateEvent } from '../../model/modals-models/drawer-create-event/DrawerCreateEventModel';
import {
  $availableHttpContentTypes,
  $selectedContentType,
  setSelectedContentType,
} from '../../model/modals-models/edit-http-node-modal/EditHttpNodeModalModel';
import { EParamsType, FORMAT_OPTIONS, ParamDataType, TargetType } from '../constants';

interface IProps {
  addContentType: (newVal: HttpContentTypeEnum | HttpStatusCodeEnum, target: TargetType) => void;
  removeContentType: (tag: HttpContentTypeEnum, target: TargetType) => void;
  contentTypeList: HttpContentDTO[];
  events: Array<EventDTO>;
  headerParametrs: HttpParameterDTO[];
  addParameters: (paramType: EParamsType) => void;
  updateParameterValue: (
    paramType: EParamsType,
    key: string,
    field: keyof HttpParameterDTO,
    value: string | boolean
  ) => void;
  HttpParametersTypeOptions: {
    label: ParamDataType;
    value: ParamDataType;
  }[];
  deleteParameters: (id: string, paramType: EParamsType) => void;
  updateRequestContentEventId: (mediaType: HttpContentTypeEnum, eventId: string) => void;
  updateRequestContentBody: (mediaType: HttpContentTypeEnum, description: string) => void;
  // multipart
  updateRequestMultipartEventId: (mediaType: HttpContentTypeEnum, eventId: string) => void;
  addMultipartFileField: (mediaType: HttpContentTypeEnum) => void;
  updateMultipartFileFieldType: (mediaType: HttpContentTypeEnum, name: string, value: 'single' | 'list') => void;
  renameMultipartFileField: (mediaType: HttpContentTypeEnum, oldName: string, newName: string) => void;
  deleteMultipartFileField: (mediaType: HttpContentTypeEnum, name: string) => void;
}

export const Request: FC<IProps> = ({
  addContentType,
  addMultipartFileField,
  addParameters,
  contentTypeList,
  deleteMultipartFileField,
  deleteParameters,
  events,
  headerParametrs,
  HttpParametersTypeOptions,
  removeContentType,
  renameMultipartFileField,
  // multipart
  updateMultipartFileFieldType,
  updateParameterValue,
  updateRequestContentBody,
  updateRequestContentEventId,
  updateRequestMultipartEventId,
}) => {
  const [isAddTagOpen, setIsAddTagOpen] = useState<boolean>(false);
  const selectedContentType = useUnit($selectedContentType);

  const availableHtthpContentTypes = useUnit($availableHttpContentTypes);
  const selectedTypeInfo = useMemo(
    () => availableHtthpContentTypes.find(item => item.type === selectedContentType),
    [availableHtthpContentTypes, selectedContentType]
  );

  const selectedContent = contentTypeList?.find(c => c.mediaType === selectedContentType);

  const otherTypesValue =
    selectedContent?.body?.type !== HttpContentTypeEnum.ApplicationJson
      ? // @ts-expect-error 'description' does not exist on all types of HttpContentBody
        selectedContent?.body?.description
      : '';

  const formatOptionsYamlDisabled = FORMAT_OPTIONS.map(option => ({ ...option, isDisabled: option.value === 'yaml' }));

  const apiOptions = availableHtthpContentTypes.map(item => ({ label: item.type, value: item.type }));
  const enumOptions = Object.values(HttpContentTypeEnum).map(value => ({ label: value, value }));
  const httpContentTypeOptions = availableHtthpContentTypes.length ? apiOptions : enumOptions;

  const eventOptions = events.map(event => ({
    label: event.name,
    value: event.id,
  }));

  const availableOptions = httpContentTypeOptions.filter(
    option => !contentTypeList?.some(content => content.mediaType === option.value)
  );

  // Выбираем первый элемент типа реквеста при монтировании если он не был выбран
  useEffect(() => {
    if (!selectedContentType && contentTypeList?.length > 0) {
      setSelectedContentType(contentTypeList[0].mediaType);
    }
  }, [selectedContentType, contentTypeList]);

  const handleCreateEvent = () => {
    openDrawerCreateEvent(null);
  };

  const eventIdValue = (selectedContent?.body as Extract<HttpContentBody, { type: 'application/json' }>)?.eventId ?? '';

  return (
    <>
      <Row className="mb-2 flex cursor-pointer items-center gap-2">
        {contentTypeList?.map(tag => (
          <div key={tag.mediaType} onClick={() => setSelectedContentType(tag.mediaType)}>
            <Tag className="mr-0" color={tag.mediaType === selectedContentType ? 'orange' : undefined}>
              {tag.mediaType}
              <X
                className="ml-2.5 h-[16px] w-[13px] cursor-pointer"
                size={10}
                onClick={e => {
                  e.stopPropagation();
                  removeContentType(tag.mediaType, 'request');

                  if (tag.mediaType === selectedContentType) {
                    setSelectedContentType(null);
                  }
                }}
              />
            </Tag>
          </div>
        ))}
      </Row>

      {!isAddTagOpen && (
        <div className="mb-3.5 flex items-center" onClick={() => setIsAddTagOpen(true)}>
          <Tag icon={<Plus size={16} />}>Request type</Tag>
        </div>
      )}

      {isAddTagOpen && (
        <Select
          className="max-h-[32px] min-w-[302px] [&>div]:rounded-[3px]"
          dropdownStyle={{ borderRadius: '3px' }}
          isAllowClear
          maxTagTextLength={8}
          maxTagCount={1}
          style={{ borderRadius: '3px' }}
          options={availableOptions}
          isAddOption
          onAddOption={newTag => {
            addContentType(newTag as HttpContentTypeEnum, 'request');
          }}
          onChange={(selectedValue: string) => {
            addContentType(selectedValue as HttpContentTypeEnum, 'request');
            setSelectedContentType(selectedValue as HttpContentTypeEnum);
            setIsAddTagOpen(false);
          }}
          data-testid="add-tag-select"
        />
      )}

      {contentTypeList?.length > 0 &&
        selectedContentType === HttpContentTypeEnum.ApplicationJson &&
        selectedTypeInfo?.isSupport && (
          <>
            <Label>
              Request body
              <DropdownWithControls
                options={eventOptions}
                value={eventIdValue}
                onChange={(newEventId: string) => {
                  if (selectedContentType) {
                    updateRequestContentEventId(selectedContentType, newEventId);
                  }
                }}
                onCreateClick={handleCreateEvent}
                buttonPlacehoder="Create event"
                emptyText="No events"
              />
            </Label>

            <div className="mt-3 flex flex-col">
              <div className="flex justify-between">
                <Label>Headers</Label>
                <div className="flex" onClick={() => addParameters(EParamsType.HEADERS)}>
                  <Plus size={16} /> Add
                </div>
              </div>
              <div className="mt-2 grid grid-cols-[100px_90px_1fr_auto] items-center gap-2">
                {headerParametrs?.map((param: HttpParameterDTO) => (
                  <>
                    <Input
                      type="text"
                      value={param.name}
                      onChange={e => updateParameterValue(EParamsType.HEADERS, param.key, 'name', e.target.value)}
                    />
                    <Select
                      className="w-full"
                      onChange={(value: string) => updateParameterValue(EParamsType.HEADERS, param.key, 'type', value)}
                      value={param?.type}
                      options={HttpParametersTypeOptions}
                    />
                    <Input
                      type="text"
                      value={param?.description}
                      onChange={e =>
                        updateParameterValue(EParamsType.HEADERS, param.key, 'description', e.target.value)
                      }
                    />
                    <Button
                      type="text"
                      icon={<IconTrash />}
                      onClick={() => deleteParameters(param.key, EParamsType.HEADERS)}
                      className="justify-self-end"
                    />
                  </>
                ))}
              </div>
            </div>
          </>
        )}
      {contentTypeList?.length > 0 &&
        (!selectedTypeInfo?.isSupport ||
          (selectedContentType !== HttpContentTypeEnum.ApplicationJson &&
            selectedContentType !== HttpContentTypeEnum.MultipartFormData)) && (
          <Label>
            <div className="flex flex-col gap-2">
              <Row className="flex items-center justify-between">
                Request body
                <RadioButtonGroup defaultValue="json" options={formatOptionsYamlDisabled} />
              </Row>

              <Editor
                loading={<NodeSkeleton className="h-[100px] w-full" isActive />}
                className="h-fit min-h-[529px] border-2 border-[#D9D9D9]"
                value={otherTypesValue || ''}
                defaultLanguage="json"
                defaultValue={otherTypesValue || ''}
                onChange={value => {
                  if (selectedContentType && value) {
                    updateRequestContentBody(selectedContentType, value);
                  }
                }}
                options={{
                  minimap: { enabled: false },
                  stickyScroll: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                }}
              />
            </div>
          </Label>
        )}

      {contentTypeList?.length > 0 &&
        selectedContentType === HttpContentTypeEnum.MultipartFormData &&
        selectedTypeInfo?.isSupport && (
          <>
            <Label>
              Request body
              <DropdownWithControls
                options={eventOptions}
                value={
                  (
                    selectedContent?.body as unknown as Extract<
                      HttpContentBody,
                      { type: 'multipart/form-data'; eventId: string }
                    >
                  )?.eventId ?? ''
                }
                onChange={(newEventId: string) => {
                  if (selectedContentType) {
                    updateRequestMultipartEventId(selectedContentType, newEventId);
                  }
                }}
                onCreateClick={handleCreateEvent}
                buttonPlacehoder="Create event"
                emptyText="No events"
              />
            </Label>

            <div className="mt-3 flex flex-col">
              <div className="flex justify-between">
                <Label>Headers</Label>
                <div className="flex" onClick={() => addParameters(EParamsType.HEADERS)}>
                  <Plus size={16} /> Add
                </div>
              </div>
              <div className="mt-2 grid grid-cols-[100px_90px_1fr_auto] items-center gap-2">
                {headerParametrs?.map((param: HttpParameterDTO) => (
                  <>
                    <Input
                      type="text"
                      value={param.name}
                      onChange={e => updateParameterValue(EParamsType.HEADERS, param.key, 'name', e.target.value)}
                    />
                    <Select
                      className="w-full"
                      onChange={(value: string) => updateParameterValue(EParamsType.HEADERS, param.key, 'type', value)}
                      value={param?.type}
                      options={HttpParametersTypeOptions}
                    />
                    <Input
                      type="text"
                      value={param?.description}
                      onChange={e =>
                        updateParameterValue(EParamsType.HEADERS, param.key, 'description', e.target.value)
                      }
                    />
                    <Button
                      type="text"
                      icon={<IconTrash />}
                      onClick={() => deleteParameters(param.key, EParamsType.HEADERS)}
                      className="justify-self-end"
                    />
                  </>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Label>Body</Label>
              <div className="mt-2 border border-[#D9D9D9] p-2">
                <div className="mb-2">
                  <Button onClick={() => addMultipartFileField(selectedContentType!)} type="default">
                    + Add
                  </Button>
                </div>
                <div className="grid grid-cols-[1fr_150px_60px] gap-2">
                  <div className="font-semibold">Name</div>
                  <div className="font-semibold">Type</div>
                  <div className="font-semibold">Action</div>
                  {Object.entries(
                    ((selectedContent?.body as unknown as Extract<HttpContentBody, { files?: Record<string, string> }>)
                      ?.files ?? {}) as Record<string, string>
                  ).map(([name, value]) => (
                    <>
                      <Input
                        value={name}
                        onChange={e => renameMultipartFileField(selectedContentType!, name, e.target.value)}
                      />
                      <Select
                        value={value}
                        onChange={(val: string) =>
                          updateMultipartFileFieldType(selectedContentType!, name, val as 'single' | 'list')
                        }
                        options={[
                          { label: 'single', value: 'single' },
                          { label: 'list', value: 'list' },
                        ]}
                      />
                      <Button
                        type="text"
                        icon={<IconTrash />}
                        onClick={() => deleteMultipartFileField(selectedContentType!, name)}
                      />
                    </>
                  ))}
                  {Object.keys(
                    ((selectedContent?.body as unknown as Extract<HttpContentBody, { files?: Record<string, string> }>)
                      ?.files ?? {}) as Record<string, string>
                  ).length === 0 && <div className="col-span-3 text-gray-400">No files</div>}
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );
};
