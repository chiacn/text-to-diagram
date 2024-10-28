"use client";
import { useState } from "react";
import DiagramItem from "./DiagramItem";
import useLLM from "@/commonHooks/useLLM";
import CommonToggleGroups from "../CommonTogleGroup";

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

  const renderDiagramItems = (item: any, depth = 0) => (
    <div
      className={`flex ${depth > 0 ? "pl-5" : ""} flex-row space-x-4`}
      key={`${depth}-${item.step}`}
    >
      <DiagramItem
        diagramId={item.step}
        depth={depth}
        target={item.target}
        example={item.example}
        description={item.description}
        result={item.result}
      >
        {item.steps &&
          item.steps.map((childItem: any) =>
            renderDiagramItems(childItem, depth + 1),
          )}
      </DiagramItem>
    </div>
  );

  return (
    <>
      <div className="flex flex-col">
        <CommonToggleGroups
          items={inquiryTypeList}
          selectedValue={inquiryType}
          setSelectedToggle={setInquiryType}
        />
        <textarea
          name="postContent"
          rows={4}
          cols={40}
          onChange={(e) => setQuestion(e.target.value)}
          className="border border-gray-300 mt-2"
        ></textarea>
        <button onClick={submitPrompt}>Submit!!</button>
      </div>

      <div
        // scrollbar 모양 변경
        className="scrollbar-custom"
        style={{
          width: "800px",
          minHeight: "min-content",
          display: "flex",
          flexDirection: "column",
          overflowX: "auto",
        }}
      >
        {/* {structure && renderDiagramItems(structure)} */}
        {testStructure && renderDiagramItems(testStructure)}
      </div>
    </>
  );
}
