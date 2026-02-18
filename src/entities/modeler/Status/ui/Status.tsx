import { Header, Layout } from '@axenix/ui-kit';
import { IconFileCheck } from '@tabler/icons-react';
import { useUnit } from 'effector-react';
import { FC } from 'react';

import { $status } from '../model/model';

/** TODO: Статус нода */
export const NodeStatus: FC = () => {
  const status = useUnit($status);
  return (
    <Layout>
      <Header
        title={
          <div className="heading-5 flex flex-row gap-1">
            <IconFileCheck /> Status
          </div>
        }
        style={{
          marginRight: 'auto',
        }}
      />
      <div>{status}</div>
    </Layout>
  );
};
