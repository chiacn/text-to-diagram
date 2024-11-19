import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface CommonButtonProps {
  onClick: () => void;
  className: string;
  isLoading: boolean;
  children: string | React.ReactNode;
}
export default function CommonButton({
  onClick,
  className,
  isLoading,
  children,
}: CommonButtonProps) {
  return (
    <>
      {isLoading ? (
        <Button className={className} disabled>
          <Loader2 className="animate-spin" />
        </Button>
      ) : (
        <Button className={className} onClick={() => onClick()}>
          {children}
        </Button>
      )}
    </>
  );
}
