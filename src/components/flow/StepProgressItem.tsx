import { MutableRefObject, useEffect, useRef } from "react";

interface StepProgressItemProps {
  item: DiagramItem;
  stepProgressItemRef: MutableRefObject<HTMLDivElement | null>;
  stepOffsetInfo: { [key: string]: number };
  highlightColor: string;
}
export default function StepProgressItem({
  item,
  stepProgressItemRef,
  stepOffsetInfo,
  highlightColor,
}: StepProgressItemProps) {
  return (
    <div
      className="absolute"
      ref={stepProgressItemRef}
      style={{
        left: stepOffsetInfo.longestLinePosition + 40,
        top: 80,
      }}
    >
      <div className="w-[520px] rounded-xl shadow-lg border border-gray-200 p-4 my-4 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer bg-white">
        <div className="text-xl font-bold text-gray-900 mb-2">
          Step {item.step}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <strong>Target:</strong>
          <span className="ml-1 block">
            <span style={{ backgroundColor: highlightColor }}>
              {item.target}
            </span>
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <strong>Example:</strong>
          <span className="ml-1 block">{item.example}</span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <strong>Description:</strong>
          <span className="ml-1 block">{item.description}</span>
        </div>
        <div className="text-sm text-gray-600">
          <strong>Result:</strong>
          <span className="ml-1 block">{JSON.stringify(item.result)}</span>
        </div>
      </div>
    </div>
  );
}
