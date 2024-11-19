import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";

interface PromptButtonDialogProps {
  getCopyPrompt: (input: string) => void;
  submitPrompt: (
    json: string | null,
    promptInput: string | null,
  ) => Promise<any>;
  setIsOpen: (isOpen: boolean) => void;
}

export default function PromptButtonDialog({
  getCopyPrompt,
  submitPrompt,
  setIsOpen,
}: PromptButtonDialogProps) {
  const [promptInput, setPromptInput] = useState("");
  const [jsonInput, setJsonInput] = useState("");

  const submit = async () => {
    const submit = await submitPrompt(jsonInput, promptInput);
    if (submit.result) setIsOpen(false);
  };

  return (
    <div className="m-8">
      <h3 className="mb-2 text-[16px] text-gray-80">
        Use the copied prompt to generate JSON output using GPT or another LLM.
        <br />
        The input text for JSON should be filled in this textarea.
      </h3>
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
          onClick={() => getCopyPrompt(promptInput)}
        >
          Get Prompt
        </Button>
      </div>

      <h3 className="mb-2 text-[16px] text-gray-80">Use the generated JSON</h3>
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
          onClick={() => submit()}
        >
          Submit JSON
        </Button>
      </div>
    </div>
  );
}
