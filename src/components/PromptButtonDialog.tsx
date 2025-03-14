import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import CommonButton from "./CommonButton";

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
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    const submit = await submitPrompt(jsonInput, promptInput);
    if (submit.result) setIsOpen(false);
  };

  const copy = async (promptInput: string) => {
    setIsLoading(true);
    await getCopyPrompt(promptInput);
    setIsLoading(false);
  };

  return (
    <div className="m-8">
      <h3 className="mb-2 text-[16px] text-gray-80">
        Input your question to generate a prompt.
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

        <CommonButton
          onClick={() => copy(promptInput)}
          className="min-w-[124px] h-20 ml-2 flex-1 justify-center item-center"
          isLoading={isLoading}
          variant="outline"
        >
          Get Prompt
        </CommonButton>
      </div>
      <h3 className="mb-2 text-[16px] text-gray-80">
        Ask GPT or another LLM using the copied prompt,
        <br />
        then paste the received answer below the input box.
      </h3>
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
