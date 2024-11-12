import React, { useEffect, useState } from "react";

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
      className={`rounded-xl border-[1px] p-4 my-2 transition-all duration-300 transform cursor-pointer
                 ml-${depth * 5} bg-white`}
      style={{ backgroundColor: isHighlighted ? highlightColor : "white" }}
      onClick={clickDiagramItem}
    >
      <div className="text-lg font-semibold text-gray-800 mb-2">
        {elementName}
      </div>
      {relationTypeWithParent && (
        <div className="text-gray-700">
          <strong>Relation:</strong> {relationTypeWithParent}
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
  );
};

export default DiagramTreeItem;
