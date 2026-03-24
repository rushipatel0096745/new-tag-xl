import { getRole, updateRole } from "@/app/services/super-admin/roleList";
import RoleForm from '@/app/super-admin/components/RoleForm';
import React from "react";

export interface RoleResponse {
  has_error: boolean;
  message: string;
  role: Role;
}

export interface Role {
  id: number;
  role_name: string;
  description: string | null;
  permission: Permission;
}

export interface Permission {
  role?: string[];
  user?: string[];
  company?: string[];
}

interface RoleFormValues {
  role_name: string;
  description?: string | null;
  permission: Record<string, string[]>;
}

const RoleEdit = async ({ params }: { params: Promise<{ id: string }> }) => {

  const {id} = await params

  const role: RoleResponse = await getRole(Number(id));

  console.log(role)

  const defaultValues: RoleFormValues = {
    role_name: role.role.role_name,
    description: role.role.description ?? "",
    permission: role.role.permission ?? {},
  };

  console.log("default values: ", defaultValues);

  return (
    
        <RoleForm
          defaultValues={defaultValues}
          action={updateRole} 
          roleId={Number(id)}
        />
 
  
  );
};

export default RoleEdit;