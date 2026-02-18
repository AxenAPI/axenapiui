import { Dropdown } from '@axenix/ui-kit';
import { ItemType } from 'antd/lib/menu/interface';

import { EventDTO, EventGraphDTO } from '@shared/openapi';

import { IS_READ_ONLY } from '@/constants/common';
import { removeEvent } from '@/models/EventGraphModel';
import { selectMenuItem } from '@/models/JsonEditorModel';

export const buildJsonEditorSidebar = (eventGraph: EventGraphDTO) => {
  const events: EventDTO[] = eventGraph?.events?.map(event => event) || [];

  const items: ItemType[] = events.map(event => ({
    key: event.id,
    label: (
      <Dropdown
        trigger={['contextMenu']}
        menu={
          !IS_READ_ONLY
            ? {
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
              }
            : undefined
        }
      >
        {event.name}
      </Dropdown>
    ),
    onClick: () => selectMenuItem(event),
  }));

  return items;
};
