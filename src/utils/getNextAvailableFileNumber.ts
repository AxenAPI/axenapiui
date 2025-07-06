import {DocNodes} from '@/types/common';

export const getNextAvailableFileNumber = (files: DocNodes[]) => {
  const usedNumbers = new Set<number>();

  files.forEach(file => {
    const match = file.title.match(/^File(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > 0) {
        usedNumbers.add(num);
      }
    }
  });

  let i = 1;
  while (usedNumbers.has(i)) {
    i++;
  }
  return i;
};
