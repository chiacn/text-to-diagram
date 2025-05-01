"use client";
import { createContext, useContextSelector } from "use-context-selector";
import { ReactNode, useEffect, useMemo } from "react";
import { useStructure } from "./StructureContext";
import {
  useHighlightItems,
  useCurrentHighlightStatus,
} from "./HighlightContext";
import { useInquiryType } from "./LLMContext";
import useHandleDataStructure from "@/components/flow/hooks/useHandleDataStructure";

interface StepSlice {
  entireSpreadedStep: any[];
  focusSpreadedStep: any[];
  resetDataStructure: () => void;
}
const StepCtx = createContext<StepSlice | null>(null);

export const StepProvider = ({ children }: { children: ReactNode }) => {
  const structure = useStructure();
  const inquiryType = useInquiryType();
  const highlightItems = useHighlightItems();
  const currentHighlightStatus = useCurrentHighlightStatus();

  const {
    assignDiagramIds,
    setSpreadSteps,
    entireSpreadedStep,
    focusSpreadedStep,
    resetDataStructure,
  } = useHandleDataStructure({
    highlightItems,
    currentHighlightStatus,
    structure,
    inquiryType,
  });

  useEffect(() => {
    if (structure) {
      assignDiagramIds(structure);
      setSpreadSteps(structure);
    } else {
      resetDataStructure();
    }
  }, [structure]);

  const stable = useMemo(
    () => ({ entireSpreadedStep, focusSpreadedStep, resetDataStructure }),
    [entireSpreadedStep, focusSpreadedStep],
  );

  return <StepCtx.Provider value={stable}>{children}</StepCtx.Provider>;
};

/* ─────────── 셀렉터 ─────────── */
export const useEntireSpreadedStep = () =>
  useContextSelector(StepCtx, (v) => v!.entireSpreadedStep);
export const useFocusSpreadedStep = () =>
  useContextSelector(StepCtx, (v) => v!.focusSpreadedStep);
export const useResetDataStructure = () =>
  useContextSelector(StepCtx, (v) => v!.resetDataStructure);
