import {Button, NodeSkeleton} from '@axenix/ui-kit';
import {Editor} from '@monaco-editor/react';
import {Copy} from 'tabler-icons-react';

import {copyToClipboard} from '@/helpers/copy-to-clipboard';

interface IJsonSchemaContentProps {
  example: string;
}

export const JsonDataExampleContent = ({example}: IJsonSchemaContentProps) => {
  const handleCopy = () => {
    copyToClipboard(example);
  };

  return (
    <div className="flex w-full flex-col items-end gap-2">
      <Button className="border-0 shadow-none" onClick={handleCopy} icon={<Copy />} />
      <Editor
        loading={<NodeSkeleton className="h-[100px] w-full" isActive />}
        className="h-fit min-h-[529px] border-2 border-[#D9D9D9]"
        value={example}
        defaultLanguage="json"
        defaultValue={example}
        options={{
          minimap: {enabled: false},
          stickyScroll: {enabled: false},
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          readOnly: true,
        }}
      />
    </div>
  );
};
