import { useCallback } from 'react';

import { API_URL } from '@shared/api';

export const useDownload = () => {
  const downloadFile = useCallback((url: string, fileName: string = '') => {
    const a = document.createElement('a');
    const isBlob = url.startsWith('blob:');
    a.href = API_URL + url;
    a.download = fileName || `file_${Date.now()}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Для Blob URL освобождаем память
    if (isBlob) {
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  }, []);

  const downloadTextAsFile = useCallback(
    (text: string, fileName: string, mimeType: string = 'text/plain') => {
      const blob = new Blob([text], { type: mimeType });
      const url = URL.createObjectURL(blob);
      downloadFile(url, fileName);
    },
    [downloadFile]
  );

  return { downloadFile, downloadTextAsFile };
};
