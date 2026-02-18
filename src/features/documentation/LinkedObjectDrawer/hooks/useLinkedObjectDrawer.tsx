import { useUnit } from 'effector-react';
import { CircleLetterH, FileCode, ServerCog, TopologyStar } from 'tabler-icons-react';

import { LinkDTO, NodeDTO, NodeDTOTypeEnum } from '@shared/openapi';

import { openDrawerCreateEvent } from '@/components/commons/diagram/model/modals-models/drawer-create-event/DrawerCreateEventModel';
import { $eventGraph } from '@/models/EventGraphModel';

import { linkedObjectDrawerModel } from '../model/linkedObjectDrawer.model';

export const useLinkedObjectDrawer = () => {
  const model = useUnit({
    isLinkedObjectDrawerOpen: linkedObjectDrawerModel.stores.$isLinkedObjectDrawerOpen,
    drawerData: linkedObjectDrawerModel.stores.$drawerData,
    closeLinkedObjectDrawer: linkedObjectDrawerModel.events.closeLinkedObjectDrawer,
    eventGraph: $eventGraph,
  });

  const drawerName = model.drawerData?.name;

  const linksToCurrentNode = model.eventGraph.links?.filter(link => link?.toId === model.drawerData?.id);
  const linksFromCurrentNode = model.eventGraph.links?.filter(link => link?.fromId === model.drawerData?.id);

  const producerIds = linksToCurrentNode.map(link => link?.fromId);
  const consumerIds = linksFromCurrentNode.map(link => link?.toId);

  const producingNodes = model.eventGraph.nodes?.filter(item => producerIds.includes(item?.id));
  const consumingNodes = model.eventGraph.nodes?.filter(item => consumerIds.includes(item?.id));

  const getNodeIcon = (node: NodeDTO) =>
    (node.type === NodeDTOTypeEnum.Service && <TopologyStar size={15} />) ||
    (node.type === NodeDTOTypeEnum.Topic && <ServerCog size={15} />) ||
    (node.type === NodeDTOTypeEnum.Http && <CircleLetterH size={15} />);

  type TLinkDirection = 'toId' | 'fromId';

  const generateNodeOptions = (nodes: NodeDTO[], links: LinkDTO[], linkDirection: TLinkDirection) =>
    nodes.map(node => ({
      key: node?.id,
      label: (
        <div className="flex gap-1">
          {getNodeIcon(node)}
          {node?.name}
        </div>
      ),
      children: model.eventGraph?.events
        ?.filter(event => links.find(link => link.eventId === event.id && link[linkDirection] === node.id))
        ?.map(event => (
          <div key={event.id}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <FileCode size={15} />
                {event?.name}
              </div>
              <span className="cursor-pointer text-[#FF4D4F]" onClick={() => openDrawerCreateEvent(event.id)}>
                Edit
              </span>
            </div>
            <div>{event?.eventDescription}</div>
          </div>
        )),
    }));

  const consumingNodesOptions = generateNodeOptions(consumingNodes, linksFromCurrentNode, 'toId');
  const producingNodesOptions = generateNodeOptions(producingNodes, linksToCurrentNode, 'fromId');

  const handleClose = () => {
    model.closeLinkedObjectDrawer();
  };

  return {
    ...model,
    handleClose,
    drawerName,
    consumingNodes,
    producingNodes,
    consumingNodesOptions,
    producingNodesOptions,
  };
};
