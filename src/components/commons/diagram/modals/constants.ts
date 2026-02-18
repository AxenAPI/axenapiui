import { Baseline, LayoutColumns, Photo } from 'tabler-icons-react';

import { GetServiceSpecificationPost200Response, NodeDTOBrokerTypeEnum } from '@shared/openapi';

export const options = Object.keys(NodeDTOBrokerTypeEnum).map(key => ({
  label: key,
  value: NodeDTOBrokerTypeEnum[key as keyof typeof NodeDTOBrokerTypeEnum],
}));

export const brokerOptions = [...options, { label: 'Other', value: 'Other' }];

export const specificationDataInitialState = {} as GetServiceSpecificationPost200Response;

export enum SPECIFICATION_VIEW {
  EDITOR = 'Editor',
  FULL = 'Full',
  SWAGGER = 'Swagger',
}

export const SPECIFICATION_OPTIONS = [
  { value: SPECIFICATION_VIEW.EDITOR, icon: Baseline },
  { value: SPECIFICATION_VIEW.FULL, icon: LayoutColumns },
  { value: SPECIFICATION_VIEW.SWAGGER, icon: Photo },
];

export const FORMAT_OPTIONS = [
  { label: 'Json', value: 'json' },
  { label: 'Yaml', value: 'yaml' },
];

export enum EParamsType {
  PATH,
  QUERY,
  HEADERS,
}

export type ParamDataType = 'string' | 'number' | 'boolean' | 'object' | 'integer' | 'array';

export type TargetType = 'request' | 'response';
