"use client";
import { useState } from "react";
import AsideItem from "./AsideItem";
import { MenuTreeNode } from "@/lib/types";

interface AsideProps {
  menuTree?: MenuTreeNode[];
  title?: string;
}

export default function Aside({ menuTree, title = "Articles" }: AsideProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className={`flex flex-col w-52 h-[80vh] pl-10 scrollbar-hide hidden sm:flex`}
    >
      {/* menuTree 전체 title은 안 보여줌.  */}
      {/* <div className="text-2xl">{title}</div> */}
      <div className="mt-8 flex flex-col">
        {menuTree?.map((t) => (
          <AsideItem key={t.title} item={t} />
        ))}
      </div>
    </div>
  );
}
