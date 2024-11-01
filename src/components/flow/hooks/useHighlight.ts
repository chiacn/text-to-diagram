import { useRef, useState } from "react";

export default function useHighlight() {
  const [highlightItems, setHighlightItems] = useState<Array<string | number>>(
    [],
  );
  const diagramItemsListRef = useRef<
    Array<{ diagramId: string | number; parentDiagramId?: string | number }>
  >([]);
  const HIGHLIGHT_STATUS = {
    NONE: 0,
    DEPTH: 1,
    STEP_COLOR: 2,
    SINGLE_STEP: 3,
  };

  const currentHighlightStatus = useRef<number>(0);

  const handleDiagramItem = (
    effectType: string,
    params: {
      diagramId: number | string;
      depth: number;
      parentDiagramId?: number | string;
    },
  ) => {
    switch (effectType) {
      // depth 기준으로 highlight
      case "highlight":
        const { parentDiagramId } = params;
        // Get all diagramIds with matching parentDiagramId
        const diagramIdsToHighlight = diagramItemsListRef.current
          .filter((item) => item.parentDiagramId === parentDiagramId)
          .map((item) => item.diagramId);

        if (
          highlightItems.length > 0 &&
          diagramIdsToHighlight.some((id) => !highlightItems.includes(id))
        ) {
          // 다른 diagram 선택 시 currentHighlightStatus 초기화
          currentHighlightStatus.current = 0;
        } else {
          incrementHighlightStatus();
        }

        const newHighlightItems =
          {
            [HIGHLIGHT_STATUS.NONE]: [],
            [HIGHLIGHT_STATUS.DEPTH]: diagramIdsToHighlight,
            [HIGHLIGHT_STATUS.STEP_COLOR]: [
              ...highlightItems,
              ...diagramIdsToHighlight,
            ],
            [HIGHLIGHT_STATUS.SINGLE_STEP]: [params.diagramId],
          }[currentHighlightStatus.current] || [];

        setHighlightItems(newHighlightItems);
        break;
      default:
        break;
    }
  };

  const incrementHighlightStatus = () => {
    currentHighlightStatus.current = (currentHighlightStatus.current + 1) % 4;
  };

  // Reset diagramItemsListRef before rendering
  diagramItemsListRef.current = [];

  return {
    handleDiagramItem,
    highlightItems,
    diagramItemsListRef,
    currentHighlightStatus,
  };
}
