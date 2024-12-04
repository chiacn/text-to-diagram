import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import StepProgressItem from "../StepProgressItem";
import React from "react";
import { match } from "assert";

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

  // highlightText 함수 정의: 여러 키워드와 일치하는 부분을 <span>으로 감싸기
  const highlightText = (text: string, keywords: string[]) => {
    if (!focusSpreadedStep || focusSpreadedStep.length === 0) return text;
    if (!keywords || keywords.length === 0) return text;

    let alreadyHighlighted = false;
    let highlightColor = null;

    const { parts, matchingText } = splitParts({
      text,
      keywords,
      isSimilar: true,
    });

    return (
      // Note: 전체 parts를 span으로 감싸면 어차피 가장 긴 line을 찾을 수 있음.
      <span ref={longestLineRef}>
        {parts.map((part, index) => {
          const matchedKeyword = keywords.find(
            // (keyword) => part?.toLowerCase() === keyword?.toLowerCase(),
            (keyword) => part?.toLowerCase() === matchingText?.toLowerCase(),
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

  ///////////////////////////////////////////////////
  // Util ==========================================
  ///////////////////////////////////////////////////

  function splitParts({
    text,
    keywords,
    isSimilar = false,
  }: {
    text: string;
    keywords: string[];
    isSimilar?: boolean;
  }) {
    const escapedKeywords = changeApostrophe(escapeRegex(keywords[0]));
    const regex = new RegExp(`(${escapedKeywords})`, "gi");
    const splitedRegex = text.split(regex);

    // console.log("splitedRegex :: ", splitedRegex);
    // console.log("matchingText --- ", keywords[0]);

    // 일치하는 문장이 있는 경우 (splitedRegex가 2개 이상) => 기존 로직으로 처리.
    // (보통 splitedRegex는 [이전 문장, 일치하는 문장, 이후 문장]으로 나뉘어지므로 (2개 이상)
    if (!isSimilar || splitedRegex.length > 2)
      return {
        matchingText: keywords[0],
        parts: splitedRegex,
      };

    // 완전히 일치하는 문장이 없는 경우 (splitedRegex.length가 한 개 이하) - 유사도 기반으로 처리
    return splitPartsWithSimilarity({ text, keywords, regex });
  }

  function splitPartsWithSimilarity({
    text,
    keywords,
    regex,
  }: {
    text: string;
    keywords: string[];
    regex: RegExp;
  }): { matchingText: string; parts: string[] } {
    const lines = text.split("\n");
    // let parts: string[] = [];
    let result: { matchingText: string; parts: string[] } = {
      matchingText: "",
      parts: [],
    };
    keywords.forEach((keyword) => {
      let highestSimilarity = 0;
      let bestMatchLine = "";

      // 해당 keyword에 대하여 가장 유사한 라인을 찾음.
      /* 
        [smilarity] - 각 line의 유사도
        [highestSimilarity] - 가장 높은 유사도
        [bestMatchLine] - 가장 유사한 라인
      */
      lines.forEach((line) => {
        const similarity = calculateSimilarity(line, keyword);
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatchLine = line;
        }
      });

      // 이스케이프 처리된 문자열로 정규식 생성
      const escapedBestMatching = escapeRegex(bestMatchLine);
      const regex = new RegExp(`(${escapedBestMatching})`, "gi");

      const splitedRegex = text.split(regex);

      // 유사도가 0.5 이상이면
      if (highestSimilarity >= 0.3) {
        // 가장 유사한 라인을 정규식으로 구분
        result = { matchingText: bestMatchLine, parts: [...splitedRegex] };
      } else {
        // 구분 없이 그대로 추가
        result = { matchingText: keywords[0], parts: [...text.split(regex)] };
      }
    });
    return result;
  }
  // 특수문자 이스케이프 처리 함수
  function escapeRegex(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function changeApostrophe(text: string) {
    return text.replace(/'/g, "’");
  }

  function calculateSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const dp: number[][] = Array.from({ length: len1 + 1 }, () =>
      Array(len2 + 1).fill(0),
    );

    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] =
            Math.min(
              dp[i - 1][j], // 삭제
              dp[i][j - 1], // 삽입
              dp[i - 1][j - 1], // 치환
            ) + 1;
        }
      }
    }

    const distance = dp[len1][len2];
    return 1 - distance / Math.max(len1, len2); // 유사도: 0 ~ 1 (1에 가까울수록 유사)
  }

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
