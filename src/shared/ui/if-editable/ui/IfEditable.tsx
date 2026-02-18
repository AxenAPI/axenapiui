import { FC } from 'react';

import { IS_READ_ONLY } from '@/constants/common';

import { IfEditableProps } from '../types/types';

import { IfEditableBtn } from './IfEditableBtn';

/**
 * Заворачивает переданный JSX элемент в редактируемый контейнер с возможностью вызова функции редактирования,
 * при условии, что приложение не в режиме "только для чтения".
 */
export const IfEditable: FC<IfEditableProps> = ({ element, onClick }) =>
  IS_READ_ONLY ? (
    element
  ) : (
    <div>
      {element}
      <IfEditableBtn onClick={onClick} />
    </div>
  );
