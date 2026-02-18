import { fireEvent, render, screen } from '@testing-library/react';
import { allSettled, createWatch, fork } from 'effector';
import { Provider } from 'effector-react';

import { EventGraphDTO, LinkDTO, NodeDTO, NodeDTOTypeEnum } from '@shared/openapi';

import { setEventGraph } from '@/models/EventGraphModel';

import { openDrawerEditLink } from '../../../model/modals-models/drawer-edit-link/DrawerEditLinkModel';
import { DrawerEditLink } from '../ui/DrawerEditLink';

const mockLink: LinkDTO = {
  id: 'test-id',
  fromId: 'node-1',
  toId: 'node-2',
  eventId: 'event-1',
};

const mockNodes: NodeDTO[] = [
  { id: 'node-1', name: 'Service A', type: NodeDTOTypeEnum.Service, belongsToGraph: [] },
  { id: 'node-2', name: 'Topic B', type: NodeDTOTypeEnum.Topic, belongsToGraph: [] },
];

const mockEventGraph: EventGraphDTO = {
  nodes: mockNodes,
  links: [mockLink],
  events: [{ id: 'event-1', name: 'Event 1', schema: '' }],
  tags: [],
};

describe('DrawerEditLink', () => {
  it('renders component', async () => {
    const scope = fork();

    await allSettled(setEventGraph, {
      scope,
      params: mockEventGraph,
    });

    await allSettled(openDrawerEditLink, {
      scope,
      params: 'test-id',
    });

    render(
      <Provider value={scope}>
        <DrawerEditLink />
      </Provider>
    );

    expect(await screen.findByTestId('drawer-edit-link')).toBeInTheDocument();
  });

  it('clicks on Cancel button', async () => {
    const scope = fork();
    const mockCloseFn = jest.fn();
    const watchedClose = createWatch({
      unit: openDrawerEditLink,
      fn: mockCloseFn,
      scope,
    });
    await allSettled(setEventGraph, {
      scope,
      params: mockEventGraph,
    });

    await allSettled(openDrawerEditLink, {
      scope,
      params: 'test-id',
    });

    render(
      <Provider value={scope}>
        <DrawerEditLink />
      </Provider>
    );

    const cancelButton = await screen.findByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockCloseFn).toHaveBeenCalled();
    watchedClose();
  });
});
