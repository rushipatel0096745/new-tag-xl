"use client";

import React, { useState } from "react";
import Step1 from "./Step1";
import Step4 from "./Step4";
import Step3 from "./Step3";
import Step2 from "./Step2"
import Link from "next/link";

const AddAsset = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState();

    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    return (
        <>
            {currentStep === 1 && <Step1 next={nextStep} />}

            {currentStep === 2 && <Step2 prev={prevStep} next={nextStep}/>}

            {currentStep === 3 && <Step3 prev={prevStep} next={nextStep}/>}

            {currentStep === 4 && <Step4 prev={prevStep}/>}
        </>
    );
};

export default AddAsset;
