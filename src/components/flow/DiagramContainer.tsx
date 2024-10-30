"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DiagramItem from "./DiagramItem";
import useLLM from "@/commonHooks/useLLM";
import CommonToggleGroups from "../CommonTogleGroup";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function DiagramContainer() {
  // LLM 테스트 ---------------------------------------------

  const { getAnswerFromModel, inquiryType, setInquiryType, inquiryTypeList } =
    useLLM({});
  const [question, setQuestion] = useState("");
  const [structure, setStructure] = useState(null);

  function fixJSON(jsonString: string) {
    return jsonString.replace(/"step":\s*([\d.]+)/g, '"step": "$1"');
  }

  const submitPrompt = async () => {
    const response = await getAnswerFromModel(question);
    const match = response.match(/{[\s\S]*}/);
    let jsonString = match ? match[0] : "{}";
    console.log("jsonString", jsonString);

    const fixedJSONString = fixJSON(jsonString);

    try {
      const json = JSON.parse(fixedJSONString);
      setStructure({ ...json });
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

  // 최상위 depth의 width 값을 useEffect로 추적합니다.
  useLayoutEffect(() => {
    if (contentWrapperRef.current) {
      // Note: +40은 padding, margin 등에 의해 제대로 측정 못 된 값 (임시)
      setContentWidth(contentWrapperRef.current.offsetWidth + 40);
    }
  }, [contentWrapperRef.current?.offsetWidth]);

  const renderDiagramItems = (
    item: any,
    depth = 0,
    parentDiagramId = undefined,
  ) => {
    const isTopLevel = depth === 1;

    // Collect diagram item information
    diagramItemsListRef.current.push({
      diagramId: item.step,
      parentDiagramId: parentDiagramId,
    });

    return (
      <div
        className={`flex ${depth > 0 ? "pl-5" : ""} flex-row space-x-4`}
        key={`${depth}-${item.step}`}
        ref={isTopLevel ? contentWrapperRef : null}
      >
        <DiagramItem
          diagramId={item.step}
          parentDiagramId={parentDiagramId}
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

  return (
    // Note: <></>로 구성 시 DOM 요소를 생성하지 않아서 flow에 문제가 발생할 수 있음.
    <div>
      <div
        className="flex flex-col justify-center items-center w-[80vw]"
        style={{ maxWidth: `${contentWidth}px` }}
      >
        <CommonToggleGroups
          items={inquiryTypeList}
          selectedValue={inquiryType}
          setSelectedToggle={setInquiryType}
          gap={20}
        />
        {/* <textarea
          name="postContent"
          rows={4}
          cols={40}
          onChange={(e) => setQuestion(e.target.value)}
          className="border border-gray-300 mt-2"
        ></textarea> */}

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

      {/* 상단 스크롤 ---------------------------------------------------- */}
      <div
        ref={topScrollRef}
        onScroll={() => syncScroll("top")}
        className="scrollbar-custom w-[80vw] mt-4 sticky top-0 z-20"
      >
        <div
          className="h-[2px]"
          style={{ width: `${contentWidth}px` }} // Inner div
        ></div>
      </div>

      {/* ---------------------------------------------------------------- */}

      <div
        ref={bottomScrollRef}
        onScroll={() => syncScroll("bottom")}
        className="scrollbar-custom w-[80vw] min-h-min flex flex-col overflow-x-auto"
      >
        {/* {structure && renderDiagramItems(structure)} */}
        {testStructure && renderDiagramItems(testStructure)}
      </div>
    </div>
  );
}
