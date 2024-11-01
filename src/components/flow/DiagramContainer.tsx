"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DiagramItem from "./DiagramItem";
import useLLM from "@/commonHooks/useLLM";
import CommonToggleGroups from "../CommonTogleGroup";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import SubmittedText from "./SubmittedText";

export default function DiagramContainer() {
  // LLM 테스트 ---------------------------------------------

  const { getAnswerFromModel, inquiryType, setInquiryType, inquiryTypeList } =
    useLLM({});
  const [question, setQuestion] = useState("");
  const [structure, setStructure] = useState(null);
  const [submittedText, setSubmittedText] = useState("");
  const [isOpenSubmittedText, setIsOpenSubmittedText] = useState(false); // 영역 접기/펼치기 상태

  function fixJSON(jsonString: string) {
    return jsonString.replace(/"step":\s*([\d.]+)/g, '"step": "$1"');
  }

  const submitPrompt = async () => {
    // const response = await getAnswerFromModel(question);
    // const match = response.match(/{[\s\S]*}/);
    // let jsonString = match ? match[0] : "{}";
    // console.log("jsonString", jsonString);

    // const fixedJSONString = fixJSON(jsonString);

    try {
      // const json = JSON.parse(fixedJSONString);

      setStructure({ ...(assignDiagramIds(testStructure) as any) });
      setSubmittedText(question);
      setIsOpenSubmittedText(true);
      setSpreadSteps(structure);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  };

  // TEST DATA ---------------------------------------------
  const testStructure = {
    target: "function solution(n)",
    example: "function solution(3)",
    steps: [
      {
        step: "1",
        target: "function solution(n)",
        example: "function solution(3)",
        description: "Initialize the solution function with n = 3.",
        result: {
          answer: [],
        },
        steps: [
          {
            step: "1.1",
            target: "hanoi(n, from, to, via)",
            example: "hanoi(3, 1, 3, 2)",
            description:
              "Call the hanoi function with n = 3, from = 1, to = 3, and via = 2.",
            result: {
              answer: [],
            },
            steps: [
              {
                step: "1.1.1",
                target: "if (n === 1) answer.push([from, to]);",
                example: "if (3 === 1) answer.push([1, 3]);",
                description:
                  "Since n = 3, this condition is not met, so we proceed to the else statement.",
                result: {
                  answer: [],
                },
              },
              {
                step: "1.1.2",
                target: "else {",
                example: "else {",
                description: "We enter the else statement since n > 1.",
                result: {
                  answer: [],
                },
                steps: [
                  {
                    step: "1.1.2.1",
                    target: "hanoi(n - 1, from, via, to);",
                    example: "hanoi(2, 1, 2, 3);",
                    description:
                      "Recursively call the hanoi function with n = 2, from = 1, to = 2, and via = 3.",
                    result: {
                      answer: [],
                    },
                    steps: [
                      {
                        step: "1.1.2.1.1",
                        target: "if (n === 1) answer.push([from, to]);",
                        example: "if (2 === 1) answer.push([1, 2]);",
                        description:
                          "Since n = 2, this condition is not met, so we proceed to the else statement.",
                        result: {
                          answer: [],
                        },
                      },
                      {
                        step: "1.1.2.1.2",
                        target: "else {",
                        example: "else {",
                        description: "We enter the else statement since n > 1.",
                        result: {
                          answer: [],
                        },
                        steps: [
                          {
                            step: "1.1.2.1.2.1",
                            target: "hanoi(n - 1, from, via, to);",
                            example: "hanoi(1, 1, 3, 2);",
                            description:
                              "Recursively call the hanoi function with n = 1, from = 1, to = 2, and via = 3.",
                            result: {
                              answer: [],
                            },
                            steps: [
                              {
                                step: "1.1.2.1.2.1.1",
                                target: "if (n === 1) answer.push([from, to]);",
                                example: "if (1 === 1) answer.push([1, 2]);",
                                description:
                                  "Since n = 1, we push the move [1, 2] to the answer array.",
                                result: {
                                  answer: [[1, 2]],
                                },
                              },
                            ],
                          },
                          {
                            step: "1.1.2.1.2.2",
                            target: "answer.push([from, to]);",
                            example: "answer.push([1, 2]);",
                            description:
                              "Push the move [1, 2] to the answer array.",
                            result: {
                              answer: [
                                [1, 2],
                                [1, 2],
                              ],
                            },
                          },
                          {
                            step: "1.1.2.1.2.3",
                            target: "hanoi(n - 1, via, to, from);",
                            example: "hanoi(1, 3, 2, 1);",
                            description:
                              "Recursively call the hanoi function with n = 1, from = 3, to = 2, and via = 1.",
                            result: {
                              answer: [
                                [1, 2],
                                [1, 2],
                              ],
                            },
                            steps: [
                              {
                                step: "1.1.2.1.2.3.1",
                                target: "if (n === 1) answer.push([from, to]);",
                                example: "if (1 === 1) answer.push([3, 2]);",
                                description:
                                  "Since n = 1, we push the move [3, 2] to the answer array.",
                                result: {
                                  answer: [
                                    [1, 2],
                                    [1, 2],
                                    [3, 2],
                                  ],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                step: "1.1.2.2",
                target: "answer.push([from, to]);",
                example: "answer.push([1, 3]);",
                description: "Push the move [1, 3] to the answer array.",
                result: {
                  answer: [
                    [1, 2],
                    [1, 2],
                    [3, 2],
                    [1, 3],
                  ],
                },
              },
              {
                step: "1.1.2.3",
                target: "hanoi(n - 1, via, to, from);",
                example: "hanoi(2, 2, 3, 1);",
                description:
                  "Recursively call the hanoi function with n = 2, from = 2, to = 3, and via = 1.",
                result: {
                  answer: [
                    [1, 2],
                    [1, 2],
                    [3, 2],
                    [1, 3],
                  ],
                },
                steps: [
                  {
                    step: "1.1.2.3.1",
                    target: "if (n === 1) answer.push([from, to]);",
                    example: "if (2 === 1) answer.push([2, 3]);",
                    description:
                      "Since n = 2, this condition is not met, so we proceed to the else statement.",
                    result: {
                      answer: [
                        [1, 2],
                        [1, 2],
                        [3, 2],
                        [1, 3],
                      ],
                    },
                  },
                  {
                    step: "1.1.2.3.2",
                    target: "else {",
                    example: "else {",
                    description: "We enter the else statement since n > 1.",
                    result: {
                      answer: [
                        [1, 2],
                        [1, 2],
                        [3, 2],
                        [1, 3],
                      ],
                    },
                    steps: [
                      {
                        step: "1.1.2.3.2.1",
                        target: "hanoi(n - 1, from, to, via);",
                        example: "hanoi(1, 2, 3, 1);",
                        description:
                          "Recursively call the hanoi function with n = 1, from = 2, to = 3, and via = 1.",
                        result: {
                          answer: [
                            [1, 2],
                            [1, 2],
                            [3, 2],
                            [1, 3],
                          ],
                        },
                        steps: [
                          {
                            step: "1.1.2.3.2.1.1",
                            target: "if (n === 1) answer.push([from, to]);",
                            example: "if (1 === 1) answer.push([2, 3]);",
                            description:
                              "Since n = 1, we push the move [2, 3] to the answer array.",
                            result: {
                              answer: [
                                [1, 2],
                                [1, 2],
                                [3, 2],
                                [1, 3],
                                [2, 3],
                              ],
                            },
                          },
                        ],
                      },
                      {
                        step: "1.1.2.3.2.2",
                        target: "answer.push([from, to]);",
                        example: "answer.push([2, 3]);",
                        description:
                          "Push the move [2, 3] to the answer array.",
                        result: {
                          answer: [
                            [1, 2],
                            [1, 2],
                            [3, 2],
                            [1, 3],
                            [2, 3],
                            [2, 3],
                          ],
                        },
                      },
                      {
                        step: "1.1.2.3.2.3",
                        target: "hanoi(n - 1, via, to, from);",
                        example: "hanoi(1, 1, 3, 2);",
                        description:
                          "Recursively call the hanoi function with n = 1, from = 1, to = 3, and via = 2.",
                        result: {
                          answer: [
                            [1, 2],
                            [1, 2],
                            [3, 2],
                            [1, 3],
                            [2, 3],
                            [2, 3],
                          ],
                        },
                        steps: [
                          {
                            step: "1.1.2.3.2.3.1",
                            target: "if (n === 1) answer.push([from, to]);",
                            example: "if (1 === 1) answer.push([1, 3]);",
                            description:
                              "Since n = 1, we push the move [1, 3] to the answer array.",
                            result: {
                              answer: [
                                [1, 2],
                                [1, 2],
                                [3, 2],
                                [1, 3],
                                [2, 3],
                                [2, 3],
                                [1, 3],
                              ],
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  // -------------------------------------------------------
  const [contentWidth, setContentWidth] = useState(0);
  const contentWrapperRef = useRef<any>(null); // 최상위 depth=1의 width만 추적할 ref

  const [highlightItems, setHighlightItems] = useState<Array<string | number>>(
    [],
  );
  const diagramItemsListRef = useRef<
    Array<{ diagramId: string | number; parentDiagramId?: string | number }>
  >([]);

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

  const renderDiagramItems = (
    item: any,
    depth = 0,
    parentDiagramId = undefined,
  ) => {
    const isTopLevel = depth === 0;
    const parentId = depth === 0 ? "root" : parentDiagramId;

    // Collect diagram item information
    diagramItemsListRef.current.push({
      diagramId: item.diagramId,
      parentDiagramId: parentId,
    });

    return (
      <div
        className={`flex ${depth > 0 ? "pl-5" : ""} flex-row space-x-4`}
        key={`${depth}-${item.step}`}
        ref={isTopLevel ? contentWrapperRef : null}
      >
        <DiagramItem
          diagramId={item.diagramId}
          step={item.step}
          parentDiagramId={parentId}
          depth={depth}
          target={item.target}
          example={item.example}
          description={item.description}
          result={item.result}
          handleDiagramItem={handleDiagramItem}
          highlightItems={highlightItems}
        >
          {item.steps &&
            item.steps.map((childItem: any) =>
              renderDiagramItems(childItem, depth + 1, item.step),
            )}
        </DiagramItem>
      </div>
    );
  };

  const handleDiagramItem = (
    effectType: string,
    params: {
      diagramId: number | string;
      depth: number;
      parentDiagramId?: number | string;
    },
  ) => {
    switch (effectType) {
      // depth 기준으로 highlight
      case "highlight":
        // Note: 여러 개 선택할 수 있게
        // setHighlightItems((prev: Array<string | number>) => {
        //   return prev.includes(params.depth)
        //     ? prev.filter((id) => id !== depth)
        //     : [...prev, params.depth];
        // });

        // Note: 단일 선택
        // highlightItems.includes(params.depth)
        //   ? setHighlightItems([])
        //   : setHighlightItems([params.depth]);

        const { parentDiagramId } = params;

        console.log("parentDiagramId", parentDiagramId);
        console.log("diagramId", params.diagramId);
        // Get all diagramIds with matching parentDiagramId
        const diagramIdsToHighlight = diagramItemsListRef.current
          .filter((item) => item.parentDiagramId === parentDiagramId)
          .map((item) => item.diagramId);

        // Toggle highlight
        const isAlreadyHighlighted =
          highlightItems.length > 0 &&
          diagramIdsToHighlight.every((id) => highlightItems.includes(id));

        if (isAlreadyHighlighted) {
          setHighlightItems([]);
        } else {
          setHighlightItems(diagramIdsToHighlight);
        }
        break;
      default:
        break;
    }
  };

  // Reset diagramItemsListRef before rendering
  diagramItemsListRef.current = [];

  const topScrollRef = useRef<HTMLDivElement | any>(null);
  const bottomScrollRef = useRef<HTMLDivElement | any>(null);

  const syncScroll = (source: string) => {
    if (source === "top") {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    } else {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
  };

  /*
    * 기능 구현 정리
      1. structure를 dfs로 훑고 직렬적으로 스텝별로 묶는다. (entireSpreadedStep)
      2. 만약 특정 step에 대해서 하이라이트 시, focusSpreadedStep으로 entireSpreadedStep을 잘라서 사용한다.
      3. SubmittedText에 props로 보낸다.
  */

  // 1. structure를 dfs로 훑고 직렬적으로 스텝별로 묶는다.
  const [entireSpreadedStep, setEntireSpreadedStep] = useState<any[]>([]);
  const [focusSpreadedStep, setFocusSpreadedStep] = useState<any[]>([]);

  function dfsStructure(node: any, steps: any[] = []) {
    if (!node) return steps;

    steps.push(node);

    if (node.steps && node.steps.length > 0) {
      node.steps.forEach((child: any) => {
        dfsStructure(child, steps);
      });
    }

    return steps;
  }

  const assignDiagramIds = (node: any, depth = 0) => {
    // diagramId를 depth와 step으로 구성하여 고유 ID로 설정
    const diagramId = `${depth}-${node.step || "root"}`;
    node.diagramId = diagramId;

    if (node.steps && node.steps.length > 0) {
      node.steps.forEach((child: any) => {
        assignDiagramIds(child, depth + 1);
      });
    }

    return node;
  };

  const setSpreadSteps = (structure: any) => {
    setEntireSpreadedStep([]);
    setFocusSpreadedStep([]);

    if (structure) {
      const steps = dfsStructure(structure); // * 여기서 diagramId 할당
      setEntireSpreadedStep(steps);
      setFocusSpreadedStep(steps); // 초기에는 전체 스텝을 설정
    }
  };

  // 2. 특정 step 하이라이트 시 focusSpreadedStep 업데이트
  function getSubstructureByStep(
    entireSpreadedStep: any[],
    highlightItems: (string | number)[],
  ): any[] {
    if (!entireSpreadedStep || highlightItems.length === 0)
      return entireSpreadedStep;

    // diagramId가 highlightSteps에 포함된 스텝만 필터링
    return entireSpreadedStep.filter((step) =>
      highlightItems.includes(step.diagramId),
    );
  }

  useEffect(() => {
    console.log("highlightItems", highlightItems);
    console.log("entireSpreadedStep", entireSpreadedStep);
    if (highlightItems.length > 0 && entireSpreadedStep.length > 0) {
      console.log("highlightItems", highlightItems);
      const focusSteps = getSubstructureByStep(
        entireSpreadedStep,
        highlightItems,
      );

      console.log("focusSteps --- ", focusSteps);
      setFocusSpreadedStep(focusSteps);
    } else {
      setFocusSpreadedStep(entireSpreadedStep);
    }
  }, [highlightItems, entireSpreadedStep]);

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
          setSelectedToggle={setInquiryType}
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
        </div>
      </div>

      <div className="sticky top-0 z-20">
        <SubmittedText
          submittedText={submittedText}
          isOpenSubmittedText={isOpenSubmittedText}
          setIsOpenSubmittedText={setIsOpenSubmittedText}
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
