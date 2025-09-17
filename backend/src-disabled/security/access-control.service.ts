import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

// MANDATORY: Role-Based Access Control Matrix
export const AccessControlMatrix = {
  super_admin: {
    applications: ['create', 'read', 'update', 'delete', 'approve', 'reject'],
    users: ['create', 'read', 'update', 'delete', 'activate', 'deactivate'],
    payments: ['create', 'read', 'update', 'delete', 'process', 'verify'],
    reports: ['create', 'read', 'export', 'schedule'],
    system: ['configure', 'backup', 'restore', 'monitor'],
    documents: ['create', 'read', 'update', 'delete', 'verify'],
    communications: ['create', 'read', 'update', 'delete', 'send'],
    analytics: ['read', 'export', 'configure'],
  },
  admin: {
    applications: ['create', 'read', 'update', 'approve', 'reject'],
    users: ['read', 'update'],
    payments: ['read', 'process'],
    reports: ['read', 'export'],
    system: ['monitor'],
    documents: ['read', 'verify'],
    communications: ['create', 'read', 'send'],
    analytics: ['read', 'export'],
  },
  reviewer: {
    applications: ['read', 'update', 'review'],
    users: ['read'],
    payments: ['read'],
    reports: ['read'],
    documents: ['read', 'verify'],
    communications: ['read'],
    analytics: ['read'],
  },
  finance_officer: {
    applications: ['read'],
    users: ['read'],
    payments: ['read', 'process', 'verify'],
    reports: ['read', 'export'],
    documents: ['read'],
    communications: ['read'],
    analytics: ['read'],
  },
  student: {
    applications: ['create', 'read_own', 'update_own'],
    users: ['read_own', 'update_own'],
    payments: ['read_own'],
    documents: ['upload_own', 'read_own'],
    communications: ['read_own'],
  },
};

@Injectable()
export class AccessControlService {
  /**
   * Check if user has permission for specific resource and action
   */
  hasPermission(userRole: UserRole, resource: string, action: string): boolean {
    const userPermissions = AccessControlMatrix[userRole];
    
    if (!userPermissions) {
      return false;
    }

    const resourcePermissions = userPermissions[resource];
    if (!resourcePermissions) {
      return false;
    }

    return resourcePermissions.includes(action);
  }

  /**
   * Check if user can access specific resource
   */
  canAccess(userRole: UserRole, resource: string): boolean {
    const userPermissions = AccessControlMatrix[userRole];
    return userPermissions && userPermissions[resource] && userPermissions[resource].length > 0;
  }

  /**
   * Get all permissions for a user role
   */
  getUserPermissions(userRole: UserRole): Record<string, string[]> {
    return AccessControlMatrix[userRole] || {};
  }

  /**
   * Check if user can perform action on specific resource instance
   */
  canPerformAction(
    userRole: UserRole,
    resource: string,
    action: string,
    resourceOwnerId?: string,
    currentUserId?: string
  ): boolean {
    // Check basic permission
    if (!this.hasPermission(userRole, resource, action)) {
      return false;
    }

    // Check ownership for own-only actions
    if (action.includes('_own')) {
      return resourceOwnerId === currentUserId;
    }

    return true;
  }

  /**
   * Get accessible resources for user role
   */
  getAccessibleResources(userRole: UserRole): string[] {
    const permissions = this.getUserPermissions(userRole);
    return Object.keys(permissions);
  }

  /**
   * Check if user can elevate privileges
   */
  canElevatePrivileges(userRole: UserRole): boolean {
    return ['super_admin', 'admin'].includes(userRole);
  }

  /**
   * Validate resource access with audit logging
   */
  async validateAccess(
    userRole: UserRole,
    resource: string,
    action: string,
    userId: string,
    resourceId?: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    const hasPermission = this.hasPermission(userRole, resource, action);
    
    if (!hasPermission) {
      // Log unauthorized access attempt
      await this.logAccessAttempt(userId, userRole, resource, action, false, 'Insufficient permissions');
      return { 
        allowed: false, 
        reason: `User role '${userRole}' does not have '${action}' permission for '${resource}'` 
      };
    }

    // Log successful access
    await this.logAccessAttempt(userId, userRole, resource, action, true);
    return { allowed: true };
  }

  /**
   * Log access attempts for audit trail
   */
  private async logAccessAttempt(
    userId: string,
    userRole: UserRole,
    resource: string,
    action: string,
    success: boolean,
    reason?: string
  ): Promise<void> {
    // This would integrate with your audit logging system
    console.log('Access attempt logged:', {
      userId,
      userRole,
      resource,
      action,
      success,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Check if action requires elevated privileges
   */
  requiresElevatedPrivileges(resource: string, action: string): boolean {
    const elevatedActions = [
      'delete',
      'approve',
      'reject',
      'process',
      'verify',
      'configure',
      'backup',
      'restore',
    ];

    return elevatedActions.includes(action);
  }

  /**
   * Get minimum role required for action
   */
  getMinimumRoleRequired(resource: string, action: string): UserRole | null {
    const roleHierarchy = [
      UserRole.STUDENT,
      UserRole.REVIEWER,
      UserRole.FINANCE_OFFICER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ];

    for (const role of roleHierarchy) {
      if (this.hasPermission(role, resource, action)) {
        return role;
      }
    }

    return null;
  }
}
