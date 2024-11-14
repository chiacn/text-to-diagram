"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DiagramItem from "./DiagramItem";
import useLLM from "@/commonHooks/useLLM";
import CommonToggleGroups from "../CommonTogleGroup";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import SubmittedText from "./SubmittedText";
import useHighlight from "./hooks/useHighlight";
import useHandleDataStructure from "./hooks/useHandleDataStructure";
import test from "node:test";
import useDiagram from "./hooks/useDiagram";
import PromptButton from "./PromptButton";

export default function DiagramContainer() {
  // LLM 테스트 ---------------------------------------------

  const { getAnswerFromModel, inquiryType, setInquiryType, inquiryTypeList } =
    useLLM({});
  const [question, setQuestion] = useState("");
  const [structure, setStructure] = useState(null);
  const [submittedText, setSubmittedText] = useState("");
  const [isOpenSubmittedText, setIsOpenSubmittedText] = useState(false); // 영역 접기/펼치기 상태

  const {
    highlightItems,
    handleDiagramItem,
    diagramItemsListRef,
    currentHighlightStatus,
    colorPalette,
    targetColorMap,
    resetHighlight,
  } = useHighlight();
  const {
    setSpreadSteps,
    entireSpreadedStep,
    focusSpreadedStep,
    assignDiagramIds,
    resetDataStructure,
  } = useHandleDataStructure({
    highlightItems,
    currentHighlightStatus,
    structure,
    inquiryType,
  });

  const { renderDiagramItems } = useDiagram({
    diagramItemsListRef,
    currentHighlightStatus,
    colorPalette,
    targetColorMap,
    handleDiagramItem,
    highlightItems,
    inquiryType,
  });

  function fixJSON(jsonString: string) {
    return jsonString.replace(/"step":\s*([\d.]+)/g, '"step": "$1"');
  }

  const submitPrompt = async () => {
    const response = await getAnswerFromModel(question);
    const match = response.match(/{[\s\S]*}/);
    let jsonString = match ? match[0] : "{}";
    // console.log("jsonString", jsonString);

    const fixedJSONString = fixJSON(jsonString);

    try {
      resetHighlight();
      resetDataStructure();

      // const json = testStructure;
      const json = JSON.parse(fixedJSONString);

      setStructure({ ...assignDiagramIds(json) });
      setSubmittedText(question);
      setIsOpenSubmittedText(true);
      // Note: setState - 비동기적으로 업데이트되고, 다음 렌더링 사이클에 상태 업데이트를 적용되므로
      // structure를 사용하지 않고 assignDiagramIds(json) 그대로 사용.
      setSpreadSteps({ ...assignDiagramIds(json) });
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  };

  const [contentWidth, setContentWidth] = useState(0);
  const contentWrapperRef = useRef<any>(null); // 최상위 depth=1의 width만 추적할 ref

  const changeInquiryType = (type: string) => {
    setStructure(null);
    setSubmittedText("");
    setIsOpenSubmittedText(false);
    resetHighlight();
    resetDataStructure();
    setInquiryType(type);
  };
  useEffect(() => {
    const updateContentWidth = () => {
      if (contentWrapperRef.current) {
        console.log(
          "contentWrapperRef.current.offsetWidth",
          contentWrapperRef.current.offsetWidth,
        );
        setContentWidth(contentWrapperRef.current.offsetWidth + 40);
      }
    };

    updateContentWidth(); // 초기 렌더링 시 설정

    window.addEventListener("resize", updateContentWidth); // 윈도우 리사이즈 시 업데이트
    return () => {
      window.removeEventListener("resize", updateContentWidth); // 컴포넌트 언마운트 시 클린업
    };
  }, []);

  const topScrollRef = useRef<HTMLDivElement | any>(null);
  const bottomScrollRef = useRef<HTMLDivElement | any>(null);
  const syncScroll = (source: string) => {
    if (source === "top") {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    } else {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
  };

  return (
    // Note: <></>로 구성 시 DOM 요소를 생성하지 않아서 flow에 문제가 발생할 수 있음.
    <div>
      <div
        className="flex flex-col justify-center items-center w-[80vw]"
        style={{
          maxWidth: `${
            !contentWidth || contentWidth < 500 ? 1000 : contentWidth
          }px`,
        }}
      >
        <CommonToggleGroups
          items={inquiryTypeList}
          selectedValue={inquiryType}
          changeInquiryType={changeInquiryType}
          gap={20}
        />
        <div className="flex w-full mt-4">
          <Textarea
            name="postContent"
            rows={4}
            cols={40}
            onChange={(e) => setQuestion(e.target.value)}
            className={`border border-gray-300 flex-4 w-full h-[90px]`}
          ></Textarea>
          <Button
            onClick={submitPrompt}
            className="w-32 h-[90px] ml-2 flex-1 justify-center item-center"
          >
            Submit
          </Button>
          <PromptButton />
        </div>
      </div>

      <div className="sticky top-0 z-20">
        <SubmittedText
          submittedText={submittedText}
          isOpenSubmittedText={isOpenSubmittedText}
          setIsOpenSubmittedText={setIsOpenSubmittedText}
          currentHighlightStatus={currentHighlightStatus}
          entireSpreadedStep={entireSpreadedStep}
          focusSpreadedStep={focusSpreadedStep}
          targetColorMap={targetColorMap.current}
          inquiryType={inquiryType}
        />

        {/* 상단 스크롤 ---------------------------------------------------- */}
        <div
          ref={topScrollRef}
          onScroll={() => syncScroll("top")}
          className="scrollbar-custom w-[80vw] mt-2"
        >
          <div
            className="h-[2px]"
            style={{ width: `${contentWidth}px` }} // Inner div
          ></div>
        </div>
        {/* ---------------------------------------------------------------- */}
      </div>

      <div
        ref={bottomScrollRef}
        onScroll={() => syncScroll("bottom")}
        className="scrollbar-custom w-[80vw] min-h-min flex flex-col overflow-x-auto"
      >
        {structure && renderDiagramItems(structure)}
        {/* {testStructure && renderDiagramItems(testStructure)} */}
      </div>
    </div>
  );
}
