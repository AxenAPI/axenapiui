import type * as Mdast from 'mdast';

import { DEFAULT_CELL_ALIGNMENT } from '../types/constants';
import type { HtmlTableColumn, HtmlTableData, HtmlTableRow } from '../types/types';

import { escapeAttrValue, escapeHtml } from './utils';

/** Serializes cell content from MDAST nodes to HTML string */
export function serializeCellContent(content: Mdast.PhrasingContent[]): string {
  if (content.length === 0) return '';

  return content
    .map((node): string => {
      switch (node.type) {
        case 'text':
          return escapeHtml(node.value);
        case 'strong':
          return `<strong>${serializeCellContent(node.children)}</strong>`;
        case 'emphasis':
          return `<em>${serializeCellContent(node.children)}</em>`;
        case 'inlineCode':
          return `<code>${escapeHtml(node.value)}</code>`;
        case 'delete':
          return `<del>${serializeCellContent(node.children)}</del>`;
        case 'link':
          return `<a href="${escapeAttrValue(node.url)}"${node.title ? ` title="${escapeAttrValue(node.title)}"` : ''}>${serializeCellContent(node.children)}</a>`;
        case 'break':
          return '<br />';
        default:
          if ('children' in node && Array.isArray(node.children)) {
            return serializeCellContent(node.children as Mdast.PhrasingContent[]);
          }
          return '';
      }
    })
    .join('');
}

/** Serializes a single table row to HTML */
function serializeRow(row: HtmlTableRow, columns: HtmlTableColumn[]): string {
  const cellsHtml = row.cells
    .map((cell, index) => {
      const align = cell.align || columns[index]?.align || DEFAULT_CELL_ALIGNMENT;
      const alignAttr = align !== DEFAULT_CELL_ALIGNMENT ? ` align="${align}"` : '';
      const content = serializeCellContent(cell.content);
      return `<${cell.type}${alignAttr}>${content}</${cell.type}>`;
    })
    .join('');

  return `<tr>${cellsHtml}</tr>`;
}

/** Serializes HtmlTableData to HTML string */
export function serializeHtmlTable(data: HtmlTableData): string {
  const parts: string[] = ['<table>'];

  parts.push('<thead>');
  parts.push(serializeRow(data.headerRow, data.columns));
  parts.push('</thead>');

  parts.push('<tbody>');
  for (const row of data.bodyRows) {
    parts.push(serializeRow(row, data.columns));
  }
  parts.push('</tbody>');

  parts.push('</table>');

  return parts.join('\n');
}
