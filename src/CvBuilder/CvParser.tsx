import React from "react";
import { StepCard } from "./StepCard";
import { File } from "lucide-react";

const CVCreatorPage: React.FC<{step:number, setStep:(step:number) => void}> = ({step, setStep}) => {


  return (
    <StepCard
    index={1}
    title="Upload Your Resume"
    icon={File}
    open={step === 1}
    onToggle={() => setStep(step === 1 ? 0 : 1)}
    >
    <div>
        <p>Upload your resume to get started</p>
    </div>
    </StepCard>
  );
};

export default CVCreatorPage;