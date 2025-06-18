import {ReactFlowProvider} from '@xyflow/react';
import {FC} from 'react';

import {JsonEditorContent} from '@/components/jsonEditor/JsonEditorContent';
import {JsonEditorSidebar} from '@/components/jsonEditor/JsonEditorSidebar';

/**
 * Json editor page.
 */
export const JsonEditorPageComponent: FC = () => (
  <div className="flex h-full w-full flex-row" data-testid="json-editor-page">
    <ReactFlowProvider>
      <JsonEditorSidebar />
      <JsonEditorContent />
    </ReactFlowProvider>
  </div>
);
