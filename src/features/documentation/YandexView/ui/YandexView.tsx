import { Drawer } from '@axenix/ui-kit';
import { FC } from 'react';

import { useDrawerWidth } from '../hooks/useDrawerWidth';
import { useYandexWebview } from '../hooks/useYandexWebview';

import styles from './yandexView.module.scss';
import { YandexViewFooter } from './YandexViewFooter';
import { YandexViewWebview } from './YandexViewWebview';

export const YandexView: FC = () => {
  const { cancelImport, close, handleImportClick, isCapturingHeaders, isOpened, isReadyForImport, webviewRef } =
    useYandexWebview();
  const drawerWidth = useDrawerWidth({ isOpened });

  return (
    <Drawer
      className={styles.yandexView}
      isOpen={isOpened}
      onClose={close}
      width={drawerWidth}
      withDefaultFooter={false}
      customFooter={
        isReadyForImport ? (
          <YandexViewFooter isCapturing={isCapturingHeaders} onCancel={cancelImport} onImport={handleImportClick} />
        ) : (
          <></>
        )
      }
    >
      <div className="flex h-full flex-col">{isOpened && <YandexViewWebview webviewRef={webviewRef} />}</div>
    </Drawer>
  );
};
