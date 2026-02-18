import { logger } from '@shared/lib/logger';

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    logger.error('Не удалось скопировать текст: ', err);
  }
};
