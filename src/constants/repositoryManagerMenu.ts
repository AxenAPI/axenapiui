import { GitRepoDtoTypeEnum } from '@shared/openapi';

import { EAuthorizationType } from '@/enums/common';

export const REPOSITORY_OPTIONS = [
  { value: GitRepoDtoTypeEnum.Code, label: 'Code repositories' },
  { value: GitRepoDtoTypeEnum.Documentation, label: 'Documentation repositories' },
];

export const AUTHORIZATION_OPTIONS = [
  { value: EAuthorizationType.TOKEN, label: 'Token' },
  { value: EAuthorizationType.LOGIN, label: 'Login' },
];
