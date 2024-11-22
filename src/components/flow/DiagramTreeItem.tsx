import React, { useEffect, useState } from "react";
import { BiRectangle } from "react-icons/bi";
import { GoDash } from "react-icons/go";

interface DiagramTreeItemProps {
  diagramId: string | number;
  elementName: string;
  relationTypeWithParent?: string;
  description: string;
  relationship?: any[];
  depth: number;
  parentDiagramId?: string | number;
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
  children?: React.ReactNode;
}

const DiagramTreeItem: React.FC<DiagramTreeItemProps> = ({
  diagramId,
  elementName,
  relationTypeWithParent,
  description,
  relationship,
  depth,
  parentDiagramId,
  handleDiagramItem,
  highlightItems,
  highlightColor,
  children,
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 펼쳐짐 상태 관리

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

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev); // 펼쳐짐 상태 토글
  };

  return (
    <div
      className={`relative rounded-3xl border-[1px] p-4 my-2 transition-all duration-300 transform cursor-pointer max-w-[400px] min-w-[180px]
                 ml-${depth * 5} bg-white ${
        !isExpanded ? "max-w-min max-h-min" : ""
      }`}
      style={{ backgroundColor: isHighlighted ? highlightColor : "white" }}
      onClick={clickDiagramItem}
    >
      {/* 우측 상단 버튼 */}
      <button
        onClick={handleButtonClick}
        className="absolute top-2 right-2 hover:bg-gray-200 rounded p-1 flex items-center justify-center"
        style={{ width: "20px", height: "20px" }}
      >
        {isExpanded ? <GoDash /> : <BiRectangle />}
      </button>

      {/* elementName 항상 표시 */}
      <div className="text-lg font-semibold text-gray-800 mb-2 mt-2 ml-4 mr-6">
        {elementName}
      </div>

      {/* 슬라이드 다운 효과 */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? "max-h-min opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {relationTypeWithParent && (
          <div className="text-gray-700">
            <strong>Relationship with Parent:</strong> {relationTypeWithParent}
          </div>
        )}
        <div className="text-gray-700">
          <strong>Description:</strong> {description}
        </div>
        {relationship && relationship.length > 0 && (
          <div className="text-gray-700">
            <strong>Relationships:</strong> {JSON.stringify(relationship)}
          </div>
        )}
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
};

export default DiagramTreeItem;
