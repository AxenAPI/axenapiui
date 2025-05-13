import {Layout as UIKitLayout, Content} from '@axenix/ui-kit';
import {FC, ReactNode} from 'react';

import {Header} from '@/components/layout/header/Header';

export const Layout: FC<{children: ReactNode}> = ({children}: {children: ReactNode}) => (
  <UIKitLayout data-testid="layout">
    <Header />
    <Content className="flex h-full min-w-full flex-col">{children}</Content>
  </UIKitLayout>
);
