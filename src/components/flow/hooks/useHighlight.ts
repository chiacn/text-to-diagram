import { useRef, useState } from "react";

export default function useHighlight() {
  const [highlightItems, setHighlightItems] = useState<Array<string | number>>(
    [],
  );
  const diagramItemsListRef = useRef<
    Array<{ diagramId: string | number; parentDiagramId?: string | number }>
  >([]);

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
        // Note: 여러 개 선택할 수 있게
        // setHighlightItems((prev: Array<string | number>) => {
        //   return prev.includes(params.depth)
        //     ? prev.filter((id) => id !== depth)
        //     : [...prev, params.depth];
        // });

        // Note: 단일 선택
        // highlightItems.includes(params.depth)
        //   ? setHighlightItems([])
        //   : setHighlightItems([params.depth]);

        const { parentDiagramId } = params;

        console.log("parentDiagramId", parentDiagramId);
        console.log("diagramId", params.diagramId);
        // Get all diagramIds with matching parentDiagramId
        const diagramIdsToHighlight = diagramItemsListRef.current
          .filter((item) => item.parentDiagramId === parentDiagramId)
          .map((item) => item.diagramId);

        // Toggle highlight
        const isAlreadyHighlighted =
          highlightItems.length > 0 &&
          diagramIdsToHighlight.every((id) => highlightItems.includes(id));

        if (isAlreadyHighlighted) {
          setHighlightItems([]);
        } else {
          setHighlightItems(diagramIdsToHighlight);
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
  };
}
