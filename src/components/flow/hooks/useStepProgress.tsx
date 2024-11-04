import { useEffect, useState } from "react";

interface StepProgressProps {
  isPlaying: boolean;
  currentHighlightStatus: number;
  submittedText: string;
  focusSpreadedStep?: DiagramItem[];
  targetColorMap: { [key: string]: string };
}
export default function useStepProgress({
  isPlaying,
  currentHighlightStatus,
  submittedText,
  focusSpreadedStep,
  targetColorMap,
}: StepProgressProps) {
  const [progressActive, setProgressActive] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [highlightedTextByStep, setHighlightedTextByStep] = useState<
    string | (string | JSX.Element)[]
  >(submittedText);

  const setHighlightTextByStep = (step: number) => {
    const matchingTextArr = [focusSpreadedStep?.[0].target];
    const text = highlightText(
      submittedText,
      (matchingTextArr as string[]) ?? [],
    );
    setHighlightedTextByStep(text);
  };

  // 특수 문자를 이스케이프하는 함수
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // highlightText 함수 정의: 여러 키워드와 일치하는 부분을 <span>으로 감싸기
  const highlightText = (text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return text; // 키워드가 없을 경우 원래 텍스트 반환

    const escapedKeywords = keywords.map((keyword) => escapeRegExp(keyword));
    const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi"); // 키워드를 "|"로 연결하여 정규식을 생성

    const parts = text.split(regex);
    return parts.map((part, index) => {
      const matchedKeyword = keywords.find(
        (keyword) => part.toLowerCase() === keyword.toLowerCase(),
      );
      if (matchedKeyword) {
        const highlightColor = targetColorMap[matchedKeyword] || "#fef3c7";
        return (
          <span key={index} style={{ backgroundColor: highlightColor }}>
            {part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  // TODO: 이제 currentStep 변경, currentStep에 따라 표시해 줄 StepProgressItem 개발할 차례.
  useEffect(() => {
    progressActive && setHighlightTextByStep(currentStep);
  }, [progressActive, currentStep]); // currentHighlightStatus 변경 -> focusSpreadedStep 변경 -> highlightText 적용

  useEffect(() => {
    switch (currentHighlightStatus) {
      case 0:
      case 1:
      case 2:
        if (isPlaying) setProgressActive(true);
        else setProgressActive(false);
        break;
      default:
        setProgressActive(false);
        break;
    }
  }, [isPlaying]);

  return { progressActive, highlightedTextByStep };
}
