import { Card } from '@axenix/ui-kit';

import { EventDTO } from '@shared/openapi';
import { IfEditableBtn } from '@shared/ui/if-editable';

import { editEventRequested } from '../model/model';

import { EventTitle } from './EventTitle';

/** Представление события */
export const EventCard = (event: EventDTO) => (
  <Card
    extra={<IfEditableBtn onClick={() => editEventRequested(event.id)} />}
    title={<EventTitle element={event} />}
    size="small"
    isBordered={false}
    isInner={false}
  >
    {event.eventDescription || null}
  </Card>
);
