import { useState, useEffect, useMemo, useRef } from "react";

export default function useNavigationHighlight(tabGap: number): {
  navigationMenuListRef: React.RefObject<HTMLDivElement>;
  currentBarStyle: React.CSSProperties;
  setHoverTabIdx: React.Dispatch<React.SetStateAction<number | null>>;
} {
  const [hoverTabIdx, setHoverTabIdx] = useState<number | null>(null);
  const calcTabWidthList = useRef<number[]>([]);
  const navigationMenuListRef = useRef<HTMLDivElement | null>(null);

  const currentBarStyle = useMemo<React.CSSProperties>(() => {
    const left = calcTabWidthList.current.reduce((acc, cur, curIdx) => {
      if (hoverTabIdx === null) return 0;
      if (curIdx < hoverTabIdx) {
        return acc + cur + tabGap;
      }
      return acc;
    }, 0);

    return {
      width:
        hoverTabIdx !== null ? `${calcTabWidthList.current[hoverTabIdx]}px` : 0,
      left: `${left}px`,
    };
  }, [calcTabWidthList, tabGap, hoverTabIdx]);

  const calcTabWidth = (): number[] => {
    if (!navigationMenuListRef.current) return [];
    return [...navigationMenuListRef.current.children].map((item) => {
      return (item as HTMLElement).getBoundingClientRect().width;
    });
  };

  const init = () => {
    setTimeout(() => {
      calcTabWidthList.current = calcTabWidth();
    }, 500);
  };

  useEffect(() => {
    init();
  }, []);

  return {
    navigationMenuListRef,
    currentBarStyle,
    setHoverTabIdx,
  };
}
