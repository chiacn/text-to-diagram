import { useState } from "react";
import Link from "next/link";
import { MenuTreeNode } from "@/lib/types";

export default function AsideItem({ item }: { item: MenuTreeNode }) {
  const [isItemsOpen, setIsItemsOpen] = useState(
    item.children && item.children?.length > 0,
  );

  return (
    <div key={item.title}>
      {item.children && item.children.length > 0 ? (
        <div
          className="text-lg font-semibold text-gray-700 cursor-pointer py-2 transition duration-300 hover:text-blue-400"
          onClick={() => setIsItemsOpen(!isItemsOpen)}
        >
          <span>{item.title}</span>
        </div>
      ) : (
        <Link href={item.urlPath} passHref>
          <div className="text-lg font-semibold text-gray-700 cursor-pointer py-2 transition duration-300 hover:text-blue-400">
            <span>{item.title}</span>
          </div>
        </Link>
      )}

      {item.children && isItemsOpen && (
        <div className="pl-4">
          {item.children.map((child) => (
            <AsideItem key={child.urlPath} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}
