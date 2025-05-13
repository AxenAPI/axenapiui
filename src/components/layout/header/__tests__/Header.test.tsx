import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import {Header} from '@/components/layout/header/Header';

describe('/src/components/layout/header/Header.tsx', () => {
  test('renders the Header component with correct structure', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const headerElement = screen.getByTestId('header');
    expect(headerElement).toBeInTheDocument();

    expect(headerElement).toHaveClass(
      'bg-dark-item-bg',
      'flex',
      'min-h-[3.75rem]',
      'flex-row',
      'items-center',
      'px-6',
      'text-white'
    );
    const logoElement = screen.getByTestId('logo');
    expect(logoElement).toBeInTheDocument();

    const profileElement = screen.getByTestId('profile');
    expect(profileElement).toBeInTheDocument();

    const profileText = screen.getByText('Anonim');
    expect(profileText).toBeInTheDocument();
    expect(profileText).toHaveClass('text-placeholder');

    const userIcon = screen.getByTestId('icon-user-circle');
    expect(userIcon).toBeInTheDocument();
  });

  test('renders navigation menu with correct items', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const menuElement = screen.getByRole('menu');
    expect(menuElement).toBeInTheDocument();

    const modelerMenuItem = screen.getByText('Modeler');
    expect(modelerMenuItem).toBeInTheDocument();

    const jsonEditorMenuItem = screen.getByText('JSON Editor');
    expect(jsonEditorMenuItem).toBeInTheDocument();
  });
});
