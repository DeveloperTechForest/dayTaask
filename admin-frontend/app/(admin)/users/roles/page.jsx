"use client";

import { useEffect, useState } from "react";
import { Shield, Users, Plus, Save, Edit, Trash2, Star } from "lucide-react";

import { apiFetch } from "@/utils/api";
import { backendRoleToUiRole } from "@/lib/roleAdapter";
import { PERMISSION_MAP } from "@/config/permissionMap";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [updatedRoleId, setUpdatedRoleId] = useState("");
  const [updatedRoleName, setUpdatedRoleName] = useState("");
  const [showPermissions, setShowPermissions] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [saving, setSaving] = useState(false);

  // Only freeze roles named "admin" or "super_admin" (case-insensitive)
  const isProtectedRole = (role) => {
    if (!role) return false;
    const name = role.name.toLowerCase().trim();
    return name === "admin" || name === "super_admin" || name === "superadmin";
  };

  /* ---------------- LOAD ROLES ---------------- */
  async function loadRoles() {
    try {
      const data = await apiFetch("/api/users/roles/");
      const mapped = data.results.map(backendRoleToUiRole);
      setRoles(mapped);
      setSelectedRole(mapped[0] || null);
    } catch (error) {
      alert("Failed to load roles: " + (error.message || "Unknown error"));
    }
  }

  useEffect(() => {
    loadRoles();
  }, []);

  /* ---------------- CREATE ROLE ---------------- */
  async function createRole() {
    try {
      if (!newRoleName.trim()) {
        alert("Role name is required");
        return;
      }

      const lowerName = newRoleName.toLowerCase().trim();
      if (["admin", "super_admin", "superadmin"].includes(lowerName)) {
        alert("You cannot create a role with this reserved name.");
        return;
      }

      await apiFetch("/api/users/roles/", {
        method: "POST",
        body: JSON.stringify({
          name: newRoleName,
          is_admin_role: showPermissions,
        }),
      });

      setNewRoleName("");
      setShowCreate(false);
      setShowPermissions(false);
      loadRoles();
    } catch (error) {
      alert("Failed to create role: " + (error.message || "Unknown error"));
    }
  }

  /* ---------------- DELETE ROLE ---------------- */
  async function deleteRole(roleId) {
    try {
      if (!window.confirm("Are you sure you want to delete this role?")) return;

      await apiFetch(`/api/users/roles/${roleId}/`, {
        method: "DELETE",
      });
      setSelectedRole(null);
      loadRoles();
    } catch (error) {
      alert("Failed to delete role: " + (error.message || "Unknown error"));
    }
  }

  /* ---------------- UPDATE ROLE ---------------- */
  async function updateRole() {
    try {
      if (!updatedRoleName.trim()) {
        alert("Role name is required");
        return;
      }

      await apiFetch(`/api/users/roles/${updatedRoleId}/`, {
        method: "PUT",
        body: JSON.stringify({
          name: updatedRoleName,
          is_admin_role: showPermissions,
        }),
      });

      setUpdatedRoleName("");
      setUpdatedRoleId("");
      setShowUpdate(false);
      setShowPermissions(false);
      loadRoles();
    } catch (error) {
      alert("Failed to update role: " + (error.message || "Unknown error"));
    }
  }

  /* ---------------- TOGGLE PERMISSION ---------------- */
  function togglePermission(module, action) {
    if (isProtectedRole(selectedRole)) return;

    const updated = roles.map((r) =>
      r.id === selectedRole.id
        ? {
            ...r,
            permissions: {
              ...r.permissions,
              [module]: {
                ...r.permissions[module],
                [action]: !r.permissions[module][action],
              },
            },
          }
        : r,
    );

    setRoles(updated);
    setSelectedRole(updated.find((r) => r.id === selectedRole.id));
  }

  /* ---------------- SAVE PERMISSIONS ---------------- */
  async function savePermissions() {
    setSaving(true);
    try {
      const permissionCodes = [];

      Object.entries(selectedRole.permissions).forEach(([module, actions]) => {
        Object.entries(actions).forEach(([action, enabled]) => {
          if (enabled) {
            permissionCodes.push(PERMISSION_MAP[module][action]);
          }
        });
      });

      await apiFetch("/api/users/roles/assign-permission/", {
        method: "POST",
        body: JSON.stringify({
          role_id: selectedRole.id,
          permissions: permissionCodes,
        }),
      });

      alert("Permissions saved successfully!");
    } catch (error) {
      alert(
        "Failed to save permissions: " + (error.message || "Unknown error"),
      );
    } finally {
      setSaving(false);
    }
  }

  if (!roles.length) return <div className="p-6">Loading…</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          <Plus size={18} /> Create Role
        </button>
      </div>

      {/* ROLES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => setSelectedRole(role)}
            className={`p-4 border rounded cursor-pointer transition-all ${
              selectedRole?.id === role.id
                ? "border-orange-500 ring-2 ring-orange-200 bg-orange-50"
                : "hover:border-slate-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <Shield className="text-orange-500" />

              {/* Edit & Delete buttons — hidden for protected roles */}
              {!isProtectedRole(role) && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUpdatedRoleName(role.name);
                      setShowPermissions(role.is_admin_role || false);
                      setUpdatedRoleId(role.id);
                      setShowUpdate(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    aria-label="Edit role"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRole(role.id);
                    }}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    aria-label="Delete role"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <h3 className="font-bold mt-2">{role.name}</h3>

            {role.isSystem && (
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                <Star size={14} /> "Admin Staff role"
              </div>
            )}

            {isProtectedRole(role) && (
              <div className="mt-2 text-xs text-orange-600 font-medium">
                Protected Role
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PERMISSION MATRIX */}
      {selectedRole && (
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-bold text-xl">{selectedRole.name}</h2>
            {!isProtectedRole(selectedRole) && (
              <button
                onClick={savePermissions}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Permissions"}
              </button>
            )}
          </div>

          {isProtectedRole(selectedRole) && (
            <div className="px-6 py-3 bg-orange-50 text-orange-800 text-sm font-medium">
              This is a protected system role. Permissions cannot be modified.
            </div>
          )}

          <div className="scrollbar overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-3 text-left font-medium">Module</th>
                  {["read", "create", "update", "delete"].map((p) => (
                    <th
                      key={p}
                      className="p-3 text-center capitalize font-medium"
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(PERMISSION_MAP).map((module) => (
                  <tr key={module} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-medium">{module}</td>
                    {["read", "create", "update", "delete"].map((action) => (
                      <td key={action} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={!!selectedRole.permissions[module]?.[action]}
                          disabled={isProtectedRole(selectedRole)}
                          onChange={() => togglePermission(module, action)}
                          className="checkbox w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE ROLE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4 shadow-xl">
            <h2 className="font-bold text-xl">Create Role</h2>
            <input
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Role name (e.g. Finance Manager)"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                id="createPermission"
                checked={showPermissions}
                onChange={() => setShowPermissions(!showPermissions)}
              />
              <label htmlFor="createPermission" className="text-sm">
                Grant access to Admin Dashboard
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="border px-4 py-2 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={createRole}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE ROLE MODAL */}
      {showUpdate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4 shadow-xl">
            <h2 className="font-bold text-xl">Update Role</h2>
            <input
              value={updatedRoleName}
              onChange={(e) => setUpdatedRoleName(e.target.value)}
              placeholder="Role name"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                id="updatePermission"
                checked={showPermissions}
                onChange={() => setShowPermissions(!showPermissions)}
                disabled={isProtectedRole(selectedRole)}
              />
              <label
                htmlFor="updatePermission"
                className={`text-sm ${
                  isProtectedRole(selectedRole) ? "text-gray-400" : ""
                }`}
              >
                Grant access to Admin Dashboard
                {isProtectedRole(selectedRole) && " (protected)"}
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUpdate(false)}
                className="border px-4 py-2 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={updateRole}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
