import { useTranslation } from '@mdxeditor/editor';
import { FC, memo } from 'react';

import { useTableEditor } from '../hooks/useTableEditor';
import type { HtmlTableEditorProps } from '../types/types';

import styles from './html-table.module.css';
import { TableStructure } from './TableStructure';

/**
 * Clean, simple HtmlTableEditor following Uncle Bob's principles.
 * Single responsibility: coordinate logic and render structure.
 * No business logic - delegated to useTableEditor hook.
 */
const HtmlTableEditor: FC<HtmlTableEditorProps> = props => {
  const { tableData } = props;
  const t = useTranslation();

  // Delegate all logic to the coordinating hook
  const tableLogic = useTableEditor(props);

  // Error state: invalid table
  if (tableData.columns.length === 0) {
    return (
      <div className={styles.tableError} role="alert">
        {t('table.invalidTable', 'Invalid HTML table')}
      </div>
    );
  }

  // Clean composition: delegate structure to dedicated component
  return <TableStructure tableData={tableData} logic={tableLogic} />;
};

const MemoizedHtmlTableEditor = memo(HtmlTableEditor);
MemoizedHtmlTableEditor.displayName = 'HtmlTableEditor';

export default MemoizedHtmlTableEditor;
