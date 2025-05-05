import { useState } from "react";
import PromptButtonDialog from "../PromptButtonDialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useLLMActions } from "@/contexts/LLMContext";

// interface PromptButtonProps {
//   getCopyPrompt: (input: string) => void;
//   submitPrompt: (
//     json: string | null,
//     promptInput: string | null,
//   ) => Promise<any>;
// }

interface PromptButtonProps {
  submitPrompt: (
    json: string | null,
    promptInput: string | null,
  ) => Promise<any>;
}

export default function PromptButton({ submitPrompt }: PromptButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { getPromptByInputText } = useLLMActions();

  const getCopyPrompt = async (input: string) => {
    try {
      const copied = await getPromptByInputText(input);
      await navigator.clipboard.writeText(copied || "");
      toast({
        variant: "info",
        description: "Copied!",
      });
    } catch (error: any) {
      toast({
        variant: error.variant ? error.variant : "destructive",
        description: error?.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-32 h-[90px] ml-2 flex-1 justify-center item-center"
        >
          Copy Prompt
        </Button>
      </DialogTrigger>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="min-w-fit">
        <PromptButtonDialog
          getCopyPrompt={getCopyPrompt}
          submitPrompt={submitPrompt}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
