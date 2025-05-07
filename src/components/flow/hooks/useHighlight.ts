import { COLOR_PALETTE } from "@/constants";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseHighlightProps {
  inquiryType: string | null;
}
export default function useHighlight({ inquiryType }: UseHighlightProps) {
  const [highlightItems, setHighlightItems] = useState<Array<string | number>>(
    [],
  );
  const diagramItemsListRef = useRef<
    Array<{ diagramId: string | number; parentDiagramId?: string | number }>
  >([]);
  const HIGHLIGHT_STATUS = {
    NONE: 0,
    SAME_DEPTH: 1,
    SEPARATE_COLOR: 2,
    SINGLE_STEP: 3,
  };

  const [currentHighlightStatus, setCurrentHighlightStatus] = useState<{
    value: number;
  }>({ value: 0 });
  const colorPalette = COLOR_PALETTE;
  const targetColorMap = useRef<Record<string, string>>({});

  const handleDiagramItem = useCallback(
    (
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
          // * inquiryType이 logical_progression일 경우, highlightStatus에 따라 highlight 종류를 여러개 두는게 아니라 해당 step만 highlight되도록 변경.
          if (inquiryType === "logical_progression") {
            let newHighlightItems;
            if (highlightItems.includes(params.diagramId)) {
              // 이미 하이라이트된 경우 제거
              newHighlightItems = highlightItems.filter(
                (id) => id !== params.diagramId,
              );
            } else {
              // 선택한 diagramId 추가
              newHighlightItems = [...highlightItems, params.diagramId];
            }
            setHighlightItems(newHighlightItems);

            // 선택된 아이템이 있을 때는 SEPARATE_COLOR, 없을 때는 NONE으로 설정
            if (newHighlightItems.length > 0) {
              setCurrentHighlightStatus({
                value: HIGHLIGHT_STATUS.SEPARATE_COLOR,
              });
            } else {
              setCurrentHighlightStatus({ value: HIGHLIGHT_STATUS.NONE });
            }
            return;
          }

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
            setCurrentHighlightStatus({ value: 0 });
            setHighlightItems(
              setHighlightItemsByStatus(0, diagramIdsToHighlight),
            );
          } else {
            setCurrentHighlightStatus((prevHighlightStatus) => {
              const newHighlightStatus = {
                value: (prevHighlightStatus.value + 1) % 4,
              };
              setHighlightItems(
                setHighlightItemsByStatus(
                  newHighlightStatus.value,
                  diagramIdsToHighlight,
                ),
              );
              return newHighlightStatus;
            });
          }

          // * Note: 주의 currentHighlightStatus는 비동기적으로 업데이트되고, 다음 렌더링 사이클에 상태 업데이트를 적용하므로
          // * currentHighlightStatus를 찍어도 업데이트 되지 않은 상태가 보여짐.
          function setHighlightItemsByStatus(
            status: number,
            highlightDiagramIds: (string | number)[] = [],
          ) {
            return (
              {
                [HIGHLIGHT_STATUS.NONE]: [],
                [HIGHLIGHT_STATUS.SAME_DEPTH]: [...highlightDiagramIds],
                [HIGHLIGHT_STATUS.SEPARATE_COLOR]: [
                  ...highlightItems,
                  ...highlightDiagramIds,
                ],
                [HIGHLIGHT_STATUS.SINGLE_STEP]: [params.diagramId],
              }[status] || []
            );
          }
          break;
        default:
          break;
      }
    },
    [inquiryType, highlightItems],
  );

  const resetHighlight = useCallback(() => {
    setHighlightItems([]);
    setCurrentHighlightStatus({ value: 0 });
  }, []);

  // Reset diagramItemsListRef before rendering
  diagramItemsListRef.current = [];

  return {
    handleDiagramItem,
    highlightItems,
    diagramItemsListRef,
    currentHighlightStatus,
    colorPalette,
    targetColorMap,
    resetHighlight,
  };
}
