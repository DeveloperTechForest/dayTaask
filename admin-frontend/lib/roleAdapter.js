// /lib/roleAdapter.js
import { PERMISSION_MAP } from "@/config/permissionMap";

export function backendRoleToUiRole(role) {
  const permissionsMatrix = {};

  // Initialize matrix
  Object.keys(PERMISSION_MAP).forEach((module) => {
    permissionsMatrix[module] = {};
    Object.keys(PERMISSION_MAP[module]).forEach((action) => {
      permissionsMatrix[module][action] = false;
    });
  });

  // Apply backend permissions
  role.permissions.forEach((permCode) => {
    for (const [module, actions] of Object.entries(PERMISSION_MAP)) {
      for (const [action, code] of Object.entries(actions)) {
        if (code === permCode) {
          permissionsMatrix[module][action] = true;
        }
      }
    }
  });

  return {
    id: role.id,
    name: role.name,
    description: role.is_admin_role ? "System Role" : "Custom Role",
    usersCount: 0, // ✅ always 0 for now
    isSystem: role.is_admin_role,
    permissions: permissionsMatrix,
  };
}
