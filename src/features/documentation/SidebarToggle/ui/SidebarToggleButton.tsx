import { Button } from '@axenix/ui-kit';
import { LayoutSidebar } from 'tabler-icons-react';

import { useSidebarToggle } from '../hooks/useSidebarToggle';

export const SidebarToggleButton = () => {
  const { isSidebarCollapsed, toggleSidebar } = useSidebarToggle();

  return (
    <Button
      className="border-0"
      aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      onClick={toggleSidebar}
    >
      <LayoutSidebar />
      {isSidebarCollapsed ? 'Show' : ''}
    </Button>
  );
};
