interface DiagramItem {
  diagramId: string | number;
  step: string | number;
  parentDiagramId?: string | number | undefined;
  target: string;
  example: string;
  description: string;
  result?: { answer: any[] };
  steps?: DiagramItem[];
  element_name: string;
}
