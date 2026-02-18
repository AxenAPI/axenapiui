import { Header as UIKitHeader, Menu as UIKitMenu } from '@axenix/ui-kit';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { About as AboutButton } from '@features/about';

import { BurgerIcon } from '@shared/ui/icons/BurgerMenu';

import { UiKitMenuButton } from '@/components/commons/buttons/UiKitMenuButton';
import { $edges } from '@/components/commons/diagram/model/DiagramModel';
import { Logo } from '@/components/commons/logo/Logo';
import { DrawerExportAs } from '@/components/layout/header/DrawerExportAs';
import { HeaderButtons } from '@/components/layout/header/HeaderButtons';
import { PATHS } from '@/constants/routes';
import { $eventGraph } from '@/models/EventGraphModel';
import { $headerModel, openDrawerExportAs, setSelectedPage } from '@/models/HeaderMenuModel';
import { openDiagram } from '@/utils/openDiagram';
import { saveDiagram } from '@/utils/saveDiagram';

export const Header: FC = () => {
  const { edges, eventGraph, headerModel } = useUnit({
    eventGraph: $eventGraph,
    edges: $edges,
    headerModel: $headerModel,
  });

  const [burgerOpen, setBurgerOpen] = useState(false);

  const headerClassNames = clsx(
    'bg-dark-item-bg flex min-h-[3.75rem] flex-row items-center px-6 text-white',
    '[&>div]:w-full [&>div]:justify-start',
    '[&>div>div:first-child]:hidden [&>div>div]:w-full [&>div>div]:items-center [&>div>div]:justify-between'
  );

  const handleBurgerMenuClick = () => {
    setBurgerOpen(prevState => !prevState);
  };

  return (
    <UIKitHeader data-testid="header" className={headerClassNames} defaultButtons={<HeaderButtons />}>
      <div className="flex items-center gap-16">
        <Logo />

        <div className="flex items-center gap-4">
          <BurgerIcon isOpen={burgerOpen} onClick={handleBurgerMenuClick} />

          {burgerOpen ? (
            <div className="flex items-center gap-2">
              <UiKitMenuButton onClick={() => openDiagram()} text="Open" />

              <UiKitMenuButton onClick={() => saveDiagram({ ...eventGraph, edges })} text="Save" />

              <UiKitMenuButton text="Save as" />

              <UiKitMenuButton onClick={openDrawerExportAs} text="Export as" />
              <AboutButton />
            </div>
          ) : (
            <UIKitMenu
              items={[
                {
                  key: 'Modeler',
                  label: (
                    <NavLink to={PATHS.root} onClick={() => setSelectedPage('Modeler')}>
                      Modeler
                    </NavLink>
                  ),
                },
                {
                  key: 'Editor',
                  label: (
                    <NavLink to={PATHS.editor} onClick={() => setSelectedPage('Editor')}>
                      JSON Editor
                    </NavLink>
                  ),
                },
                {
                  key: 'Document',
                  label: (
                    <NavLink to={PATHS.documentation} onClick={() => setSelectedPage('Document')}>
                      Documentation
                    </NavLink>
                  ),
                },
                {
                  key: 'RepositoryManager',
                  label: (
                    <NavLink to={PATHS.repositoryManager} onClick={() => setSelectedPage('RepositoryManager')}>
                      Repository manager
                    </NavLink>
                  ),
                },
              ]}
              mode="horizontal"
              theme="dark"
              defaultSelectedKeys={['Modeler']}
              selectedKeys={[headerModel.selectedPage]}
              style={{
                minWidth: '209px',
              }}
            />
          )}
        </div>
      </div>

      <DrawerExportAs />
    </UIKitHeader>
  );
};
