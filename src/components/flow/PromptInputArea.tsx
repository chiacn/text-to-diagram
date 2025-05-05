import {
  useInquiryType,
  useInquiryTypesList,
  useLLMActions,
  useSetInquiryType,
} from "@/contexts/LLMContext";
import CommonButton from "../CommonButton";
import CommonToggleGroups from "../CommonTogleGroup";
import { Textarea } from "../ui/textarea";
import PromptButton from "./PromptButton";
import { useStructureDispatch } from "@/contexts/StructureContext";
import { useResetHighlight } from "@/contexts/HighlightContext";
import { useResetDataStructure } from "@/contexts/StepContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface PromptInputAreaProps {
  setSubmittedText: (text: string) => void;
  setIsOpenSubmittedText: (isOpen: boolean) => void;
}

export default function PromptInputArea({
  setSubmittedText,
  setIsOpenSubmittedText,
}: PromptInputAreaProps) {
  const inquiryList = useInquiryTypesList();
  const inquiryType = useInquiryType();
  const setInquiryType = useSetInquiryType();

  const structureDispatch = useStructureDispatch();

  const resetHighlight = useResetHighlight();

  const resetDataStructure = useResetDataStructure();

  const { getAnswer, isLoading } = useLLMActions();

  /* local */
  const [question, setQuestion] = useState("");

  const changeInquiryType = (type: string) => {
    setInquiryType(type);
    structureDispatch({ type: "RESET_STRUCTURE" });
    resetHighlight();
    setSubmittedText("");
    setIsOpenSubmittedText(false);
  };

  const resetData = () => {
    structureDispatch({ type: "RESET_STRUCTURE" });
    setSubmittedText("");
    setIsOpenSubmittedText(false);
    resetHighlight();
    resetDataStructure();
  };

  const submitPrompt = async (
    json: string | null,
    tempQuestion: string | null = null,
    isExample: boolean = false,
  ) => {
    try {
      let response: any; // TODO: 타입 정의하기

      if (!json) {
        // jsonInput이 null인 경우 -> llm에게 질의
        response = await getAnswer(question);
      } else {
        response = json;
      }
      const match = response.match(/{[\s\S]*}/);
      let jsonString = match ? match[0] : "{}";
      const fixedJSONString = fixJSON(jsonString);

      /* 2) JSON 검증 */
      const validation = validateJsonFormat(fixedJSONString);
      if (!validation.result && !isExample) throw new Error(validation.message);

      resetData();

      /* 3) 구조 세팅 */
      const parsedJson = JSON.parse(fixedJSONString);
      // refactor: 기존 setSpreadSteps({ ...assignDiagramIds(parsedJson) }) -> structureDispatch - type: "SET_STRUCTURE" 로 변경
      structureDispatch({ type: "SET_STRUCTURE", payload: parsedJson });

      if (json && tempQuestion) {
        setSubmittedText(tempQuestion);
      } else {
        setSubmittedText(question);
      }
      setIsOpenSubmittedText(true);

      return { result: true, message: "Success!" };
    } catch (e: any) {
      resetData();
      toast({
        variant: e.variant ? e.variant : "destructive",
        description: e?.message,
      });
      console.error("Failed to parse JSON:", e);
      return { result: false, message: e.message };
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

  const checkValidation = () => {
    if (!inquiryType)
      throw { result: false, message: "Please select inquiry type." };
    return { result: true, message: "Success" };
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

  return (
    <>
      <CommonToggleGroups
        items={inquiryList}
        selectedValue={inquiryType}
        changeInquiryType={changeInquiryType}
        gap={80}
      />
      <div className="flex w-full mt-4">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border flex-4 w-full h-[90px]"
        />
        <CommonButton
          onClick={submitPrompt}
          className="min-w-[90px] h-[90px] ml-2 flex-1"
          isLoading={isLoading}
        >
          Submit
        </CommonButton>
        <PromptButton submitPrompt={submitPrompt} />
        <CommonButton
          onClick={getExample}
          className="min-w-[90px] h-[90px] ml-2 flex-1 justify-center item-center"
          isLoading={isLoading}
          variant={"outline"}
        >
          Example
        </CommonButton>
      </div>
    </>
  );
}
