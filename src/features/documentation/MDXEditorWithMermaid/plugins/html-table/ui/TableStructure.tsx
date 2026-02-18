import { FC } from 'react';

import type { TableEditorLogic } from '../hooks/useTableEditor';
import { ALIGN_TO_CLASS_MAP, ALIGN_TO_STYLE_MAP } from '../types/constants';
import type { HtmlTableData } from '../types/types';

import Cell from './Cell';
import { ColumnEditor } from './ColumnEditor';
import styles from './html-table.module.css';
import { RowEditor } from './RowEditor';

interface TableStructureProps {
  tableData: HtmlTableData;
  logic: TableEditorLogic;
}

/**
 * Pure presentational component for table structure.
 * No business logic - only rendering based on props.
 * Follows Uncle Bob's "Single Responsibility Principle".
 */
export const TableStructure: FC<TableStructureProps> = ({ logic, tableData }) => {
  const {
    addColumnToRight,
    addRowToBottom,
    deleteTable,
    highlightedCoordinates,
    iconComponentFor,
    store,
    t,
    tableHandlers,
    tableRef,
  } = logic;

  return (
    <table
      ref={tableRef}
      aria-label={t('table.editableTable', 'Editable table')}
      className={styles.tableEditor}
      {...tableHandlers}
    >
      <TableColGroup columns={tableData.columns} />
      <TableHeader
        deleteTable={deleteTable}
        highlightedCoordinates={highlightedCoordinates}
        iconComponentFor={iconComponentFor}
        store={store}
        t={t}
        tableData={tableData}
      />
      <TableBody
        addColumnToRight={addColumnToRight}
        highlightedCoordinates={highlightedCoordinates}
        iconComponentFor={iconComponentFor}
        store={store}
        tableData={tableData}
      />
      <TableFooter
        addRowToBottom={addRowToBottom}
        columnsCount={tableData.columns.length}
        iconComponentFor={iconComponentFor}
        t={t}
      />
    </table>
  );
};

// Pure sub-components for better structure

interface TableColGroupProps {
  columns: HtmlTableData['columns'];
}

const TableColGroup: FC<TableColGroupProps> = ({ columns }) => (
  <colgroup>
    <col />
    {columns.map(column => (
      <col key={column.id} className={ALIGN_TO_CLASS_MAP[column.align]} style={ALIGN_TO_STYLE_MAP[column.align]} />
    ))}
    <col />
  </colgroup>
);

interface TableHeaderProps {
  deleteTable: TableEditorLogic['deleteTable'];
  highlightedCoordinates: TableEditorLogic['highlightedCoordinates'];
  iconComponentFor: TableEditorLogic['iconComponentFor'];
  store: TableEditorLogic['store'];
  t: TableEditorLogic['t'];
  tableData: HtmlTableData;
}

const TableHeader: FC<TableHeaderProps> = ({
  deleteTable,
  highlightedCoordinates,
  iconComponentFor,
  store,
  t,
  tableData,
}) => (
  <thead>
    <tr>
      <th aria-label="Table controls" className={styles.tableToolsColumn} />
      {tableData.columns.map((column, colIndex) => (
        <th key={column.id} data-tool-cell>
          <ColumnEditor
            align={column.align}
            colIndex={colIndex}
            highlightedCoordinates={highlightedCoordinates}
            lexicalTable={store.lexicalTable}
            parentEditor={store.parentEditor}
            store={store}
          />
        </th>
      ))}
      <th className={styles.tableToolsColumn} data-tool-cell>
        <button
          aria-label={t('table.deleteTable', 'Delete table')}
          className={styles.iconButton}
          onClick={deleteTable}
          title={t('table.deleteTable', 'Delete table')}
          type="button"
        >
          {iconComponentFor('delete_small')}
        </button>
      </th>
    </tr>
  </thead>
);

interface TableBodyProps {
  addColumnToRight: TableEditorLogic['addColumnToRight'];
  highlightedCoordinates: TableEditorLogic['highlightedCoordinates'];
  iconComponentFor: TableEditorLogic['iconComponentFor'];
  store: TableEditorLogic['store'];
  tableData: HtmlTableData;
}

