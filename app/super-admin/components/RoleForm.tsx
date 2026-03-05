// "use client";

// import { createRole } from "@/app/services/super-admin/roleList";
// import { startTransition, useActionState, useState } from "react";
// import { useForm } from "react-hook-form";

// export const permissionGroups = [
//     {
//         name: "Manage User",
//         key: "user",
//         actions: ["list", "create", "update", "delete"],
//     },
//     {
//         name: "Manage Role",
//         key: "role",
//         actions: ["list", "create", "update", "delete"],
//     },
//     {
//         name: "Manage Company",
//         key: "company",
//         actions: ["list", "create", "update", "delete", "login-to-company"],
//     },
// ];

// type FormValues = {
//     name: string;
//     description?: string;
//     permissions: Record<string, boolean>;
// };

// type ApiPermission = Record<string, string[]>;

// type ApiBody = {
//     role_name: string;
//     permission: ApiPermission;
//     description: string | null;
// };

// const ACTION_MAP: Record<string, string> = {
//     list: "list",
//     create: "create",
//     update: "edit",
//     delete: "delete",
//     "login-to-company": "login-to-company",
// };

// function buildApiBody(data: FormValues): ApiBody {
//     const permission: ApiPermission = {};

//     permissionGroups.forEach((group) => {
//         const selectedActions = group.actions
//             .filter((action) => data.permissions?.[`${group.key}_${action}`])
//             .map((action) => ACTION_MAP[action] ?? action);

//         if (selectedActions.length > 0) {
//             permission[group.key] = selectedActions;
//         }
//     });

//     return {
//         role_name: data.name,
//         permission,
//         description: data.description?.trim() || null,
//     };
// }

// export default function RoleForm() {
//     const [state, formAction, isPending] = useActionState(createRole, { success: null, error: "", data: null });

//     const { register, handleSubmit, watch, setValue } = useForm<FormValues>();
//     const [expanded, setExpanded] = useState<Record<string, boolean>>({});

//     const permissions = watch("permissions") || {};

//     const toggleExpand = (key: string) => {
//         setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
//     };

//     const toggleGroup = (groupKey: string, actions: string[], checked: boolean) => {
//         actions.forEach((action) => {
//             setValue(`permissions.${groupKey}_${action}`, checked);
//         });
//     };

//     const isGroupChecked = (groupKey: string, actions: string[]) =>
//         actions.every((action) => permissions[`${groupKey}_${action}`]);

//     const isGroupIndeterminate = (groupKey: string, actions: string[]) => {
//         const checkedCount = actions.filter((a) => permissions[`${groupKey}_${a}`]).length;
//         return checkedCount > 0 && checkedCount < actions.length;
//     };

//     const onSubmit = (data: FormValues) => {
//         const apiBody = buildApiBody(data);
//         // console.log("API Body:", JSON.stringify(apiBody, null, 2));
//         console.log(apiBody);
//         startTransition(()=>formAction(apiBody))
//     };

//     return (
//         <div className='bg-white rounded-xl shadow p-6'>
//             <h2 className='text-xl font-semibold mb-6'>Add Role</h2>

//             <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
//                 {/* Role Name */}
//                 <div>
//                     <label className='font-medium'>
//                         Name <span className='text-red-500'>*</span>
//                     </label>
//                     <input
//                         {...register("name", { required: true })}
//                         className='w-full border rounded-md px-3 py-2 mt-2'
//                     />
//                 </div>

//                 {/* Permissions */}
//                 <div>
//                     <h3 className='font-semibold mb-4'>Select Permissions</h3>

//                     <div className='space-y-4'>
//                         {permissionGroups.map((group) => {
//                             const checked = isGroupChecked(group.key, group.actions);
//                             const indeterminate = isGroupIndeterminate(group.key, group.actions);

//                             return (
//                                 <div key={group.key} className='border rounded-md p-4'>
//                                     {/* Group Header */}
//                                     <div className='flex items-center gap-3'>
//                                         <button
//                                             type='button'
//                                             onClick={() => toggleExpand(group.key)}
//                                             className='text-red-500 font-bold'>
//                                             {expanded[group.key] ? "-" : "+"}
//                                         </button>

//                                         <input
//                                             type='checkbox'
//                                             checked={checked}
//                                             ref={(el) => {
//                                                 if (el) el.indeterminate = indeterminate;
//                                             }}
//                                             onChange={(e) => toggleGroup(group.key, group.actions, e.target.checked)}
//                                         />

//                                         <span className='font-medium'>{group.name}</span>
//                                     </div>

//                                     {/* Children Permissions */}
//                                     {expanded[group.key] && (
//                                         <div className='grid grid-cols-4 gap-6 mt-4 ml-6'>
//                                             {group.actions.map((action) => {
//                                                 const key = `${group.key}_${action}`;
//                                                 return (
//                                                     <label key={key} className='flex items-center gap-2'>
//                                                         <input type='checkbox' {...register(`permissions.${key}`)} />
//                                                         {action.charAt(0).toUpperCase() + action.slice(1)}
//                                                     </label>
//                                                 );
//                                             })}
//                                         </div>
//                                     )}
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className='flex justify-end gap-3'>
//                     <button type='button' className='border px-4 py-2 rounded-md'>
//                         Back
//                     </button>
//                     <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded-md'>
//                         Save
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";

type PermissionMap = {
  [key: string]: string[];
};

interface RoleFormValues {
  role_name: string;
  description?: string | null;
  permission: PermissionMap;
}

interface Props {
  defaultValues?: RoleFormValues;
  onSubmit: (data: RoleFormValues) => void;
  loading?: boolean;
}

const PERMISSIONS = {
  user: ["list", "create", "update", "delete"],
  role: ["list", "create", "update", "delete"],
  company: ["list", "create", "update", "delete", "login_to_company"],
};

export default function RoleForm({ defaultValues, onSubmit, loading }: Props) {
  const { register, handleSubmit, setValue, reset, watch } = useForm<RoleFormValues>({
    defaultValues: {
      role_name: defaultValues?.role_name ?? "",
      description: defaultValues?.description ?? "",
      permission: defaultValues?.permission ?? {},
    },
  });

  useEffect(() => {
  if (defaultValues) {
    reset(defaultValues);
  }
}, [defaultValues, reset]);

  const permissionWatch = watch("permission");

  const togglePermission = (module: string, action: string) => {
    const current = permissionWatch?.[module] || [];

    if (current.includes(action)) {
      setValue(
        `permission.${module}`,
        current.filter((p) => p !== action),
      );
    } else {
      setValue(`permission.${module}`, [...current, action]);
    }
  };

  const isChecked = (module: string, action: string) => {
    return permissionWatch?.[module]?.includes(action) ?? false;
  };

  const handleFormSubmit = (data: RoleFormValues) => {
    console.log("Form submitted with values:", data);
    // onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      {/* Role Name */}

      <div>
        <label className="font-medium">Name*</label>

        <input
          {...register("role_name")}
          className="w-full border rounded px-3 py-2 mt-2"
        />
      </div>

      {/* Permissions */}

      <div>
        <div className="font-medium mb-4">Select Permissions</div>

        {Object.entries(PERMISSIONS).map(([module, actions]) => (
          <div key={module} className="mb-6">
            <div className="font-semibold capitalize mb-2">Manage {module}</div>

            <div className="flex flex-wrap gap-6">
              {actions.map((action) => (
                <label key={action} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked(module, action)}
                    onChange={() => togglePermission(module, action)}
                  />

                  {action}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
