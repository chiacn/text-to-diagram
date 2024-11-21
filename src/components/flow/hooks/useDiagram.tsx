import { MutableRefObject, useEffect, useRef } from "react";
import DiagramItem from "../DiagramItem";
import DiagramProgressionItem from "../DiagramProgressionItem";
import TreeDiagramItem from "../DiagramTreeItem";
import DiagramTreeItem from "../DiagramTreeItem";

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

interface LogicalStepType {
  diagramId: string;
  step: string;
  target: string;
  statement: string;
  description: string;
  implications: string;
}

interface LogicalProgressionStructureType {
  title: string;
  steps: LogicalStepType[];
  conclusion: string;
  diagramId: string;
}

// 트리 구조를 위한 인터페이스 정의
interface TreeDiagramItemType {
  diagramId: string;
  element_name: string;
  relationTypeWithParent?: string;
  relationship?: any[];
  description: string;
  related_elements?: TreeDiagramItemType[];
}

interface UseDiagramProps {
  diagramItemsListRef: MutableRefObject<
    { diagramId: string | number; parentDiagramId?: string | number }[]
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
  inquiryType: string | null;
}

export default function useDiagram({
  diagramItemsListRef,
  currentHighlightStatus,
  colorPalette,
  targetColorMap,
  handleDiagramItem,
  highlightItems,
  inquiryType,
}: UseDiagramProps) {
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);

  const getHighlightColor = (index: number): string =>
    currentHighlightStatus === 2
      ? colorPalette[index % colorPalette.length]
      : "#fef3c7";

  const renderDiagramItems = (structure: any) => {
    switch (inquiryType) {
      case "tree":
        return renderTreeDiagramItems(structure);
      case "example":
        return renderExampleDiagramItems(structure);
      case "logical_progression":
        return renderLogicalProgressionItems(structure);
      default:
        return renderExampleDiagramItems(structure);
    }
  };

  const renderExampleDiagramItems = (
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

    const highlightColor = getHighlightColor(itemIndex);
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
          {item.steps?.map((childItem) =>
            renderExampleDiagramItems(childItem, depth + 1, item.diagramId),
          )}
        </DiagramItem>
      </div>
    );
  };

  const renderLogicalProgressionItems = (
    item: LogicalProgressionStructureType,
    depth = 0,
    parentDiagramId: string | undefined = undefined,
  ): JSX.Element => {
    const isTopLevel = depth === 0;

    // const parentId = isTopLevel ? "root" : parentDiagramId;
    // const itemIndex = diagramItemsListRef.current.length;
    // diagramItemsListRef.current.push({
    //   diagramId: structure.diagramId,
    //   parentDiagramId: parentId,
    // });

    // const highlightColor = getHighlightColor(itemIndex);

    return (
      <div
        className={`mt-8 mb-8 flex flex-col space-y-6`} // 적당한 여백
        ref={isTopLevel ? contentWrapperRef : null}
      >
        {/* 제목 렌더링 */}
        {item.title && (
          <div className="flex items-center space-x-2">
            <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-gray-900 ml-4 flex items-center">
              {item.title}
            </h2>
          </div>
        )}

        {/* 논리 단계 렌더링 */}
        {item.steps?.map((stepItem: LogicalStepType, index: number) => {
          const stepDiagramId = stepItem.diagramId;
          const stepIndex = diagramItemsListRef.current.length;
          diagramItemsListRef.current.push({
            diagramId: stepDiagramId,
            parentDiagramId: parentDiagramId || "root",
          });
          const stepHighlightColor = getHighlightColor(stepIndex);
          targetColorMap.current[stepItem.target] = stepHighlightColor;

          return (
            <DiagramProgressionItem
              key={index}
              diagramId={stepDiagramId}
              step={stepItem.step}
              parentDiagramId={parentDiagramId}
              depth={depth + 1}
              target={stepItem.target}
              statement={stepItem.statement}
              description={stepItem.description}
              implications={stepItem.implications}
              handleDiagramItem={handleDiagramItem}
              highlightItems={highlightItems}
              highlightColor={stepHighlightColor}
            />
          );
        })}

        {/* 결론 렌더링 */}
        {item.conclusion && (
          <div className="ml-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Conclusion
            </h3>
            <p className="text-gray-700">{item.conclusion}</p>
          </div>
        )}
      </div>
    );
  };

  const renderTreeDiagramItems = (structure: any): JSX.Element | null => {
    // 트리 구조의 최상위 콘텐츠가 배열인지 확인
    if (!structure.content || !Array.isArray(structure.content)) return null;

    // 고유한 diagramId 생성을 위한 카운터
    let idCounter = 0;

    // 재귀적으로 트리 노드를 렌더링하는 함수
    const renderTreeNode = (
      node: TreeDiagramItemType,
      depth: number,
      parentDiagramId?: string | number,
    ): JSX.Element => {
      // *Note: DiagramContainer에서 structure 받아올 때, assignDiagramIds로 diagramId를 할당해주니까 그거 사용하면 될듯 (여기서 만들어 줄 필요 x)
      // const diagramId = `tree-${idCounter++}`;
      const diagramId = node.diagramId;
      const isTopLevel = depth === 0;

      // diagramItemsListRef에 현재 노드 추가
      diagramItemsListRef.current.push({
        diagramId,
        parentDiagramId: parentDiagramId || "root",
      });

      // 하이라이트 색상 설정
      const highlightColor = getHighlightColor(
        diagramItemsListRef.current.length - 1,
      );
      targetColorMap.current[node.element_name] = highlightColor;

      return (
        <div
          className={`flex ${depth > 0 ? "pl-5" : ""} flex-row space-x-4`}
          key={diagramId}
          ref={isTopLevel ? contentWrapperRef : null}
        >
          <DiagramTreeItem
            diagramId={diagramId}
            elementName={node.element_name}
            relationTypeWithParent={node.relationTypeWithParent}
            description={node.description}
            relationship={node.relationship}
            depth={depth}
            parentDiagramId={parentDiagramId}
            handleDiagramItem={handleDiagramItem}
            highlightItems={highlightItems}
            highlightColor={highlightColor}
          >
            {node.related_elements &&
              node.related_elements.map((childNode) =>
                renderTreeNode(childNode, depth + 1, diagramId),
              )}
          </DiagramTreeItem>
        </div>
      );
    };

    return (
      <div className="flex flex-row flex-wrap gap-4">
        {structure.content.map((node: TreeDiagramItemType) =>
          renderTreeNode(node, 0, "root"),
        )}
      </div>
    );
  };

  return {
    renderDiagramItems,
    contentWrapperRef,
  };
}
