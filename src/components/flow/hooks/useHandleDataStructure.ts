import { useEffect, useState } from "react";

interface HandleDataStructureProps {
  highlightItems: Array<string | number>;
}
export default function useHandleDataStructure({
  highlightItems,
}: HandleDataStructureProps) {
  const [entireSpreadedStep, setEntireSpreadedStep] = useState<any[]>([]);
  const [focusSpreadedStep, setFocusSpreadedStep] = useState<any[]>([]);

  function dfsStructure(node: any, steps: any[] = []) {
    if (!node) return steps;

    steps.push(node);

    if (node.steps && node.steps.length > 0) {
      node.steps.forEach((child: any) => {
        dfsStructure(child, steps);
      });
    }

    return steps;
  }

  const assignDiagramIds = (node: any, depth = 0) => {
    // diagramId를 depth와 step으로 구성하여 고유 ID로 설정
    const diagramId = `${depth}-${node.step || "root"}`;
    node.diagramId = diagramId;

    if (node.steps && node.steps.length > 0) {
      node.steps.forEach((child: any) => {
        assignDiagramIds(child, depth + 1);
      });
    }

    return node;
  };

  const setSpreadSteps = (structure: any) => {
    setEntireSpreadedStep([]);
    setFocusSpreadedStep([]);

    if (structure) {
      const steps = dfsStructure(structure); // * 여기서 diagramId 할당
      setEntireSpreadedStep(steps);
      setFocusSpreadedStep(steps); // 초기에는 전체 스텝을 설정
    }
  };

  // 2. 특정 step 하이라이트 시 focusSpreadedStep 업데이트
  function getSubstructureByStep(
    entireSpreadedStep: any[],
    highlightItems: (string | number)[],
  ): any[] {
    if (!entireSpreadedStep || highlightItems.length === 0)
      return entireSpreadedStep;

    // diagramId가 highlightSteps에 포함된 스텝만 필터링
    return entireSpreadedStep.filter((step) =>
      highlightItems.includes(step.diagramId),
    );
  }

  useEffect(() => {
    if (highlightItems.length > 0 && entireSpreadedStep.length > 0) {
      console.log("highlightItems", highlightItems);
      const focusSteps = getSubstructureByStep(
        entireSpreadedStep,
        highlightItems,
      );
      setFocusSpreadedStep(focusSteps);
    } else {
      setFocusSpreadedStep(entireSpreadedStep);
    }
  }, [highlightItems, entireSpreadedStep]);

  return {
    setSpreadSteps,
    entireSpreadedStep,
    focusSpreadedStep,
    assignDiagramIds,
  };
}
