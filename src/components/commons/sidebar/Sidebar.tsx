import {ButtonsGroup, InputSearch, Menu} from '@axenix/ui-kit';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import {FC, useState} from 'react';
import {CloudUpload, FileCode, FileExport, Reload} from 'tabler-icons-react';

import {openDrawerExport} from '@/components/commons/diagram/model/modals-models/drawer-export/DrawerExportModel';
import {EMPTY_CHAR} from '@/constants/common';
import {buildSidebar} from '@/helpers/buildSidebar';
import {filterSidebarPanel} from '@/helpers/filterSidebarPanel';
import {$eventGraph} from '@/models/EventGraphModel';

import {$hiddenItems} from '../diagram/model/HiddenItemsModel';

import './Sidebar.css';

export const Sidebar: FC = () => {
  const hiddenItems = useUnit($hiddenItems);
  const eventGraphData = useUnit($eventGraph);
  const [filterText, setFilterText] = useState<string>(EMPTY_CHAR);
  const filteredMenuItems = filterSidebarPanel(eventGraphData, filterText);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // состояние сортировки: true = A-Z, false = Z-A
  const [sortOrders, setSortOrders] = useState<Record<string, boolean>>({
    sub1: true,
    sub2: true,
    sub3: true,
    sub4: true,
    sub5: true,
  });

  // Функция переключения сортировки по ключу раздела
  const toggleSortOrder = (key: string) => {
    setSortOrders(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const containerClassName = clsx('h-full w-[20rem] bg-white shrink-0 pt-12', 'side-bar');

  // 215px - высота нижней панели с кнопками + отступ от верхней границы экрана
  const scrollAreaClassName = clsx(`w-full overflow-y-scroll scroll-auto`, 'scrollbar', 'h-[calc(100vh_-_215px)]');
  return (
    <div className={containerClassName} data-testid="sidebar">
      <div className="flex w-full px-4 pb-3 pl-[35px]">
        <InputSearch value={filterText} placeholder="Search object" onChange={e => setFilterText(e.target.value)} />
      </div>
      <div className={scrollAreaClassName}>
        <Menu
          onOpenChange={setOpenKeys}
          items={buildSidebar(filteredMenuItems, hiddenItems, eventGraphData, openKeys, sortOrders, toggleSortOrder)}
          mode="inline"
        />
      </div>

      <div className="absolute bottom-0 h-[4rem] w-[20rem] border-t border-gray-200 bg-white p-3">
        <ButtonsGroup
          className="flex items-center justify-start gap-3"
          buttonsConfig={[
            {
              buttonKey: 'export-button',
              icon: <FileExport />,
              iconPosition: 'start',
              children: 'Export',
              isBlock: false,
              isDisabled: !eventGraphData,
              isLoading: false,
              onClick: () => openDrawerExport(),
              type: 'primary',
            },
            {
              buttonKey: 'upload-button',
              icon: <CloudUpload />,
              isBlock: false,
              isDisabled: false,
              isLoading: false,
              onClick: () => console.log('Upload'),
            },
            {
              buttonKey: 'reload-button',
              icon: <Reload />,
              isBlock: false,
              isDisabled: false,
              isLoading: false,
              onClick: () => console.log('Reload'),
            },
            {
              buttonKey: 'filecode-button',
              icon: <FileCode />,
              isBlock: false,
              isDisabled: false,
              isLoading: false,
              onClick: () => console.log('File'),
            },
          ]}
        />
      </div>
    </div>
  );
};
