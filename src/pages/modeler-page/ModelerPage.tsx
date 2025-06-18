import {ReactFlowProvider} from '@xyflow/react';
import {FC} from 'react';

import {Diagram} from '@/components/commons/diagram/Diagram';
import {Sidebar} from '@/components/commons/sidebar/Sidebar';

/**
 * Modeler page.
 */
export const ModelerPage: FC = () => (
  <div className="flex h-full w-full flex-row" data-testid="modeler-page">
    <ReactFlowProvider>
      <Sidebar />
      <Diagram />
    </ReactFlowProvider>
  </div>
);
