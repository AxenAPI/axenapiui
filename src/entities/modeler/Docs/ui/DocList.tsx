import { Button, Header, Layout, List, ScrollArea } from '@axenix/ui-kit';
import { IconFileText, IconLink } from '@tabler/icons-react';
import { useUnit } from 'effector-react';
import { FC } from 'react';

import { EmptyState } from '@shared/ui/EmptyState/ui/EmptyState';

import { $docsResults, DocFetchResult, fetchDocsFx } from '../model/api.model';
import { $docsIds, linkDocumentRequested } from '../model/model';
import { DocsListProps } from '../types/types';

import { DocItem } from './DocItem';
import styles from './DocList.module.scss';

/** Представление списка документов нода */
export const DocsList: FC<DocsListProps> = ({ onViewDocument }) => {
  const [docs, docsResults, isLoading, onLinkClick] = useUnit([
    $docsIds,
    $docsResults,
    fetchDocsFx.pending,
    linkDocumentRequested,
  ]);

  const dataSource: {
    key: string;
    data: DocFetchResult;
  }[] = docsResults.map(docResult => {
    if (docResult.status === 'success') {
      return {
        key: docResult.data.uuid,
        data: docResult,
      };
    }
    return {
      key: docResult.uuid,
      data: docResult,
    };
  });

  if (!docs?.length) {
    return (
      <EmptyState
        title="No documents linked"
        description="Link object with a document."
        action={{ icon: <IconLink />, label: 'Link document', onClick: onLinkClick }}
      />
    );
  }

  return (
    <ScrollArea>
      <Layout>
        <Header
          className={styles.header}
          title={
            <div className="flex flex-row gap-1">
              <IconFileText /> Linked docs
            </div>
          }
          defaultButtons={
            <Button onClick={onLinkClick} type="link" title="Link document">
              Link
            </Button>
          }
        />
        <List
          dataSource={dataSource}
          renderItem={item => <DocItem data={item.data} onViewDocument={onViewDocument} />}
          loading={isLoading}
        />
        <List
          dataSource={dataSource}
          renderItem={item => <DocItem data={item.data} onViewDocument={onViewDocument} />}
          loading={isLoading}
        />
      </Layout>
    </ScrollArea>
  );
};
