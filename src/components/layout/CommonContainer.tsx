"use client";
import NavigationBar from "./navbar/NavigationBar";
import MobileNavigationBar from "./navbar/MobileNavigationBar";
import useIsMobile from "./hooks/useIsMobile";

interface ContainerProps {
  children: React.ReactNode;
}

export default function CommonContainer({ children }: ContainerProps) {
  const isMobile = useIsMobile({ maxWidth: 640 });
  if (isMobile === null) {
    return null; // Note: 모바일 여부 판단이 안 되었을 시 표시 x
  }
  return (
    <div className="sm:px-[400px] min-w-screen w-screen min-h-screen h-screen flex flex-col">
      {/* {isMobile ? <MobileNavigationBar /> : <NavigationBar />} */}
      <div className="flex flex-col items-center justify-between sm:mt-12 sm:w-full sm:min-h-full sm:h-full">
        {children}
      </div>
    </div>
  );
}
