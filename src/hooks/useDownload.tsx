import {useCallback} from 'react';

export const useDownload = () => {
  const downloadFile = useCallback((url: string, fileName: string = '') => {
    const a = document.createElement('a');
    a.href = process.env.CLOUD_SERVER_URL + url;
    a.download = fileName || `file_${Date.now()}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Для Blob URL освобождаем память
    if (url.startsWith('blob:')) {
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  }, []);

  const downloadTextAsFile = useCallback(
    (text: string, fileName: string, mimeType: string = 'text/plain') => {
      const blob = new Blob([text], {type: mimeType});
      const url = URL.createObjectURL(blob);
      downloadFile(url, fileName);
    },
    [downloadFile]
  );

  return {downloadFile, downloadTextAsFile};
};
