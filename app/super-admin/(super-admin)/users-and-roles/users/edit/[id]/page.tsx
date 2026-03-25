import { getUser } from "@/app/services/super-admin/user-action";
import UserAddForm from "@/app/super-admin/components/users-and-roles/users/UserAddForm";
import UserEditForm from "@/app/super-admin/components/users-and-roles/users/UserEditForm";
import React from "react";

const UserEdit = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return <UserEditForm id={id} />;
};

export default UserEdit;
