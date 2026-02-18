import { DocumentationMeta } from '@features/documentation/DocumentationMeta';
import { MDXEditorWithMermaid } from '@features/documentation/MDXEditorWithMermaid';

export const DocViewContent = () => (
  <div>
    <DocumentationMeta />
    <MDXEditorWithMermaid />
  </div>
);
