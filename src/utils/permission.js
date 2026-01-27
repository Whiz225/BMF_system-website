// utils/permissions.js
export const checkPermission = (user, permission) => {
  if (!user) return false;

  if (user.role === "business_owner") return true;

  if (user.permissions && user.permissions.get(permission)) {
    return true;
  }

  return false;
};
