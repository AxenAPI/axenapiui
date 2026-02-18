import { Button, Header, Layout } from '@axenix/ui-kit';
import { IconTag } from '@tabler/icons-react';
import { FC } from 'react';

import { EmptyState } from '@shared/ui/EmptyState/ui/EmptyState';
import { TagsView } from '@shared/ui/tags';

import { ViewModeProps } from '../types/types';

import styles from './Tags.module.scss';

/** Режим просмотра тегов */
export const ViewMode: FC<ViewModeProps> = ({ onStartEdit, tags }) =>
  tags?.length ? (
    <Layout>
      <Header
        className={styles.header}
        title={
          <div className="heading-5 flex flex-row gap-1">
            <IconTag />
            Tags
          </div>
        }
        defaultButtons={
          <Button onClick={onStartEdit} type="link" title="Add tag">
            Add tag
          </Button>
        }
      />
      <TagsView tags={tags} />
    </Layout>
  ) : (
    <EmptyState
      title="No tags added"
      description="Start by adding a new one."
      action={{ icon: <IconTag />, label: 'Add tag', onClick: onStartEdit }}
    />
  );
