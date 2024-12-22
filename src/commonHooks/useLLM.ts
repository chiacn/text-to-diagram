import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import useCallLLM from "./useCallLLM";

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
  const { callLLM } = useCallLLM();

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
    const params = {
      input,
      inquiryType,
      serviceInfo: {
        service: "groq",
        model: "llama-3.3-70b-versatile",
      },
    };
    try {
      const { result, message } = checkValidation();
      if (!result) throw new Error(message);

      // const response = await fetch("/api/llm", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(params),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to fetch data");
      // }

      // const data = await response.json();

      // * Note: github pages 배포 시 정적 페이지만 배포 가능하므로 api route 못 사용하지 못 하는 문제가 있어서 변경.
      const response = await callLLM(params);
      const data = response;
      return data;
    } catch (e: any) {
      throw {
        variant: "warning",
        message: e?.message,
      };
    }
  };

  const getPromptByInputText = async (input: string) => {
    const params = {
      input,
      inquiryType,
      serviceInfo: {},
      getOnlyPrompt: true,
    };
    try {
      const { result, message } = checkValidation();
      if (!result) throw new Error(message);

      // * Note: github pages 배포 시 정적 페이지만 배포 가능하므로 api route 못 사용하지 못 하는 문제가 있어서 변경.
      // const response = await fetch("/api/llm", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(params),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to fetch data");
      // }

      // const data = await response.json();
      // return data.output.kwargs.content;

      const response: any = await callLLM(params);
      return response.output.content;
    } catch (e: any) {
      throw {
        variant: "warning",
        message: e?.message,
      };
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
