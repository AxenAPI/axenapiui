import { Button } from '@axenix/ui-kit';
import { FC } from 'react';

import { DocTitleProps } from '../types/types';

export const DocTitle: FC<DocTitleProps> = ({ data, onViewDocument }) => (
  <Button title={data.title || data.uuid} type="text" onClick={() => onViewDocument?.(data.uuid)}>
    {data.title || data.uuid}
  </Button>
);
