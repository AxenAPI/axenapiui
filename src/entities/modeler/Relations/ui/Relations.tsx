import { Divider, Header, Layout, ScrollArea } from '@axenix/ui-kit';
import { IconArrowGuide, IconArrowLeftCircle, IconArrowRightCircle } from '@tabler/icons-react';

import { EmptyState } from '@shared/ui/EmptyState/ui/EmptyState';

import { useNodeRelations } from '../hooks/useNodeRelations';

import { GraphElementRelationsList } from './LinkList';

/** Представление связей нода */
export const Relations = () => {
  const result = useNodeRelations();

  if (!result) {
    return null;
  }

  const { onAddRelation, relations } = result;

  return relations.consuming.length || relations.producing.length ? (
    <ScrollArea className="vertical-scroll-area-full-height-width" orientation="vertical">
      {relations.consuming.length ? (
        <Layout>
          <Header
            title={
              <div className="heading-5 flex flex-row gap-1">
                Consuming <IconArrowRightCircle />
              </div>
            }
            style={{
              marginRight: 'auto',
            }}
          />
          <GraphElementRelationsList items={relations.consuming} />
          <Divider />
        </Layout>
      ) : null}
      {relations.producing.length ? (
        <Layout>
          <Header
            title={
              <div className="heading-5 flex flex-row gap-1">
                Producing <IconArrowLeftCircle />
              </div>
            }
            style={{
              marginRight: 'auto',
            }}
          />
          <GraphElementRelationsList items={relations.producing} />
        </Layout>
      ) : null}
    </ScrollArea>
  ) : (
    <EmptyState
      title="No relations added"
      description="Start by adding a new one."
      action={{ icon: <IconArrowGuide />, label: 'Add relation', onClick: onAddRelation }}
    />
  );
};
