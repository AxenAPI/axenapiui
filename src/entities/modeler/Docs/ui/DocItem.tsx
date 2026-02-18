import { FC } from 'react';

import { DocItemProps } from '../types/types';

import { DocError } from './DocError';
import { DocTitle } from './DocTitle';

/** Представление элемента документа в списке */
export const DocItem: FC<DocItemProps> = ({ data, onViewDocument }) => (
  <div className="my-4">
    {data.status === 'success' ? (
      <DocTitle data={data.data} onViewDocument={onViewDocument} />
    ) : (
      <DocError data={data} />
    )}
  </div>
);
