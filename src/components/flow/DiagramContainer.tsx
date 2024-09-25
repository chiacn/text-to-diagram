"use client";
import { useState } from "react";
import DiagramItem from "./DiagramItem";
import useLLM from "@/commonHooks/useLLM";

export default function DiagramContainer() {
  //  LLM 테스트 ---------------------------------------------

  const { getAnswerFromModel } = useLLM({});

  const [question, setQuestion] = useState("");

  const submitPrompt = () => {
    getAnswerFromModel(question);
  };

  // 주입식으로?
  // useFlowContainer
  const injectElementStyle = () => {};
  const dummyElement = [
    {
      diagramId: 1,
      style: {
        width: 200,
        height: 200,
        top: 100,
        left: 100,
      },
    },
    {
      diagramId: 2,
      style: {
        width: 200,
        height: 200,
        top: 100,
        left: 140,
      },
    },
  ];
  return (
    <>
      <div>
        <textarea
          name="postContent"
          rows={4}
          cols={40}
          onChange={(e) => setQuestion(e.target.value)}
          className="border border-gray-300"
        ></textarea>
        <button onClick={submitPrompt}>Submit!!</button>
      </div>
      <div style={{ position: "relative" }}>
        {/* 둘 사이의 관계성은 어떻게..? => 공통 컴포넌트로 하자.*/}

        {dummyElement.map((item) => {
          return (
            <DiagramItem
              key={item.diagramId}
              diagramId={item.diagramId}
              style={{
                position: "absolute",
                ...item.style,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
