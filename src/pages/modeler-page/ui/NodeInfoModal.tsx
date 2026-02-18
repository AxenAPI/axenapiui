import { Tabs, Modal as UIKitModal } from '@axenix/ui-kit';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { FC } from 'react';
import { X } from 'tabler-icons-react';

import { NodeTitle } from '@entities/modeler/Relations';

import { getDocsTab } from '@widgets/modelerPage/NodeInfoModal/Docs';
import { getRelationsTab } from '@widgets/modelerPage/NodeInfoModal/Relations';
import { getSettingsTab } from '@widgets/modelerPage/NodeInfoModal/Settings';

import { logger } from '@shared/lib/logger';

import { useNodeDetailsModalStart } from '../hooks/useNodeDetailsModalStart';
import { $data, $selectedElementId, nodeDetailsModalClosed } from '../model/nodeInfoModal';
import { GraphNodeDetailModalProps } from '../types/types';

import styles from './NodeInfoModal.module.scss';

/** Модальное окно с деталями нода графа */
export const GraphNodeDetailModal: FC<GraphNodeDetailModalProps> = ({ onViewDocument }) => {
  const { isEmpty } = useNodeDetailsModalStart();
  const [selectedElementId, data] = useUnit([$selectedElementId, $data]);
  if (isEmpty) {
    // TODO: что делать если нет документации?
    logger.warn('GraphNodeDetailModal: нет документации');
  }

  const handleClose = () => {
    nodeDetailsModalClosed();
  };

  if (!data) return null;

  return (
    <UIKitModal
      className={clsx(styles.nodeInfoModal)}
      closeIcon={<X size={22} />}
      isOpen={selectedElementId !== null}
      closable
      afterClose={handleClose}
      onOk={handleClose}
      onCancel={handleClose}
      title={<NodeTitle element={data.node} />}
    >
      <Tabs
        items={[getRelationsTab(), getDocsTab({ onViewDocument }), getSettingsTab()]}
        rootClassName="graph-node-tabs"
      />
    </UIKitModal>
  );
};
