import { useUnit } from 'effector-react';

import { sidebarToggleModel } from '../model/sidebarToggle.model';

export const useSidebarToggle = () => {
  const { isSidebarCollapsed, toggleSidebar } = useUnit({
    isSidebarCollapsed: sidebarToggleModel.stores.$isSidebarCollapsed,
    toggleSidebar: sidebarToggleModel.events.toggleSidebar,
  });

  return {
    isSidebarCollapsed,
    toggleSidebar,
  };
};
