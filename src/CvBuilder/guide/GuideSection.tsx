import { GuideStep } from "./GuideStep";
import { GuideStepData } from "./guideData";
import { INK } from "./theme";

// Reusable section: a labelled group of GuideSteps (e.g. all TruCV steps).
export const GuideSection = ({
  title,
  logo,
  steps,
}: {
  title: string;
  logo: string;
  steps: GuideStepData[];
}) => (
  <div>
    <div className="mb-3 flex items-center gap-2.5">
      <img src={logo} alt={title} className="h-7 w-7 shrink-0 object-contain" />
      <h3 className="text-[15px] font-bold" style={{ color: INK }}>
        {title}
      </h3>
    </div>
    <div className="grid grid-cols-1 gap-5">
      {steps.map((step, i) => (
        <GuideStep
          key={step.image}
          index={i + 1}
          image={step.image}
          title={step.title}
          description={step.description}
          tips={step.tips}
          link={step.link}
        />
      ))}
    </div>
  </div>
);
