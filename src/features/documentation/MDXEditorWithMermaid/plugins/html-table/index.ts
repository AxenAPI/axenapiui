import { addExportVisitor$, addImportVisitor$, addLexicalNode$, realmPlugin } from '@mdxeditor/editor';

import { LexicalHtmlRawTableVisitor } from './helpers/LexicalHtmlRawTableVisitor';
import { MdastHtmlRawTableVisitor, MdastRawHtmlTableVisitor } from './helpers/MdastHtmlRawTableVisitor';
import { HtmlRawTableNode } from './ui/HtmlRawTableNode';

export const htmlTablePlugin = realmPlugin({
  init(realm) {
    realm.pubIn({
      [addExportVisitor$]: LexicalHtmlRawTableVisitor,
      [addImportVisitor$]: [MdastHtmlRawTableVisitor, MdastRawHtmlTableVisitor],
      [addLexicalNode$]: HtmlRawTableNode,
    });
  },
});
