import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import StepProgressItem from "../StepProgressItem";
import React from "react";

interface StepProgressProps {
  currentHighlightStatus: number;
  submittedText: string;
  focusSpreadedStep?: DiagramItem[];
  targetColorMap: { [key: string]: string };
  inquiryType: string | null;
}
export default function useStepProgress({
  currentHighlightStatus,
  submittedText,
  focusSpreadedStep,
  targetColorMap,
  inquiryType,
}: StepProgressProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressActive, setProgressActive] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [highlightedTextByStep, setHighlightedTextByStep] = useState<
    string | (string | JSX.Element)[]
  >(submittedText);
  const [isSmaller, setIsSmaller] = useState<boolean>(false);

  // 추가된 상태 및 ref
  const [stepOffsetInfo, setStepOffsetInfo] = useState({
    longestLinePosition: 0,
    stepProgressItemHeight: 0,
    highlightedTextPosition: 0,
    submittedTextMinHeight: 0,
    submittedTextMaxHeight: 0,
    submittedTextRightPosition: 0,
  });

  const textContainerRef = useRef<HTMLDivElement>(null);
  const highlightedTextRef = useRef<HTMLSpanElement>(null);
  const stepProgressItemRef = useRef<HTMLDivElement>(null);
  const longestLineRef = useRef<HTMLSpanElement>(null);

  const setHighlightText = () => {
    if (inquiryType === "tree") {
      setHighlightWithTree();
      return;
    }

    const matchingTextArr = [focusSpreadedStep?.[currentStep]?.target];
    const text = highlightText(
      submittedText,
      (matchingTextArr as string[]) ?? [],
    );
    setHighlightedTextByStep(text as any);
  };

  const setHighlightWithTree = () => {
    if (focusSpreadedStep?.length === 0) return;

    const matchingTextArr = focusSpreadedStep?.map(
      (step: any) => step.element_name,
    );

    const text = highlightText(
      submittedText,
      (matchingTextArr as string[]) ?? [],
    );
    setHighlightedTextByStep(text as any);
  };

  // 특수 문자를 이스케이프하는 함수
  const escapeRegExp = (string: string) => {
    return string?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // highlightText 함수 정의: 여러 키워드와 일치하는 부분을 <span>으로 감싸기
  const highlightText = (text: string, keywords: string[]) => {
    if (!focusSpreadedStep || focusSpreadedStep.length === 0) return text;
    if (!keywords || keywords.length === 0) return text;

    const escapedKeywords = keywords.map((keyword) => escapeRegExp(keyword));
    const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi");

    let alreadyHighlighted = false;
    let highlightColor = null;

    const parts = text.split(regex);
    return (
      // Note: 전체 parts를 span으로 감싸면 어차피 가장 긴 line을 찾을 수 있음.
      <span ref={longestLineRef}>
        {parts.map((part, index) => {
          const matchedKeyword = keywords.find(
            (keyword) => part?.toLowerCase() === keyword?.toLowerCase(),
          );
          if (matchedKeyword && !alreadyHighlighted) {
            if (inquiryType !== "tree") alreadyHighlighted = true;
            highlightColor = targetColorMap[matchedKeyword] || "#fef3c7";
            return (
              <span key={`fragment-${index}`}>
                <span
                  key={`progress-${index}`}
                  style={{ backgroundColor: highlightColor }}
                  ref={highlightedTextRef}
                >
                  {part}
                </span>
              </span>
            );
          } else {
            return <span key={`part-${index}`}>{part}</span>;
          }
        })}
        {inquiryType !== "tree" && (
          <StepProgressItem
            key={`progress-item`}
            item={focusSpreadedStep?.[currentStep] as DiagramItem}
            stepProgressItemRef={stepProgressItemRef}
            stepOffsetInfo={stepOffsetInfo}
            highlightColor={highlightColor ?? ""}
            inquiryType={inquiryType}
          />
        )}
      </span>
    );
  };

  const resetProgress = () => {
    setIsPlaying(false);
    setProgressActive(false);
    setCurrentStep(0);
    setStepOffsetInfo({
      longestLinePosition: 0,
      stepProgressItemHeight: 0,
      highlightedTextPosition: 0,
      submittedTextMinHeight: 0,
      submittedTextMaxHeight: 0,
      submittedTextRightPosition: 0,
    });
    setIsSmaller(false);
  };

  useEffect(() => {
    // Note: tree일 경우 node 요소 클릭 시 highlight 되도록
    if (currentHighlightStatus !== 0 && inquiryType === "tree") {
      setProgressActive(true);
      setHighlightText();
    } else if (currentHighlightStatus === 0 || currentHighlightStatus === 1) {
      resetProgress();
    }
  }, [currentHighlightStatus, focusSpreadedStep]);

  // Note: longestLinePosition 할당 시 StepProgressItem가 그 값을 반영할 수 있도록 의존성 배열에 stepOffsetInfo.longestLinePosition 추가
  useEffect(() => {
    progressActive && setHighlightText();
  }, [progressActive, currentStep, stepOffsetInfo.longestLinePosition]); // currentHighlightStatus 변경 -> focusSpreadedStep 변경 -> highlightText 적용

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

  /*
    ? 왜 useLayoutEffect가 유리한가.
    우선 useLayoutEffect는 useLayoutEffect가 재렌더링을 트리거하는 시점, 그 직후에 DOM 업데이트 직후, paint, layout 단계 이전에 
    해당 로직이 동기적으로 실행되므로 정확한 DOM 값을 얻는데 유리, 깜빡임 현상 줄일 수 있음.
    (다만 성능상으론 useLayoutEffect가 더 무거움)
  */
  useLayoutEffect(() => {
    if (inquiryType === "tree") return;
    setUIInfoByStepChange();
    goToHighlightedText();
  }, [highlightedTextByStep]);

  const goToHighlightedText = () => {
    if (highlightedTextRef.current) {
      highlightedTextRef.current.scrollIntoView({
        behavior: "smooth", // FIXME: 바깥 scroll도 움직여서 block, inline - nearest로 바꾸니까 behavior: smooth 안 먹히는 이슈.
        block: "nearest",
        inline: "nearest",
      });
    }
  };

  // SubmittedText의 오른쪽 경계와, longestLinePosition (가장 긴 줄)의 차이를 통해 isSmaller를 결정
  const checkIsSmaller = (
    submittedTextRightPosition: number,
    longestLinePosition: number,
  ) => {
    // * prev 값 - 이미 변경되었으면 다시 안 바뀌게. (최초에만 변경)
    // * 여러번 바뀔 수 있게되면, isSmaller에 의해 바뀐 SubmittedText의 width에 의해 isSmaller가 자기 자신의 변동사항에 의해 계속 변경되게 됨.
    const isSmaller =
      inquiryType === "tree"
        ? false
        : submittedTextRightPosition - longestLinePosition < 400;
    setIsSmaller((prev) => (!prev ? isSmaller : prev));
  };

  const setUIInfoByStepChange = () => {
    if (highlightedTextRef.current) {
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
      const submittedTextRightPosition = Math.floor(
        textContainerRef.current?.getBoundingClientRect().right || 0,
      );

      const submittedTextLeftPosition = Math.floor(
        textContainerRef.current?.getBoundingClientRect().left || 0,
      );

      const longestLineRightPosition = Number(
        longestLineRef.current.offsetWidth,
      );

      checkIsSmaller(submittedTextRightPosition, longestLineRightPosition);
      setStepOffsetInfo((prevUiInfo) => ({
        ...prevUiInfo,
        // Note: longestLineRightPosition 값은 초기에 한 번만 이루어지게 함.
        longestLinePosition: longestLineRightPosition,
        submittedTextMinHeight: textContainerRef.current?.clientHeight || 0,
        submittedTextMaxHeight: textContainerRef.current?.scrollHeight || 0,
        submittedTextRightPosition: submittedTextRightPosition,
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
    isSmaller,
  };
}
