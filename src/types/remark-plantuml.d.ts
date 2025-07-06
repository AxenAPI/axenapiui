declare module 'remark-plantuml' {
  import {Plugin} from 'unified';

  interface PlantUMLOptions {
    baseUrl?: string;
    imageType?: 'svg' | 'png';
    generateSourceMap?: boolean;
  }

  const plantuml: Plugin<[PlantUMLOptions?]>;
  export default plantuml;
}
