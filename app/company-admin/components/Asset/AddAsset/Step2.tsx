import React, { use, useEffect, useRef, useState } from "react";
import { Location } from "../../../(admin)/location-master/page";
import { getAllLocations } from "@/app/services/company-admin/location";
import { useForm } from "react-hook-form";
import LocationModal from "./LocationModal";

interface Props {
    next: () => void;
    prev: () => void;
    updateForm: (name: string, value: any | null) => void;
    validate: () => boolean;
    errors: any;
    formData: any;
}

const initialFormValues = {
    name: "",
    location_id: null,
    batch_code: "",
};

const Step2 = ({ next, prev, updateForm, validate, errors, formData }: Props) => {
    const [loactions, setLocations] = useState<Location[]>([]);

    // const [formData, setFormData] = useState(initialFormValues);

    // const [errors, setErrors] = useState(initialFormValues);

    const [image, setImage] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            updateForm("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function handleRemoveImage() {
        setImagePreview(null);
        updateForm("image", null);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // function validate() {
    //     let newErrors = {} as any;
    //     if (!formData.name) newErrors.name = "Asset name is required";
    //     if (!formData.location_id) newErrors.location_id = "Location is required";
    //     if (!formData.batch_code) newErrors.batch_code = "Batch code required";

    //     setErrors(newErrors);

    //     return Object.keys(newErrors).length === 0;
    // }

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = e.target;
    //     setFormData((prevValues) => ({
    //         ...prevValues,
    //         [name]: value,
    //     }));
    // };

    // const handleFileChange = (e) => {
    //     setImage(e.target.files[0]);
    // };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        console.log("image: ", image);

        const flag = validate();
        console.log(flag);

        if (!flag) {
            return;
        } else {
            next();
        }
        // next();
    };

    async function getLocations() {
        const locationData = await getAllLocations();
        setLocations(locationData);
    }

    useEffect(() => {
        getLocations();
    }, []);

    return (
        <>
            <LocationModal isOpen={isModalOpen} isClosed={closeModal} getLocations={getLocations} updateForm={updateForm}/>
            <form action='' method='POST' className='block' onSubmit={handleSubmit}>
                <div className='card-box-inner border-3 border-solid border-[#f5f6fa] rounded-3xl p-5.5'>
                    <div className='card-box-block'>
                        <div className='card-box-head mb-4'>
                            <h4 className='title h3 text-[18px] font-semibold leading-6'>Basic Information</h4>
                        </div>
                    </div>

                    <div className='card-box-block_body'>
                        <div className='row flex w-full gap-2.5 flex-wrap'>
                            <div className='col-6 w-[calc(50%-8px)]'>
                                <div className='fancy-input relative'>
                                    <input
                                        className='box-border text-[#17181a] bg-[#f5f6fa] border border-solid border-[#efefef] rounded-[10px] w-full h-11 pt-[18px] px-[14px] pb-2 text-[14px] font-medium'
                                        placeholder=''
                                        id='name'
                                        type='text'
                                        name='name'
                                        value={formData.name}
                                        onChange={(e) => updateForm("name", e.target.value)}
                                    />
                                    <label
                                        htmlFor='name'
                                        className='form-label text-[#878d99] text-[11px] top-4 bg-[#0000] py-0.5 absolute left-3 transform -translate-y-1/2'>
                                        Name<span className='require'>*</span>
                                    </label>
                                </div>
                                {errors.name && <p className='text-red-600'>{errors.name}</p>}
                            </div>
                            <div className='col-6 w-[calc(50%-8px)]'>
                                <div className='fancy-input select relative'>
                                    <select
                                        name='location_id'
                                        id='location_id'
                                        value={Number(formData.location_id)}
                                        onChange={(e) => updateForm("location_id", e.target.value)}
                                        className='form-select box-border text-[#17181a] bg-[#f5f6fa] border border-solid border-[#efefef] rounded-[10px] w-full h-11 pt-[18px] px-[14px] pb-2 text-[14px] font-medium'>
                                        <option value=''>Select Location</option>
                                        {loactions?.map((location) => (
                                            <option value={location?.id} key={location?.id}>
                                                {location?.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label
                                        htmlFor='location_id'
                                        className='form-label text-[#878d99] text-[11px] top-4 bg-[#0000] py-0.5 absolute left-3 transform -translate-y-1/2'>
                                        Location<span className='require'>*</span>
                                    </label>
                                </div>
                                {errors.location_id && <p className='text-red-600'>{errors.location_id}</p>}

                                <div className='add-location-wrapper'>
                                    <span className='add-location-link text-sm underline' onClick={() => openModal()}>
                                        Add New Location
                                    </span>
                                </div>
                            </div>
                            <div className='col w-full'>
                                <div className='fancy-input relative'>
                                    <input
                                        className='box-border text-[#17181a] bg-[#f5f6fa] border border-solid border-[#efefef] rounded-[10px] w-full h-11 pt-[18px] px-[14px] pb-2 text-[14px] font-medium'
                                        placeholder=''
                                        id='batch_code'
                                        type='text'
                                        name='batch_code'
                                        value={formData.batch_code}
                                        onChange={(e) => updateForm("batch_code", e.target.value)}
                                    />
                                    <label
                                        htmlFor='batch_code'
                                        className='form-label text-[#878d99] text-[11px] top-[12px] bg-[#0000] py-0.5 absolute left-3 transform -translate-y-1/2'>
                                        Batch Code<span className='require'>*</span>
                                    </label>
                                </div>
                                {errors.batch_code && <p className='text-red-600'>{errors.batch_code}</p>}
                            </div>
                            <div className='col w-full'>
                                <div className='form-group image-upload-wrapper flex flex-col gap-3 mt-2.5 '>
                                    <h5 className='h5 text-[14px] font-semibold leading-5'>Add Image</h5>

                                    <div className='image-upload-block flex items-center gap-4'>
                                        {/* Upload Block */}
                                        <div className='upload-block cursor-pointer text-[#333] text-center border-2 border-dashed border-[#c9d5ff] rounded-[10px] flex-col justify-center items-center gap-[10px] w-[180px] h-[180px] transition-[background] duration-200 flex relative overflow-hidden'>
                                            <input
                                                ref={imageInputRef}
                                                className='file-input opacity-0 cursor-pointer absolute inset-0 z-10'
                                                id='image'
                                                type='file'
                                                name='image'
                                                accept='image/*'
                                                onChange={handleImageChange}
                                            />
                                            <div className='upload-icon bg-[#f5f6fa] rounded-[6px] justify-center items-center w-[40px] h-[40px] transition-colors duration-200 flex'>
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    width={25}
                                                    height={24}
                                                    className='align-bottom'
                                                    viewBox='0 0 25 24'
                                                    fill='none'>
                                                    <path
                                                        d='M18.5313 22V20.0313H16.5625C16.0103 20.0312 15.5625 19.5835 15.5625 19.0313C15.5625 18.479 16.0103 18.0313 16.5625 18.0313H18.5313V16.0625C18.5313 15.5103 18.979 15.0625 19.5313 15.0625C20.0835 15.0625 20.5312 15.5103 20.5313 16.0625V18.0313H22.5C23.0523 18.0313 23.5 18.479 23.5 19.0313C23.5 19.5836 23.0523 20.0313 22.5 20.0313H20.5313V22C20.5312 22.5523 20.0835 23 19.5313 23C18.979 23 18.5313 22.5523 18.5313 22ZM15 12.5C15 11.1193 13.8807 10 12.5 10C11.1193 10 10 11.1193 10 12.5C10.0001 13.8807 11.1193 15 12.5 15C13.8807 15 15 13.8807 15 12.5ZM20.5 12.75V9.25686L20.4951 8.86526C20.432 7.92922 19.7296 7.17191 18.8194 7.02542L18.6338 7.00491C18.5753 7.00099 18.4971 7.00003 18.2432 7.00003L18.0205 6.99808C17.2355 6.97353 16.4777 6.7185 15.8399 6.26858L15.5742 6.0635L15.4063 5.91702L15.208 5.73929C15.0663 5.61257 14.9742 5.53104 14.9072 5.47366L14.7569 5.35354C14.5181 5.18534 14.2454 5.07114 13.959 5.01956L13.835 5.00198C13.7334 4.9902 13.6216 4.98831 13.2412 4.98831H11.7588C11.5687 4.98831 11.4456 4.9884 11.3574 4.99026L11.1651 5.00198C10.875 5.03571 10.5956 5.13176 10.3477 5.28421L10.2432 5.35354C10.2014 5.38299 10.1597 5.41635 10.0928 5.47366L9.79201 5.73929L9.59377 5.91702L9.4258 6.0635C8.82402 6.56859 8.08911 6.88408 7.31349 6.97366L6.97951 6.99808C6.91362 7.00013 6.84703 7.00003 6.75685 7.00003L6.36623 7.00491C5.36758 7.07208 4.5723 7.86668 4.5049 8.86526C4.50096 8.92384 4.50002 9.00242 4.50002 9.25686V14.7002C4.50002 15.5566 4.50036 16.1389 4.53713 16.5889C4.57295 17.0273 4.6381 17.2518 4.71779 17.4082L4.79494 17.5459C4.98709 17.8592 5.26259 18.1145 5.59181 18.2823L5.72463 18.3389C5.87419 18.3924 6.08257 18.4351 6.41115 18.4619C6.8612 18.4987 7.44339 18.5 8.29982 18.5H12.5C13.0523 18.5 13.5 18.9477 13.5 19.5C13.5 20.0523 13.0523 20.5 12.5 20.5H8.29982C7.47633 20.5 6.79844 20.5011 6.24806 20.4561C5.75609 20.4159 5.29903 20.3347 4.8672 20.1494L4.68361 20.0635C4.02532 19.728 3.47408 19.2182 3.08986 18.5918L2.93556 18.3155C2.6885 17.8303 2.58988 17.3138 2.54396 16.752C2.499 16.2016 2.50002 15.5237 2.50002 14.7002V9.25686C2.50002 9.03493 2.49922 8.87398 2.50881 8.73147C2.64317 6.73391 4.23391 5.14323 6.23146 5.00882L6.46388 5.001C6.54966 4.99994 6.64572 5.00003 6.75685 5.00003C6.85923 5.00003 6.88947 4.99991 6.91701 4.99905L7.084 4.98636C7.47183 4.94155 7.83975 4.78386 8.14064 4.53128L8.26076 4.42581L8.45802 4.24905L8.79396 3.95218C8.89578 3.86538 8.99177 3.78927 9.09181 3.71878L9.3008 3.58108C9.79653 3.2763 10.3536 3.08212 10.9336 3.01468L11.1182 2.99905C11.3059 2.98755 11.5074 2.98831 11.7588 2.98831H13.2412C13.5764 2.98831 13.823 2.98637 14.0664 3.01468C14.7294 3.09177 15.3626 3.33435 15.9082 3.71878L16.0567 3.82913C16.2044 3.94576 16.3545 4.08139 16.542 4.24905L16.7393 4.42581L16.8594 4.53128L16.9922 4.63382C17.3112 4.85901 17.6903 4.98677 18.083 4.99905L18.2432 5.00003C18.4651 5.00003 18.6261 4.99923 18.7686 5.00882L18.9541 5.02542C20.8639 5.24258 22.3611 6.79615 22.4912 8.73147L22.499 8.9639C22.5001 9.04965 22.5 9.14577 22.5 9.25686V12.75C22.5 13.3023 22.0523 13.75 21.5 13.75C20.9478 13.75 20.5001 13.3023 20.5 12.75ZM17 12.5C17 14.9853 14.9853 17 12.5 17C10.0148 17 8.00007 14.9853 8.00002 12.5C8.00002 10.0147 10.0147 8.00003 12.5 8.00003C14.9853 8.00003 17 10.0147 17 12.5Z'
                                                        fill='#263f94'
                                                    />
                                                </svg>
                                            </div>
                                            <span className='upload-text'>
                                                Upload images <br /> no more 5 Mb
                                            </span>
                                            <button
                                                type='button'
                                                className='btn min-w-19 h-auto px-[5px] appearance-none cursor-pointer text-center bg-[#263f94] border border-[#263f94] text-white box-border rounded-[40px] justify-center items-center gap-[6px] px-[14px] py-[10px] text-[14px] font-medium transition-all duration-200 inline-flex'>
                                                Upload
                                            </button>
                                        </div>

                                        {imagePreview && (
                                            <div className='relative w-[180px] h-[180px] rounded-[10px] overflow-hidden border border-solid border-[#c9d5ff]'>
                                                <img
                                                    src={imagePreview}
                                                    alt='Preview'
                                                    className='w-full h-full object-cover'
                                                />
                                                <button
                                                    type='button'
                                                    onClick={handleRemoveImage}
                                                    className='absolute top-1.5 right-1.5 z-20 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow'>
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='actions-btn next_step-btn flex items-center justify-between gap-2 mt-6 '>
                    <button
                        onClick={prev}
                        type='button'
                        className='btn continue py-2.5 pr-3 pl-3.5 all-unset text-[#111c43] cursor-pointer text-center bg-[#41414126] border border-[#0000 box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-500 transition-all duration-200 inline-flex'>
                        <svg xmlns='http://www.w3.org/2000/svg' width={18} height={18} viewBox='0 0 18 18' fill='none'>
                            <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M8.5771 14.2023C8.3135 14.4659 7.88611 14.4659 7.62251 14.2023L2.89751 9.47732C2.6339 9.21372 2.6339 8.78633 2.89751 8.52273L7.6225 3.79773C7.88611 3.53412 8.3135 3.53412 8.5771 3.79773C8.8407 4.06133 8.8407 4.48872 8.5771 4.75232L5.0044 8.32502L14.6248 8.32502C14.9976 8.32502 15.2998 8.62723 15.2998 9.00002C15.2998 9.37282 14.9976 9.67502 14.6248 9.67502L5.0044 9.67502L8.5771 13.2477C8.8407 13.5113 8.8407 13.9387 8.5771 14.2023Z'
                                fill='#111c42'
                            />
                        </svg>
                        Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        type='submit'
                        className='btn continue py-2.5 pr-3 pl-3.5 ml-auto all-unset cursor-pointer text-center bg-[#263f94] border border-[#263f94] text-white box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-500 transition-all duration-200 inline-flex'>
                        Continue
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='align-bottom'
                            width={18}
                            height={18}
                            viewBox='0 0 18 18'
                            fill='none'>
                            <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M9.4229 3.79768C9.6865 3.53407 10.1139 3.53407 10.3775 3.79768L15.1025 8.52268C15.3661 8.78628 15.3661 9.21367 15.1025 9.47727L10.3775 14.2023C10.1139 14.4659 9.6865 14.4659 9.4229 14.2023C9.1593 13.9387 9.1593 13.5113 9.4229 13.2477L12.9956 9.67498H3.3752C3.0024 9.67498 2.7002 9.37277 2.7002 8.99998C2.7002 8.62718 3.0024 8.32498 3.3752 8.32498H12.9956L9.4229 4.75227C9.1593 4.48867 9.1593 4.06128 9.4229 3.79768Z'
                                fill='white'
                            />
                        </svg>
                    </button>
                </div>
            </form>
        </>
    );
};

export default Step2;
