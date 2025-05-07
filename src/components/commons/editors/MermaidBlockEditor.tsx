import {CodeBlockEditorProps} from '@mdxeditor/editor';
import mermaid from 'mermaid';
import {FC, useEffect, useRef} from 'react';

export const MermaidBlockEditor: FC<CodeBlockEditorProps> = props => {
  const containerRef = useRef<HTMLDivElement>(null);

  const text = props.code ?? '';

  useEffect(() => {
    if (!containerRef.current) return;

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;

    mermaid
      .render(id, text)
      .then(result => {
        if (containerRef.current) {
          containerRef.current.innerHTML = result.svg;
        }
      })
      .catch(error => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre style="color:red">${error.message}</pre>`;
        }
      });
  }, [text]);

  return <div ref={containerRef} />;
};
