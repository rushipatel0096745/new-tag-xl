"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
    {
        label: "All Alerts",
        href: "/company-admin/alerts/all",
    },
    {
        label: "Asset Failure",
        href: "/company-admin/alerts/asset-failure",
    },
    {
        label: "Recertification Needed",
        href: "/company-admin/alerts/recertification-needed",
    },
    {
        label: "Maintenance Check Due",
        href: "/company-admin/alerts/maintenance-check-due",
    },
    {
        label: "Asset in Maintenance",
        href: "/company-admin/alerts/asset-in-maintenance",
    },
];

const AlertHeader = ({ title }: { title: string }) => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <div className='card-box_head border-b border-b-[#ededed] px-4 py-5.5 flex justify-between items-center'>
            <h3 className='h3 text-[18px] font-semibold leading-6'>{title}</h3>
            <div className='actions-btn flex gap-2 items-center'>
                {links.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={`icon-text-button cursor-pointer rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium border ${
                            isActive(item.href) ? "bg-[#f5f3ff] border-[#845ADF]" : "bg-[#fff] border-[#845adf26]"
                        }`}>
                        <span className='icon-circle'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width={20}
                                height={20}
                                viewBox='0 0 20 20'
                                fill='none'>
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M10 4C10.355 4 10.6429 4.28782 10.6429 4.64286V9.35714H15.3571C15.7122 9.35714 16 9.64496 16 10C16 10.355 15.7122 10.6429 15.3571 10.6429H10.6429V15.3571C10.6429 15.7122 10.355 16 10 16C9.64496 16 9.35714 15.7122 9.35714 15.3571V10.6429H4.64286C4.28782 10.6429 4 10.355 4 10C4 9.64496 4.28782 9.35714 4.64286 9.35714H9.35714V4.64286C9.35714 4.28782 9.64496 4 10 4Z'
                                    fill='#845ADF'
                                />
                            </svg>
                        </span>

                        <span className='button-label text-[#1a1a1a] capitalize ml-2'>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AlertHeader;
