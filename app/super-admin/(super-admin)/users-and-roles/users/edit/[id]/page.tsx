import { getUser } from "@/app/services/super-admin/usersList";
import UserAddForm from "@/app/super-admin/components/UserAddForm";
import UserEditForm from "@/app/super-admin/components/UserEditForm";
import React from "react";

export interface UserProfile {
    has_error: boolean;
    message: string;
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    user_status: boolean;
    last_logged_in: string;
    role: Role;
}

export interface Role {
    id: number;
    role_name: string;
    permission: Permission;
}

export interface Permission {
    role: string[];
    user: string[];
    company: string[];
}

const UserEdit = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const user: UserProfile = await getUser(Number(id));

    return <UserEditForm userData={user} id={Number(id)} />;
};

export default UserEdit;
