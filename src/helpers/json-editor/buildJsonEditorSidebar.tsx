import {Dropdown} from '@axenix/ui-kit';
import {ItemType} from 'antd/lib/menu/interface';

import {removeEvent} from '@/models/EventGraphModel';
import {selectMenuItem} from '@/models/JsonEditorModel';
import {EventDTO, EventGraphDTO} from '@/shared/api/event-graph-api';

export const buildJsonEditorSidebar = (eventGraph: EventGraphDTO) => {
  const events: EventDTO[] = eventGraph?.events?.map(event => event) || [];

  const items: ItemType[] = events.map(event => ({
    key: event.id,
    label: (
      <Dropdown
        trigger={['contextMenu']}
        menu={{
          items: [
            {
              label: 'Delete',
              key: `del:${event.id}`,
              onClick: e => {
                e.domEvent.stopPropagation();
                removeEvent(event.id);
              },
            },
          ],
        }}
      >
        {event.name}
      </Dropdown>
    ),
    onClick: () => selectMenuItem(event),
  }));

  return items;
};
