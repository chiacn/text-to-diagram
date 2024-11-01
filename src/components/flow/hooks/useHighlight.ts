import { useRef, useState } from "react";

export default function useHighlight() {
  const [highlightItems, setHighlightItems] = useState<Array<string | number>>(
    [],
  );
  const diagramItemsListRef = useRef<
    Array<{ diagramId: string | number; parentDiagramId?: string | number }>
  >([]);

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
          setCurrentHighlightStatus();
        }

        console.log(
          "useHighlight - highlightStatus : ",
          currentHighlightStatus.current,
        );

        switch (currentHighlightStatus.current) {
          case 0:
            setHighlightItems([]);
            break;
          case 1:
            setHighlightItems(diagramIdsToHighlight);
            break;
          case 2:
            setHighlightItems((prev) => [...prev, ...diagramIdsToHighlight]);
            break;
          case 3:
            setHighlightItems([params.diagramId]);
            break;
          default:
            setHighlightItems([]);
            break;
        }

        break;
      default:
        break;
    }
  };

  const setCurrentHighlightStatus = () => {
    /**
     * currentHighlight
     * 0: Highlight 없음
     * 1: 해당 depth Highlight
     * 2: 각 step 별 개별 색상 부여
     * 3: 해당 step만 Highlight
     */
    if (currentHighlightStatus.current > 2) {
      currentHighlightStatus.current = 0;
    } else {
      currentHighlightStatus.current++;
    }
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
