import { MutableRefObject } from "react";

interface StepProgressItemProps {
  item: Record<string, any>; // 모든 속성을 동적으로 처리하기 위해 타입을 넓게 설정
  stepProgressItemRef: MutableRefObject<HTMLDivElement | null>;
  stepOffsetInfo: { [key: string]: number };
  highlightColor: string;
  inquiryType: string | null;
}

export default function StepProgressItem({
  item,
  stepProgressItemRef,
  stepOffsetInfo,
  highlightColor,
  inquiryType,
}: StepProgressItemProps) {
  const displayKeys: Record<
    "example" | "logical_progression" | "tree" | string,
    string[]
  > = {
    example: ["target", "example", "description", "result"],
    logical_progression: ["target", "statement", "description", "implications"],
    tree: ["target"], //TODO: 추후 추가
  };

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
        {Object.entries(item)
          .filter(([key, value]) => {
            const keys = displayKeys[inquiryType ?? "example"];
            return Array.isArray(keys) && keys.includes(key.toLowerCase());
          })
          .map(([key, value]) => {
            if (key === "step") return null; // 이미 step은 위에서 렌더링되었으므로 제외

            return (
              <div key={key} className="text-sm text-gray-600 mb-2">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                <span className="ml-1 block">
                  {key === "target" ? (
                    <span style={{ backgroundColor: highlightColor }}>
                      {value}
                    </span>
                  ) : (
                    JSON.stringify(value)
                  )}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
