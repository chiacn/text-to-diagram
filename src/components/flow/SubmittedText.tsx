interface SubmittedTextProps {
  submittedText: string;
  isOpenSubmittedText: boolean;
  setIsOpenSubmittedText: (isOpenSubmittedText: boolean) => void;
}

export default function SubmittedText({
  submittedText,
  isOpenSubmittedText,
  setIsOpenSubmittedText,
}: SubmittedTextProps) {
  return (
    <div className="w-full">
      {/* Submit된 텍스트 표시 영역 */}
      <div
        className={`w-full mt-8 bg-white border border-gray-300 rounded-lg shadow-lg ${
          submittedText
            ? "opacity-100 max-h-[500px] scale-100"
            : "opacity-0 max-h-0 scale-95"
        }`}
      >
        {/* 상단 바 -------------------------------------------------- */}
        <div className="flex items-center justify-end p-2 bg-gray-100 border-b border-gray-300">
          {/* 접기/펼치기 토글 버튼 */}
          <button
            onClick={() => setIsOpenSubmittedText(!isOpenSubmittedText)}
            className="text-gray-600 hover:text-gray-800 transition-transform duration-300 transform"
          >
            <span
              className={`inline-block transition-transform duration-300 ${
                isOpenSubmittedText ? "rotate-180" : "rotate-0"
              }`}
            >
              ▲
            </span>
          </button>
        </div>
        {/* ----------------------------------------------------------- */}

        {/* 제출된 텍스트 표시 영역 */}
        <div
          className={`transition-all duration-500 transform whitespace-pre-wrap text-left p-4 ${
            isOpenSubmittedText
              ? "opacity-100 max-h-[500px] scale-100"
              : "opacity-0 max-h-0 scale-95"
          }`}
          style={{ overflow: "hidden" }}
        >
          {submittedText}
        </div>
      </div>
    </div>
  );
}
