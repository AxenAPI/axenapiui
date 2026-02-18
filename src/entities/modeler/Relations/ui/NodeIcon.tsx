import { IconServerCog } from '@tabler/icons-react';

import { NodeDTO } from '@shared/openapi';

import { IconMap } from '@/helpers/nodes-value-map';

/** Иконка нода в зависимости от его брокера или типа */
export const NodeIcon = (element: NodeDTO) =>
  (element.brokerType && IconMap[element.brokerType]) || (element.type && IconMap[element.type]) || <IconServerCog />;
