import { Divider, Layout, ScrollArea } from '@axenix/ui-kit';
import { FC } from 'react';

import { NodeStatus } from '@entities/modeler/Status/ui/Status';
import { NodeTags } from '@entities/modeler/Tags';

/** Вкладка настроек нода */
export const SettingsTab: FC = () => (
  <ScrollArea>
    <Layout>
      <NodeStatus />
      <Divider isPlain type="horizontal" />
      <NodeTags />
    </Layout>
  </ScrollArea>
);
