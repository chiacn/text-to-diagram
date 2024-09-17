import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function useIsMobile(query: object) {
  const [isMobile, setIsMobile] = useState<Boolean | null>(null);
  const mobile = useMediaQuery(query);
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);

  return isMobile;
}
