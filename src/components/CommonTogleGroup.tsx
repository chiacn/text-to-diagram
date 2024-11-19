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
  gap = 12,
}: ToggleGroupsProps) {
  return (
    <ToggleGroup
      type="single"
      onValueChange={(value: string) => changeInquiryType(value)}
      className="flex"
      style={{ gap }}
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          className={`rounded-3xl text-sm font-medium transition-transform duration-200 p-5
            ${
              selectedValue === item.value
                ? "bg-gray-700 text-gray-200 shadow-md scale-105"
                : "bg-white-800 text-black-400 border border-gray-600 hover:bg-gray-700 hover:text-white opacity-80"
            }
          
          `}
        >
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
