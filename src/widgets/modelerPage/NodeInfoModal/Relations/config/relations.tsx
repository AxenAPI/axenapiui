import { IconCirclesRelation } from '@tabler/icons-react';

import { Relations } from '@entities/modeler/Relations';

/** Получить вкладку связей нода для модального окна */
export const getRelationsTab = () => ({
  children: <Relations />,
  key: 'Relations',
  icon: <IconCirclesRelation />,
  label: 'Relations',
});
