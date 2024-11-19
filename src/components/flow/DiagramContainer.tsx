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
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import CommonButton from "../CommonButton";

export default function DiagramContainer() {
  // LLM 테스트 ---------------------------------------------

  const {
    getAnswerFromModel,
    inquiryType,
    setInquiryType,
    inquiryTypeList,
    getPromptByInputText,
  } = useLLM({});
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

  const [isLoading, setIsLoading] = useState(false);

  const getCopyPrompt = async (input: string) => {
    const copied = await getPromptByInputText(input);
    await navigator.clipboard.writeText(JSON.stringify(copied) || "");
    toast({
      variant: "info",
      description: "Copied!",
    });
  };

  function fixJSON(jsonString: string) {
    return jsonString.replace(/"step":\s*([\d.]+)/g, '"step": "$1"');
  }

  const submitPrompt = async (
    json: string | null = null,
    tempQuestion: string | null = null,
  ) => {
    try {
      let response;
      setIsLoading(true);
      if (json === null) {
        response = await getAnswerFromModel(question);
      } else {
        response = json;
      }
      const match = response.match(/{[\s\S]*}/);
      let jsonString = match ? match[0] : "{}";
      const fixedJSONString = fixJSON(jsonString);

      const validation = validateJsonFormat(fixedJSONString);
      if (!validation.result) throw new Error(validation.message);

      resetHighlight();
      resetDataStructure();

      const parsedJson = JSON.parse(fixedJSONString);

      setStructure({ ...assignDiagramIds(parsedJson) });
      if (json && tempQuestion) {
        setSubmittedText(tempQuestion);
      } else {
        setSubmittedText(question);
      }
      setIsOpenSubmittedText(true);
      // Note: setState - 비동기적으로 업데이트되고, 다음 렌더링 사이클에 상태 업데이트를 적용되므로
      // structure를 사용하지 않고 assignDiagramIds(json) 그대로 사용.
      setSpreadSteps({ ...assignDiagramIds(json) });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error?.message,
      });
      console.error("Failed to parse JSON:", error);

      return {
        // PromptButtomDialog용
        result: false,
        message: error.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const validateJsonFormat = (str: string) => {
    try {
      checkValidation();
      parsingStr();
      checkHasValidKey(str);
      return {
        result: true,
        message: "Success!",
      };
    } catch (e: any) {
      return {
        result: false,
        message: e.message,
      };
    }

    function parsingStr() {
      try {
        JSON.parse(str.trim());
        return {
          result: true,
          message: "Success!",
        }; // 파싱에 성공하면 유효한 JSON
      } catch (e: any) {
        console.error("error :: ", e);
        throw {
          result: false,
          message: "Invalid JSON format.",
        }; // 파싱 중 에러 발생 시 유효하지 않음
      }
    }
    function checkHasValidKey(str: string) {
      const requiredKeysMap: any = {
        example: ["target", "example", "steps"],
        tree: ["content"],
        progression: ["steps"],
      };

      const json = JSON.parse(str);
      const keys = Object.keys(json);
      const requiredKeys = requiredKeysMap[inquiryType ?? "example"];

      if (!requiredKeys) {
        throw {
          result: false,
          message: "Invalid inquiry type. Please try again.",
        };
      }

      const missingKey = requiredKeys.find(
        (key: string) => !keys.includes(key),
      );
      if (missingKey) {
        throw {
          result: false,
          message: `A required key is missing in the JSON: ${missingKey}. Please try again.`,
        };
      }

      return {
        result: true,
        message: "Success!",
      };
    }
  };

  const checkValidation = () => {
    if (!inquiryType)
      throw { result: false, message: "Please select inquiry type." };
    return { result: true, message: "Success" };
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
          <CommonButton
            onClick={submitPrompt}
            className="min-w-[90px] h-[90px] ml-2 flex-1 justify-center item-center"
            isLoading={isLoading}
          >
            Submit
          </CommonButton>
          <PromptButton
            getCopyPrompt={getCopyPrompt}
            submitPrompt={submitPrompt}
          />
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
