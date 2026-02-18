import { editorRootElementRef$, iconComponentFor$, useCellValues, useTranslation } from '@mdxeditor/editor';
import * as RadixPopover from '@radix-ui/react-popover';
import * as RadixToolbar from '@radix-ui/react-toolbar';
import classNames from 'classnames';
import { FC, memo, useEffect, useState } from 'react';

import { useRowOperations } from '../hooks/useRowOperations';
import { HEADER_ROW_INDEX, POPOVER_SIDE_OFFSET } from '../types/constants';
import type { RowEditorProps } from '../types/types';

import styles from './html-table.module.css';

export const RowEditor: FC<RowEditorProps> = memo(
  ({ highlightedCoordinates, lexicalTable, parentEditor, rowIndex, store }) => {
    const [editorRootElementRef, iconComponentFor] = useCellValues(editorRootElementRef$, iconComponentFor$);
    const t = useTranslation();
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
      if (editorRootElementRef?.current) {
        setPortalContainer(editorRootElementRef.current);
      }
    }, [editorRootElementRef]);

    const { handleDelete, handleInsertAbove, handleInsertBelow } = useRowOperations(
      parentEditor,
      lexicalTable,
      rowIndex,
      store
    );

    const rowMenuLabel = t('table.rowMenu', 'Row menu');
    const insertAboveLabel = t('table.insertRowAbove', 'Insert a row above this one');
    const insertBelowLabel = t('table.insertRowBelow', 'Insert a row below this one');
    const deleteRowLabel = t('table.deleteRow', 'Delete this row');

    return (
      <RadixPopover.Root>
        <RadixPopover.PopoverTrigger
          aria-label={rowMenuLabel}
          className={styles.tableColumnEditorTrigger}
          data-active={highlightedCoordinates[1] === rowIndex}
          title={rowMenuLabel}
        >
          {iconComponentFor('more_horiz')}
        </RadixPopover.PopoverTrigger>

        <RadixPopover.Portal container={portalContainer}>
          <RadixPopover.PopoverContent
            className={classNames(styles.tableColumnEditorPopoverContent)}
            onOpenAutoFocus={e => e.preventDefault()}
            side="bottom"
            sideOffset={POPOVER_SIDE_OFFSET}
          >
            <RadixToolbar.Root className={styles.tableColumnEditorToolbar}>
              {rowIndex !== HEADER_ROW_INDEX && (
                <RadixToolbar.Button aria-label={insertAboveLabel} onClick={handleInsertAbove} title={insertAboveLabel}>
                  {iconComponentFor('insert_row_above')}
                </RadixToolbar.Button>
              )}

              <RadixToolbar.Button aria-label={insertBelowLabel} onClick={handleInsertBelow} title={insertBelowLabel}>
                {iconComponentFor('insert_row_below')}
              </RadixToolbar.Button>

              {rowIndex !== HEADER_ROW_INDEX && (
                <RadixToolbar.Button aria-label={deleteRowLabel} onClick={handleDelete} title={deleteRowLabel}>
                  {iconComponentFor('delete_small')}
                </RadixToolbar.Button>
              )}
            </RadixToolbar.Root>

            <RadixPopover.Arrow className={styles.popoverArrow} />
          </RadixPopover.PopoverContent>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    );
  }
);

RowEditor.displayName = 'RowEditor';
