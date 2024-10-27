"use client";
import { useState } from "react";
import DiagramItem from "./DiagramItem";
import useLLM from "@/commonHooks/useLLM";
import CommonToggleGroups from "../CommonTogleGroup";

export default function DiagramContainer() {
  //  LLM 테스트 ---------------------------------------------

  const { getAnswerFromModel, inquiryType, setInquiryType, inquiryTypeList } =
    useLLM({});
  const [question, setQuestion] = useState("");

  const [structure, setStructure] = useState(null);

  function fixJSON(jsonString: string) {
    return jsonString.replace(/"step":\s*([\d.]+)/g, '"step": "$1"');
  }

  const submitPrompt = async () => {
    const response = await getAnswerFromModel(question);

    // JSON 추출
    const match = response.match(/{[\s\S]*}/);
    let jsonString = match ? match[0] : "{}";
    console.log("jsonString", jsonString);

    const fixedJSONString = fixJSON(jsonString);

    try {
      const json = JSON.parse(fixedJSONString);
      setStructure({ ...json });
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  };

  const renderDiagramItems = (item: any, depth = 0) => (
    <DiagramItem
      key={item.step}
      diagramId={item.step}
      depth={depth}
      target={item.target}
      example={item.example}
      description={item.description}
      result={item.result}
    >
      {item.steps &&
        item.steps.map((childItem: any) =>
          renderDiagramItems(childItem, depth + 1),
        )}
    </DiagramItem>
  );

  return (
    <>
      <div className="flex flex-col">
        <CommonToggleGroups
          items={inquiryTypeList}
          selectedValue={inquiryType}
          setSelectedToggle={setInquiryType}
        />
        <textarea
          name="postContent"
          rows={4}
          cols={40}
          onChange={(e) => setQuestion(e.target.value)}
          className="border border-gray-300 mt-2"
        ></textarea>
        <button onClick={submitPrompt}>Submit!!</button>
      </div>

      <div>{structure && renderDiagramItems(structure)}</div>
    </>
  );
}
