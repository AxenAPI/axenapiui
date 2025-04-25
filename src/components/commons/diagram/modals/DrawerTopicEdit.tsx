import {
  Form as UIKitForm,
  FormItem as UIKitFormItem,
  Input as UIKitInput,
  Select as UIKitSelect,
  Drawer as UIKitDrawer,
  Space as UIKitSpace,
  Button as UIKitButton,
} from '@axenix/ui-kit';
import {useUnit} from 'effector-react';
import {FC, useEffect, useState} from 'react';

import {
  $drawerEditTopic,
  closeDrawerEditTopic,
} from '@/components/commons/diagram/model/modals-models/drawer-edit-topic/DrawerEditTopicModel';
import {$eventGraph, editNode} from '@/models/EventGraphModel';
import {NodeDTO} from '@/shared/api/event-graph-api';

import {brokerOptions} from './constants';

interface IDrawerTopicEditProps {
  name?: string;
  isOpen?: boolean;
  onClose?: () => void;
  broker?: string;
}

export const DrawerTopicEdit: FC<IDrawerTopicEditProps> = () => {
  const eventGraph = useUnit($eventGraph);
  const drawerEditTopic = useUnit($drawerEditTopic);

  const {isOpen, itemId} = drawerEditTopic;

  const [nodeData, setNodeData] = useState<Partial<NodeDTO>>({
    name: '',
    brokerType: null,
    type: 'TOPIC',
  });

  const handleSave = () => {
    editNode({id: itemId, updates: nodeData});
    closeDrawerEditTopic();
  };

  const handleChange =
    (field: keyof NodeDTO) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
      if (typeof e === 'string') {
        setNodeData({...nodeData, [field]: e});
      } else {
        setNodeData({...nodeData, [field]: e.target.value});
      }
    };

  const otherBroker = brokerOptions.find(option => option.value === nodeData.brokerType)?.label === 'Other';

  useEffect(() => {
    if (isOpen && eventGraph) {
      const node = eventGraph.nodes.find(n => n.id === itemId);
      if (node) {
        setNodeData({
          name: node.name,
          brokerType: node.brokerType,
        });
      }
    }
  }, [isOpen, eventGraph, itemId]);

  return (
    <UIKitDrawer
      size="350px"
      width={350}
      isResizable
      isDestroyOnClose
      isOpen={isOpen}
      onClose={closeDrawerEditTopic}
      placement="right"
      title="Topic edit"
      customFooter={
        <div className="flex h-full flex-row gap-2 py-2.5">
          <UIKitButton type="primary" onClick={handleSave}>
            Save
          </UIKitButton>
          <UIKitButton type="primary" onClick={() => closeDrawerEditTopic()}>
            Cancel
          </UIKitButton>
        </div>
      }
    >
      <UIKitSpace direction="vertical" size="small">
        <UIKitForm name="wrap" labelAlign="left" labelWrap colon style={{maxWidth: 302}} layout="vertical">
          <UIKitFormItem label="Name">
            <UIKitInput value={nodeData.name} style={{borderRadius: '3px '}} onChange={handleChange('name')} />
          </UIKitFormItem>
          <UIKitFormItem label="Broker">
            <UIKitSelect
              className="min-w-[302px] [&>div]:rounded-[3px]"
              dropdownStyle={{borderRadius: '3px'}}
              style={{borderRadius: '3px '}}
              defaultValue={nodeData.brokerType}
              value={nodeData.brokerType}
              onSearch={() => {}}
              onChange={handleChange('brokerType')}
              options={brokerOptions}
            />
          </UIKitFormItem>

          {otherBroker && (
            <UIKitFormItem label="Broker URL">
              <UIKitInput style={{borderRadius: '3px '}} isDisabled />
            </UIKitFormItem>
          )}
        </UIKitForm>
      </UIKitSpace>
    </UIKitDrawer>
  );
};
