"use client";

import React, { useEffect, useState } from "react";
import Step1 from "./Step1";
import Step4 from "./Step4";
import Step3 from "./Step3";
import Step2 from "./Step2";
import { useRouter } from "next/navigation";
import { createAsset } from "@/app/services/company-admin/asset-actions";
import Modal from "../../Modal";
import { CreateAsset } from "@/app/services/company-admin/assets";

const AddAsset = () => {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        tag_type: "",
        uid: "",
        tag_id: "",
        name: "",
        location_id: "",
        batch_code: "",
        // image: null as File | null,
        image: "" as string | File,
        manual_template_id: "",
        status: null,
        // oem_certificate: null as File | null,
        oem_certificate: "" as string | File,
        // third_party_certificate: null as File | null,
        third_party_certificate: "" as string | File,
        third_party_start_date: "",
        third_party_expiry_date: "",
        pre_use_template_id: "",
        maintenance_template_id: "",
        asset_pre_use_questions: "",
        asset_maintenance_questions: "",
    });

    const [isMounted, setIsMounted] = useState(false);

    const [savedData, setSavedData] = useState<any>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const isFormEmpty = (data: typeof formData) => {
        return Object.values(data).every((value) => {
            if (value === null || value === "") return true;
            if (typeof value === "string" && value.trim() === "") return true;
            return false;
        });
    };

    function handleChoice(value: boolean) {
        if (value && savedData) {
            setFormData((prev) => ({
                ...prev,
                ...savedData,
            }));
        } else {
            localStorage.removeItem("ASSET_FORM_DATA");
        }

        closeModal();
    }

    useEffect(() => {
        const saved = localStorage.getItem("ASSET_FORM_DATA");

        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                if (!isFormEmpty(parsed)) {
                    setSavedData(parsed);
                    openModal();
                }
            } catch (e) {
                console.error("Invalid localStorage data");
            }
        }

        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const timeout = setTimeout(() => {
            if (isFormEmpty(formData)) {
                localStorage.removeItem("ASSET_FORM_DATA");
                return;
            }

            const safeData = {
                ...formData,
                image: typeof formData.image === "string" ? formData.image : "",
                oem_certificate: typeof formData.oem_certificate === "string" ? formData.oem_certificate : "",
                third_party_certificate:
                    typeof formData.third_party_certificate === "string" ? formData.third_party_certificate : "",
            };

            localStorage.setItem("ASSET_FORM_DATA", JSON.stringify(safeData));
        }, 300);

        return () => clearTimeout(timeout);
    }, [formData, isMounted]);

    const [errors, setErrors] = useState<any>({});
    const [formError, setFormError] = useState("");

    const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
    const MAX_FILE_SIZE_MB = 5;

    const updateForm = function (name: string, value: any) {
        if ((name === "oem_certificate" || name === "third_party_certificate") && value instanceof File) {
            if (!ALLOWED_IMAGE_TYPES.includes(value.type)) {
                setErrors((prev: any) => ({
                    ...prev,
                    [name]: "Only PNG, JPG, or JPEG images are allowed",
                }));
                return;
            }
            if (value.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setErrors((prev: any) => ({
                    ...prev,
                    [name]: `Upload File Less than ${MAX_FILE_SIZE_MB}MB`,
                }));
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSave = async function () {
        // const data = formData
        // console.log(data)

        const assetFormData = new FormData();
        assetFormData.append("tag_id", formData.tag_id);
        assetFormData.append("name", formData.name);
        assetFormData.append("location_id", formData.location_id);
        assetFormData.append("batch_code", formData.batch_code);
        formData.image && assetFormData.append("image", formData.image);
        formData.manual_template_id && assetFormData.append("manual_template_id", formData.manual_template_id);
        assetFormData.append("status", String(Number(formData.status) || 0));
        assetFormData.append("oem_certificate", formData.oem_certificate);
        if (formData.third_party_certificate) {
            assetFormData.append("third_party_certificate", formData.third_party_certificate);
            assetFormData.append("third_party_start_date", formData.third_party_start_date);
            assetFormData.append("third_party_expiry_date", formData.third_party_expiry_date);
        }
        assetFormData.append("pre_use_template_id", formData.pre_use_template_id);
        assetFormData.append("maintenance_template_id", formData.maintenance_template_id);
        formData.asset_pre_use_questions &&
            assetFormData.append("asset_pre_use_questions", formData.asset_pre_use_questions);
        formData.asset_maintenance_questions &&
            assetFormData.append("asset_maintenance_questions", formData.asset_maintenance_questions);

        console.log([...assetFormData.entries()]);

        const response = await CreateAsset(assetFormData);

        console.log("response for create asset: ", response);

        if (response?.success) {
            router.push("/company-admin/asset?create=true");
            return;
        }

        if (!response?.success && response?.error) {
            setFormError(response?.error);
        }
    };

    const requiredFields = ["tag_id", "name", "location_id", "batch_code", "oem_certificate"];

    const validate = function () {
        const newErrors: any = {};

        if (currentStep === 1) {
            // if (!formData.tag_id) newErrors.tag_id = "Tag id is required";
            if (!formData.tag_type) newErrors.tag_type = "Select the Tag Type is required";
            if (!formData.uid) newErrors.uid = "Tag uid is required";
        }

        if (currentStep === 2) {
            if (!formData.name) newErrors.name = "Name is required";
            if (!formData.location_id) newErrors.location_id = "Location is required";
            if (!formData.batch_code) newErrors.batch_code = "Batch code is required";
            if (formData.image && formData.image instanceof File) {
                if (!ALLOWED_IMAGE_TYPES.includes(formData.image.type)) {
                    newErrors.image = "Only PNG, JPG, or JPEG images are allowed";
                } else if (formData.image.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                    newErrors.image = `Upload File Less than ${MAX_FILE_SIZE_MB}MB`;
                }
            }
        }

        if (currentStep === 3) {
            if (!formData.oem_certificate) {
                newErrors.oem_certificate = "OEM Certificate is required";
            } else if (formData.oem_certificate instanceof File) {
                if (!ALLOWED_IMAGE_TYPES.includes(formData.oem_certificate.type)) {
                    newErrors.oem_certificate = "Only PNG, JPG, or JPEG images are allowed";
                } else if (formData.oem_certificate.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                    newErrors.oem_certificate = `Upload File Less than ${MAX_FILE_SIZE_MB}MB`;
                }
            }

            if (formData.third_party_certificate) {
                if (formData.third_party_certificate instanceof File) {
                    if (!ALLOWED_IMAGE_TYPES.includes(formData.third_party_certificate.type)) {
                        newErrors.third_party_certificate = "Only PNG, JPG, or JPEG images are allowed";
                    } else if (formData.third_party_certificate.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                        newErrors.third_party_certificate = `Upload File Less than ${MAX_FILE_SIZE_MB}MB`;
                    }
                }
                if (!formData.third_party_start_date)
                    newErrors.third_party_start_date = "Third party start date required";
                if (!formData.third_party_expiry_date)
                    newErrors.third_party_expiry_date = "Third party expiry date required";
            }

            if (
                (formData.third_party_start_date || formData.third_party_expiry_date) &&
                !formData.third_party_certificate
            ) {
                newErrors.third_party_certificate = "Third party certificate is required";
            }
        }

        if (currentStep === 4) {
            if (!formData.pre_use_template_id) newErrors.pre_use_template_id = "Select the pre use template";
            if (!formData.maintenance_template_id)
                newErrors.maintenance_template_id = "Select the maintenance template";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className='flex flex-col justify-between gap-4 bg-white p-4 border-0 rounded-xl'>
                    <p className=''>Do you want to continue from where you left?</p>

                    <div className='action-btn flex justify-around'>
                        <button
                            type='button'
                            onClick={() => handleChoice(true)}
                            className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm'>
                            Yes
                        </button>
                        <button
                            onClick={() => handleChoice(false)}
                            className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm'>
                            No
                        </button>
                    </div>
                </div>
            </Modal>

            {currentStep === 1 && (
                <Step1
                    next={nextStep}
                    updateForm={updateForm}
                    validate={validate}
                    errors={errors}
                    formData={formData}
                />
            )}

            {currentStep === 2 && (
                <Step2
                    prev={prevStep}
                    next={nextStep}
                    updateForm={updateForm}
                    validate={validate}
                    errors={errors}
                    formData={formData}
                />
            )}

            {currentStep === 3 && (
                <Step3
                    prev={prevStep}
                    next={nextStep}
                    updateForm={updateForm}
                    validate={validate}
                    errors={errors}
                    formData={formData}
                />
            )}

            {currentStep === 4 && (
                <Step4
                    prev={prevStep}
                    next={nextStep}
                    updateForm={updateForm}
                    validate={validate}
                    errors={errors}
                    formData={formData}
                    handleSubmit={handleSave}
                    formError={formError}
                />
            )}
        </>
    );
};

export default AddAsset;
