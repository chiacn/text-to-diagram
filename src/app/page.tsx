import DiagramContainer from "@/components/flow/DiagramContainer";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col w-full h-full items-center justify-between">
      <DiagramContainer />
    </main>
  );
}
