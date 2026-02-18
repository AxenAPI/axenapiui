import { editorRootElementRef$, iconComponentFor$, useCellValues, useTranslation } from '@mdxeditor/editor';
import * as RadixPopover from '@radix-ui/react-popover';
import * as RadixToolbar from '@radix-ui/react-toolbar';
import classNames from 'classnames';
import { FC, memo, useEffect, useState } from 'react';

import { useColumnOperations } from '../hooks/useColumnOperations';
import { DEFAULT_CELL_ALIGNMENT, POPOVER_SIDE_OFFSET } from '../types/constants';
import { ColumnEditorProps } from '../types/types';

import styles from './html-table.module.css';

export const ColumnEditor: FC<ColumnEditorProps> = memo(
  // CHECKME: стоит ли создать еще один store для highlightedCoordinates
  ({ align, colIndex, highlightedCoordinates, lexicalTable, parentEditor, store }) => {
    const [editorRootElementRef, iconComponentFor] = useCellValues(editorRootElementRef$, iconComponentFor$);
    const t = useTranslation();
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
      if (editorRootElementRef?.current) {
        setPortalContainer(editorRootElementRef.current);
      }
    }, [editorRootElementRef]);

    // CHECKME: может лучше ID
    const { handleAlignChange, handleDelete, handleInsertLeft, handleInsertRight } = useColumnOperations(
      parentEditor,
      lexicalTable,
      colIndex,
      store
    );

    // CHECKME: Объявлять константы снаружи компонента?
    const columnMenuLabel = t('table.columnMenu', 'Column menu');
    const alignLeftLabel = t('table.alignLeft', 'Align left');
    const alignCenterLabel = t('table.alignCenter', 'Align center');
    const alignRightLabel = t('table.alignRight', 'Align right');
    const alignJustifyLabel = t('table.alignJustify', 'Align justify');
    const insertLeftLabel = t('table.insertColumnLeft', 'Insert a column to the left of this one');
    const insertRightLabel = t('table.insertColumnRight', 'Insert a column to the right of this one');
    const deleteColumnLabel = t('table.deleteColumn', 'Delete this column');
    const textAlignmentLabel = t('table.textAlignment', 'Text alignment');

    return (
      <RadixPopover.Root>
        <RadixPopover.PopoverTrigger
          aria-label={columnMenuLabel}
          className={styles.tableColumnEditorTrigger}
          data-active={highlightedCoordinates[0] === colIndex}
          title={columnMenuLabel}
        >
          {iconComponentFor('more_vert')}
        </RadixPopover.PopoverTrigger>

        <RadixPopover.Portal container={portalContainer}>
          <RadixPopover.PopoverContent
            className={classNames(styles.tableColumnEditorPopoverContent)}
            onOpenAutoFocus={e => e.preventDefault()}
            side="top"
            sideOffset={POPOVER_SIDE_OFFSET}
          >
            <RadixToolbar.Root className={styles.tableColumnEditorToolbar}>
              <RadixToolbar.ToggleGroup
                aria-label={textAlignmentLabel}
                className={styles.toggleGroupRoot}
                onValueChange={handleAlignChange}
                type="single"
                // CHECKME: гарантировать значение align
                value={align || DEFAULT_CELL_ALIGNMENT}
              >
                <RadixToolbar.ToggleItem aria-label={alignLeftLabel} title={alignLeftLabel} value="left">
                  {iconComponentFor('format_align_left')}
                </RadixToolbar.ToggleItem>
                <RadixToolbar.ToggleItem aria-label={alignCenterLabel} title={alignCenterLabel} value="center">
                  {iconComponentFor('format_align_center')}
                </RadixToolbar.ToggleItem>
                <RadixToolbar.ToggleItem aria-label={alignRightLabel} title={alignRightLabel} value="right">
                  {iconComponentFor('format_align_right')}
                </RadixToolbar.ToggleItem>
                <RadixToolbar.ToggleItem aria-label={alignJustifyLabel} title={alignJustifyLabel} value="justify">
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>≡</span>
                </RadixToolbar.ToggleItem>
              </RadixToolbar.ToggleGroup>

              <RadixToolbar.Separator />

              <RadixToolbar.Button aria-label={insertLeftLabel} onClick={handleInsertLeft} title={insertLeftLabel}>
                {iconComponentFor('insert_col_left')}
              </RadixToolbar.Button>

              <RadixToolbar.Button aria-label={insertRightLabel} onClick={handleInsertRight} title={insertRightLabel}>
                {iconComponentFor('insert_col_right')}
              </RadixToolbar.Button>

              <RadixToolbar.Button aria-label={deleteColumnLabel} onClick={handleDelete} title={deleteColumnLabel}>
                {iconComponentFor('delete_small')}
              </RadixToolbar.Button>
            </RadixToolbar.Root>

            <RadixPopover.Arrow className={styles.popoverArrow} />
          </RadixPopover.PopoverContent>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    );
  }
);

ColumnEditor.displayName = 'ColumnEditor';
