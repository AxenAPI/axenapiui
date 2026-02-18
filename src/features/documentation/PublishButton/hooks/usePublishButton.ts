import { useUnit } from 'effector-react';

import { repositoryModel } from '@app/models/repository';

import { publishButtonModel } from '../model/publishButton.model';

export const usePublishButton = () => {
  const handlePublish = () => {
    publishButtonModel.events.publishClicked();
  };

  const isPending = useUnit(repositoryModel.api.createMRDocumentationPostApi.pending);

  return { handlePublish, isPending };
};
