import React, { useEffect, useState } from "react";

interface DiagramProgressionItemProps {
  diagramId: number | string;
  step: number | string;
  parentDiagramId?: number | string;
  depth: number;
  target: string;
  statement: string;
  description: string;
  implications: string;
  handleDiagramItem: (
    effectType: string,
    params: {
      diagramId: number | string;
      depth: number;
      parentDiagramId?: number | string;
    },
  ) => void;
  highlightItems?: Array<number | string>;
  highlightColor?: string;
}

export default function DiagramProgressionItem({
  diagramId,
  step,
  parentDiagramId,
  depth,
  target,
  statement,
  description,
  implications,
  handleDiagramItem,
  highlightItems,
  highlightColor,
}: DiagramProgressionItemProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const clickDiagramItem = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleDiagramItem("highlight", { diagramId, depth, parentDiagramId });
  };

  const changeDiagramColor = () => {
    setIsHighlighted(highlightItems?.includes(diagramId) ?? false);
  };

  useEffect(() => {
    changeDiagramColor();
  }, [highlightItems]);

  return (
    <div
      className={`rounded-lg border p-4 my-3 transition-all duration-300 transform cursor-pointer ${
        isHighlighted ? "shadow-md" : ""
      }`}
      style={{
        backgroundColor: isHighlighted ? highlightColor : "#ffffff",
        marginLeft: `${depth * 20}px`,
        borderColor: isHighlighted ? highlightColor : "#e5e7eb",
      }}
      onClick={(e) => clickDiagramItem(e)}
    >
      <div className="text-lg font-semibold text-gray-800 mb-2">
        Step {step}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <strong className="text-gray-700">Target:</strong> {target}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <strong className="text-gray-700">Statement:</strong> {statement}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <strong className="text-gray-700">Description:</strong> {description}
      </div>
      <div className="text-sm text-gray-600">
        <strong className="text-gray-700">Implications:</strong> {implications}
      </div>
    </div>
  );
}
