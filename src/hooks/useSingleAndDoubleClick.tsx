import { MouseEvent, useEffect, useState } from 'react';

export const useSingleAndDoubleClick = (
  actionSimpleClick: (event?: MouseEvent) => void,
  actionDoubleClick: (event?: MouseEvent) => void,
  delay = 250
) => {
  const [click, setClick] = useState(0);
  const [lastEvent, setLastEvent] = useState<MouseEvent | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (click === 1) {
        actionSimpleClick(lastEvent || undefined);
      }
      setClick(0);
      setLastEvent(null);
    }, delay);

    if (click === 2) {
      actionDoubleClick(lastEvent || undefined);
      setLastEvent(null);
    }

    return () => clearTimeout(timer);
  }, [actionDoubleClick, actionSimpleClick, click, delay, lastEvent]);

  return (event?: MouseEvent) => {
    setLastEvent(event || null);
    setClick(prev => prev + 1);
  };
};
