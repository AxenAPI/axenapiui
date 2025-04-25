import {Collapse as UIKitCollapse, NCollapse, Icon} from '@axenix/ui-kit';
import clsx from 'clsx';
import {FC} from 'react';
import {CodeDots} from 'tabler-icons-react';

import {IconMap} from '@/helpers/nodes-value-map';
import {InfoPanelItem} from '@/types/common';

import './InfoPanelCollapse.css';

export interface ICollapseProps {
  data: InfoPanelItem[];
}

const CollapseDataRow = ({title, value}: {title?: string; value?: string}) => (
  <div className={clsx('max-w-100% flex min-h-[1.25rem] gap-4', 'text-sm-normal align-middle')}>
    <div className="text-text-tertiary w-[5.625rem]">{title || null}</div>
    <div className="w-[12.5rem] overflow-hidden text-ellipsis whitespace-nowrap">{value || null}</div>
  </div>
);

export const InfoPanelCollapse: FC<ICollapseProps> = ({data}) => {
  const items: NCollapse.TCollapseItem[] = data.map(node => ({
    children: node?.events?.map(event => (
      <div className="flex flex-col gap-1">
        <div className="text-sm-strong flex h-[1.375rem] gap-2">
          <CodeDots size={20} />
          {event?.name}
        </div>
        <div className="flex flex-col align-middle">
          <CollapseDataRow title="description" value={event?.eventDescription} />
          <CollapseDataRow title="type" value={event?.eventType} />
        </div>
      </div>
    )),
    key: node.id,
    label: (
      <div className="flex items-center gap-2">
        <Icon size={20} icon={node.brokerType ? IconMap[node.brokerType] : IconMap[node.type]} />
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">{node?.name}</div>
      </div>
    ),
    className: 'bg-fill-alter rounded-none',
  }));

  return (
    <UIKitCollapse
      isGhost
      className="collapse-component flex max-w-full flex-col gap-3 overflow-hidden rounded-none p-0"
      expandIconPosition="end"
      items={items}
    />
  );
};
