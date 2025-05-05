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

type StepCtx = ReturnType<typeof useHandleDataStructure>;
type StepState = Pick<StepCtx, "entireSpreadedStep" | "focusSpreadedStep">;
type StepActions = Pick<StepCtx, "resetDataStructure">;

const StepStateCtx = createContext<StepState | null>(null);
const StepActionsCtx = createContext<StepActions | null>(null);

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

  const stableState = useMemo(
    () => ({
      entireSpreadedStep,
      focusSpreadedStep,
    }),
    [entireSpreadedStep, focusSpreadedStep],
  );

  const stableActions = useMemo(
    () => ({
      resetDataStructure,
    }),
    [resetDataStructure],
  );

  return (
    <StepActionsCtx.Provider value={stableActions}>
      <StepStateCtx.Provider value={stableState}>
        {children}
      </StepStateCtx.Provider>
    </StepActionsCtx.Provider>
  );
};

/* ─────────── 셀렉터 ─────────── */
export const useEntireSpreadedStep = () =>
  useContextSelector(StepStateCtx, (v) => v!.entireSpreadedStep);
export const useFocusSpreadedStep = () =>
  useContextSelector(StepStateCtx, (v) => v!.focusSpreadedStep);
export const useResetDataStructure = () =>
  useContextSelector(StepActionsCtx, (v) => v!.resetDataStructure);
