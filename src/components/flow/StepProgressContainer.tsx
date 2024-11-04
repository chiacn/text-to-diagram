interface StepProgressContainerProps {
  progressActive: boolean;
  focusSpreadedStep?: DiagramItem[];
}
export default function StepProgressContainer({
  progressActive,
  focusSpreadedStep,
}: StepProgressContainerProps) {
  return (
    progressActive && (
      <div className="absolute top-0 left-0 w-full h-full bg-transparent bg-opacity-75 z-10 rounded-lg p-4">
        <div className="text-gray-700"></div>
      </div>
    )
  );
}
