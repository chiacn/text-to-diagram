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
  } = useHighlight({ inquiryType });
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
    try {
      const copied = await getPromptByInputText(input);
      await navigator.clipboard.writeText(copied || "");
      toast({
        variant: "info",
        description: "Copied!",
      });
    } catch (error: any) {
      toast({
        variant: error.variant ? error.variant : "destructive",
        description: error?.message,
      });
    }
  };

  const getExample = async () => {
    const input = `
        function solution(n) {
          let answer = [];
          const hanoi = (n, from, to, via) => {
              if (n === 1) answer.push([from, to]); 
              else {
                
                  
                  hanoi(n - 1, from, via, to);
                  answer.push([from, to]);
                  hanoi(n - 1, via, to, from);
              }
          } 
          hanoi(n, 1, 3, 2);
          return answer;
      }
    `;

    const exampleJson = `{
      "target": "function solution(n)",
      "example": "function solution(3)",
      "steps": [
        {
          "step": "1",
          "target": "function solution(n)",
          "example": "function solution(3)",
          "description": "The function solution(n) is called with the argument n=3.",
          "result": {
            "answer": []
          },
          "steps": [
            {
              "step": "1.1",
              "target": "hanoi(n, from, to, via)",
              "example": "hanoi(3, 1, 3, 2)",
              "description": "The hanoi function is called with n=3, from=1, to=3, and via=2.",
              "result": {
                "answer": []
              },
              "steps": [
                {
                  "step": "1.1.1",
                  "target": "hanoi(n - 1, from, via, to)",
                  "example": "hanoi(2, 1, 2, 3)",
                  "description": "The hanoi function is called recursively with n=2, from=1, to=2, and via=3.",
                  "result": {
                    "answer": []
                  },
                  "steps": [
                    {
                      "step": "1.1.1.1",
                      "target": "hanoi(n - 1, from, via, to)",
                      "example": "hanoi(1, 1, 3, 2)",
                      "description": "The hanoi function is called recursively with n=1, from=1, to=3, and via=2.",
                      "result": {
                        "answer": []
                      },
                      "steps": [
                        {
                          "step": "1.1.1.1.1",
                          "target": "answer.push([from, to]);",
                          "example": "answer.push([1, 3]);",
                          "description": "The base case of the recursion is reached, and the move from peg 1 to peg 3 is added to the answer array.",
                          "result": {
                            "answer": [[1, 3]]
                          }
                        }
                      ]
                    },
                    {
                      "step": "1.1.1.2",
                      "target": "answer.push([from, to]);",
                      "example": "answer.push([1, 2]);",
                      "description": "The move from peg 1 to peg 2 is added to the answer array.",
                      "result": {
                        "answer": [
                          [1, 3],
                          [1, 2]
                        ]
                      }
                    },
                    {
                      "step": "1.1.1.3",
                      "target": "hanoi(n - 1, via, to, from)",
                      "example": "hanoi(1, 2, 3, 1)",
                      "description": "The hanoi function is called recursively with n=1, from=2, to=3, and via=1.",
                      "result": {
                        "answer": [
                          [1, 3],
                          [1, 2]
                        ]
                      },
                      "steps": [
                        {
                          "step": "1.1.1.3.1",
                          "target": "answer.push([from, to]);",
                          "example": "answer.push([2, 3]);",
                          "description": "The base case of the recursion is reached, and the move from peg 2 to peg 3 is added to the answer array.",
                          "result": {
                            "answer": [
                              [1, 3],
                              [1, 2],
                              [2, 3]
                            ]
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  "step": "1.1.2",
                  "target": "answer.push([from, to]);",
                  "example": "answer.push([1, 3]);",
                  "description": "The move from peg 1 to peg 3 is added to the answer array.",
                  "result": {
                    "answer": [
                      [1, 3],
                      [1, 2],
                      [2, 3],
                      [1, 3]
                    ]
                  }
                },
                {
                  "step": "1.1.3",
                  "target": "hanoi(n - 1, via, to, from)",
                  "example": "hanoi(2, 2, 3, 1)",
                  "description": "The hanoi function is called recursively with n=2, from=2, to=3, and via=1.",
                  "result": {
                    "answer": [
                      [1, 3],
                      [1, 2],
                      [2, 3],
                      [1, 3]
                    ]
                  },
                  "steps": [
                    {
                      "step": "1.1.3.1",
                      "target": "hanoi(n - 1, from, via, to)",
                      "example": "hanoi(1, 2, 1, 3)",
                      "description": "The hanoi function is called recursively with n=1, from=2, to=1, and via=3.",
                      "result": {
                        "answer": [
                          [1, 3],
                          [1, 2],
                          [2, 3],
                          [1, 3]
                        ]
                      },
                      "steps": [
                        {
                          "step": "1.1.3.1.1",
                          "target": "answer.push([from, to]);",
                          "example": "answer.push([2, 1]);",
                          "description": "The base case of the recursion is reached, and the move from peg 2 to peg 1 is added to the answer array.",
                          "result": {
                            "answer": [
                              [1, 3],
                              [1, 2],
                              [2, 3],
                              [1, 3],
                              [2, 1]
                            ]
                          }
                        }
                      ]
                    },
                    {
                      "step": "1.1.3.2",
                      "target": "answer.push([from, to]);",
                      "example": "answer.push([2, 3]);",
                      "description": "The move from peg 2 to peg 3 is added to the answer array.",
                      "result": {
                        "answer": [
                          [1, 3],
                          [1, 2],
                          [2, 3],
                          [1, 3],
                          [2, 1],
                          [2, 3]
                        ]
                      }
                    },
                    {
                      "step": "1.1.3.3",
                      "target": "hanoi(n - 1, via, to, from)",
                      "example": "hanoi(1, 1, 3, 2)",
                      "description": "The hanoi function is called recursively with n=1, from=1, to=3, and via=2.",
                      "result": {
                        "answer": [
                          [1, 3],
                          [1, 2],
                          [2, 3],
                          [1, 3],
                          [2, 1],
                          [2, 3]
                        ]
                      },
                      "steps": [
                        {
                          "step": "1.1.3.3.1",
                          "target": "answer.push([from, to]);",
                          "example": "answer.push([1, 3]);",
                          "description": "The base case of the recursion is reached, and the move from peg 1 to peg 3 is added to the answer array.",
                          "result": {
                            "answer": [
                              [1, 3],
                              [1, 2],
                              [2, 3],
                              [1, 3],
                              [2, 1],
                              [2, 3],
                              [1, 3]
                            ]
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }`;

    setInquiryType("example");
    submitPrompt(exampleJson as any, input, true);
  };

  function fixJSON(jsonString: string) {
    return jsonString.replace(/"step":\s*([\d.]+)/g, '"step": "$1"');
  }

  const submitPrompt = async (
    json: string | null = null,
    tempQuestion: string | null = null,
    isExample: boolean = false,
  ) => {
    try {
      let response;
      setIsLoading(true);
      if (json === null) {
        response = (await getAnswerFromModel(question)) as any; // TODO: any - 추후 변경
      } else {
        response = json;
      }
      const match = response.match(/{[\s\S]*}/);
      let jsonString = match ? match[0] : "{}";
      const fixedJSONString = fixJSON(jsonString);

      const validation = validateJsonFormat(fixedJSONString);
      if (!validation.result && !isExample) throw new Error(validation.message);

      resetData();

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
      setSpreadSteps({ ...assignDiagramIds(parsedJson) });

      return {
        result: true,
        message: "Success!",
      };
    } catch (error: any) {
      resetData();
      toast({
        variant: error.variant ? error.variant : "destructive",
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
        logical_progression: ["steps"],
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

  const resetData = () => {
    setStructure(null);
    setSubmittedText("");
    setIsOpenSubmittedText(false);
    resetHighlight();
    resetDataStructure();
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
          gap={80}
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
          <CommonButton
            onClick={getExample}
            className="min-w-[90px] h-[90px] ml-2 flex-1 justify-center item-center"
            isLoading={isLoading}
            variant={"outline"}
          >
            Example
          </CommonButton>
        </div>
      </div>

      <div className="sticky top-0 z-20">
        <SubmittedText
          submittedText={submittedText}
          isOpenSubmittedText={isOpenSubmittedText}
          setIsOpenSubmittedText={setIsOpenSubmittedText}
          currentHighlightStatus={currentHighlightStatus.value}
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
