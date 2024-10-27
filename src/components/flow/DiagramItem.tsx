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
  const defaultStyle: React.CSSProperties = {
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: "1px solid black",
    padding: "10px",
    margin: "5px",
    marginLeft: `${depth * 20}px`, // depth에 따라 들여쓰기
  };

  return (
    <div style={defaultStyle}>
      <div>
        <strong>Step {diagramId}</strong>
      </div>
      <div>
        <strong>Target:</strong> {target}
      </div>
      <div>
        <strong>Example:</strong> {example}
      </div>
      <div>
        <strong>Description:</strong> {description}
      </div>
      <div>
        <strong>Result:</strong> {JSON.stringify(result)}
      </div>
      <div style={{ marginTop: "10px" }}>{children}</div>
    </div>
  );
}
