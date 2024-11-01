import { useEffect, useState } from "react";

interface HandleDataStructureProps {
  highlightItems: Array<string | number>;
}
export default function useHandleDataStructure({
  highlightItems,
}: HandleDataStructureProps) {
  /*
    * 기능 구현 정리
      1. structure를 dfs로 훑고 직렬적으로 스텝별로 묶는다. (entireSpreadedStep)
      2. 만약 특정 step에 대해서 하이라이트 시, focusSpreadedStep으로 entireSpreadedStep을 잘라서 사용한다.
      3. SubmittedText에 props로 보낸다.
  */

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
    console.log("highlightItems", highlightItems);
    console.log("entireSpreadedStep", entireSpreadedStep);
    if (highlightItems.length > 0 && entireSpreadedStep.length > 0) {
      console.log("highlightItems", highlightItems);
      const focusSteps = getSubstructureByStep(
        entireSpreadedStep,
        highlightItems,
      );

      console.log("focusSteps --- ", focusSteps);
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
