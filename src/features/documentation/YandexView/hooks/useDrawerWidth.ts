import { useEffect, useState } from 'react';

import { SIDEBAR_WIDTH } from '@/constants/common';

interface UseDrawerWidthProps {
  isOpened: boolean;
}

export const useDrawerWidth = ({ isOpened }: UseDrawerWidthProps) => {
  const [drawerWidth, setDrawerWidth] = useState(window.innerWidth - SIDEBAR_WIDTH);

  useEffect(() => {
    const handleResize = () => {
      setDrawerWidth(window.innerWidth - SIDEBAR_WIDTH);
    };

    window.addEventListener('resize', handleResize);

    if (isOpened) {
      handleResize(); // Set initial width on open
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isOpened]);

  return drawerWidth;
};
