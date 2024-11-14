import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function PromptButtonDialog() {
  const [promptInput, setPromptInput] = useState("");
  const [jsonInput, setJsonInput] = useState("");

  const handleGetPrompt = () => {
    // handle prompt generation logic here
    console.log("Prompt generated:", promptInput);
  };

  const handleSubmitJson = () => {
    // handle JSON submission logic here
    console.log("JSON submitted:", jsonInput);
  };

  return (
    <div className="m-8">
      <div className="flex justify-center items-center gap-4 mb-8">
        <Textarea
          name="Input your question to get prompt."
          rows={4}
          cols={40}
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          className={`border border-gray-300 flex-4 w-full h-[90px] min-w-[600px]`}
          placeholder="Input your question to get prompt."
        ></Textarea>

        <Button
          variant="outline"
          className="w-50 h-20 ml-2 flex-1 justify-center item-center"
          onClick={handleGetPrompt}
        >
          Get Prompt
        </Button>
      </div>

      <div className="flex justify-center items-center gap-4">
        <Textarea
          name="Follow the specified JSON format."
          rows={4}
          cols={40}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className={`border border-gray-300 flex-4 w-full h-[90px]`}
          placeholder="Follow the specified JSON format."
        ></Textarea>

        <Button
          variant="secondary"
          className="w-40 h-20 ml-2 flex-1 justify-center item-center border"
          onClick={handleSubmitJson}
        >
          Submit JSON
        </Button>
      </div>
    </div>
  );
}
