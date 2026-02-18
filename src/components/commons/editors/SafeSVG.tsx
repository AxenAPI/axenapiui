import { FC, useEffect, useRef } from 'react';

import { EMPTY_CHAR } from '@/constants/common';

export const SafeSVG: FC<{ svgString: string }> = ({ svgString }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = EMPTY_CHAR;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.documentElement;

    if (svgElement.tagName.toLowerCase() === 'svg') {
      ref.current.appendChild(svgElement);
    } else {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Произошла ошибка при парсинге SVG.';
      errorDiv.style.color = 'red';
      ref.current.appendChild(errorDiv);
    }
  }, [svgString]);

  return <div ref={ref} style={{ maxWidth: '100%' }} />;
};
