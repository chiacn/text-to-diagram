"use client";
import { createContext, useContextSelector } from "use-context-selector";
import { ReactNode, useMemo } from "react";
import { useInquiryType } from "./LLMContext";
import useHighlight from "@/components/flow/hooks/useHighlight";

type HighlightSlice = ReturnType<typeof useHighlight>;

type HighlightState = Pick<
  HighlightSlice,
  | "highlightItems"
  | "currentHighlightStatus"
  | "diagramItemsListRef"
  | "colorPalette"
  | "targetColorMap"
>;

type HighlightActions = Pick<
  HighlightSlice,
  "resetHighlight" | "handleDiagramItem"
>;

const HighlightStateCtx = createContext<HighlightState | null>(null);
const HighlightActionsCtx = createContext<HighlightActions | null>(null);

export const HighlightProvider = ({ children }: { children: ReactNode }) => {
  console.log("HighlightProvider -----------------------");
  const inquiryType = useInquiryType();

  const {
    highlightItems,
    currentHighlightStatus,
    diagramItemsListRef,
    colorPalette,
    targetColorMap,
    handleDiagramItem,
    resetHighlight,
  } = useHighlight({ inquiryType });

  const stableState = useMemo(
    () => ({
      highlightItems,
      currentHighlightStatus,
      diagramItemsListRef,
      colorPalette,
      targetColorMap,
    }),
    [highlightItems, currentHighlightStatus],
  );

  const stableActions = useMemo(
    () => ({
      resetHighlight,
      handleDiagramItem,
    }),
    [resetHighlight, handleDiagramItem],
  );

  return (
    <HighlightActionsCtx.Provider value={stableActions}>
      <HighlightStateCtx.Provider value={stableState}>
        {children}
      </HighlightStateCtx.Provider>
    </HighlightActionsCtx.Provider>
  );
};

/* ─────────── 셀렉터 ─────────── */
export const useHighlightItems = () =>
  useContextSelector(HighlightStateCtx, (v) => v!.highlightItems);

export const useCurrentHighlightStatus = () =>
  useContextSelector(HighlightStateCtx, (v) => v!.currentHighlightStatus);

export const useDiagramRefsPalette = () =>
  useContextSelector(HighlightStateCtx, (v) => ({
    diagramItemsListRef: v!.diagramItemsListRef,
    colorPalette: v!.colorPalette,
    targetColorMap: v!.targetColorMap,
  }));

export const useResetHighlight = () =>
  useContextSelector(HighlightActionsCtx, (v) => v!.resetHighlight);

export const useHandleDiagramItem = () =>
  useContextSelector(HighlightActionsCtx, (v) => v!.handleDiagramItem);
