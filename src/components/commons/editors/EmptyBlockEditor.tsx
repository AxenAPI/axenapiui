export const emptyCodeBlockDescriptor = {
  priority: 100,
  match: (language: string | null | undefined) => !language || language === '' || language === 'N/A',
  Editor: (props: { code: string }) => (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{props.code ?? ''}</pre>
  ),
};
