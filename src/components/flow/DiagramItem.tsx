import React, { useEffect, useState } from "react";

interface DiagramItemProps {
  diagramId: number | string;
  step?: number | string;
  parentDiagramId?: number | string;
  depth: number;
  target: string;
  example: string;
  description: string;
  result?: { answer: any[] };
  handleDiagramItem: (
    effectType: string,
    params: {
      diagramId: number | string;
      depth: number;
      parentDiagramId?: number | string;
    },
  ) => void;
  highlightItems?: Array<number | string>;
  children?: React.ReactNode[];
}

export default function DiagramItem({
  diagramId,
  step,
  parentDiagramId,
  depth,
  target,
  example,
  description,
  result,
  handleDiagramItem,
  highlightItems,
  children,
}: DiagramItemProps) {
  // TODO: Next, Prev 버튼 추가?

  const [isHighlighted, setIsHighlighted] = useState(false);

  const clickDiagramItem = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleDiagramItem("highlight", { diagramId, depth, parentDiagramId });
  };

  const changeDiagramColor = () => {
    // `highlightItems` 배열에 `depth`가 포함되어 있다면 true로 설정하여 색상을 변경
    setIsHighlighted(highlightItems?.includes(diagramId) ?? false);
  };

  useEffect(() => {
    changeDiagramColor();
  }, [highlightItems]);

  return (
    <div
      className={`rounded-xl border-[1px] p-4 my-2 transition-all duration-300 transform bg-gray-100 cursor-pointer
                   ml-${depth * 5}  ${
        isHighlighted ? "bg-amber-100" : "bg-white"
      }`}
      onClick={(e) => clickDiagramItem(e)}
    >
      <div className="text-lg font-semibold text-gray-800 mb-2">
        Step {step}
      </div>
      <div className="text-gray-700">
        <strong>Target:</strong> {target}
      </div>
      <div className="text-gray-700">
        <strong>Example:</strong> {example}
      </div>
      <div className="text-gray-700">
        <strong>Description:</strong> {description}
      </div>
      <div className="text-gray-700">
        <strong>Result:</strong> {JSON.stringify(result)}
      </div>
      {/*  TODO: 여기 flex-row 임시 적용 */}
      <div className="mt-3">{children}</div>
      {/* <div className="mt-3 flex flex-row">{children}</div> */}
    </div>
  );
}
