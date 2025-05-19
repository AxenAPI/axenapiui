import {getExpandableLinkId} from '@/helpers/diagram-helpers/edge-helpers';
import {Consume2Events1Topic} from '@/shared/data-mock';
import {TExpandableItem} from '@/types/common';

export const expandableItemMockConsume2Events1Topic: TExpandableItem = {
  compoundLinkId: getExpandableLinkId(Consume2Events1Topic.links[0]),
  topicId: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
  relatedItems: [
    {
      linkId: Consume2Events1Topic.links[0].id,
      eventId: Consume2Events1Topic.links[0].eventId,
    },
    {
      linkId: Consume2Events1Topic.links[1].id,
      eventId: Consume2Events1Topic.links[1].eventId,
    },
  ],
  isExpanded: false,
};

export const expandedItemMockConsume2Events1Topic: TExpandableItem = {
  ...expandableItemMockConsume2Events1Topic,
  isExpanded: true,
};
