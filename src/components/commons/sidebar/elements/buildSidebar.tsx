import { Badge, Dropdown } from '@axenix/ui-kit';
import { ItemType } from 'antd/lib/menu/interface';
import clsx from 'clsx';
import { AlertCircle, CloudLock } from 'tabler-icons-react';

import { nodeDetailsModalOpened } from '@pages/modeler-page/model/nodeInfoModal';

import { logger } from '@shared/lib/logger';
import { EventGraphDTO } from '@shared/openapi';

import { openDrawerEditLink } from '@/components/commons/diagram/model/modals-models/drawer-edit-link/DrawerEditLinkModel';
import { getLinkFormData } from '@/helpers/modal-helpers/getLinkFormData';
import { IconMap } from '@/helpers/nodes-value-map';
import { MenuItem, SidebarItems } from '@/types/common';

import { buildSidebarContextMenu } from '../config/buildSidebarContextMenu';
import { getLinkItemTitle } from '../utils/sidebar-helpers';
import { sortItems } from '../utils/sortItems';

import styles from './buildSidebar.module.scss';
import { LabelDropdown } from './LabelDropdown';

export const buildSidebar = (
  eventGraph: EventGraphDTO,
  hiddenItems: string[],
  eventGraphData: EventGraphDTO,
  openKeys: string[],
  sortOrders: Record<string, boolean>,
  toggleSortOrder: (key: string) => void
) => {
  const services: MenuItem[] = (eventGraph?.nodes || [])
    .filter(node => node.type === 'SERVICE' && node.name && node.id)
    .map(node => ({ name: node.name!, id: node.id!, type: node.type }));

  const topics: MenuItem[] = (eventGraph?.nodes || [])
    .filter(node => node.type === 'TOPIC' && node.name && node.id)
    .map(node => ({ name: node.name!, id: node.id!, type: node.type }));

  const events: MenuItem[] = (eventGraph?.events || [])
    .filter(event => event.name && event.id)
    .map(event => ({ name: event.name!, id: event.id!, type: 'EVENT' }));

  const https: MenuItem[] = (eventGraph?.nodes || [])
    .filter(node => node.type === 'HTTP' && node.name && node.id)
    .map(node => ({ name: node.name!, id: node.id!, type: node.type }));

  const buildData: SidebarItems = {
    services,
    topics,
    events,
    https,
  };

  const topicsStartIndex = buildData.services.length;
  const eventsStartIndex = topicsStartIndex + buildData.topics.length;
  const httpStartIndex = buildData.https.length + buildData.topics.length + buildData.events.length;
  const linkStartIndex = eventGraph?.links?.length;

  const rawNodes = eventGraphData?.nodes ?? [];
  // обогощаем ссылки наименованием для сортировки
  const enrichedLinks = (eventGraph?.links || []).map(link => {
    const { fromId, toId } = link;
    const { connectionType, httpNode, serviceNode, topicNode } = getLinkFormData(rawNodes, fromId, toId);

    return {
      ...link,
      name: getLinkItemTitle(serviceNode, topicNode, httpNode, connectionType),
    };
  });

  const items: ItemType[] = [
    {
      children: sortItems(buildData.services, sortOrders.sub1).map((service, index) => ({
        key: index,
        className: clsx(hiddenItems.includes(service.id) && 'opacity-30'),
        label: (
          <Dropdown trigger={['contextMenu']} menu={buildSidebarContextMenu(service, hiddenItems)}>
            <span className="pl-[10px]">{service.name}</span>
          </Dropdown>
        ),
        onClick: () => (service.id ? nodeDetailsModalOpened(service.id) : undefined),
      })),
      key: 'sub1',
      className: styles.itemMenu,
      label: (
        <LabelDropdown
          title="Services"
          hiddenItems={hiddenItems}
          menuItem={buildData.services}
          isOpen={openKeys.includes('sub1')}
          icon={IconMap.SERVICE}
          asc={sortOrders.sub1}
          onClick={e => {
            e.stopPropagation();
            toggleSortOrder('sub1');
          }}
        />
      ),
      expandIcon: () => null,
    },
    {
      children: sortItems(buildData.topics, sortOrders.sub2).map((topic, index) => ({
        key: topicsStartIndex + index,
        className: clsx(hiddenItems.includes(topic.id) && 'opacity-30'),
        label: (
          <Dropdown trigger={['contextMenu']} menu={buildSidebarContextMenu(topic, hiddenItems)}>
            <span className="pl-[10px]">{topic.name}</span>
          </Dropdown>
        ),
        itemIcon: <AlertCircle size={16} className="text-red-500" />,
        onClick: () => (topic.id ? nodeDetailsModalOpened(topic.id) : undefined),
      })),
      className: styles.itemMenu,
      key: 'sub2',
      label: (
        <LabelDropdown
          title="Topics"
          hiddenItems={hiddenItems}
          menuItem={buildData.topics}
          isOpen={openKeys.includes('sub2')}
          icon={IconMap.TOPIC}
          asc={sortOrders.sub2}
          onClick={e => {
            e.stopPropagation();
            toggleSortOrder('sub2');
          }}
        />
      ),
      expandIcon: () => null,
    },
    {
      children: sortItems(buildData.events, sortOrders.sub3).map((event, index) => ({
        key: eventsStartIndex + index,
        className: clsx(hiddenItems.includes(event.id) && 'opacity-30'),
        label: (
          <Dropdown trigger={['contextMenu']} menu={buildSidebarContextMenu(event, hiddenItems)}>
            <span className="pl-[10px]">{event.name}</span>
          </Dropdown>
        ),
        onClick: () => logger.log(`Click ${event.name}, id:${event.id}`),
        itemIcon: (
          <div className="flex items-center gap-1">
            <AlertCircle size={16} className="text-red-500" />
            <CloudLock size={16} className="text-neutral-300" />
          </div>
        ),
      })),
      className: styles.itemMenu,
      key: 'sub3',
      label: (
        <LabelDropdown
          title="Events"
          hiddenItems={hiddenItems}
          menuItem={buildData.events}
          isOpen={openKeys.includes('sub3')}
          icon={IconMap.EVENTS}
          asc={sortOrders.sub3}
          onClick={e => {
            e.stopPropagation();
            toggleSortOrder('sub3');
          }}
        />
      ),
      expandIcon: () => null,
    },
    {
      children: sortItems(buildData.https, sortOrders.sub4).map((http, index) => ({
        key: httpStartIndex + index,
        className: clsx(hiddenItems.includes(http.id) && 'opacity-30'),
        label: (
          <Dropdown trigger={['contextMenu']} menu={buildSidebarContextMenu(http, hiddenItems)}>
            <span className="pl-[10px]">{http.name}</span>
          </Dropdown>
        ),
        itemIcon: <AlertCircle size={16} className="text-red-500" />,
        onClick: () => (http.id ? nodeDetailsModalOpened(http.id) : undefined),
      })),
      className: styles.itemMenu,
      key: 'sub4',
      label: (
        <LabelDropdown
          title="HTTPS"
          hiddenItems={hiddenItems}
          menuItem={buildData.https}
          isOpen={openKeys.includes('sub4')}
          icon={IconMap.HTTP}
          asc={sortOrders.sub4}
          onClick={e => {
            e.stopPropagation();
            toggleSortOrder('sub4');
          }}
        />
      ),
      expandIcon: () => null,
    },
    {
      children: sortItems(enrichedLinks, sortOrders.sub5).map((link, index) => ({
        key: linkStartIndex + index,
        className: clsx(hiddenItems.includes(link.id) && 'opacity-30'),
        label: (
          <Dropdown>
            <span className="pl-[10px]">{link.name}</span>
          </Dropdown>
        ),
        onClick: () => openDrawerEditLink(link.id),
      })),
      className: styles.itemMenu,
      key: 'sub5',
      label: (
        <LabelDropdown
          title="Links"
          hasMenu={false}
          badge={<Badge type="default" count={enrichedLinks.length} />}
          hiddenItems={hiddenItems}
          menuItem={[]}
          isOpen={openKeys.includes('sub5')}
          icon={IconMap.LINK}
          asc={sortOrders.sub5}
          onClick={e => {
            e.stopPropagation();
            toggleSortOrder('sub5');
          }}
        />
      ),
      expandIcon: () => null,
    },
  ];

  return items;
};
