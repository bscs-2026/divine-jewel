// src/lib/pageAccessHelper.ts

export const rolePermissions = {
    1: ['*'], // Role 1: Admin - can access all pages
    2: ['*'], // Role 2: Assistant (Admin Assistant?) - can access all pages for now, we will adjust later
    3: ['/orders', '/stocks', '/history', '/returns'], // Role 3: Cashier - can access only specific pages
  };
  
  /**
   * Checks if a role has access to a specific page.
   * @param roleId The role ID of the user.
   * @param path The path the user is trying to access.
   * @returns True if the role has access, false otherwise.
   */
  export function hasAccess(roleId: number, path: string): boolean {
    const permissions = rolePermissions[roleId];
  
    if (!permissions) {
      // If roleId is not defined in rolePermissions
      return false;
    }
  
    if (permissions.includes('*')) {
      // Role has access to all pages
      return true;
    }
  
    return permissions.includes(path);
  }
  