import React from "react";

interface DiagramItemProps {
  diagramId: number | string;
  depth: number;
  target: string;
  example: string;
  description: string;
  result: { answer: any[] };
  children?: React.ReactNode;
}

export default function DiagramItem({
  diagramId,
  depth,
  target,
  example,
  description,
  result,
  children,
}: DiagramItemProps) {
  return (
    <div
      className={`rounded-lg shadow-md border p-4 my-2 transition-all duration-300 transform bg-gray-100
                  hover:shadow-lg hover:translate-y-[-4px] hover:border-teal-500 hover:bg-teal-50 ml-${
                    depth * 5
                  }`}
    >
      <div className="text-lg font-semibold text-gray-800 mb-2">
        Step {diagramId}
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
      {/* <div className="mt-3">{children}</div> */}
      <div className="mt-3 flex flex-row">{children}</div>
    </div>
  );
}
