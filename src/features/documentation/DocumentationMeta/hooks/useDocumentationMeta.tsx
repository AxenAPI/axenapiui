import { Divider, Input, Menu } from '@axenix/ui-kit';
import { ItemType } from 'antd/lib/menu/interface';
import { useUnit } from 'effector-react';
import { ChangeEvent, KeyboardEvent } from 'react';
import { CircleLetterH, FileCode, ServerCog, TopologyStar, X } from 'tabler-icons-react/dist';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

import { editButtonModel } from '@features/documentation/EditButton';

import { logger } from '@shared/lib/logger';
import { EventDTO, NodeDTO, NodeDTOTypeEnum } from '@shared/openapi';

import { $nodes } from '@/components/commons/diagram/model/DiagramModel';
import { openDrawerCreateEvent } from '@/components/commons/diagram/model/modals-models/drawer-create-event/DrawerCreateEventModel';
import { $eventGraph, setEventGraph } from '@/models/EventGraphModel';
import { TCustomNode } from '@/types/common';

import { documentationMetaModel } from '../model/documentationMeta.model';

const META_CONTAINER_CLASS = 'flex flex-col px-6';
const META_INFO_CLASS = 'flex flex-col gap-4 pt-8 pb-8';
const AUTHOR_CLASS = 'flex items-center gap-2';
const AUTHOR_TEXT_CLASS = 'text-[16px] text-[#1F1F1F]';
const TITLE_CLASS = 'text-[24px] text-[#1F1F1F]';
const UPDATED_CLASS = 'text-[12px] text-[#A6A6A6]';
const LINKED_OBJECT_CLASS =
  'group flex w-fit cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-[#F37022] hover:text-[#F37022]';
const CLOSE_BUTTON_CLASS = 'text-gray-500 transition-colors group-hover:text-[#F37022]';
enum ELinkedObject {
  EVENT = 'EVENT',
}

