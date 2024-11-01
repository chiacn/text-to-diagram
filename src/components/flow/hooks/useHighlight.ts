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

  const [currentHighlightStatus, setCurrentHighlightStatus] =
    useState<number>(0);

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
          setCurrentHighlightStatus(0);
          setHighlightItems(setHighlightItemsByStatus(0));
        } else {
          setCurrentHighlightStatus((prevHighlightStatus) => {
            const newHighlightStatus = (prevHighlightStatus + 1) % 4;
            setHighlightItems(setHighlightItemsByStatus(newHighlightStatus));
            return newHighlightStatus;
          });
        }

        // * Note: 주의 currentHighlightStatus는 비동기적으로 업데이트되고, 다음 렌더링 사이클에 상태 업데이트를 적용하므로
        // * currentHighlightStatus를 찍어도 업데이트 되지 않은 상태가 보여짐.
        function setHighlightItemsByStatus(status: number) {
          return (
            {
              [HIGHLIGHT_STATUS.NONE]: [],
              [HIGHLIGHT_STATUS.DEPTH]: diagramIdsToHighlight,
              [HIGHLIGHT_STATUS.STEP_COLOR]: [
                ...highlightItems,
                ...diagramIdsToHighlight,
              ],
              [HIGHLIGHT_STATUS.SINGLE_STEP]: [params.diagramId],
            }[status] || []
          );
        }
        break;
      default:
        break;
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
