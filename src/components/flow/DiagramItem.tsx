interface DiagramItemProps {
  diagramId: number;
  style: React.CSSProperties;
}
export default function DiagramItem({ diagramId, style }: DiagramItemProps) {
  const defaultStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: "1px solid black",
  };
  return <div style={{ ...defaultStyle, ...style }}></div>;
}
