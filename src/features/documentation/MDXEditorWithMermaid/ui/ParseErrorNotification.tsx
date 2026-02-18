import { Alert } from '@axenix/ui-kit';
import { FC } from 'react';

import { ParseErrorType } from '../model/editor.model';

interface ParseErrorNotificationProps {
  message: string;
  type: ParseErrorType;
  onClose?: () => void;
}

/**
 * Компонент для отображения ошибок/предупреждений парсинга Markdown
 */
export const ParseErrorNotification: FC<ParseErrorNotificationProps> = ({ message, onClose, type }) => {
  const isInfo = type === 'info';

  return (
    <Alert
      message={isInfo ? 'Разметка автоматически исправлена' : 'Ошибка парсинга разметки'}
      description={
        <div>
          <p>{message}</p>
          {isInfo ? (
            <p>Изменения будут сохранены автоматически.</p>
          ) : (
            <p>Исправьте ошибки в режиме исходного кода или они будут автоматически исправлены при сохранении.</p>
          )}
        </div>
      }
      type={type === 'info' ? 'info' : 'error'}
      closable
      onClose={onClose}
    />
  );
};
