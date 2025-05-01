"use client";
import { createContext, useContextSelector } from "use-context-selector";
import { ReactNode, useState, useMemo } from "react";
import useCallLLM from "@/commonHooks/useCallLLM";

interface LLMState {
  inquiryType: string | null;
  setInquiryType: (v: string) => void;
  inquiryTypeList: { value: string; label: string }[];
  getAnswer: (input: string) => Promise<string>;
  getPrompt: (input: string) => Promise<string>;
  getPromptByInputText: (input: string) => Promise<string>;
  isLoading: boolean;
}

const LLMContext = createContext<LLMState | null>(null);

export const LLMProvider = ({ children }: { children: ReactNode }) => {
  const { callLLM } = useCallLLM();
  const [inquiryType, setInquiryType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inquiryTypeList = [
    { value: "tree", label: "Tree" },
    { value: "example", label: "Example" },
    { value: "logical_progression", label: "Logical Progression" },
  ];

  const getAnswer = async (input: string) => {
    setIsLoading(true);
    const resp: any = await callLLM({
      input,
      inquiryType,
      serviceInfo: { service: "groq", model: "llama-3.3-70b-versatile" },
    });
    setIsLoading(false);
    return resp;
  };

  const getPrompt = async (input: string) => {
    const resp: any = await callLLM({
      input,
      inquiryType,
      serviceInfo: {},
      getOnlyPrompt: true,
    });
    return resp.output.content;
  };

  const getPromptByInputText = async (input: string) => {
    const resp: any = await callLLM({
      input,
      inquiryType,
      serviceInfo: {},
      getOnlyPrompt: true,
    });
    return resp.output.content;
  };

  const stable = useMemo<LLMState>(
    () => ({
      inquiryType,
      setInquiryType,
      inquiryTypeList,
      getAnswer,
      getPromptByInputText,
      getPrompt,
      isLoading,
    }),
    [inquiryType, isLoading],
  );

  return <LLMContext.Provider value={stable}>{children}</LLMContext.Provider>;
};

/* ─────────── 셀렉터 훅 ─────────── */
export const useInquiryType = () =>
  useContextSelector(LLMContext, (v) => v!.inquiryType);
export const useSetInquiryType = () =>
  useContextSelector(LLMContext, (v) => v!.setInquiryType);
export const useInquiryTypesList = () =>
  useContextSelector(LLMContext, (v) => v!.inquiryTypeList);
export const useLLMActions = () =>
  useContextSelector(LLMContext, (v) => ({
    getAnswer: v!.getAnswer,
    getPrompt: v!.getPrompt,
    getPromptByInputText: v!.getPromptByInputText,
    isLoading: v!.isLoading,
  }));
