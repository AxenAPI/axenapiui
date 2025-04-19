import {fireEvent, render, screen} from '@testing-library/react';
import {allSettled, createWatch, fork} from 'effector';
import {Provider} from 'effector-react';
import '@/__mocks__/matchMedia';

import {openDrawerEditLink} from '../../../model/modals-models/drawer-edit-link/DrawerEditLinkModel';
import {DrawerEditLink} from '../DrawerEditLink';

describe('DrawerEditLink', () => {
  const scope = fork();

  const renderDrawer = () =>
    render(
      <Provider value={scope}>
        <DrawerEditLink />
      </Provider>
    );

  it('renders component', async () => {
    await allSettled(openDrawerEditLink, {
      scope,
      params: 'test-id',
    });

    renderDrawer();

    expect(screen.getByTestId('drawer-edit-link')).toBeInTheDocument();
  });

  it('clicks on Cancel button', async () => {
    const mockCloseFn = jest.fn();

    const watchedClose = createWatch({
      unit: openDrawerEditLink,
      fn: mockCloseFn,
      scope,
    });

    await allSettled(openDrawerEditLink, {
      scope,
      params: 'test',
    });

    renderDrawer();

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockCloseFn).toHaveBeenCalledWith('test');
    watchedClose();
  });
});
