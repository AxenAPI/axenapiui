import {Button, Button as UIKitButton, Drawer as UIKitDrawer, NodeSkeleton, Row} from '@axenix/ui-kit';
import {Editor} from '@monaco-editor/react';
import {useUnit} from 'effector-react';
import {useEffect, useState} from 'react';
import {Copy} from 'tabler-icons-react';

import {
  $drawerGenerateFromJson,
  closeDrawerGenerateFromJson,
  fetchJsonSchemaFx,
} from '@/components/jsonEditor/model/generateFromJson/GenerateFromJsonModel';
import {EMPTY_CHAR} from '@/constants/common';
import {copyToClipboard} from '@/helpers/copy-to-clipboard';
import {editEvent} from '@/models/EventGraphModel';
import {EventDTO} from '@/shared/api/event-graph-api';
import {SetState} from '@/types/common';

interface IDrawerGenerateFromJson {
  setSchema: SetState<string>;
  selectedEventData: EventDTO;
}

export const DrawerGenerateFromJson = ({selectedEventData, setSchema}: IDrawerGenerateFromJson) => {
  const drawerGenerateFromJson = useUnit($drawerGenerateFromJson);
  const {isOpen} = drawerGenerateFromJson;
  const [jsonCode, setJsonCode] = useState<string>(EMPTY_CHAR);

  useEffect(() => {
    setJsonCode(EMPTY_CHAR);
  }, [isOpen]);

  const handleClose = () => {
    closeDrawerGenerateFromJson();
  };

  const handleGenerate = () => {
    fetchJsonSchemaFx({jsonInput: jsonCode}).then(result => {
      const schema = JSON.stringify(JSON.parse(result.data.schema), null, 2);
      setSchema(schema);
      editEvent({id: selectedEventData?.id, updates: {schema}});
    });
    handleClose();
  };

  const handleCopy = () => {
    copyToClipboard(jsonCode);
  };

  const handleJsonCodeChange = (value: string | undefined) => {
    setJsonCode(value);
  };

  return (
    <UIKitDrawer
      size="500px"
      width={500}
      isResizable
      isDestroyOnClose
      isOpen={isOpen}
      onClose={handleClose}
      placement="right"
      title="Generate from JSON"
      customFooter={
        <div className="flex h-[100%] flex-row gap-2 py-2.5">
          <UIKitButton type="primary" onClick={handleGenerate} style={{borderRadius: '3px'}}>
            Generate
          </UIKitButton>
          <UIKitButton type="default" onClick={handleClose} style={{borderRadius: '3px'}}>
            Cancel
          </UIKitButton>
        </div>
      }
      classNames={{
        body: 'scrollbar',
      }}
    >
      <div className="flex flex-col gap-2">
        <Row className="center flex justify-between">
          JSON Code
          <Button className="border-0 shadow-none" onClick={handleCopy} icon={<Copy />} />
        </Row>

        <Editor
          loading={<NodeSkeleton className="h-[100px] w-full" isActive />}
          className="h-fit min-h-[529px] border-2 border-[#D9D9D9]"
          value={jsonCode}
          defaultLanguage="json"
          defaultValue={jsonCode}
          onChange={handleJsonCodeChange}
          options={{
            minimap: {enabled: false},
            stickyScroll: {enabled: false},
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>
    </UIKitDrawer>
  );
};
