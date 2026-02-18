import { PageSpinner } from '@axenix/ui-kit';
import { useUnit } from 'effector-react';

import { globalBlockerModel } from '../model/globalBlocker.model';

export const GlobalBlocker = () => {
  const isBlocked = useUnit(globalBlockerModel.stores.$isUIBlocked);

  if (!isBlocked) {
    return null;
  }

  return <PageSpinner isFullscreen />;
};
