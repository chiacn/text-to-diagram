"use client";
import { createContext, useContextSelector } from "use-context-selector";
import { ReactNode, useMemo } from "react";
import { useInquiryType } from "./LLMContext";
import useHighlight from "@/components/flow/hooks/useHighlight";

type HighlightSlice = ReturnType<typeof useHighlight>;
const HighlightCtx = createContext<HighlightSlice | null>(null);

export const HighlightProvider = ({ children }: { children: ReactNode }) => {
  const inquiryType = useInquiryType();
  const highlight = useHighlight({ inquiryType });
  const stable = useMemo(() => highlight, [highlight]); // identity
  return (
    <HighlightCtx.Provider value={stable}>{children}</HighlightCtx.Provider>
  );
};

/* ─────────── 셀렉터 ─────────── */
export const useHighlightItems = () =>
  useContextSelector(HighlightCtx, (v) => v!.highlightItems);
export const useCurrentHighlightStatus = () =>
  useContextSelector(HighlightCtx, (v) => v!.currentHighlightStatus);
export const useHandleDiagramItem = () =>
  useContextSelector(HighlightCtx, (v) => v!.handleDiagramItem);
export const useDiagramRefsPalette = () =>
  useContextSelector(HighlightCtx, (v) => ({
    diagramItemsListRef: v!.diagramItemsListRef,
    colorPalette: v!.colorPalette,
    targetColorMap: v!.targetColorMap,
  }));
export const useResetHighlight = () =>
  useContextSelector(HighlightCtx, (v) => v!.resetHighlight);
