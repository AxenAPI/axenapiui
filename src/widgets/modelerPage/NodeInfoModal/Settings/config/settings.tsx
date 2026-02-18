import { IconSettings } from '@tabler/icons-react';

import { SettingsTab } from '../ui/Settings';

/** Получить вкладку настроек нода */
export const getSettingsTab = () => ({
  children: <SettingsTab />,
  key: 'Settings',
  label: 'Settings',
  icon: <IconSettings />,
});
