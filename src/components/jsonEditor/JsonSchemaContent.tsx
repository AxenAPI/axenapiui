import {Button, NodeSkeleton} from '@axenix/ui-kit';
import {Editor} from '@monaco-editor/react';
import React from 'react';

import {JsonSchemaForm} from '@/components/jsonEditor/json-schema-form/JsonSchemaForm';

interface IJsonSchemaContentProps {
  isEditorChosen: boolean;
  schema: string;
  onChange: (value: string | undefined) => void;
  onSave: () => void;
}

export const JsonSchemaContent = ({isEditorChosen, onChange, onSave, schema}: IJsonSchemaContentProps) => (
  <div className="w-full">
    {isEditorChosen ? (
      <React.Fragment>
        <Editor
          loading={<NodeSkeleton className="h-[100px] w-full" isActive />}
          className="h-fit min-h-[529px] border-2 border-[#D9D9D9]"
          value={schema}
          defaultLanguage="json"
          defaultValue={schema}
          onChange={onChange}
          options={{
            minimap: {enabled: false},
            stickyScroll: {enabled: false},
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
        <Button type="primary" onClick={onSave}>
          Save
        </Button>
      </React.Fragment>
    ) : (
      <JsonSchemaForm schema={schema} />
    )}
  </div>
);
