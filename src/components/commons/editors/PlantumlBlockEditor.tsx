import {useEffect, useState} from 'react';

import {encodePlantUML} from '@/utils/plantumlEncode';

export const PlantUMLBlockEditor = ({code}: {code: string}) => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    encodePlantUML(code || '').then(encoded => {
      setUrl(`https://www.plantuml.com/plantuml/svg/~1${encoded}`);
    });
  }, [code]);

  if (!url) return <div>Loading...</div>;

  return (
    <div style={{overflow: 'auto'}}>
      <img src={url} alt="PlantUML Diagram" style={{maxWidth: '100%'}} />
    </div>
  );
};
