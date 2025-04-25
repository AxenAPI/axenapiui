import {Modal as UIKitModal, Icon, Tag} from '@axenix/ui-kit';
import {IconServerCog} from '@tabler/icons-react';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import {FC} from 'react';
import {ArrowLeftCircle, ArrowRightCircle, X} from 'tabler-icons-react';

import {InfoPanelCollapse} from '@/components/commons/diagram/modals/info-panel-modal/InfoPanelCollapse';
import {$filterTags, addTagToFilter, removeTagFromFilter} from '@/components/commons/diagram/model/FilterTagsModel';
import {
  $infoPanelModal,
  closeInfoPanelModal,
} from '@/components/commons/diagram/model/modals-models/info-panel-modal/InfoPanelModalModel';
import {getInfoPanelData} from '@/helpers/modal-helpers/getInfoPanelData';
import {IconMap} from '@/helpers/nodes-value-map';
import {$eventGraph} from '@/models/EventGraphModel';

import {InfoPanelNoEventsStub} from './InfoPanelNoEventsStub';

export const InfoPanelModal: FC = () => {
  const infoPanelModal = useUnit($infoPanelModal);
  const eventGraph = useUnit($eventGraph);
  const filterTags = useUnit($filterTags);

  const {isOpen, itemId} = infoPanelModal;
  const showContent = isOpen && eventGraph && itemId;

  if (!showContent) return;

  const nodes = eventGraph.nodes || [];
  const links = eventGraph.links || [];
  const events = eventGraph.events || [];
  const currentItem = nodes.find(item => item && item.id === itemId);
  const icon = (currentItem?.brokerType && IconMap[currentItem?.brokerType]) ||
    (currentItem?.type && IconMap[currentItem.type]) || <IconServerCog size={16} />;

  const {consumingData, producingData} = getInfoPanelData(currentItem?.id, links, nodes, events);

  const handleClose = () => {
    closeInfoPanelModal();
  };

  const handleChangeTag = (tag: string) => {
    if (filterTags.includes(tag)) {
      removeTagFromFilter(tag);
    } else {
      addTagToFilter(tag);
    }
  };

  return (
    <UIKitModal
      className={clsx(
        'rounded-2 fixed top-[176px] right-[1.5rem] max-h-[90vh] max-w-[23.625rem] gap-5',
        'text-color-text'
      )}
      closeIcon={<X size={22} />}
      isOpen={isOpen}
      afterClose={handleClose}
      closable
      mask={false}
      onOk={handleClose}
      onCancel={handleClose}
      classNames={{
        // @ts-ignore
        content: 'pt-10 px-6 pb-8 h-full',
        header: 'm-0',
        footer: 'm-0',
      }}
    >
      <div className={clsx('flex flex-col gap-5')}>
        <div className="heading-4 flex flex-row items-center gap-1">
          <Icon icon={icon} size={20} />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{currentItem && currentItem.name}</span>
        </div>

        {currentItem?.tags && (
          <div className="flex flex-wrap gap-2">
            {currentItem?.tags.map(tag => (
              <Tag
                className="m-0"
                key={tag}
                isCheckable
                isChecked={filterTags.includes(tag)}
                onCheck={() => handleChangeTag(tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>
        )}

        {!consumingData.length && !producingData.length ? <InfoPanelNoEventsStub /> : null}

        {/* 264px - отступ сверху (176px), отступ (20px), заголовок модалки (28px), padding (40px) */}
        <div className={clsx('flex flex-col gap-8', 'scrollbar max-h-[calc(90vh-264px)] overflow-y-auto')}>
          {consumingData.length ? (
            <div className="flex flex-col gap-4">
              <div className="heading-5 flex gap-2">
                Consuming
                <ArrowRightCircle />
              </div>

              <InfoPanelCollapse data={consumingData} />
            </div>
          ) : null}
          {producingData.length ? (
            <div className="flex flex-col gap-4">
              <div className="heading-5 flex gap-2">
                Producing
                <ArrowLeftCircle />
              </div>

              <InfoPanelCollapse data={producingData} />
            </div>
          ) : null}
        </div>
      </div>
    </UIKitModal>
  );
};
