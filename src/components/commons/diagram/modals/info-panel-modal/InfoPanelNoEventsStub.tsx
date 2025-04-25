import {Button} from '@axenix/ui-kit';
import {useUnit} from 'effector-react';
import {FC, useCallback} from 'react';
import {ArrowGuide} from 'tabler-icons-react';

import {$eventGraph} from '@/models/EventGraphModel';

import {openDrawerAddLink} from '../../model/modals-models/drawer-add-link/DrawerAddLinkModel';
import {$infoPanelModal, closeInfoPanelModal} from '../../model/modals-models/info-panel-modal/InfoPanelModalModel';

export const InfoPanelNoEventsStub: FC = () => {
  const infoPanelModal = useUnit($infoPanelModal);
  const eventGraph = useUnit($eventGraph);

  const {itemId} = infoPanelModal;

  const nodes = eventGraph.nodes || [];
  const currentItem = itemId ? nodes.find(item => item && item.id === itemId) : null;

  const handleOpenDrawerAddLink = useCallback(() => {
    openDrawerAddLink(currentItem.id);
    closeInfoPanelModal();
  }, [currentItem.id]);

  return (
    <div className="bg-background-grey flex flex-col gap-3 p-4">
      <p>No connection found</p>

      <Button
        className="max-w-[90px]"
        icon={<ArrowGuide />}
        onClick={handleOpenDrawerAddLink}
        size="small"
        type="default"
      >
        Add Link
      </Button>
    </div>
  );
};
