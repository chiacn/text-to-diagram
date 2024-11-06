import { useEffect, useLayoutEffect, useRef, useState } from "react";
import StepProgressItem from "../StepProgressItem";
import React from "react";

interface StepProgressProps {
  currentHighlightStatus: number;
  submittedText: string;
  focusSpreadedStep?: DiagramItem[];
  targetColorMap: { [key: string]: string };
}
export default function useStepProgress({
  currentHighlightStatus,
  submittedText,
  focusSpreadedStep,
  targetColorMap,
}: StepProgressProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressActive, setProgressActive] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [highlightedTextByStep, setHighlightedTextByStep] = useState<
    string | (string | JSX.Element)[]
  >(submittedText);

  // 추가된 상태 및 ref
  const [stepOffsetInfo, setStepOffsetInfo] = useState({
    longestLinePosition: 0,
    stepProgressItemHeight: 0,
    highlightedTextPosition: 0,
    submittedTextMinHeight: 0,
    submittedTextMaxHeight: 0,
  });

  const textContainerRef = useRef<HTMLDivElement>(null);
  const highlightedTextRef = useRef<HTMLSpanElement>(null);
  const stepProgressItemRef = useRef<HTMLDivElement>(null);
  const longestLineRef = useRef<HTMLSpanElement>(null);

  /*
    TODO: 추가로 필요한 기능
    1. text 중 가장 긴 줄의 위치값 - StepProgressItem의 left 위치값 계산하는데 사용.
    2. StepProgressItem의 height 값 - StepProgressItem의 top 위치값, 전체 SubmittedText의 최소 높이 최대 높이값 계산하는데 사용.
    3. highlight된 text의 위치값 - SubmittedText의 스크롤  위치값 계산하는데 사용. (해당 부분으로 이동)

    => 이 정보들을 구할 수 있는 시점. 
      1. submittedText 들어오는 시점. 
      2. highlightText 함수 - StepProgressItem 렌더링 시점. 
      3. highlightText 함수 - 해당 text의 위치값 알아내기.

      => 이 세 가지 정보를 uiInfo로 관리?
  */

  const setHighlightTextByStep = (step: number) => {
    const matchingTextArr = [focusSpreadedStep?.[currentStep]?.target];
    const text = highlightText(
      submittedText,
      (matchingTextArr as string[]) ?? [],
    );
    const wrappedText = getWrappedText(text); // 가장 긴 줄 span으로 감싸서 위치 값 얻기.
    setHighlightedTextByStep(wrappedText);
  };
  const getWrappedText = (text: string | (string | JSX.Element)[]) => {
    const contentArray = Array.isArray(text) ? text : [text];
    let longestLineLength = 0;
    let longestLineIndex = 0;

    const lines = contentArray.map((item, index) => {
      const lineContent = typeof item === "string" ? item : ""; // Assuming JSX elements are wrappers around strings
      if (lineContent.length > longestLineLength) {
        longestLineLength = lineContent.length;
        longestLineIndex = index;
      }
      return item;
    });

    return lines.map((line, index) => {
      const isLongestLine = index === longestLineIndex;
      return (
        <span key={`line-${index}`} ref={isLongestLine ? longestLineRef : null}>
          {line}
        </span>
      );
    });
  };

  // 특수 문자를 이스케이프하는 함수
  const escapeRegExp = (string: string) => {
    return string?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // highlightText 함수 정의: 여러 키워드와 일치하는 부분을 <span>으로 감싸기
  const highlightText = (text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return text; // 키워드가 없을 경우 원래 텍스트 반환

    const escapedKeywords = keywords.map((keyword) => escapeRegExp(keyword));
    const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi"); // 키워드를 "|"로 연결하여 정규식을 생성

    let alreadyHighlighted = false; // Note: 첫 번째 일치 키워드만 highlight 처리

    const parts = text.split(regex);
    return parts.map((part, index) => {
      const matchedKeyword = keywords.find(
        (keyword) => part?.toLowerCase() === keyword?.toLowerCase(),
      );
      if (matchedKeyword && !alreadyHighlighted) {
        alreadyHighlighted = true;
        const highlightColor = targetColorMap[matchedKeyword] || "#fef3c7";
        return (
          <span key={`fragment-${index}`}>
            <span
              key={`progress-${index}`}
              style={{ backgroundColor: highlightColor }}
              ref={highlightedTextRef}
            >
              {part}
            </span>
            <StepProgressItem
              key={`progress-item-${index}`}
              item={focusSpreadedStep?.[currentStep] as DiagramItem}
              stepProgressItemRef={stepProgressItemRef}
              stepOffsetInfo={stepOffsetInfo}
            />
          </span>
        );
      } else {
        return <span key={`part-${index}`}>{part}</span>;
      }
    });
  };

  const resetProgress = () => {
    setIsPlaying(false);
    setProgressActive(false);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (currentHighlightStatus === 0 || currentHighlightStatus === 1) {
      resetProgress();
    }
  }, [currentHighlightStatus, focusSpreadedStep]);

  useEffect(() => {
    progressActive && setHighlightTextByStep(currentStep);
  }, [progressActive, currentStep]); // currentHighlightStatus 변경 -> focusSpreadedStep 변경 -> highlightText 적용

  useEffect(() => {
    switch (currentHighlightStatus) {
      case 0:
      case 1:
      case 2:
        if (isPlaying) setProgressActive(true);
        else resetProgress();
        break;
      default:
        resetProgress();
        break;
    }
  }, [isPlaying]);

  useLayoutEffect(() => {
    setUIInfoByStepChange();
  }, [highlightedTextByStep]);

  const setUIInfoByStepChange = () => {
    if (highlightedTextRef.current) {
      console.log("useLayoutEffect ----- highlightedTextPosition");
      const rect = highlightedTextRef.current.getBoundingClientRect();
      setStepOffsetInfo((prevUiInfo) => ({
        ...prevUiInfo,
        highlightedTextPosition: rect.top,
      }));
    }
    if (stepProgressItemRef.current) {
      const rect = stepProgressItemRef.current.getBoundingClientRect();
      setStepOffsetInfo((prevUiInfo) => ({
        ...prevUiInfo,
        stepProgressItemHeight: rect.height,
      }));
    }

    if (longestLineRef.current) {
      const rect = longestLineRef.current.getBoundingClientRect().right;
      setStepOffsetInfo((prevUiInfo) => ({
        ...prevUiInfo,
        longestLinePosition: rect,
        submittedTextMinHeight: textContainerRef.current?.clientHeight || 0,
        submittedTextMaxHeight: textContainerRef.current?.scrollHeight || 0,
      }));
    }
  };

  return {
    isPlaying,
    setIsPlaying,
    progressActive,
    highlightedTextByStep,
    currentStep,
    setCurrentStep,
    stepOffsetInfo,
    textContainerRef,
  };
}
