"use client";
import { createContext, useContextSelector } from "use-context-selector";
import { ReactNode, useState, useMemo } from "react";
import useLLM from "@/commonHooks/useLLM";

interface LLMState {
  inquiryType: string | null;
  setInquiryType: (v: string) => void;
  inquiryTypeList: { value: string; label: string }[];
  getAnswer: (input: string, topic?: string) => Promise<string | object>;
  getPrompt: (input: string) => Promise<string>;
  getPromptByInputText: (input: string) => Promise<string>;
  isLoading: boolean;
}

const LLMContext = createContext<LLMState | null>(null);

export const LLMProvider = ({ children }: { children: ReactNode }) => {
  const {
    getAnswerFromModel,
    getPromptByInputText,
    inquiryType,
    setInquiryType,
    inquiryTypeList,
  } = useLLM({});

  const [isLoading, setIsLoading] = useState(false);

  const getAnswer = async (input: string) => {
    setIsLoading(true);
    try {
      return (await getAnswerFromModel(input)) ?? "";
    } finally {
      setIsLoading(false);
    }
  };

  // getPrompt은 그대로 전달
  const getPrompt = getPromptByInputText;

  // Context value 객체를 useMemo로 고정
  const stableValue = useMemo<LLMState>(
    () => ({
      inquiryType,
      setInquiryType,
      inquiryTypeList,
      getAnswer,
      getPrompt,
      getPromptByInputText,
      isLoading,
    }),
    [inquiryType, isLoading, inquiryTypeList, getAnswer, getPromptByInputText],
  );

  return (
    <LLMContext.Provider value={stableValue}>{children}</LLMContext.Provider>
  );
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
