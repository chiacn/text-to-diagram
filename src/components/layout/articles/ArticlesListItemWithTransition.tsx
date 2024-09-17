"use client";
import { useEffect, useState } from "react";

interface ArticlesListItemWithTransitionProps {
  children: React.ReactNode;
}

export default function ArticlesListItemWithTransition({
  children,
}: ArticlesListItemWithTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트되면 transition 트리거
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-opacity transition-transform duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}
