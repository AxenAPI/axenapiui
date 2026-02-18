import { sample } from 'effector';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

import { documentationMetaModel } from '@features/documentation/DocumentationMeta';
import { linkedObjectDrawerModel } from '@features/documentation/LinkedObjectDrawer';

import { $eventGraph } from '@/models/EventGraphModel';

sample({
  clock: documentationMetaModel.api.linkDocumentationPageApi.doneData,
  target: $eventGraph,
});

sample({
  clock: documentationMetaModel.events.openLinkedObjectDrawer,
  fn: () => true,
  target: linkedObjectDrawerModel.stores.$isLinkedObjectDrawerOpen,
});

sample({
  clock: documentationMetaModel.events.passDataToDrawer,
  target: linkedObjectDrawerModel.stores.$drawerData,
});

// Handle rename request: connect renameRequested to renamePageFx
sample({
  clock: documentationMetaModel.events.renameRequested,
  source: documentTreeModel.stores.$selectedFile,
  filter: Boolean,
  fn: (selectedFile, newTitle) => ({
    id: selectedFile.id,
    newTitle,
    relativePath: selectedFile.pagePath,
  }),
  target: documentTreeModel.api.renamePageFx,
});
