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

interface PromptButtonProps {
  getCopyPrompt: (input: string) => void;
  submitPrompt: (
    json: string | null,
    promptInput: string | null,
  ) => Promise<void>;
}

export default function PromptButton({
  getCopyPrompt,
  submitPrompt,
}: PromptButtonProps) {
  return (
    <Dialog>
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
        />
      </DialogContent>
    </Dialog>
  );
}
