"use client";
import { useRenderItems, useContentWrapperRef } from "@/contexts/RenderContext";
import { useStructure } from "@/contexts/StructureContext";

export default function RenderDiagram() {
  const structure = useStructure();
  const renderDiagramItems = useRenderItems();
  const contentWrapperRef = useContentWrapperRef();

  return (
    <div ref={contentWrapperRef} className="mt-4 w-full">
      {structure && renderDiagramItems(structure)}
    </div>
  );
}
