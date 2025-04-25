import {Drawer, Button, Collapse, Space} from '@axenix/ui-kit';
import {IconTrash} from '@tabler/icons-react';
import {useUnit} from 'effector-react';
import {FC, useCallback} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {Plus} from 'tabler-icons-react';

import {
  $drawerAddLink,
  closeDrawerAddLink,
} from '@/components/commons/diagram/model/modals-models/drawer-add-link/DrawerAddLinkModel';
import {initialLinksForm} from '@/constants/diagram';
import {getDeterminedLinkIds} from '@/helpers/modal-helpers/getDeterminedLinkIds';
import {$eventGraph, addLinks, addLinksError} from '@/models/EventGraphModel';
import {NodeDTOTypeEnum} from '@/shared/api/event-graph-api';
import {ILinksForm} from '@/types/common';

import {DrawerLinkItem} from './DrawerLinkItem';

interface IProps {
  event?: string;
}

export const DrawerCreateLink: FC<IProps> = () => {
  const eventGraph = useUnit($eventGraph);
  const drawerCreateLink = useUnit($drawerAddLink);
  const {isOpen} = drawerCreateLink;

  const methods = useForm<ILinksForm>({defaultValues: {links: [initialLinksForm]}});
  const {fields, prepend, remove} = useFieldArray({
    control: methods.control,
    name: 'links',
  });

  const nodes = eventGraph?.nodes;
  const events = eventGraph?.events || [];
  const topicNodes = nodes?.filter(({type}) => type === NodeDTOTypeEnum.Topic);
  const serviceNodes = nodes?.filter(({type}) => type === NodeDTOTypeEnum.Service);
  const httpNodes = nodes?.filter(({type}) => type === NodeDTOTypeEnum.Http);

  const topicOptions = topicNodes?.map(({id, name}) => ({
    label: name,
    value: id,
  }));
  const serviceOptions = serviceNodes?.map(({id, name}) => ({
    label: name,
    value: id,
  }));
  const httpOptions = httpNodes?.map(({id, name}) => ({
    label: name,
    value: id,
  }));
  const eventsOptions = events?.map(({id, name}) => ({
    label: name,
    value: id,
  }));

  const handleClose = () => {
    closeDrawerAddLink();
    methods.reset();
  };

  const handleAddLink = (data: ILinksForm) => {
    const adjustedLinks = data.links.map(link => getDeterminedLinkIds(link.connectionType, link));

    // Проверка наличия необходимых идентификаторов
    if (!data.links[0].eventId || !data.links[0].fromId || !data.links[0].toId) {
      return addLinksError();
    }

    addLinks(adjustedLinks);
    handleClose();
  };

  const addLinkHandler = useCallback(() => {
    prepend(initialLinksForm);
  }, [prepend]);

  return (
    <Drawer
      data-testid="drawer-create-link"
      title="New Link"
      size="350px"
      width={350}
      extra={
        <Button
          className="flex flex-row items-center rounded-[3px]"
          size="small"
          iconPosition="start"
          icon={<Plus size={16} className="flex items-center" />}
          onClick={addLinkHandler}
        >
          Add Link
        </Button>
      }
      customFooter={
        <Space>
          <Button className="rounded-[3px]" type="primary" onClick={methods.handleSubmit(handleAddLink)}>
            Create
          </Button>

          <Button className="rounded-[3px]" onClick={handleClose}>
            Cancel
          </Button>
        </Space>
      }
      isOpen={isOpen}
      isDestroyOnClose
      onClose={handleClose}
    >
      {fields.map((field, idx) => (
        <Collapse
          className="mb-3"
          key={`${field.id}-${field.fromId}`}
          defaultActiveKey={[!idx ? 0 : null]}
          items={[
            {
              key: 0,
              label: 'Link',
              children: (
                <DrawerLinkItem
                  serviceOptions={serviceOptions}
                  topicOptions={topicOptions}
                  eventsOptions={eventsOptions}
                  httpOptions={httpOptions}
                  connectionTypeFieldName={`links.${idx}.connectionType`}
                  fromNodeFieldName={`links.${idx}.fromId`}
                  objectToConnectFieldName={`links.${idx}.objectToConnect`}
                  toNodeFieldName={`links.${idx}.toId`}
                  eventFieldName={`links.${idx}.eventId`}
                  methods={methods}
                />
              ),
              extra: <Button type="text" icon={<IconTrash />} onClick={() => remove(idx)} />,
            },
          ]}
          isBordered={false}
        />
      ))}
    </Drawer>
  );
};
