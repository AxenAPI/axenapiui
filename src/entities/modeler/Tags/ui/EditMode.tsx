import { Button, Header, Layout } from '@axenix/ui-kit';
import { IconTag } from '@tabler/icons-react';
import { FC } from 'react';

import { TagsEdit } from '@shared/ui/tags';

import { EditModeProps } from '../types/types';

import styles from './Tags.module.scss';

/** Режим редактирования тегов */
export const EditMode: FC<EditModeProps> = ({ availableTags, onChange, onClose, onCreateNew, tags }) => (
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
        <Button onClick={onClose} type="link" title="Done">
          Done
        </Button>
      }
    />
    <TagsEdit tags={tags} availableTags={availableTags} onChange={onChange} onCreateNew={onCreateNew} />
  </Layout>
);
