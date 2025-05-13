import {Header as UIKitHeader, Menu as UIKitMenu} from '@axenix/ui-kit';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import {FC, useState} from 'react';
import {NavLink} from 'react-router-dom';

import {UiKitMenuButton} from '@/components/commons/buttons/UiKitMenuButton';
import {$edges, $ghostNodes, $nodes} from '@/components/commons/diagram/model/DiagramModel';
import {Logo} from '@/components/commons/logo/Logo';
import {DrawerExportAs} from '@/components/layout/header/DrawerExportAs';
import {HeaderButtons} from '@/components/layout/header/HeaderButtons';
import {PATHS} from '@/constants/routes';
import {$headerModel, openDrawerExportAs, setSelectedPage} from '@/models/HeaderMenuModel';
import {BurgerIcon} from '@/shared/ui/icons/BurgerMenu';
import {openDiagram} from '@/utils/openDiagram';
import {saveDiagram} from '@/utils/saveDiagram';

export const Header: FC = () => {
  const {selectedPage} = useUnit($headerModel);
  const [burgerOpen, setBurgerOpen] = useState(false);

  const headerClassNames = clsx(
    'bg-dark-item-bg flex min-h-[3.75rem] flex-row items-center px-6 text-white',
    '[&>div]:w-full [&>div]:justify-start',
    '[&>div>div:first-child]:hidden [&>div>div]:w-full [&>div>div]:items-center [&>div>div]:justify-between'
  );

  const handleBurgerMenuClick = () => {
    setBurgerOpen(prevState => !prevState);
  };

  const nodes = useUnit($nodes);
  const edges = useUnit($edges);
  const ghostNodes = useUnit($ghostNodes);

  return (
    <UIKitHeader data-testid="header" className={headerClassNames} defaultButtons={<HeaderButtons />}>
      <div className="flex items-center gap-16">
        <Logo />

        <div className="flex items-center gap-4">
          <BurgerIcon isOpen={burgerOpen} onClick={handleBurgerMenuClick} />

          {burgerOpen ? (
            <div className="flex items-center gap-2">
              <UiKitMenuButton onClick={() => openDiagram(ghostNodes)} text="Open" />

              <UiKitMenuButton onClick={() => saveDiagram(nodes, edges)} text="Save" />

              <UiKitMenuButton text="Save as" />

              <UiKitMenuButton onClick={openDrawerExportAs} text="Export as" />
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
              ]}
              mode="horizontal"
              theme="dark"
              defaultSelectedKeys={['Modeler']}
              selectedKeys={[selectedPage]}
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
