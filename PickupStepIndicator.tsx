type PickupStepIndicatorProps = {
  currentStep: number;
};

const steps = ["Waste", "Photo", "Details", "Schedule", "Review"];

export function PickupStepIndicator({ currentStep }: PickupStepIndicatorProps) {
  return (
    <ol className="mb-7 grid grid-cols-5 gap-1" aria-label="Pickup request progress">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const complete = stepNumber < currentStep;
        const current = stepNumber === currentStep;

        return (
          <li key={step} className="min-w-0">
            <div
              className={
                "h-2 rounded-full " +
                (complete || current ? "bg-forest-600" : "bg-slate-200")
              }
            />
            <p
              className={
                "mt-2 truncate text-center text-[10px] font-semibold sm:text-xs " +
                (current ? "text-forest-800" : "text-slate-500")
              }
            >
              {step}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
