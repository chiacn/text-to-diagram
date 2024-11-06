import { MutableRefObject, useRef } from "react";
import DiagramItem from "../DiagramItem";

interface ExampleDiagramItemType {
  diagramId: string;
  step: string;
  parentDiagramId?: string;
  depth?: number;
  target: string;
  example: string;
  description: string;
  result?: { answer: any[] };
  steps?: ExampleDiagramItemType[];
}

interface UseDiagramProps {
  diagramItemsListRef: MutableRefObject<
    {
      diagramId: string | number;
      parentDiagramId?: string | number | undefined;
    }[]
  >;
  currentHighlightStatus: number;
  colorPalette: string[];
  targetColorMap: React.MutableRefObject<Record<string, string>>;
  handleDiagramItem: (
    effectType: string,
    params: {
      diagramId: number | string;
      depth: number;
      parentDiagramId?: number | string;
    },
  ) => void;
  highlightItems?: Array<number | string>;
}

export default function useDiagram({
  diagramItemsListRef,
  currentHighlightStatus,
  colorPalette,
  targetColorMap,
  handleDiagramItem,
  highlightItems,
}: UseDiagramProps) {
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);

  const renderDiagramItems = (
    item: ExampleDiagramItemType,
    depth = 0,
    parentDiagramId: string | undefined = undefined,
  ): JSX.Element => {
    const isTopLevel = depth === 0;
    const parentId = isTopLevel ? "root" : parentDiagramId;

    const itemIndex = diagramItemsListRef.current.length;
    diagramItemsListRef.current.push({
      diagramId: item.diagramId,
      parentDiagramId: parentId,
    });

    const highlightColor =
      currentHighlightStatus === 2
        ? colorPalette[itemIndex % colorPalette.length]
        : "#fef3c7";

    targetColorMap.current[item.target] = highlightColor;

    return (
      <div
        className={`flex ${depth > 0 ? "pl-5" : ""} flex-row space-x-4`}
        key={`${depth}-${item.step}`}
        ref={isTopLevel ? contentWrapperRef : null}
      >
        <DiagramItem
          diagramId={item.diagramId}
          step={item.step}
          parentDiagramId={parentId}
          depth={depth}
          target={item.target}
          example={item.example}
          description={item.description}
          result={item.result}
          handleDiagramItem={handleDiagramItem}
          highlightItems={highlightItems}
          highlightColor={highlightColor}
        >
          {item.steps &&
            item.steps.map((childItem) =>
              renderDiagramItems(childItem, depth + 1, item.diagramId),
            )}
        </DiagramItem>
      </div>
    );
  };

  return {
    renderDiagramItems,
    contentWrapperRef,
  };
}
