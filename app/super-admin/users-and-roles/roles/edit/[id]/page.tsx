import { getRole, updateRole } from "@/app/services/super-admin/roleList";
// import RoleForm from "../../../../components/RoleForm";
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

const RoleEdit = async ({ params }: { params: { id: string } }) => {
  const role: Role = await getRole(Number(params.id));

  console.log(role)

  const defaultValues: RoleFormValues = {
    role_name: role.role_name,
    description: role.description ?? "",
    permission: role.permission ?? {},
  };

  return (
    
        <RoleForm
          defaultValues={defaultValues}
          onSubmit={updateRole.bind(null, role.id)}
        />
 
  
  );
};

export default RoleEdit;