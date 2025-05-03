"use client";
import { useState } from "react";

import SubmittedText from "./SubmittedText";

import RenderDiagram from "./RenderDiagram";
import PromptInputArea from "./PromptInputArea";

export default function DiagramContainer() {
  console.log("DiagramContainer Render -----------------------");

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
