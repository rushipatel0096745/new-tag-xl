import { createRole } from '@/app/services/super-admin/roleList';
import RoleForm from '@/app/super-admin/components/RoleForm';
import React from 'react'

const RoleAddPage = () => {
  return (
    <div>
      <RoleForm action={createRole}/>
    </div>
  )
}

export default RoleAddPage