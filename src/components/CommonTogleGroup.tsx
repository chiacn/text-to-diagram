import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import type { Dispatch, SetStateAction } from "react";

interface ToggleGroupsProps {
  items: ToggleItem[];
  selectedValue: string | null;
  changeInquiryType:
    | ((value: string) => void)
    | Dispatch<SetStateAction<string | null>>;
  gap?: number;
}
type ToggleItem = {
  value: string;
  label: string;
};
export default function CommonToggleGroups({
  items,
  selectedValue,
  changeInquiryType,
  gap,
}: ToggleGroupsProps) {
  return (
    <ToggleGroup
      type="single"
      onValueChange={(value: string) => changeInquiryType(value)}
      className="flex"
      style={{ gap: `${gap ? gap : 12}px` }}
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          className={`
            px-4 py-2 border border-gray-300 rounded
            hover:bg-gray-100 transition-colors 
            cursor-pointer min-h-16 hover:bg-gray-100 
            ${selectedValue === item.value ? "bg-gray-100" : "bg-white"}
          `}
        >
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
