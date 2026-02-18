import { Button, Input, Label, Select, Switch, TextArea } from '@axenix/ui-kit';
import { IconTrash } from '@tabler/icons-react';
import { ChangeEvent, FC, Fragment, useRef } from 'react';
import { Plus } from 'tabler-icons-react';

import { HttpParameterDTO, NodeDTO, NodeDTOMethodTypeEnum } from '@shared/openapi';

import { EParamsType, ParamDataType } from '../constants';

interface IProps {
  nodeData: NodeDTO;
  handleChange: (field: keyof NodeDTO) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => void;
  pathParametrs: HttpParameterDTO[];
  queryParametrs: HttpParameterDTO[];
  addParameters: (paramType: EParamsType) => void;
  updateParameterValue: (
    paramType: EParamsType,
    key: string,
    field: keyof HttpParameterDTO,
    value: string | boolean
  ) => void;
  deleteParameters: (id: string, paramType: EParamsType) => void;
  HttpParametersTypeOptions: {
    label: ParamDataType;
    value: ParamDataType;
  }[];
  handleHttpRequestBodyDescriptionChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => void;
}

interface ResizableTextAreaRef extends HTMLTextAreaElement {
  resizableTextArea: { textArea: HTMLTextAreaElement };
}

const MethodOptions = Object.entries(NodeDTOMethodTypeEnum).map(([, value]) => ({
  label: value,
  value,
}));

export const General: FC<IProps> = ({
  addParameters,
  deleteParameters,
  handleChange,
  handleHttpRequestBodyDescriptionChange,
  HttpParametersTypeOptions,
  nodeData,
  pathParametrs,
  queryParametrs,
  updateParameterValue,
}) => {
  const requestBodyRef = useRef<ResizableTextAreaRef>(null);
  return (
    <>
      <Label>Path</Label>
      <Input className="mt-2" name="name" placeholder="" value={nodeData.name} onChange={handleChange('name')} />

      <div className="mt-3 flex flex-col">
        <div className="flex justify-between">
          <Label>Path parametrs</Label>
          <div className="flex" onClick={() => addParameters(EParamsType.PATH)}>
            <Plus size={16} /> Add
          </div>
        </div>
        <div className="mt-2 grid grid-cols-[100px_90px_1fr_auto] items-center gap-2">
          {pathParametrs?.map((param: HttpParameterDTO) => (
            <Fragment key={param.key}>
              <Input
                type="text"
                value={param.name}
                onChange={e => updateParameterValue(EParamsType.PATH, param.key, 'name', e.target.value)}
              />
              <Select
                className="w-full"
                onChange={(value: string) => updateParameterValue(EParamsType.PATH, param.key, 'type', value)}
                value={param.type}
                options={HttpParametersTypeOptions}
              />
              <Input
                type="text"
                value={param.description}
                onChange={e => updateParameterValue(EParamsType.PATH, param.key, 'description', e.target.value)}
              />
              <Button
                type="text"
                icon={<IconTrash />}
                onClick={() => deleteParameters(param.key, EParamsType.PATH)}
                className="justify-self-end"
              />
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col">
        <div className="flex justify-between">
          <Label>Query parametrs</Label>
          <div className="flex" onClick={() => addParameters(EParamsType.QUERY)}>
            <Plus size={16} /> Add
          </div>
        </div>
        <div className="mt-2 grid grid-cols-[100px_90px_auto_auto_auto] items-center gap-2">
          {queryParametrs?.map((param: HttpParameterDTO) => (
            <Fragment key={param.key}>
              <Input
                type="text"
                value={param.name}
                onChange={e => updateParameterValue(EParamsType.QUERY, param.key, 'name', e.target.value)}
              />
              <Select
                className="w-full"
                value={param.type}
                onChange={(value: string) => updateParameterValue(EParamsType.QUERY, param.key, 'type', value)}
                options={HttpParametersTypeOptions}
              />
              <Input
                type="text"
                value={param.description}
                onChange={e => updateParameterValue(EParamsType.QUERY, param.key, 'description', e.target.value)}
              />
              <Switch
                onChange={(value: boolean) => updateParameterValue(EParamsType.QUERY, param.key, 'required', value)}
              />
              <Button
                type="text"
                icon={<IconTrash />}
                onClick={() => deleteParameters(param.key, EParamsType.QUERY)}
                className="justify-self-end"
              />
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col">
        <Label>Descriptions</Label>
        <TextArea
          name="requestBody"
          className="mt-2"
          ref={requestBodyRef}
          value={nodeData.httpRequestBody?.description}
          onChange={handleHttpRequestBodyDescriptionChange}
        />
      </div>

      <div className="mt-2 grid grid-cols-[1fr_1fr] items-center justify-between gap-4">
        <Label>
          Method
          <Select
            className="mt-2"
            value={nodeData.methodType}
            onChange={handleChange('methodType')}
            options={MethodOptions}
          />
        </Label>
        <Label>
          URL
          <Input
            className="mt-2"
            name="nodeUrl"
            placeholder=""
            value={nodeData.nodeUrl}
            onChange={handleChange('nodeUrl')}
          />
        </Label>
      </div>
    </>
  );
};
