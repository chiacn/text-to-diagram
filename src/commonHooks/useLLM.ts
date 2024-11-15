import { toast } from "@/hooks/use-toast";
import { useState } from "react";

/*
  고민 및 TODOLIST 
  TODO: (비용) Groq과 HuggingFace pro 둘 다 사용한다면? (Groq 무료버전 이용량 초과 시 HuggingFace 이용.)

*/

// TODO: 하루 토큰 50만회 이상 이용 시 제한 - 다른 모델로 돌려쓰기? (recovery 로직 추가?)
interface LLMProps {
  model?: string;
  service?: string;
}
export default function useLLM({
  // model = "llama3-groq-70b-8192-tool-use-preview",
  model = "llama3-groq-70b-8192-tool-use-preview",
  service = "groq",
}: LLMProps) {
  // State ----------------------------------------------------------
  const [inquiryType, setInquiryType] = useState<string | null>(null);
  // ----------------------------------------------------------------

  // Constants ------------------------------------------------------
  const inquiryTypeList = [
    { value: "tree", label: "Tree" },
    // { value: "list_compare", label: "Compare" },
    { value: "example", label: "Example" },
    { value: "logical_progression", label: "Logical Progression" },
  ];
  // ----------------------------------------------------------------

  const checkValidation = () => {
    if (!inquiryType)
      return { result: false, message: "Please select inquiry type." };
    return { result: true, message: "Success" };
  };

  const getAnswerFromModel = async (input: string, topic?: string) => {
    const { result, message } = checkValidation();
    if (!result) {
      console.error("error :: ", message);
      toast({
        variant: "warning",
        description: message,
      });
      return;
    }
    const params = {
      input,
      inquiryType,
      serviceInfo: {
        service: "groq",
        model: "llama3-groq-70b-8192-tool-use-preview",
      },
    };
    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("output --- ", data.output);
      return data.output;
    } catch (e) {
      console.error("error :: ", e);
    }
  };

  const getPromptByInputText = async (input: string) => {
    const { result, message } = checkValidation();
    if (!result) throw new Error(message);
    const params = {
      input,
      inquiryType,
      serviceInfo: {},
      getOnlyPrompt: true,
    };
    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      return data.output.kwargs.content;
    } catch (e: any) {
      toast({
        variant: "warning",
        description: e.message,
      });
      console.error("error :: ", e);
    }
  };

  return {
    getAnswerFromModel,
    inquiryType,
    setInquiryType,
    inquiryTypeList,
    getPromptByInputText,
  };
}
