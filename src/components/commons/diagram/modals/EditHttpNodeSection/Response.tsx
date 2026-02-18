import { Button, Input, Label, Row, Select, Tag } from '@axenix/ui-kit';
import { IconTrash } from '@tabler/icons-react';
import { FC, useState } from 'react';
import { Plus, X } from 'tabler-icons-react';

import { DropdownWithControls } from '@shared/components/DropdownWithControls';
import { EventDTO, HttpContentTypeEnum, HttpParameterDTO, HttpResponseDTO, HttpStatusCodeEnum } from '@shared/openapi';

import { openDrawerCreateEvent } from '../../model/modals-models/drawer-create-event/DrawerCreateEventModel';
import { ParamDataType, TargetType } from '../constants';

interface IProps {
  addContentType: (newTag: HttpContentTypeEnum | HttpStatusCodeEnum, target: TargetType) => void;
  removeContentType: (tag: HttpStatusCodeEnum, target: TargetType) => void;
  events: Array<EventDTO>;
  httpResponses: HttpResponseDTO[];
  HttpParametersTypeOptions: {
    label: ParamDataType;
    value: ParamDataType;
  }[];
  addHeaderToResponse: (statusCode: HttpStatusCodeEnum) => void;
  deleteHeaderFromResponse: (statusCode: HttpStatusCodeEnum, headerKey: string) => void;
  updateHeaderValueInResponse: (
    statusCode: HttpStatusCodeEnum,
    headerKey: string,
    field: keyof HttpParameterDTO,
    value: string | boolean
  ) => void;
  updateResponseContentEventId: (statusCode: HttpStatusCodeEnum, eventId: string) => void;
}

export const Response: FC<IProps> = ({
  addContentType,
  addHeaderToResponse,
  deleteHeaderFromResponse,
  events,
  HttpParametersTypeOptions,
  httpResponses,
  removeContentType,
  updateHeaderValueInResponse,
  updateResponseContentEventId,
}) => {
  const [isAddTagOpen, setIsAddTagOpen] = useState<boolean>(false);
  // Состояние выбранного statusCode (по умолчанию - первый элемент или null)
  const [selectedStatusCode, setSelectedStatusCode] = useState<HttpStatusCodeEnum | null>(
    httpResponses?.[0]?.statusCode ?? null
  );

  const selectStatusCode = (code: HttpStatusCodeEnum): void => {
    if (code === selectedStatusCode) {
      setSelectedStatusCode(null);
    } else {
      setSelectedStatusCode(code);
    }
  };

  const selectedResponse = httpResponses?.find(r => r.statusCode === selectedStatusCode);

  const httpContentTypeOptions = Object.values(HttpStatusCodeEnum).map(value => ({
    label: value,
    value,
  }));

  const eventOptions = events.map(event => ({
    label: event.name,
    value: event.id,
  }));

  const availableOptions = httpContentTypeOptions.filter(
    option => !httpResponses?.some(content => content.statusCode === option.value)
  );

  const handleCreateEvent = () => {
    openDrawerCreateEvent(null);
  };

  return (
    <>
      <Row className="mb-2 flex cursor-pointer items-center gap-2">
        {httpResponses?.map(res => (
          <div key={res.statusCode} onClick={() => selectStatusCode(res.statusCode)}>
            <Tag className="mr-0" color={res.statusCode === selectedStatusCode ? 'orange' : undefined}>
              {res.statusCode}
              <X
                className="ml-2.5 h-[16px] w-[13px] cursor-pointer"
                size={10}
                onClick={e => {
                  e.stopPropagation(); // чтобы клик по кресту не выбирал тег
                  removeContentType(res.statusCode, 'response');
                  // Если удаляем выбранный тег — сбросить selection
                  if (res.statusCode === selectedStatusCode) {
                    setSelectedStatusCode(null);
                  }
                }}
              />
            </Tag>
          </div>
        ))}
      </Row>

      {!isAddTagOpen && (
        <div className="mb-3.5 flex items-center" onClick={() => setIsAddTagOpen(true)}>
          <Tag icon={<Plus size={16} />}>Response type</Tag>
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
            addContentType(newTag as HttpStatusCodeEnum, 'response');
          }}
          onChange={(selectedValue: string) => {
            addContentType(selectedValue as HttpStatusCodeEnum, 'response');
            setSelectedStatusCode(selectedValue as HttpStatusCodeEnum);
            setIsAddTagOpen(false);
          }}
          data-testid="add-tag-select"
        />
      )}

      {httpResponses.length > 0 && (
        <>
          <Label>
            Response body
            <DropdownWithControls
              options={eventOptions}
              value={selectedResponse?.content?.[0]?.eventId ?? ''}
              onChange={(newEventId: string) => {
                if (selectedStatusCode) {
                  updateResponseContentEventId(selectedStatusCode, newEventId);
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
              <div className="flex" onClick={() => selectedStatusCode && addHeaderToResponse(selectedStatusCode)}>
                <Plus size={16} /> Add
              </div>
            </div>

            <div className="mt-2 grid grid-cols-[100px_90px_1fr_auto] items-center gap-2">
              {selectedResponse?.headers?.map(param => (
                <>
                  <Input
                    type="text"
                    value={param.name}
                    onChange={e => updateHeaderValueInResponse(selectedStatusCode!, param.key, 'name', e.target.value)}
                  />
                  <Select
                    value={param.type}
                    onChange={(value: string) =>
                      updateHeaderValueInResponse(selectedStatusCode!, param.key, 'type', value)
                    }
                  >
                    {HttpParametersTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                  <Input
                    type="text"
                    value={param.description}
                    onChange={e =>
                      updateHeaderValueInResponse(selectedStatusCode!, param.key, 'description', e.target.value)
                    }
                  />
                  <Button
                    icon={<IconTrash />}
                    onClick={() => deleteHeaderFromResponse(selectedStatusCode!, param.key)}
                  />
                </>
              ))}

              {selectedResponse && !selectedResponse?.headers?.length && (
                <div className="col-span-5 text-gray-400">No headers</div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
