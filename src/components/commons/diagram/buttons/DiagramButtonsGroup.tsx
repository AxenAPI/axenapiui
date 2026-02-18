import { Button, ButtonsGroup } from '@axenix/ui-kit';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { FC } from 'react';
import { ArrowGuide, CircleLetterH, FileCode, ServerCog, TopologyStar, Trash } from 'tabler-icons-react';

import { ImportFileButton } from '@/components/commons/diagram/buttons/ImportFileButton';
import { $selectedItems } from '@/components/commons/diagram/model/SelectedItemsModel';

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
    <div className="flex items-center gap-1">
      <ButtonsGroup
        className="flex items-center gap-1"
        buttonsConfig={[
          {
            buttonKey: 'firstButton',
            icon: <TopologyStar />,
            isBlock: false,
            isDisabled: false,
            isLoading: false,
            onClick: onAddService,
            style: {},
            tooltip: 'Service',
            placementTooltip: 'bottomLeft',
            shape: 'default',
            size: 'middle',
            type: 'default',
          },
          {
            buttonKey: 'secondButton',
            icon: <ServerCog />,
            isBlock: false,
            isDisabled: false,
            isLoading: false,
            onClick: onAddTopic,
            style: {},
            tooltip: 'Topic',
            placementTooltip: 'bottomLeft',
            size: 'middle',
            type: 'default',
          },
          {
            buttonKey: 'thirdButton',
            icon: <FileCode />,
            isBlock: false,
            isDisabled: false,
            isLoading: false,
            onClick: onAddEvent,
            style: {},
            tooltip: 'Event',
            placementTooltip: 'bottomLeft',
            size: 'middle',
            type: 'default',
          },
          {
            buttonKey: 'fourthButton',
            icon: <CircleLetterH />,
            isBlock: false,
            isDisabled: false,
            isLoading: false,
            onClick: onAddHttp,
            style: {},
            tooltip: 'HTTP',
            placementTooltip: 'bottomLeft',
            size: 'middle',
            type: 'default',
          },
          {
            buttonKey: 'fifthButton',
            icon: <ArrowGuide />,
            isBlock: false,
            isDisabled: false,
            isLoading: false,
            onClick: onAddLink,
            style: {},
            tooltip: 'Link',
            placementTooltip: 'bottomLeft',
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
        tooltip="Delete"
        placementTooltip="bottomLeft"
        type="default"
        isGhost={false}
      />
    </div>
  );
};
