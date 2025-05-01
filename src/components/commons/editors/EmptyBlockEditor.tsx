export const emptyCodeBlockDescriptor = {
  priority: 100,
  match: (language: string) => !language || language === '' || language === 'N/A' || language === 'yaml', // ловим пустой или N/A
  Editor: (props: {code: string}) => (
    <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace'}}>{props.code ?? ''}</pre>
  ),
};
