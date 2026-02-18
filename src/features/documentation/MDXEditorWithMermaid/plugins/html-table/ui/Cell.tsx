import { FC, memo, useCallback, useMemo } from 'react';

import { sanitizeHtmlTable } from '../helpers/sanitizeHtmlTable';
import { serializeCellContent } from '../helpers/serialization';
import { useIsCellActive } from '../hooks/useTableCellStore';
import { ALIGN_TO_CLASS_MAP, ALIGN_TO_STYLE_MAP, DEFAULT_CELL_ALIGNMENT } from '../types/constants';
import type { CellProps } from '../types/types';

import CellEditor from './CellEditor';

const Cell: FC<CellProps> = ({
  align,
  CellElement,
  cellId,
  colIndex,
  contents,
  lexicalTable,
  parentEditor,
  rowIndex,
  store,
}) => {
  // useSyncExternalStore selector: only re-renders when THIS cell's active state changes
  const isActive = useIsCellActive(store, cellId);

  const className = ALIGN_TO_CLASS_MAP[align ?? DEFAULT_CELL_ALIGNMENT];
  const style = ALIGN_TO_STYLE_MAP[align ?? DEFAULT_CELL_ALIGNMENT];

  const handleClick = useCallback(() => {
    store.navigateTo(cellId);
  }, [cellId, store]);

  const sanitizedContent = useMemo(() => {
    const rawContent = serializeCellContent(contents) || '<br />';
    return sanitizeHtmlTable(rawContent);
  }, [contents]);

  return (
    <CellElement className={className} data-active={isActive} onClick={handleClick} style={style}>
      {isActive ? (
        <CellEditor
          colIndex={colIndex}
          contents={contents}
          lexicalTable={lexicalTable}
          parentEditor={parentEditor}
          rowIndex={rowIndex}
          store={store}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      )}
    </CellElement>
  );
};

const MemoizedCell = memo(Cell);
MemoizedCell.displayName = 'Cell';

export default MemoizedCell;
