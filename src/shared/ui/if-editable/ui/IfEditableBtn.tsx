import { Button } from '@axenix/ui-kit';
import { FC } from 'react';

import { IS_READ_ONLY } from '@/constants/common';

import { IfEditableBtnProps } from '../types/types';

export const IfEditableBtn: FC<IfEditableBtnProps> = ({ onClick }) =>
  IS_READ_ONLY ? null : (
    <Button onClick={() => onClick()} type="link">
      Edit
    </Button>
  );