const TableBody: FC<TableBodyProps> = ({
  addColumnToRight,
  highlightedCoordinates,
  iconComponentFor,
  store,
  tableData,
}) => (
  <tbody>
    <HeaderRow
      addColumnToRight={addColumnToRight}
      highlightedCoordinates={highlightedCoordinates}
      iconComponentFor={iconComponentFor}
      store={store}
      tableData={tableData}
    />
    {tableData.bodyRows.map((row, bodyRowIndex) => {
      const rowIndex = bodyRowIndex + 1;
      return (
        <BodyRow
          key={row.id}
          row={row}
          rowIndex={rowIndex}
          tableData={tableData}
          highlightedCoordinates={highlightedCoordinates}
          store={store}
        />
      );
    })}
  </tbody>
);

interface HeaderRowProps {
  addColumnToRight: TableEditorLogic['addColumnToRight'];
  highlightedCoordinates: TableEditorLogic['highlightedCoordinates'];
  iconComponentFor: TableEditorLogic['iconComponentFor'];
  store: TableEditorLogic['store'];
  tableData: HtmlTableData;
}

const HeaderRow: FC<HeaderRowProps> = ({
  addColumnToRight,
  highlightedCoordinates,
  iconComponentFor,
  store,
  tableData,
}) => (
  <tr>
    <th className={styles.toolCell} data-tool-cell>
      <RowEditor
        highlightedCoordinates={highlightedCoordinates}
        lexicalTable={store.lexicalTable}
        parentEditor={store.parentEditor}
        rowIndex={0}
        store={store}
      />
    </th>
    {tableData.headerRow.cells.map((cell, colIndex) => (
      <Cell
        key={cell.id}
        align={cell.align ?? tableData.columns[colIndex]?.align}
        CellElement="th"
        cellId={cell.id}
        colIndex={colIndex}
        contents={cell.content}
        lexicalTable={store.lexicalTable}
        parentEditor={store.parentEditor}
        rowIndex={0}
        store={store}
      />
    ))}
    <th data-tool-cell rowSpan={tableData.bodyRows.length + 1}>
      <button aria-label="Add column" className={styles.addColumnButton} onClick={addColumnToRight} type="button">
        {iconComponentFor('add_column')}
      </button>
    </th>
  </tr>
);

interface BodyRowProps {
  highlightedCoordinates: TableEditorLogic['highlightedCoordinates'];
  row: HtmlTableData['bodyRows'][0];
  rowIndex: number;
  store: TableEditorLogic['store'];
  tableData: HtmlTableData;
}

const BodyRow: FC<BodyRowProps> = ({ highlightedCoordinates, row, rowIndex, store, tableData }) => (
  <tr>
    <td className={styles.toolCell} data-tool-cell>
      <RowEditor
        highlightedCoordinates={highlightedCoordinates}
        lexicalTable={store.lexicalTable}
        parentEditor={store.parentEditor}
        rowIndex={rowIndex}
        store={store}
      />
    </td>
    {row.cells.map((cell, colIndex) => (
      <Cell
        key={cell.id}
        align={cell.align ?? tableData.columns[colIndex]?.align}
        CellElement="td"
        cellId={cell.id}
        colIndex={colIndex}
        contents={cell.content}
        lexicalTable={store.lexicalTable}
        parentEditor={store.parentEditor}
        rowIndex={rowIndex}
        store={store}
      />
    ))}
  </tr>
);

interface TableFooterProps {
  addRowToBottom: TableEditorLogic['addRowToBottom'];
  columnsCount: number;
  iconComponentFor: TableEditorLogic['iconComponentFor'];
  t: TableEditorLogic['t'];
}

const TableFooter: FC<TableFooterProps> = ({ addRowToBottom, columnsCount, iconComponentFor, t }) => (
  <tfoot>
    <tr>
      <td aria-label="Table footer spacer" />
      <td colSpan={columnsCount}>
        <button
          aria-label={t('table.addRow', 'Add row')}
          className={styles.addRowButton}
          onClick={addRowToBottom}
          type="button"
        >
          {iconComponentFor('add_row')}
        </button>
      </td>
      <td aria-label="Table footer spacer" />
    </tr>
  </tfoot>
);
