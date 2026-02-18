import { Button } from '@axenix/ui-kit';
import { IconAlertTriangle } from '@tabler/icons-react';
import { FC } from 'react';

import { DocErrorProps } from '../types/types';

export const DocError: FC<DocErrorProps> = ({ data }) => (
  <Button title="Этот объект был удален. Обновите документацию или удалите связь." type="text">
    <IconAlertTriangle /> {data.uuid}
  </Button>
);
