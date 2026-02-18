import type { MdastImportVisitor } from '@mdxeditor/editor';
import type { ElementNode } from 'lexical';
import type * as Mdast from 'mdast';
import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

import { MDAST_VISITOR_PRIORITY } from '../types/constants';
import { $createHtmlRawTableNode } from '../ui/HtmlRawTableNode';

import { sanitizeHtmlTable } from './sanitizeHtmlTable';
import { escapeAttrValue } from './utils';

function serializeAttributes(attributes: MdxJsxAttribute[] | undefined): string {
  if (!attributes || attributes.length === 0) return '';

  const serialized = attributes
    .filter((attr): attr is MdxJsxAttribute => attr.type === 'mdxJsxAttribute' && Boolean(attr.name))
    .map(attr => {
      if (attr.value === null || attr.value === undefined) {
        return attr.name;
      }
      const value = typeof attr.value === 'string' ? attr.value : JSON.stringify(attr.value);
      return `${attr.name}="${escapeAttrValue(value)}"`;
    })
    .join(' ');

  return serialized ? ` ${serialized}` : '';
}

function isHtmlTableNode(node: Mdast.Nodes): node is MdxJsxFlowElement {
  return node.type === 'mdxJsxFlowElement' && node.name === 'table';
}

function isRawHtmlTableNode(node: Mdast.Nodes): node is Mdast.Html {
  if (node.type !== 'html') return false;
  const trimmed = node.value.trim();
  return /^<table[\s>]/i.test(trimmed);
}

function mdastNodeToHtml(node: Mdast.Nodes): string {
  if (!node) return '';

  if (node.type === 'text') {
    return node.value || '';
  }

  if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
    const tagName = node.name;
    const attrsString = serializeAttributes(node.attributes as MdxJsxAttribute[]);
    const childrenHtml = node.children ? node.children.map(child => mdastNodeToHtml(child)).join('') : '';
    return `<${tagName}${attrsString}>${childrenHtml}</${tagName}>`;
  }

  if ('children' in node && node.children) {
    return node.children.map(child => mdastNodeToHtml(child)).join('');
  }

  return '';
}

function mdastTableToHtml(node: MdxJsxFlowElement): string {
  const attrsString = serializeAttributes(node.attributes as MdxJsxAttribute[]);
  const childrenHtml = node.children.map(child => mdastNodeToHtml(child as MdxJsxFlowElement)).join('\n');
  return `<table${attrsString}>\n${childrenHtml}\n</table>`;
}

export const MdastHtmlRawTableVisitor: MdastImportVisitor<MdxJsxFlowElement> = {
  priority: MDAST_VISITOR_PRIORITY,
  testNode: isHtmlTableNode,
  visitNode({ lexicalParent, mdastNode }) {
    const htmlContent = mdastTableToHtml(mdastNode);
    const sanitizedHtml = sanitizeHtmlTable(htmlContent);
    (lexicalParent as ElementNode).append($createHtmlRawTableNode(sanitizedHtml));
  },
};

export const MdastRawHtmlTableVisitor: MdastImportVisitor<Mdast.Html> = {
  priority: MDAST_VISITOR_PRIORITY,
  testNode: isRawHtmlTableNode,
  visitNode({ lexicalParent, mdastNode }) {
    const sanitizedHtml = sanitizeHtmlTable(mdastNode.value);
    (lexicalParent as ElementNode).append($createHtmlRawTableNode(sanitizedHtml));
  },
};
