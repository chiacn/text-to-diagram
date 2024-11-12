interface StepProgressControllerProps {
  totalSteps: number;
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
}

export default function StepProgressController({
  totalSteps,
  currentStep,
  setCurrentStep,
}: StepProgressControllerProps) {
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="sticky top-4 text-right pointer-events-auto">
      <div className="flex justify-end items-center space-x-1.5">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`px-3 py-1 rounded-full font-medium shadow-sm transition-transform duration-200 ${
            currentStep === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-sky-100 text-sky-600 hover:bg-sky-200"
          }`}
        >
          &larr; Prev
        </button>
        <span className="px-3 py-1 text-sm font-semibold text-gray-600">
          {currentStep + 1} / {totalSteps}
        </span>
        <button
          onClick={handleNext}
          disabled={currentStep >= totalSteps - 1}
          className={`px-3 py-1 rounded-full font-medium shadow-sm transition-transform duration-200 ${
            currentStep >= totalSteps - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-sky-100 text-sky-600 hover:bg-sky-200"
          }`}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
