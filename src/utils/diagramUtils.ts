export interface StepItem {
  diagramId: string;
  data: any;
}

export function assignDiagramIds(
  node: any,
  inquiryType: string,
  depth = 0,
): any {
  const id = `${depth}-${node.step ?? node.element_name ?? "node"}`;
  node.diagramId = id;

  if (inquiryType === "tree") {
    if (Array.isArray(node.content)) {
      node.content.forEach((c: any) =>
        assignDiagramIds(c, inquiryType, depth + 1),
      );
    } else if (Array.isArray(node.related_elements)) {
      node.related_elements.forEach((c: any) =>
        assignDiagramIds(c, inquiryType, depth + 1),
      );
    }
  } else {
    Array.isArray(node.steps) &&
      node.steps.forEach((c: any) =>
        assignDiagramIds(c, inquiryType, depth + 1),
      );
  }

  return node;
}

export function flattenSteps(node: any, inquiryType: string): StepItem[] {
  const out: StepItem[] = [];
  function dfs(n: any) {
    out.push({ diagramId: n.diagramId, data: n });
    if (inquiryType === "tree") {
      if (Array.isArray(n.content)) n.content.forEach(dfs);
      else if (Array.isArray(n.related_elements))
        n.related_elements.forEach(dfs);
    } else {
      Array.isArray(n.steps) && n.steps.forEach(dfs);
    }
  }
  dfs(node);
  return out;
}
