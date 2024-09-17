"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import navlinks from "@/data/navlink";

import React, { useEffect, useMemo, useRef, useState } from "react";
import useNavigationHighlight from "../hooks/useNavigationHighlight";
import Link from "next/link";

interface NavigationBarProps {
  hoverActiveMode?: boolean;
}
export default function NavigationBar({
  hoverActiveMode = true,
}: NavigationBarProps) {
  const tabGap = 40;
  const { navigationMenuListRef, currentBarStyle, setHoverTabIdx } =
    useNavigationHighlight(tabGap);

  return (
    <div>
      <NavigationMenu className="h-20 p-8">
        <NavigationMenuList>
          <div
            className="flex"
            style={{ gap: tabGap }}
            ref={navigationMenuListRef}
          >
            {navlinks.map((navlink) => (
              <NavigationMenuItem
                key={navlink.title}
                onMouseOver={
                  hoverActiveMode
                    ? () => setHoverTabIdx(navlink.idx)
                    : undefined
                }
              >
                <Link href={navlink.link} passHref>
                  <NavigationMenuTrigger
                    className="text-base"
                    showArrowButton={false}
                  >
                    {navlink.title}
                  </NavigationMenuTrigger>
                </Link>

                {/* TODO: 추후 하위 메뉴 생기면 주석 해제 */}
                {/* <NavigationMenuContent>
                  <NavigationMenuLink>{navlink.title}</NavigationMenuLink>
                </NavigationMenuContent> */}
              </NavigationMenuItem>
            ))}
            {/* Current Line Tab Highlight */}
            <div
              className="absolute bottom-0 left-0 bg-black h-[2px] transition-[width,left,right] duration-[0.3s,0.3s,0.3s] ease"
              style={{ ...currentBarStyle }}
            ></div>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
