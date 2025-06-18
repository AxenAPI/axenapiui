import {ReactFlowProvider} from '@xyflow/react';
import {FC} from 'react';

import {DocumentationContent} from '@/components/documentation/DocumentationContent';

/**
 * Json editor page.
 */
export const DocumentationPageComponent: FC = () => (
  <div className="flex h-full w-full flex-row" data-testid="json-editor-page">
    <ReactFlowProvider>
      <DocumentationContent />
    </ReactFlowProvider>
  </div>
);
