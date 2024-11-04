import StepProgressController from "./StepProgressController";

interface StepProgressContainerProps {
  progressActive: boolean;
  focusSpreadedStep?: DiagramItem[];
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
}
export default function StepProgressContainer({
  progressActive,
  focusSpreadedStep = [],
  currentStep,
  setCurrentStep,
}: StepProgressContainerProps) {
  return (
    progressActive && (
      <div className="absolute top-0 left-0 w-full h-full bg-transparent bg-opacity-75 z-10 rounded-lg p-4">
        <StepProgressController
          totalSteps={focusSpreadedStep.length}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
    )
  );
}