// TODO: Заменить на TMenuInfo из @axenix/ui-kit, когда проблема с импортом будет решена.
// import { NMenu } from '@axenix/ui-kit/dist/src/ui/navigation/menu/models';
// Это временное решение для обхода ошибки с некорректным экспортом типов из библиотеки.
type TMenuInfoLike = {
  key: string;
};
// TODO: [Техдолг] Рефакторинг useDocumentationMeta.
// Этот хук стал слишком большим и выполняет множество задач. Его следует декомпозировать:
// 1. Вынести логику рендеринга (linkedNodeElements, DocumetationMetaDropdownMenu) в отдельные компоненты.
// 2. Разделить бизнес-логику (handleItemClick, handleDeleteConnection) на более мелкие, специфичные хуки или сервисы.
// 3. Уменьшить количество зависимостей, передаваемых через useUnit, возможно, разделив на несколько effector-моделей.
// 4. Проанализировать кросс-импорты, о которых упоминается в handleEdit, и устранить их.
export const useDocumentationMeta = () => {
  const model = useUnit({
    title: documentationMetaModel.stores.$title,
    newTitle: documentationMetaModel.stores.$newTitle,
    isEditing: documentationMetaModel.stores.$isEditing,
    canEditDocumentation: editButtonModel.stores.$isEditing,
    menuFilterValue: documentationMetaModel.stores.$menuFilterValue,
    editModeToggled: documentationMetaModel.events.editModeToggled,
    newTitleChanged: documentationMetaModel.events.newTitleChanged,
    renameRequested: documentationMetaModel.events.renameRequested,
    setMenuFilterChange: documentationMetaModel.events.setMenuFilterValue,
    openLinkedObjectDrawer: documentationMetaModel.events.openLinkedObjectDrawer,
    passDataToDrawer: documentationMetaModel.events.passDataToDrawer,
    linkDocumentationPageApi: documentationMetaModel.api.linkDocumentationPageApi,
    nodes: $nodes,
    eventGraph: $eventGraph,
    setEventGraph,
    selectedFile: documentTreeModel.stores.$selectedFile,
  });

  const handleEdit = () => {
    // Сейчас происходит крос импорт между фичами, надо избавиться
    if (!model.canEditDocumentation) return;
    model.editModeToggled();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    model.newTitleChanged(event.target.value);
  };

  const handleSave = () => {
    model.renameRequested(model.newTitle);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }

    if (event.key === 'Escape') {
      model.editModeToggled();
    }
  };

  const customNodes = model?.nodes?.filter(item => 'nodeType' in item.data) as TCustomNode[];

  const allServiceOptions = customNodes
    ?.filter(item => item.data?.nodeType === NodeDTOTypeEnum.Service)
    ?.map(item => ({ label: item.data?.name, key: item.id }));

  const allTopicOptions = customNodes
    ?.filter(item => item.data?.nodeType === NodeDTOTypeEnum.Topic)
    ?.map(item => ({ label: item.data?.name, key: item.id }));

  const allHTTPOptions = customNodes
    ?.filter(item => item.data?.nodeType === NodeDTOTypeEnum.Http)
    ?.map(item => ({ label: item.data?.name, key: item.id }));

  const allMenuItems = [
    {
      key: 'g1',
      label: 'Services',
      children: allServiceOptions,
      type: 'group',
      mode: 'vertical',
    },
    {
      key: 'g2',
      label: 'Topics',
      children: allTopicOptions,
      type: 'group',
      mode: 'vertical',
    },
    {
      key: 'g3',
      label: 'HTTP',
      children: allHTTPOptions,
      type: 'group',
      mode: 'vertical',
    },
    {
      key: 'g4',
      label: 'Events',
      children: model.eventGraph.events?.map((event: EventDTO) => ({ label: event.name, key: event.id })),
      type: 'group',
      mode: 'vertical',
    },
  ];

  const getNodeIcon = (item: NodeDTO | EventDTO) =>
    ('type' in item && item.type === NodeDTOTypeEnum.Service && <TopologyStar size={15} />) ||
    ('type' in item && item.type === NodeDTOTypeEnum.Topic && <ServerCog size={15} />) ||
    ('type' in item && item.type === NodeDTOTypeEnum.Http && <CircleLetterH size={15} />) ||
    (!('type' in item) && <FileCode size={15} />);

  const handleItemClick = (itemClicked: TMenuInfoLike) => {
    if (!model.selectedFile) return;
    // TODO: Добавить связывание Event
    const nodeClicked = customNodes.find(node => node.id === itemClicked.key);
    const eventClicked = model.eventGraph.events?.find(event => event.id === itemClicked.key);

    let objectId: string;
    let objectType: NodeDTOTypeEnum | ELinkedObject.EVENT;

    if (nodeClicked) {
      objectId = nodeClicked.id;
      objectType = nodeClicked.data?.nodeType;
    } else if (eventClicked) {
      objectId = eventClicked.id;
      objectType = ELinkedObject.EVENT;
    } else {
      logger.error('Clicked item not found in nodes or events:', itemClicked.key);
      return;
    }

    // FIXME: Это надо обязательно переносить в model
    model.linkDocumentationPageApi({
      addPageLinkRequest: {
        objectId,
        objectType,
        eventGraph: {
          ...model.eventGraph,
          nodes: nodeClicked
            ? model.eventGraph.nodes.map(node =>
                node.id === nodeClicked.id
                  ? {
                      ...node,
                      documentationFileLinks: [
                        ...(node.documentationFileLinks || []),
                        model.selectedFile?.pagePath ?? '',
                      ],
                    }
                  : node
              )
            : model.eventGraph.nodes, // No change to nodes if eventClicked
          events: eventClicked
            ? model.eventGraph.events.map(event =>
                event.id === eventClicked.id
                  ? {
                      ...event,
                      documentationFileLinks: [
                        ...(event.documentationFileLinks || []),
                        model.selectedFile?.pagePath ?? '',
                      ],
                    }
                  : event
              )
            : model.eventGraph.events,
        },
        pagePath: model.selectedFile.pagePath,
      },
    });
  };

  const handleDeleteConnection = (itemClicked: NodeDTO | EventDTO) => {
    if (!model.selectedFile) return;

    let objectType: NodeDTOTypeEnum | ELinkedObject.EVENT;

    if ('type' in itemClicked && Object.values(NodeDTOTypeEnum).includes(itemClicked.type as NodeDTOTypeEnum)) {
      objectType = itemClicked.type as NodeDTOTypeEnum;
    } else {
      objectType = ELinkedObject.EVENT;
    }

    model.linkDocumentationPageApi({
      addPageLinkRequest: {
        objectId: itemClicked.id,
        objectType,
        eventGraph: {
          ...model.eventGraph,
          nodes:
            objectType !== ELinkedObject.EVENT
              ? model.eventGraph?.nodes?.map(item =>
                  itemClicked.id === item.id
                    ? {
                        ...item,
                        documentationFileLinks: [
                          ...(item.documentationFileLinks?.filter(link => link !== model.selectedFile?.pagePath) || []),
                        ],
                      }
                    : item
                )
              : model.eventGraph.nodes, // If it's an Event, don't modify nodes
          events:
            objectType === ELinkedObject.EVENT
              ? model.eventGraph?.events?.map(event =>
                  itemClicked.id === event.id
                    ? {
                        ...event,
                        documentationFileLinks: [
                          ...(event.documentationFileLinks?.filter(link => link !== model.selectedFile?.pagePath) ||
                            []),
                        ],
                      }
                    : event
                )
              : model.eventGraph.events, // If it's a Node, don't modify events
        },
        pagePath: model.selectedFile.pagePath,
      },
    });
  };

  const linkedNodes = model.selectedFile
    ? [
        ...(model.eventGraph.nodes || []).filter(item =>
          item?.documentationFileLinks?.includes(model.selectedFile!.pagePath)
        ),

        ...(model.eventGraph.events || []).filter(item =>
          item?.documentationFileLinks?.includes(model.selectedFile!.pagePath)
        ),
      ]
    : [];

  const filteredItems = allMenuItems.filter(item =>
    item.label.toLowerCase().includes(model.menuFilterValue.toLowerCase())
  ) as ItemType[];

  const handleOpenLinkedObjectDrawer = (data: NodeDTO | EventDTO) => {
    model.openLinkedObjectDrawer();
    model.passDataToDrawer(data);
  };

  const linkedNodeElements = linkedNodes.map(obj => (
    <div key={obj.id} className={LINKED_OBJECT_CLASS}>
      <span
        className="flex items-center gap-2"
        onClick={() => {
          if ('type' in obj) {
            handleOpenLinkedObjectDrawer(obj);
          } else {
            openDrawerCreateEvent(obj.id);
          }
        }}
      >
        {getNodeIcon(obj)}
        {obj.name}
      </span>
      <X onClick={() => handleDeleteConnection(obj)} size={18} className={CLOSE_BUTTON_CLASS} />
    </div>
  ));

  const DocumetationMetaDropdownMenu = () => (
    <div style={{ backgroundColor: 'white' }}>
      <div style={{ padding: '8px' }}>
        <Input
          placeholder="Search..."
          value={model.menuFilterValue}
          onChange={e => model.setMenuFilterChange(e.target.value)}
        />
      </div>
      <Divider style={{ margin: 0 }} />
      <Menu style={{ borderRadius: 0, backgroundColor: 'white' }} items={filteredItems} onClick={handleItemClick} />
    </div>
  );

  const renderDropdownMenu = () => <DocumetationMetaDropdownMenu />;

  return {
    handleChange,
    handleEdit,
    handleKeyDown,
    handleItemClick,
    filteredItems,
    handleSave,
    linkedNodeElements,
    renderDropdownMenu,
    ...model,
    metaContainerClass: META_CONTAINER_CLASS,
    metaInfoClass: META_INFO_CLASS,
    authorClass: AUTHOR_CLASS,
    authorTextClass: AUTHOR_TEXT_CLASS,
    titleClass: TITLE_CLASS,
    updatedClass: UPDATED_CLASS,
  };
};
