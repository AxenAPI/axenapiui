import { NodeSkeleton } from '@axenix/ui-kit';
import { Editor } from '@monaco-editor/react';

import { JsonSchemaForm } from '@/components/jsonEditor/ui/elements/json-schema-form/JsonSchemaForm';
import { IS_READ_ONLY } from '@/constants/common';

interface IJsonSchemaContentProps {
  isEditorChosen: boolean;
  schema: string;
  onChange: (value: string | undefined) => void;
}

export const JsonSchemaContent = ({ isEditorChosen, onChange, schema }: IJsonSchemaContentProps) => (
  <div className="flex min-h-0 w-full flex-1 flex-col">
    {isEditorChosen ? (
      <Editor
        loading={<NodeSkeleton className="h-[100px] w-full" isActive />}
        className="h-full border-2 border-[#D9D9D9]"
        value={schema}
        defaultLanguage="json"
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          stickyScroll: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          readOnly: IS_READ_ONLY,
        }}
      />
    ) : (
      <JsonSchemaForm schema={schema} />
    )}
  </div>
);
