import { Button, NNotification } from '@axenix/ui-kit';
import { createEffect, sample } from 'effector';
import { createGate } from 'effector-react';

import { repositoryModel } from '@app/models/repository';

import { branchSelectModel } from '@features/documentation/BranchSelect';
import { documentStateModel } from '@features/documentation/MDXEditorWithMermaid/model/documentState.model';
import { publishButtonModel } from '@features/documentation/PublishButton';

import { ElectronService } from '@shared/electron/api';

const DocumentationHeaderGate = createGate<NNotification.TNotificationInstance>('DocumentationHeaderGate');

const NOTIFICATION_KEY = {
  checkoutBranch: 'checkoutBranch',
  checkoutError: 'checkoutError',
};

const publishFx = createEffect(async (params: { path: string; content: string; relativePath: string }) => {
  await repositoryModel.effects.writeFileLocallyFx({ path: params.path, content: params.content });
});

const mrCreatedFX = createEffect<{ api: NNotification.TNotificationInstance; url: string }, void>(({ api, url }) => {
  const message = 'Merge request created';
  api.success({
    key: NOTIFICATION_KEY.checkoutBranch,
    message,
    placement: 'bottomRight',
    duration: 3,
    actions: (
      <Button variant="text" onClick={() => ElectronService.openUrl(url)}>
        View MR
      </Button>
    ),
  });
});

// --- Orchestration Logic ---

// Only react to repositoryPathSet *after* the gate is open

sample({
  clock: repositoryModel.events.repositoryPathSet,
  filter: DocumentationHeaderGate.status,
  target: branchSelectModel.api.fetchBranchesApi,
});

// When publish is clicked, start the chain by saving the file
sample({
  clock: publishButtonModel.events.publishClicked,
  source: {
    path: documentStateModel.stores.$fullPath,
    content: documentStateModel.stores.$markdown,
    relativePath: documentStateModel.stores.$relativePathForMR,
  },
  target: publishFx,
});

// When Publish and file is committed, start the chain by creating the MR
sample({
  clock: publishFx.done,
  target: repositoryModel.api.createMRDocumentationPostApi,
});

sample({
  clock: repositoryModel.api.createMRDocumentationPostApi.doneData,
  source: DocumentationHeaderGate.state,
  filter: Boolean,
  fn: (src, clk) => ({ api: src, url: clk }),
  target: mrCreatedFX,
});

export const documentationHeaderModel = {
  gate: DocumentationHeaderGate,
};
