import type * as Mdast from 'mdast';

import { CELL_TYPE_DATA, CELL_TYPE_HEADER, DEFAULT_CELL_ALIGNMENT } from '../types/constants';
import type { HtmlAlignType, HtmlTableCell, HtmlTableColumn, HtmlTableData, HtmlTableRow } from '../types/types';

import { createEmptyCell, normalizeTableStructure } from './normalization';
import { generateCellId, generateColumnId, generateRowId } from './utils';

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

/** Creates a minimal valid table structure for graceful degradation */
function createMinimalTable(): HtmlTableData {
  return {
    bodyRows: [{ id: generateRowId(), cells: [createEmptyCell(false)] }],
    columns: [{ id: generateColumnId(), align: DEFAULT_CELL_ALIGNMENT }],
    headerRow: { id: generateRowId(), cells: [createEmptyCell(true)] },
  };
}

/** Parses cell content into MDAST phrasing nodes */
function parseCellContent(cellElement: HTMLElement): Mdast.PhrasingContent[] {
  const content: Mdast.PhrasingContent[] = [];
  const childNodes = Array.from(cellElement.childNodes);

  for (const node of childNodes) {
    if (node.nodeType === TEXT_NODE) {
      if (node.textContent) {
        content.push({ type: 'text', value: node.textContent });
      }
    } else if (node.nodeType === ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();
      const children = parseCellContent(el);

      switch (tagName) {
        case 'strong':
        case 'b':
          content.push({ children, type: 'strong' });
          break;
        case 'em':
        case 'i':
          content.push({ children, type: 'emphasis' });
          break;
        case 'del':
        case 's':
        case 'strike':
          content.push({ children, type: 'delete' });
          break;
        case 'code':
          content.push({ type: 'inlineCode', value: el.textContent || '' });
          break;
        case 'a':
          content.push({
            children,
            title: el.getAttribute('title') || undefined,
            type: 'link',
            url: el.getAttribute('href') || '',
          });
          break;
        case 'br':
          content.push({ type: 'break' });
          break;
        default:
          content.push(...children);
          break;
      }
    }
  }

  return content;
}

/** Parses a single table row element */
function parseRow(rowElement: HTMLTableRowElement | null, columnCount: number, isHeader: boolean): HtmlTableRow {
  const cells: HtmlTableCell[] = [];

  if (rowElement) {
    const cellElements = Array.from(rowElement.querySelectorAll('th, td'));

    for (let i = 0; i < columnCount; i++) {
      const cellElement = cellElements[i] as HTMLElement | undefined;

      if (cellElement) {
        const cellType = cellElement.tagName.toLowerCase() as typeof CELL_TYPE_DATA | typeof CELL_TYPE_HEADER;
        const align = cellElement.getAttribute('align') as HtmlAlignType | null;
        const content = parseCellContent(cellElement);
        cells.push({ id: generateCellId(), align: align ?? undefined, content, type: cellType });
      } else {
        cells.push(createEmptyCell(isHeader));
      }
    }
  } else {
    for (let i = 0; i < columnCount; i++) {
      cells.push(createEmptyCell(isHeader));
    }
  }

  return { id: generateRowId(), cells };
}

/**
 * Checks if the first row contains only <th> elements.
 * Used as heuristic to detect implicit header row when <thead> is absent.
 */
function isFirstRowAllHeaders(firstRow: HTMLTableRowElement): boolean {
  const cells = Array.from(firstRow.querySelectorAll('th, td'));
  if (cells.length === 0) {
    return false;
  }
  return cells.every(cell => cell.tagName.toLowerCase() === CELL_TYPE_HEADER);
}

/** Parses an HTML table string into HtmlTableData */
export function parseHtmlTable(html: string): HtmlTableData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table = doc.querySelector('table');

  if (!table) {
    // Graceful degradation: return minimal valid table structure
    return createMinimalTable();
  }

  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  const allRows: HTMLTableRowElement[] = [];

  if (thead) {
    allRows.push(...Array.from(thead.querySelectorAll('tr')));
  }

  if (tbody) {
    allRows.push(...Array.from(tbody.querySelectorAll('tr')));
  } else {
    const directRows = Array.from(table.querySelectorAll('tr')).filter(row => !thead?.contains(row));
    allRows.push(...directRows);
  }

  if (allRows.length === 0) {
    // Graceful degradation: return minimal valid table structure
    return createMinimalTable();
  }

  const firstRowCells = Array.from(allRows[0].querySelectorAll('th, td'));
  const columnCount = firstRowCells.length || 1;

  // Determine if we have an explicit thead or if first row should be treated as header
  const hasTheadSection = thead !== null;
  // Heuristic: if no <thead> but first row contains only <th> elements, treat it as header
  const firstRowIsImplicitHeader = !hasTheadSection && isFirstRowAllHeaders(allRows[0]);
  const shouldTreatFirstRowAsHeader = hasTheadSection || firstRowIsImplicitHeader;

  const headerRowElement = shouldTreatFirstRowAsHeader ? allRows[0] : null;
  const headerRow = parseRow(headerRowElement, columnCount, true);

  const bodyRowElements = shouldTreatFirstRowAsHeader ? allRows.slice(1) : allRows;
  const bodyRows = bodyRowElements.map(row => parseRow(row, columnCount, false));

  const columns: HtmlTableColumn[] = firstRowCells.map(cell => {
    const align = cell.getAttribute('align') as HtmlAlignType | null;
    return { id: generateColumnId(), align: align ?? DEFAULT_CELL_ALIGNMENT };
  });

  // Ensure we have at least one column
  if (columns.length === 0) {
    columns.push({ id: generateColumnId(), align: DEFAULT_CELL_ALIGNMENT });
  }

  return normalizeTableStructure({
    bodyRows,
    columns,
    headerRow,
  });
}
