import {AxiosResponse} from 'axios';
import {Baseline, LayoutColumns, Photo} from 'tabler-icons-react';

import {EMPTY_OBJECT} from '@/constants/common';
import {GetServiceSpecificationPost200Response, NodeDTOBrokerTypeEnum} from '@/shared/api/event-graph-api';

export const options = Object.keys(NodeDTOBrokerTypeEnum).map(key => ({
  label: key,
  value: NodeDTOBrokerTypeEnum[key as keyof typeof NodeDTOBrokerTypeEnum],
}));

export const brokerOptions = [...options, {label: 'Other', value: 'Other'}];

export const specificationDataInitialState: AxiosResponse<GetServiceSpecificationPost200Response> = {
  config: undefined,
  data: EMPTY_OBJECT,
  headers: EMPTY_OBJECT,
  request: EMPTY_OBJECT,
  status: 0,
  statusText: '',
};

export enum SPECIFICATION_VIEW {
  EDITOR = 'Editor',
  FULL = 'Full',
  SWAGGER = 'Swagger',
}

export const SPECIFICATION_OPTIONS = [
  {value: SPECIFICATION_VIEW.EDITOR, icon: Baseline},
  {value: SPECIFICATION_VIEW.FULL, icon: LayoutColumns},
  {value: SPECIFICATION_VIEW.SWAGGER, icon: Photo},
];

export const FORMAT_OPTIONS = [
  {label: 'Json', value: 'json'},
  {label: 'Yaml', value: 'yaml'},
];
