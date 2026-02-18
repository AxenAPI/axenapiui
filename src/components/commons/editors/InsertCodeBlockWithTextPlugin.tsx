import { ButtonWithTooltip, iconComponentFor$, MDXEditorMethods, useCellValue } from '@mdxeditor/editor';
import { FC, RefObject } from 'react';

function getSelectedText(): string {
  if (window.getSelection) {
    return window.getSelection()?.toString() || '';
  }
  return '';
}

type InsertCodeBlockWithSelectionProps = {
  editorRef: RefObject<MDXEditorMethods>;
};

export const InsertCodeBlockWithSelection: FC<InsertCodeBlockWithSelectionProps> = ({ editorRef }) => {
  const handleInsert = () => {
    if (editorRef?.current) {
      const selectedText = getSelectedText();
      const markdownToInsert = selectedText ? `\`\`\`tsx\n${selectedText}\n\`\`\`` : '```tsx\n\n```';
      editorRef.current.insertMarkdown(markdownToInsert);
    }
  };
  const iconComponentFor = useCellValue(iconComponentFor$);
  return (
    <ButtonWithTooltip title="Insert Code Block" onClick={handleInsert}>
      {iconComponentFor('frame_source')}
    </ButtonWithTooltip>
  );
};
