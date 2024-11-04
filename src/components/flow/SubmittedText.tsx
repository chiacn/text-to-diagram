import { MutableRefObject, useEffect, useState } from "react";
import useStepProgress from "./hooks/useStepProgress";
import StepProgressContainer from "./StepProgressContainer";
import PlayButton from "./PlayButton";

interface SubmittedTextProps {
  submittedText: string;
  isOpenSubmittedText: boolean;
  setIsOpenSubmittedText: (isOpenSubmittedText: boolean) => void;
  entireSpreadedStep?: DiagramItem[];
  focusSpreadedStep?: DiagramItem[];
  currentHighlightStatus: number;
  targetColorMap: { [key: string]: string };
}

export default function SubmittedText({
  submittedText,
  isOpenSubmittedText,
  setIsOpenSubmittedText,
  entireSpreadedStep,
  focusSpreadedStep,
  currentHighlightStatus,
  targetColorMap,
}: SubmittedTextProps) {
  const [displayText, setDisplayText] = useState<
    string | (string | JSX.Element)[]
  >(submittedText);
  const {
    isPlaying,
    setIsPlaying,
    progressActive,
    highlightedTextByStep,
    currentStep,
    setCurrentStep,
  } = useStepProgress({
    currentHighlightStatus,
    submittedText,
    focusSpreadedStep,
    targetColorMap,
  });

  // 특수 문자를 이스케이프하는 함수
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // highlightText 함수 정의: 여러 키워드와 일치하는 부분을 <span>으로 감싸기
  const highlightText = (text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return text; // 키워드가 없을 경우 원래 텍스트 반환

    // 키워드를 이스케이프하여 정규식을 생성
    const escapedKeywords = keywords.map((keyword) => escapeRegExp(keyword));
    const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi"); // 키워드를 "|"로 연결하여 정규식을 생성

    // 정규식으로 텍스트를 분리하고 일치하는 부분에 <span> 적용
    const parts = text.split(regex);
    return parts.map((part, index) => {
      const matchedKeyword = keywords.find(
        (keyword) => part.toLowerCase() === keyword.toLowerCase(),
      );
      if (matchedKeyword) {
        const highlightColor = targetColorMap[matchedKeyword] || "#fef3c7";
        return (
          <span
            key={`submitted-${index}`}
            style={{ backgroundColor: highlightColor }}
          >
            {part}
          </span>
        );
      } else {
        return <span key={`submitted-${index}`}>{part}</span>;
      }
    });
  };

  const setTextByHighlightStatus = () => {
    if (currentHighlightStatus === 0) {
      setDisplayText(submittedText);
      return;
    }

    // 배열로 들어감.
    const matchingTextArr = focusSpreadedStep?.map(
      (item: DiagramItem) => item.target,
    );

    const highlightedText = highlightText(submittedText, matchingTextArr ?? []);
    setDisplayText(highlightedText);
  };

  useEffect(() => {
    setTextByHighlightStatus();
  }, [focusSpreadedStep]); // currentHighlightStatus 변경 -> focusSpreadedStep 변경 -> highlightText 적용

  return (
    <div className="w-full relative">
      {/* Submit된 텍스트 표시 영역 */}
      <div
        className={`w-full mt-8 bg-white border border-gray-300 rounded-lg shadow-lg ${
          submittedText
            ? "opacity-100 max-h-[500px] scale-100"
            : "opacity-0 max-h-0 scale-95"
        }`}
      >
        {/* 상단 바 -------------------------------------------------- */}
        <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-300">
          {/* 재생 버튼 */}
          <PlayButton isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
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
          className={`transition-all duration-500 transform whitespace-pre-wrap text-left p-4 overflow-scroll scrollbar-custom ${
            isOpenSubmittedText
              ? "opacity-100 max-h-[400px] scale-100"
              : "opacity-0 max-h-0 scale-95"
          }`}
          style={{ overflowX: "hidden" }}
        >
          {progressActive ? highlightedTextByStep : displayText}
          <StepProgressContainer
            progressActive={progressActive}
            focusSpreadedStep={focusSpreadedStep}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </div>
    </div>
  );
}
