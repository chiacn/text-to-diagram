"use client";
import { useState } from "react";

import SubmittedText from "./SubmittedText";

import RenderDiagram from "./RenderDiagram";
import PromptInputArea from "./PromptInputArea";
import { useStructureDispatch } from "@/contexts/StructureContext";
import { useResetHighlight } from "@/contexts/HighlightContext";
import { useResetDataStructure } from "@/contexts/StepContext";
import { useLLMActions } from "@/contexts/LLMContext";

export default function DiagramContainer() {
  console.log("DiagramContainer Render -----------------------");

  /*
   !Rendering Test 
    1. <RenderDiagram />에서 비롯된 highlightItems 변경 시 => <PromptInputArea />가 렌더링 되는 상황.
    1-1. react devtool - profiler로 확인 시 HighlightProvider가 렌더링 됨에 따라 발생한 것으로 추정되지만 DiagramContainer는 리렌더링되지 않는다.
    2. 결국 어떤 sliced context를 구독하느냐에 따른 이슈로 추정.
    3. <PromptInputArea />가 구독하는 상태를 DiagramContainer에서 구독해보고 소거하면서 리렌더링을 일으키는 context 확인하기
    결론 - useResetHighlight와 useResetDataStructure에 의해 리렌더링이 나타나는 것으로 확인됨.
   */
  // TEST용 - diagram 클릭 시 리렌더링 유발하는 context selector hook
  // const resetHighlight = useResetHighlight();
  // const resetDataStructure = useResetDataStructure();

  /* handlers */
  const [submittedText, setSubmittedText] = useState("");
  const [isOpenSubmittedText, setIsOpenSubmittedText] = useState(false);

  return (
    <div className="flex flex-col items-center w-[80vw]">
      <PromptInputArea
        setSubmittedText={setSubmittedText}
        setIsOpenSubmittedText={setIsOpenSubmittedText}
      />
      <SubmittedText
        submittedText={submittedText}
        isOpenSubmittedText={isOpenSubmittedText}
        setIsOpenSubmittedText={setIsOpenSubmittedText}
      />
      <RenderDiagram />
    </div>
  );
}
