import { ImportData } from '@/types/common';

export const saveDiagram = (importData: ImportData) => {
  const json = JSON.stringify(importData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'reactflow-diagram.json';
  link.click();

  URL.revokeObjectURL(url);
};
