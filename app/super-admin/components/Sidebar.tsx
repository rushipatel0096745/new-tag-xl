"use client";

import Link from "next/link";
import React, { useState } from "react";

const Sidebar = () => {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div>
            <div className='flex items-center justify-center border-b-white border-b-1 text-white mt-5 mb-0 p-2 text-2xl'>
                TagXL
            </div>
            <ul className='flex-col space-y-2 py-2 justify-center text-white '>
                <li className=''>
                    <Link
                        href='/super-admin'
                        className='flex items-center px-4 py-1.5 font-medium text-body rounded-base hover:bg-red-500'>
                        <span className='ms-5'>Super Admin</span>
                    </Link>
                </li>
                <hr className=' border-white' />
                <li>
                    <Link href='/super-admin' className='flex items-center px-4 py-1.5 rounded-base hover:bg-red-500'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
                            <g clipPath='url(#clip0_1292_1107)'>
                                <path
                                    d='M15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 10.7189 2.89342 12.287 3.95142 13.4788C4.46436 11.9045 5.90385 10.7498 7.63403 10.7498H10.366C12.0961 10.7498 13.5348 11.9047 14.0479 13.4788C15.106 12.287 15.75 10.7191 15.75 9ZM7.63403 12.2498C6.38458 12.2498 5.32031 13.2739 5.25293 14.6147C6.32497 15.3316 7.61354 15.75 9 15.75C10.3862 15.75 11.6744 15.3314 12.7463 14.6147C12.6789 13.2739 11.6154 12.2498 10.366 12.2498H7.63403ZM10.7812 7.125C10.7812 6.06352 9.95828 5.25 9 5.25C8.04172 5.25 7.21875 6.06352 7.21875 7.125C7.21875 8.18648 8.04172 9 9 9C9.95828 9 10.7812 8.18648 10.7812 7.125ZM17.25 9C17.25 13.5563 13.5563 17.25 9 17.25C4.44365 17.25 0.75 13.5563 0.75 9C0.75 4.44365 4.44365 0.75 9 0.75C13.5563 0.75 17.25 4.44365 17.25 9ZM12.2812 7.125C12.2812 8.96302 10.8377 10.5 9 10.5C7.16234 10.5 5.71875 8.96302 5.71875 7.125C5.71875 5.28698 7.16234 3.75 9 3.75C10.8377 3.75 12.2812 5.28698 12.2812 7.125Z'
                                    fill='white'></path>
                            </g>
                            <defs>
                                <clipPath id='clip0_1292_1107'>
                                    <rect width='18' height='18' fill='white'></rect>
                                </clipPath>
                            </defs>
                        </svg>
                        <span className='ms-5'>Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href='/super-admin/company'
                        className='flex items-center px-4 py-1.5 text-body rounded-base hover:bg-red-500'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
                            <path
                                d='M15 13.3579V8.14966C15 7.69089 14.8254 7.26496 14.5349 6.96167L14.4038 6.84009L10.3638 3.49951C9.55787 2.83336 8.44212 2.83336 7.63623 3.49951L3.59619 6.84009C3.22808 7.14465 3.00002 7.6256 3 8.14966V13.3579C3 14.3085 3.71411 15 4.5 15H6V12.561C6 10.8697 7.30061 9.41895 9 9.41895C10.6994 9.41895 12 10.8697 12 12.561V15H13.5C14.2859 15 15 14.3085 15 13.3579ZM16.5 13.3579C16.5 15.0492 15.1994 16.5 13.5 16.5H12C11.1716 16.5 10.5 15.8284 10.5 15V12.561C10.5 11.6104 9.78589 10.9189 9 10.9189C8.21411 10.9189 7.5 11.6104 7.5 12.561V15C7.5 15.8284 6.82843 16.5 6 16.5H4.5C2.80061 16.5 1.5 15.0492 1.5 13.3579V8.14966C1.50002 7.19782 1.91271 6.28532 2.64038 5.68359L6.68042 2.34375L6.80933 2.24194C8.16017 1.22004 10.0014 1.2539 11.3196 2.34375L15.3596 5.68359L15.4922 5.80005C16.1372 6.39957 16.5 7.25727 16.5 8.14966V13.3579Z'
                                fill='white'></path>
                        </svg>
                        <span className='ms-5'>Company</span>
                    </Link>
                </li>
                <li>
                    <div
                        onMouseEnter={() => setShowMenu((prev) => !prev)}
                        className='flex items-center px-4 py-1.5 text-body rounded-base hover:bg-red-500 group relative'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
                            <g clipPath='url(#clip0_1292_1107)'>
                                <path
                                    d='M15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 10.7189 2.89342 12.287 3.95142 13.4788C4.46436 11.9045 5.90385 10.7498 7.63403 10.7498H10.366C12.0961 10.7498 13.5348 11.9047 14.0479 13.4788C15.106 12.287 15.75 10.7191 15.75 9ZM7.63403 12.2498C6.38458 12.2498 5.32031 13.2739 5.25293 14.6147C6.32497 15.3316 7.61354 15.75 9 15.75C10.3862 15.75 11.6744 15.3314 12.7463 14.6147C12.6789 13.2739 11.6154 12.2498 10.366 12.2498H7.63403ZM10.7812 7.125C10.7812 6.06352 9.95828 5.25 9 5.25C8.04172 5.25 7.21875 6.06352 7.21875 7.125C7.21875 8.18648 8.04172 9 9 9C9.95828 9 10.7812 8.18648 10.7812 7.125ZM17.25 9C17.25 13.5563 13.5563 17.25 9 17.25C4.44365 17.25 0.75 13.5563 0.75 9C0.75 4.44365 4.44365 0.75 9 0.75C13.5563 0.75 17.25 4.44365 17.25 9ZM12.2812 7.125C12.2812 8.96302 10.8377 10.5 9 10.5C7.16234 10.5 5.71875 8.96302 5.71875 7.125C5.71875 5.28698 7.16234 3.75 9 3.75C10.8377 3.75 12.2812 5.28698 12.2812 7.125Z'
                                    fill='white'></path>
                            </g>
                            <defs>
                                <clipPath id='clip0_1292_1107'>
                                    <rect width='18' height='18' fill='white'></rect>
                                </clipPath>
                            </defs>
                        </svg>
                        <span className='ms-5'>User and Roles</span>
                    </div>
                </li>
                <li onMouseLeave={() => setShowMenu((prev) => !prev)}>
                    {showMenu && (
                        <>
                            <Link
                                href='/super-admin/users-and-roles/users'
                                className='flex items-center px-4 py-1.5 text-body rounded-base hover:bg-red-500'>
                                <span className='ms-5'>Users</span>
                            </Link>

                            <Link
                                href='/super-admin/users-and-roles/roles'
                                className='flex items-center px-4 py-1.5 text-body rounded-base hover:bg-red-500'>
                                <span className='ms-5'>Roles</span>
                            </Link>
                        </>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
