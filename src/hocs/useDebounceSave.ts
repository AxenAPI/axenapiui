import {useRef, useEffect} from 'react';

import {saveFile} from '@/utils/saveFile';

const SAVE_DELAY_MS = 5000;

/**
 * Функция для сохранения изменений в файле документации через определенное время при изменении файла
 *
 * @param {string} fullPath - Полный путь до файла, включая его расширение md
 * @param {string} shortPath - Относительный путь до файла, включая его расширение md
 * @param {string} markdown - Содержимое файла
 * @param {boolean} isDirty - Флаг того, что в файле произошли изменения
 */
export function useDebouncedSave(fullPath: string, shortPath: string, markdown: string, isDirty: boolean) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isDirty) return;
    if (!fullPath || !markdown) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveFile(fullPath, markdown, shortPath);
    }, SAVE_DELAY_MS);

    // Очистка таймера при размонтировании или изменении shortPath/content
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fullPath, markdown, shortPath, isDirty]);
}
