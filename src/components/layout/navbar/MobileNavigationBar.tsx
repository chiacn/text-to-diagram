"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import navlinks from "@/data/navlink";
import Link from "next/link";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

export default function MobileNavigationBar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="flex justify-between p-2">
      <div className="text-2xl"></div>
      <div className="text-2xl">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <IoMenu size={32} />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>

              <ul>
                {navlinks.map((navlink) => (
                  <li
                    key={navlink.title}
                    className="hover:bg-gray-200 p-2 rounded transition-colors"
                  >
                    <Link
                      href={navlink.link}
                      onClick={() => setSheetOpen(false)}
                    >
                      <SheetDescription>
                        <span className="text-lg text-gray-600 hover:text-gray-800 transition-colors">
                          {navlink.title}
                        </span>
                      </SheetDescription>
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
