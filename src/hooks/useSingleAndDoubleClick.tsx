import React, {useState, useEffect} from 'react';

export const useSingleAndDoubleClick = (
  actionSimpleClick: (event?: React.MouseEvent) => void,
  actionDoubleClick: (event?: React.MouseEvent) => void,
  delay = 250
) => {
  const [click, setClick] = useState(0);
  const [lastEvent, setLastEvent] = useState<React.MouseEvent | null>(null);

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

  return (event?: React.MouseEvent) => {
    setLastEvent(event || null);
    setClick(prev => prev + 1);
  };
};
