"use client";
import { createContext, useContextSelector } from "use-context-selector";
import React, { ReactNode, useMemo } from "react";
import useDiagram from "@/components/flow/hooks/useDiagram";
import { useInquiryType } from "./LLMContext";
import {
  useDiagramRefsPalette,
  useHandleDiagramItem,
  useHighlightItems,
  useCurrentHighlightStatus,
} from "./HighlightContext";

interface RenderSlice {
  renderDiagramItems: (s: any) => JSX.Element | null;
  contentWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
}
const RenderCtx = createContext<RenderSlice | null>(null);

export const RenderProvider = ({ children }: { children: ReactNode }) => {
  const inquiryType = useInquiryType();
  const { diagramItemsListRef, colorPalette, targetColorMap } =
    useDiagramRefsPalette();
  const highlightItems = useHighlightItems();
  const currentHighlightStatus = useCurrentHighlightStatus();
  const handleDiagramItem = useHandleDiagramItem();

  const { renderDiagramItems, contentWrapperRef } = useDiagram({
    diagramItemsListRef,
    currentHighlightStatus,
    colorPalette,
    targetColorMap,
    handleDiagramItem,
    highlightItems,
    inquiryType,
  });

  const stable = useMemo(
    () => ({ renderDiagramItems, contentWrapperRef }),
    [renderDiagramItems],
  );

  return <RenderCtx.Provider value={stable}>{children}</RenderCtx.Provider>;
};

/* ─────────── 셀렉터 ─────────── */
// export const useRender = () => useContextSelector(RenderCtx, (v) => v!);
export const useRenderItems = () =>
  useContextSelector(RenderCtx, (v) => v!.renderDiagramItems);

export const useContentWrapperRef = () =>
  useContextSelector(RenderCtx, (v) => v!.contentWrapperRef);
