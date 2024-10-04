import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import type { Dispatch, SetStateAction } from "react";

interface ToggleGroupsProps {
  type: "single" | "multiple";
  items: ToggleItem[];
  setSelectedToggle:
    | ((value: string) => void)
    | Dispatch<SetStateAction<string | null>>;
}
type ToggleItem = {
  value: string;
  label: string;
};
export default function CommonToggleGroups({
  items,
  setSelectedToggle,
}: ToggleGroupsProps) {
  return (
    <ToggleGroup
      type="single"
      onValueChange={(value: string) => setSelectedToggle(value)}
      className="flex gap-2"
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          className="            
            px-4 py-2 border border-gray-300 rounded 
            bg-white hover:bg-gray-100 transition-colors 
            cursor-pointe
          "
        >
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
