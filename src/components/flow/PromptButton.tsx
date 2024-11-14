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

export default function PromptButton() {
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
        <PromptButtonDialog />
      </DialogContent>
    </Dialog>
  );
}
