import { useGate } from 'effector-react';
import { useUnit } from 'effector-react/effector-react.mjs';

import { repositoryModel } from '@app/models/repository';

import { documentPageModel } from '../model/documentationPage.model';

export const useDocumentationPageStart = () => {
  useGate(documentPageModel.gate);

  const hasDocumentation = useUnit(repositoryModel.stores.$hasDocumentationActive);

  const isEmpty = !hasDocumentation;

  return { isEmpty };
};
