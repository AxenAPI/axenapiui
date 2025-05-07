import {ButtonsGroup, Menu} from '@axenix/ui-kit';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import {FC} from 'react';
import {Plus} from 'tabler-icons-react';

import {DrawerCreateEvent} from '@/components/commons/diagram/modals/DrawerCreateEvent';
import {openDrawerCreateEvent} from '@/components/commons/diagram/model/modals-models/drawer-create-event/DrawerCreateEventModel';
import {buildJsonEditorSidebar} from '@/helpers/json-editor';
import {$eventGraph} from '@/models/EventGraphModel';
import './JsonEditorSidebar.css';
import {$selectedMenuItem} from '@/models/JsonEditorModel';

export const JsonEditorSidebar: FC = () => {
  const eventGraphData = useUnit($eventGraph);
  const selectedEvent = useUnit($selectedMenuItem);

  const containerClassName = clsx('h-full w-[20rem] bg-white shrink-0', 'side-bar');

  const scrollAreaClassName = clsx(`w-full h-full overflow-y-scroll scroll-auto pt-10 pl-6 pr-6 pb-16`, 'scrollbar');
  return (
    <div className={containerClassName} data-testid="json-editor-sidebar">
      <div className={scrollAreaClassName}>
        {eventGraphData ? (
          <Menu selectedKeys={[selectedEvent?.id]} items={buildJsonEditorSidebar(eventGraphData)} mode="inline" />
        ) : (
          'No data'
        )}
      </div>

      <div className="absolute bottom-0 h-[4rem] w-[20rem] border-t border-gray-200 bg-white p-3">
        <ButtonsGroup
          className="flex items-center justify-start gap-3"
          buttonsConfig={[
            {
              buttonKey: 'new-event-button',
              icon: <Plus />,
              iconPosition: 'start',
              children: 'New Event',
              isBlock: false,
              isDisabled: false,
              isLoading: false,
              onClick: () => openDrawerCreateEvent(null),
              type: 'primary',
            },
          ]}
        />
      </div>

      <DrawerCreateEvent />
    </div>
  );
};
