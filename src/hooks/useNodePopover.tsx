import {IconCodeDots, IconEdit, IconEyeOff, IconFileCode, IconListCheck, IconTrash} from '@tabler/icons-react';
import {useUnit} from 'effector-react';
import {useCallback} from 'react';
import {Schema, SchemaOff} from 'tabler-icons-react';

import {
  $expandableItems,
  expandItemByTopicId,
  shrinkItemByTopicId,
} from '@/components/commons/diagram/model/ExpandableItemsModel';
import {$hiddenItems, hideItem, showItem} from '@/components/commons/diagram/model/HiddenItemsModel';
import {openDeleteSelectedItemsModal} from '@/components/commons/diagram/model/modals-models/delete-selected-items-modal/DeleteSelectedItemsModal';
import {openDrawerEditTopic} from '@/components/commons/diagram/model/modals-models/drawer-edit-topic/DrawerEditTopicModel';
import {openSpecificationModal} from '@/components/commons/diagram/model/modals-models/drawer-specification/SpecificationModalModel';
import {openEditHttpNodeModal} from '@/components/commons/diagram/model/modals-models/edit-http-node-modal/EditHttpNodeModalModel';
import {closePopoverMenu} from '@/components/commons/diagram/model/modals-models/popover/PopoverMenuModel';
import {EMPTY_ARRAY} from '@/constants/common';
import {NodeDTOTypeEnum} from '@/shared/api/event-graph-api';
import {TCustomNodeData} from '@/types/common';

export const useNodePopover = (id: string, data: TCustomNodeData) => {
  const hiddenItems = useUnit($hiddenItems);
  const expandableItems = useUnit($expandableItems);

  const handleOpenEditTopic = useCallback(() => {
    openDrawerEditTopic(id);
    closePopoverMenu();
  }, [id]);

  const handleOpenHttpNodeEdit = useCallback(() => {
    openEditHttpNodeModal(id);
    closePopoverMenu();
  }, [id]);

  const handleOpenSpecificationEdit = useCallback(() => {
    openSpecificationModal(id);
    closePopoverMenu();
  }, [id]);

  const getFirstPopoverItem = (nodeType: string) => {
    switch (nodeType) {
      case 'TOPIC':
        return {
          key: 'editTopic',
          label: 'Edit Topic',
          onClick: () => handleOpenEditTopic(),
          icon: <IconEdit />,
        };
      case 'HTTP':
        return {
          key: 'editHTTP',
          label: 'Edit HTTP-node',
          onClick: () => handleOpenHttpNodeEdit(),
          icon: <IconEdit />,
        };
      case 'SERVICE':
        return {
          key: 'editService',
          label: 'Specification',
          onClick: () => handleOpenSpecificationEdit(),
          icon: <IconFileCode />,
        };
      default:
        return null;
    }
  };

  const getExtraPopoverItems = (nodeType: string) => {
    if (nodeType === NodeDTOTypeEnum.Http) return EMPTY_ARRAY;

    const baseExtraPopoverItems = [
      {
        key: 'editEvent',
        label: 'Edit event',
        onClick: () => {},
        icon: <IconCodeDots />,
      },
      {
        key: 'testContract',
        label: 'Test contract',
        onClick: () => {},
        icon: <IconListCheck />,
      },
    ];

    if (nodeType === NodeDTOTypeEnum.Topic && expandableItems.find(el => el.topicId === id)) {
      return [
        ...baseExtraPopoverItems,
        {
          key: 'showEvents',
          label: expandableItems.find(el => el.topicId === id).isExpanded ? 'Hide events' : 'Show events',
          onClick: expandableItems.find(el => el.topicId === id).isExpanded
            ? () => shrinkItemByTopicId(id)
            : () => expandItemByTopicId(id),
          icon: expandableItems.find(el => el.topicId === id).isExpanded ? <SchemaOff /> : <Schema />,
        },
      ];
    }

    return baseExtraPopoverItems;
  };

  const popoverItems = [
    getFirstPopoverItem(data.nodeType),
    {
      key: 'hide',
      label: 'Hide',
      onClick: () => (hiddenItems.includes(id) ? showItem(id) : hideItem(id)),
      icon: <IconEyeOff />,
    },
    ...getExtraPopoverItems(data.nodeType),
    {
      key: 'delete',
      label: 'Delete',
      onClick: () => openDeleteSelectedItemsModal([id]),
      icon: <IconTrash />,
    },
  ];

  return {popoverItems};
};
