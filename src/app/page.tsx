import DiagramContainer from "@/components/flow/DiagramContainer";
import { DiagramProviders } from "@/contexts/DiagramProviders";

export default function Home() {
  return (
    <main className="flex flex-col w-full h-full items-center justify-between">
      <DiagramProviders>
        <DiagramContainer />
      </DiagramProviders>
    </main>
  );
}
