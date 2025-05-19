import {MermaidBlockEditor} from '@/components/commons/editors/MermaidBlockEditor';
import {PlantUMLBlockEditor} from '@/components/commons/editors/PlantumlBlockEditor';

export const mermaidCodeBlockDescriptor = {
  priority: 100,
  match: (language: string) => language === 'mermaid',
  Editor: MermaidBlockEditor,
};

export const plantumlCodeBlockDescriptor = {
  priority: 100,
  match: (language: string) => language === 'plantuml',
  Editor: PlantUMLBlockEditor,
};
