import {Badge, Dropdown} from '@axenix/ui-kit';
import {ItemType} from 'antd/lib/menu/interface';
import clsx from 'clsx';
import isEmpty from 'lodash/isEmpty';
import {cloneElement} from 'react';
import {AlertCircle, CloudLock} from 'tabler-icons-react';

import {openDrawerEditLink} from '@/components/commons/diagram/model/modals-models/drawer-edit-link/DrawerEditLinkModel';
import {openInfoPanelModal} from '@/components/commons/diagram/model/modals-models/info-panel-modal/InfoPanelModalModel';
import {buildSidebarHeaderContextMenu} from '@/helpers/buildSidebarHeaderContextMenu';
import {getLinkFormData} from '@/helpers/modal-helpers/getLinkFormData';
import {EventGraphDTO} from '@/shared/api/event-graph-api';
import {ExpandIcon} from '@/shared/ui/components/ExpandIcon';
import {MenuItem, SidebarItems} from '@/types/common';

import {buildSidebarContextMenu} from './buildSidebarContextMenu';
import {IconMap} from './nodes-value-map';
import {getLinkItemTitle} from './sidebar-helpers';
import {sortItems, SortOrderLabel} from './utils';

export const buildSidebar = (
  eventGraph: EventGraphDTO,
  hiddenItems: string[],
  eventGraphData: EventGraphDTO,
  openKeys: string[],
  sortOrders: Record<string, boolean>,
  toggleSortOrder: (key: string) => void
) => {
  const services: MenuItem[] =
    eventGraph?.nodes
      ?.filter(node => node.type === 'SERVICE' && node.name)
      .map(node => ({name: node.name, id: node.id, type: node.type})) || [];

  const topics: MenuItem[] =
    eventGraph?.nodes
      ?.filter(node => node.type === 'TOPIC' && node.name)
      .map(node => ({name: node.name, id: node.id, type: node.type})) || [];

  const events: MenuItem[] = eventGraph?.events?.map(event => ({name: event.name, id: event.id, type: 'EVENT'})) || [];

  const https: MenuItem[] =
    eventGraph?.nodes
      ?.filter(node => node.type === 'HTTP' && node.name)
      .map(node => ({name: node.name, id: node.id, type: node.type})) || [];

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
  const enrichedLinks = eventGraph.links.map(link => {
    const {fromId, toId} = link;
    const {connectionType, httpNode, serviceNode, topicNode} = getLinkFormData(rawNodes, fromId, toId);

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
        onClick: () => openInfoPanelModal(service.id),
      })),
      key: 'sub1',
      label: (
        <Dropdown
          trigger={['contextMenu']}
          menu={!isEmpty(buildData.services) && buildSidebarHeaderContextMenu(buildData.services, hiddenItems)}
        >
          <ExpandIcon isOpen={openKeys.includes('sub1')} />
          {cloneElement(IconMap.SERVICE, {width: 17, height: 17})}
          Services
          <Badge type="default" count={buildData.services.length} />
          <button
            onClick={e => {
              e.stopPropagation();
              toggleSortOrder('sub1');
            }}
            style={{background: 'none', border: 'none', cursor: 'pointer'}}
            aria-label="Toggle sort order"
          >
            {SortOrderLabel(sortOrders.sub1)}
          </button>
        </Dropdown>
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
        onClick: () => openInfoPanelModal(topic.id),
      })),
      key: 'sub2',
      label: (
        <Dropdown
          trigger={['contextMenu']}
          menu={!isEmpty(buildData.topics) && buildSidebarHeaderContextMenu(buildData.topics, hiddenItems)}
        >
          <ExpandIcon isOpen={openKeys.includes('sub2')} />
          {cloneElement(IconMap.TOPIC, {width: 17, height: 17})}
          Topics
          <Badge type="default" count={buildData.topics.length} />
          <button
            onClick={e => {
              e.stopPropagation();
              toggleSortOrder('sub2');
            }}
            style={{background: 'none', border: 'none', cursor: 'pointer'}}
            aria-label="Toggle sort order"
          >
            {SortOrderLabel(sortOrders.sub2)}
          </button>
        </Dropdown>
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
        onClick: () => console.log(`Click ${event.name}, id:${event.id}`),
        itemIcon: (
          <div className="flex items-center gap-1">
            <AlertCircle size={16} className="text-red-500" />
            <CloudLock size={16} className="text-neutral-300" />
          </div>
        ),
      })),
      key: 'sub3',
      label: (
        <Dropdown
          trigger={['contextMenu']}
          menu={!isEmpty(buildData.events) && buildSidebarHeaderContextMenu(buildData.events, hiddenItems, true)}
        >
          <ExpandIcon isOpen={openKeys.includes('sub3')} />
          {cloneElement(IconMap.EVENTS, {width: 17, height: 17})}
          Events
          <Badge type="default" count={buildData.events.length} />
          <button
            onClick={e => {
              e.stopPropagation();
              toggleSortOrder('sub3');
            }}
            style={{background: 'none', border: 'none', cursor: 'pointer'}}
            aria-label="Toggle sort order"
          >
            {SortOrderLabel(sortOrders.sub3)}
          </button>
        </Dropdown>
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
        onClick: () => openInfoPanelModal(http.id),
      })),
      key: 'sub4',
      label: (
        <Dropdown
          trigger={['contextMenu']}
          menu={!isEmpty(buildData.https) && buildSidebarHeaderContextMenu(buildData.https, hiddenItems)}
        >
          <ExpandIcon isOpen={openKeys.includes('sub4')} />
          {cloneElement(IconMap.HTTP, {width: 17, height: 17})}
          HTTP-nodes
          <Badge type="default" count={buildData.https.length} />
          <button
            onClick={e => {
              e.stopPropagation();
              toggleSortOrder('sub4');
            }}
            style={{background: 'none', border: 'none', cursor: 'pointer'}}
            aria-label="Toggle sort order"
          >
            {SortOrderLabel(sortOrders.sub4)}
          </button>
        </Dropdown>
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
      key: 'sub5',
      label: (
        <Dropdown>
          <ExpandIcon isOpen={openKeys.includes('sub5')} />
          {cloneElement(IconMap.LINK, {width: 17, height: 17})}
          Links
          <Badge type="default" count={eventGraph?.links?.length} />
          <button
            onClick={e => {
              e.stopPropagation();
              toggleSortOrder('sub5');
            }}
            style={{background: 'none', border: 'none', cursor: 'pointer'}}
            aria-label="Toggle sort order"
          >
            {SortOrderLabel(sortOrders.sub5)}
          </button>
        </Dropdown>
      ),
      expandIcon: () => null,
    },
  ];

  return items;
};
