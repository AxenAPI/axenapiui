import type { LexicalExportVisitor } from '@mdxeditor/editor';
import type * as Mdast from 'mdast';

import { MDAST_VISITOR_PRIORITY } from '../types/constants';
import { $isHtmlRawTableNode, HtmlRawTableNode } from '../ui/HtmlRawTableNode';

import { sanitizeHtmlTable } from './sanitizeHtmlTable';

function htmlToMdastHtml(htmlContent: string): Mdast.Html {
  return { type: 'html', value: htmlContent };
}

export const LexicalHtmlRawTableVisitor: LexicalExportVisitor<HtmlRawTableNode, Mdast.Html> = {
  priority: MDAST_VISITOR_PRIORITY,
  testLexicalNode: $isHtmlRawTableNode,
  visitLexicalNode({ lexicalNode, mdastParent }) {
    const htmlContent = lexicalNode.getHtmlContent();
    const sanitizedHtml = sanitizeHtmlTable(htmlContent);
    const mdastNode = htmlToMdastHtml(sanitizedHtml);
    mdastParent.children.push(mdastNode);
  },
};
