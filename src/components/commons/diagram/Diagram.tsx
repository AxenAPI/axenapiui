import {IconEraser} from '@tabler/icons-react';
import {Background, Controls, Panel, ReactFlow, type OnConnect, ControlButton} from '@xyflow/react';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import React, {FC, useCallback} from 'react';

import {DiagramGroupButtons} from '@/components/commons/diagram/buttons/DiagramButtonsGroup';
import {FilterByTag} from '@/components/commons/diagram/filter/FilterByTag';
import {InfoPanelModal} from '@/components/commons/diagram/modals';
import {DeleteAllItemsModal} from '@/components/commons/diagram/modals/delete-items-modal/DeleteAllItemsModal';
import {DeleteSelectedItemsModal} from '@/components/commons/diagram/modals/delete-items-modal/DeleteSelectedItemsModal';
import {DrawerExport} from '@/components/commons/diagram/modals/drawer-export/DrawerExport';
import {SpecificationModal} from '@/components/commons/diagram/modals/SpecificationModal';
import {openDeleteItemsModal} from '@/components/commons/diagram/model/modals-models/delete-items-modal/DeleteItemsModalModel';
import {openDeleteSelectedItemsModal} from '@/components/commons/diagram/model/modals-models/delete-selected-items-modal/DeleteSelectedItemsModal';
import {openDrawerAddLink} from '@/components/commons/diagram/model/modals-models/drawer-add-link/DrawerAddLinkModel';
import {$selectedItems} from '@/components/commons/diagram/model/SelectedItemsModel';
import {edgeColors, edgeTypes, nodeTypes} from '@/constants/reactflow';
import {getNodeType} from '@/helpers/node-helpers';
import {useDiagramNotification} from '@/hooks/useDiagramNotification';
import {$eventGraph, addLink, addNode} from '@/models/EventGraphModel';
import {NodeDTOTypeEnum} from '@/shared/api/event-graph-api';

import './Diagram.css';

import {DrawerCreateLink} from './modals/drawer-link-modal/DrawerCreateLink';
import {DrawerEditLink} from './modals/drawer-link-modal/DrawerEditLink';
import {DrawerCreateEvent} from './modals/DrawerCreateEvent';
import {DrawerTopicEdit} from './modals/DrawerTopicEdit';
import {EditHttpNodeModal} from './modals/EditHttpNodeModal';
import {$edges, $ghostNodes, $nodes, onEdgesChange, onNodesChange} from './model/DiagramModel';
import {openDrawerCreateEvent} from './model/modals-models/drawer-create-event/DrawerCreateEventModel';

export const Diagram: FC = () => {
  const nodes = useUnit($nodes);
  const ghostNodes = useUnit($ghostNodes);
  const edges = useUnit($edges);
  const {contextHandler: notificationContextHandler} = useDiagramNotification();
  const selectedItems = useUnit($selectedItems);
  const eventGraph = useUnit($eventGraph);

  const onConnect: OnConnect = useCallback(
    params => {
      const fromId = params.sourceHandle === null ? params.target : params.source;
      const toId = params.sourceHandle === null ? params.source : params.target;

      // Проверка на самосоединение
      if (fromId === toId) return;

      // Получаем типы узлов
      const fromNodeType = getNodeType(eventGraph, fromId);
      const toNodeType = getNodeType(eventGraph, toId);

      // Проверяем допустимые соединения
      const isValidConnection =
        (fromNodeType === 'SERVICE' && toNodeType === 'TOPIC') ||
        (fromNodeType === 'TOPIC' && toNodeType === 'SERVICE') ||
        (fromNodeType === 'HTTP' && toNodeType === 'SERVICE');

      // Если соединение недопустимо, выходим из функции
      if (!isValidConnection) return;

      const newEdge = {
        fromId,
        toId,
        group: '',
        eventId: '',
      };
      addLink(newEdge);
    },
    [eventGraph]
  );

  const coloredEdges = edges.map((edge, i) => ({
    ...edge,
    data: {
      ...edge.data,
      color: edgeColors[i % edgeColors.length],
    },
  }));

  return (
    <React.Fragment>
      {notificationContextHandler}
      <ReactFlow
        data-testid="diagram"
        deleteKeyCode=""
        nodes={[...nodes, ...ghostNodes]}
        edges={coloredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        proOptions={{hideAttribution: true}}
        fitViewOptions={{minZoom: 1, maxZoom: 1}}
        fitView
      >
        <Panel
          position="top-right"
          data-testid="panel"
          className={clsx('ml-2 flex w-[calc(100%-30px)] gap-14 pb-3', 'overflow-x-auto scroll-auto', 'scrollbar')}
        >
          <FilterByTag />
          <DiagramGroupButtons
            onAddService={() => addNode(NodeDTOTypeEnum.Service)}
            onAddTopic={() => addNode(NodeDTOTypeEnum.Topic)}
            onAddEvent={() => openDrawerCreateEvent(null)}
            onAddHttp={() => addNode(NodeDTOTypeEnum.Http)}
            onAddLink={() => openDrawerAddLink('')}
            onDelete={() => openDeleteSelectedItemsModal(selectedItems)}
          />
        </Panel>
        <Controls orientation="horizontal" position="bottom-center" className="text-color-icon gap-1 shadow-none">
          <ControlButton data-testid="delete-all-btn" onClick={() => openDeleteItemsModal()}>
            <IconEraser className="fill-none" size={16} />
          </ControlButton>
        </Controls>
        <Background />
      </ReactFlow>

      <DeleteAllItemsModal />
      <InfoPanelModal />
      <EditHttpNodeModal />
      <SpecificationModal />
      <DrawerCreateLink />
      <DrawerEditLink />
      <DrawerTopicEdit />
      <DrawerCreateEvent />
      <DeleteSelectedItemsModal />
      <DrawerExport />
    </React.Fragment>
  );
};
