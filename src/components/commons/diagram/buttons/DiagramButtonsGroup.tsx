import {Button, ButtonsGroup} from '@axenix/ui-kit';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import {FC} from 'react';
import {ArrowGuide, CircleLetterH, FileCode, ServerCog, TopologyStar, Trash} from 'tabler-icons-react';

import {ImportFileButton} from '@/components/commons/diagram/buttons/ImportFileButton';
import {$selectedItems} from '@/components/commons/diagram/model/SelectedItemsModel';

export type TDiagramGroupButtonsProps = {
  onAddService: () => void;
  onAddTopic: () => void;
  onAddEvent: () => void;
  onAddHttp: () => void;
  onAddLink: () => void;
  onDelete: () => void;
};
export const DiagramGroupButtons: FC<TDiagramGroupButtonsProps> = ({
  onAddEvent,
  onAddHttp,
  onAddLink,
  onAddService,
  onAddTopic,
  onDelete,
}) => {
  const selectedItems = useUnit($selectedItems);

  return (
    <div className="flex items-center gap-2">
      <ButtonsGroup
        className="flex items-center gap-2"
        buttonsConfig={[
          {
            buttonKey: 'firstButton',
            icon: <TopologyStar />,
            children: 'Service',
            isBlock: false,
            isDisabled: false,
            isLoading: false,
            onClick: onAddService,
            style: {},
            title: 'Service',
            shape: 'default',
            size: 'middle',
            type: 'default',
          },
          {
            buttonKey: 'secondButton',
            icon: <ServerCog />,
            children: 'Topic',
            isBlock: false,
            isDisabled: false,
            isLoading: false,
            onClick: onAddTopic,
            style: {},
            title: 'Topic',
            size: 'middle',
            type: 'default',
          },
          {
            buttonKey: 'thirdButton',
            icon: <FileCode />,
            children: 'Event',
            isBlock: false,
            isDisabled: false,
            isLoading: false,
            onClick: onAddEvent,
            style: {},
            title: 'Event',
            size: 'middle',
            type: 'default',
          },
          {
            buttonKey: 'fourthButton',
            icon: <CircleLetterH />,
            children: 'HTTP',
            isBlock: false,
            isDisabled: false,
            isLoading: false,
            onClick: onAddHttp,
            style: {},
            title: 'HTTP',
            size: 'middle',
            type: 'default',
          },
          {
            buttonKey: 'fifthButton',
            icon: <ArrowGuide />,
            children: 'Link',
            isBlock: false,
            isDisabled: false,
            isLoading: false,
            onClick: onAddLink,
            style: {},
            title: 'Link',
            size: 'middle',
            type: 'default',
          },
        ]}
      />
      <ImportFileButton />
      <Button
        key="deleteBtn"
        className={clsx(selectedItems.length ? 'text-color-error' : '')}
        icon={<Trash />}
        iconPosition="start"
        isBlock={false}
        isDisabled={!selectedItems.length}
        isLoading={false}
        onClick={onDelete}
        shape="default"
        size="middle"
        title="Delete"
        type="default"
        isGhost={false}
      >
        Delete
      </Button>
    </div>
  );
};
