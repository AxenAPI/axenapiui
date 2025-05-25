import {Edge} from '@xyflow/react';
import stc from 'string-to-color';

import {getLinkType} from '@/helpers/diagram-helpers/edge-helpers';
import {EventGraphDTO} from '@/shared/api/event-graph-api';

export function formatBaseLinks(rawData: EventGraphDTO): Edge[] {
  return (
    rawData.links?.map((el, index) => ({
      id: el.id || `${el.fromId}->${el.toId}.${index}`,
      source: el.fromId,
      target: el.toId,
      type: getLinkType(el, rawData),
      data: {
        color: stc(el.eventId || ''),
        eventId: el.eventId,
      },
    })) || []
  );
}
