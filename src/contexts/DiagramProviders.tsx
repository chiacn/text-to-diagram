import { ReactNode } from "react";
import { LLMProvider } from "./LLMContext";
import { StructureProvider } from "./StructureContext";
import { HighlightProvider } from "./HighlightContext";
import { StepProvider } from "./StepContext";
import { RenderProvider } from "./RenderContext";
import React from "react";

export const DiagramProviders = ({ children }: { children: ReactNode }) => (
  <LLMProvider>
    <StructureProvider>
      <HighlightProvider>
        <StepProvider>
          <RenderProvider>{children}</RenderProvider>
        </StepProvider>
      </HighlightProvider>
    </StructureProvider>
  </LLMProvider>
);
