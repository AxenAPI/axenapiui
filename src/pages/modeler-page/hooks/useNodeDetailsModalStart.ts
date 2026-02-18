import { useGate, useUnit } from 'effector-react';

import { repositoryModel } from '@app/models/repository';

import { NodeDetailsModalModel } from '../model/nodeInfoModal';

export const useNodeDetailsModalStart = () => {
  useGate(NodeDetailsModalModel.gate);

  const hasDocumentation = useUnit(repositoryModel.stores.$hasDocumentationActive);

  const isEmpty = !hasDocumentation;

  return { isEmpty };
};
