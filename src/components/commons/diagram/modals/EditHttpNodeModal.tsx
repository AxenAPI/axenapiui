import {Drawer, Form, Input, Label, Select, TextArea} from '@axenix/ui-kit';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import {FC, useEffect, useRef, useState} from 'react';
import {Copy, ExternalLink} from 'tabler-icons-react';

import {copyToClipboard} from '@/helpers/copy-to-clipboard';
import {$eventGraph, editNode} from '@/models/EventGraphModel';
import {NodeDTO, NodeDTOMethodTypeEnum} from '@/shared/api/event-graph-api';

import {
  $editHttpNodeModal,
  closeEditHttpNodeModal,
} from '../model/modals-models/edit-http-node-modal/EditHttpNodeModalModel';

interface ResizableTextAreaRef extends HTMLTextAreaElement {
  resizableTextArea: {textArea: HTMLTextAreaElement};
}

// TODO использовать SimpleValues
const MethodOptions = Object.entries(NodeDTOMethodTypeEnum).map(([, value]) => ({
  label: value,
  value,
}));

export const EditHttpNodeModal: FC = () => {
  const requestBodyRef = useRef<ResizableTextAreaRef>(null);
  const responseBodyRef = useRef<ResizableTextAreaRef>(null);

  const handleCopy = (ref: React.RefObject<ResizableTextAreaRef>) => {
    if (ref.current) {
      copyToClipboard(ref.current.resizableTextArea.textArea.textContent);
    }
  };

  const editHttpNodeModal = useUnit($editHttpNodeModal);
  const {isOpen, nodeId} = editHttpNodeModal;
  const eventGraph = useUnit($eventGraph);
  const [nodeData, setNodeData] = useState<NodeDTO>({
    name: '',
    belongsToGraph: [],
    type: 'HTTP',
    nodeDescription: '',
    nodeUrl: '',
    requestBody: '',
    responseBody: '',
    methodType: 'GET',
  });

  useEffect(() => {
    if (isOpen && eventGraph) {
      const node = eventGraph.nodes.find(n => n.id === nodeId);
      if (node) {
        setNodeData(node);
      }
    }
  }, [isOpen, eventGraph, nodeId]);

  const handleChange =
    (field: keyof NodeDTO) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
      if (typeof e === 'string') {
        setNodeData({...nodeData, [field]: e});
      } else {
        setNodeData({...nodeData, [field]: e.target.value});
      }
    };

  const handleSave = () => {
    editNode({id: nodeId, updates: nodeData});
    closeEditHttpNodeModal();
  };

  return (
    <Drawer
      title="HTTP-node edit"
      withDefaultFooter
      isOpen={isOpen}
      onClose={closeEditHttpNodeModal}
      placement="right"
      defaultFooterProps={{
        cancelBtnText: 'Cancel',
        acceptBtnText: 'Save',
        onAccept: handleSave,
      }}
    >
      <Form className="flex flex-col gap-4" layout="vertical">
        <Label>
          Name
          <Input
            className="mt-2"
            name="name"
            placeholder="" /// <reference path="" />
            value={nodeData.name}
            onChange={handleChange('name')}
          />
        </Label>
        <Label>
          URL
          <Input
            className="mt-2"
            name="nodeUrl"
            placeholder="" /// <reference path="" />
            value={nodeData.nodeUrl}
            onChange={handleChange('nodeUrl')}
          />
        </Label>
        <Label>
          Method
          <Select
            className="mt-2"
            value={nodeData.methodType}
            onChange={handleChange('methodType')}
            options={MethodOptions}
          />
        </Label>
        <Label>
          Description
          <TextArea
            name="nodeDescription"
            className="mt-2" /// <reference path="" />
            value={nodeData.nodeDescription}
            onChange={handleChange('nodeDescription')}
          />
        </Label>
        <Label>
          <span className="flex w-full items-center justify-between gap-3">
            Request body
            <span className="flex gap-3">
              <Copy
                className={clsx('cursor-pointer hover:opacity-70', 'flex h-6 w-6 items-center justify-center p-1')}
                size={14}
                onClick={() => handleCopy(requestBodyRef)}
              />
              <ExternalLink
                className={clsx('cursor-pointer hover:opacity-70', 'flex h-6 w-6 items-center justify-center p-1')}
                size={14}
              />
            </span>
          </span>
          <TextArea
            name="requestBody"
            className="mt-2" /// <reference path="" />
            ref={requestBodyRef}
            value={nodeData.requestBody}
            onChange={handleChange('requestBody')}
          />
        </Label>
        <Label>
          <span className="flex w-full items-center justify-between gap-3">
            Response body
            <span className="flex gap-3">
              <Copy
                className={clsx('cursor-pointer hover:opacity-70', 'flex h-6 w-6 items-center justify-center p-1')}
                size={14}
                onClick={() => handleCopy(responseBodyRef)}
              />
              <ExternalLink
                className={clsx('cursor-pointer hover:opacity-70', 'flex h-6 w-6 items-center justify-center p-1')}
                size={14}
              />
            </span>
          </span>
          <TextArea
            height="200px"
            name="responseBody"
            className="mt-2" /// <reference path="" />
            ref={responseBodyRef}
            value={nodeData.responseBody}
            onChange={handleChange('responseBody')}
          />
        </Label>
      </Form>
    </Drawer>
  );
};
