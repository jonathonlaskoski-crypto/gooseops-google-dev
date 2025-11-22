/**
 * GooseOps Neural Empire Permission System
 * 
 * Provides role-based access control (RBAC) for different user roles within the GooseOps ecosystem.
 * This ensures that users only see features and data relevant to their job functions.
 */

// User roles in order of increasing permission level
export enum UserRole {
  TECHNICIAN = 'technician',       // Field technicians (GooseOps Lite)
  DISPATCHER = 'dispatcher',        // Job dispatchers
  OFFICE_STAFF = 'office_staff',    // General office staff
  FPM = 'fpm',                     // Facilities/Property Manager
  SUPERVISOR = 'supervisor',        // Team supervisors
  DIRECTOR = 'director',            // Directors
  EXECUTIVE = 'executive',          // C-level executives
  ADMIN = 'admin'                   // System administrators
}

// Feature permissions
export enum Permission {
  // Basic features
  VIEW_JOBS = 'view_jobs',
  MANAGE_JOBS = 'manage_jobs',
  VIEW_TASKS = 'view_tasks',
  COMPLETE_TASKS = 'complete_tasks',
  ASSIGN_TASKS = 'assign_tasks',
  
  // Communication
  USE_MESSAGING = 'use_messaging',
  VIEW_CUSTOMER_CONTACTS = 'view_customer_contacts',
  
  // AI features
  USE_ARES_BASIC = 'use_ares_basic',
  USE_ARES_ADVANCED = 'use_ares_advanced',
  USE_COPILOT = 'use_copilot',
  
  // Analytics & Insights
  VIEW_BASIC_REPORTS = 'view_basic_reports',
  VIEW_ML_INSIGHTS = 'view_ml_insights',
  VIEW_STRATEGIC_PLANNING = 'view_strategic_planning',
  
  // Integration features
  USE_POWER_PLATFORM = 'use_power_platform',
  MANAGE_INTEGRATIONS = 'manage_integrations',
  
  // Admin features
  VIEW_SECURITY_DASHBOARD = 'view_security_dashboard',
  MANAGE_USERS = 'manage_users',
  CONFIGURE_SYSTEM = 'configure_system',
  
  // Special features
  USE_RFB = 'use_rfb',  // Request for Bid feature
  USE_STRATEGIC_PLANNING = 'use_strategic_planning'
}

// Permission sets for each role
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.TECHNICIAN]: [
    Permission.VIEW_JOBS,
    Permission.VIEW_TASKS,
    Permission.COMPLETE_TASKS,
    Permission.USE_MESSAGING,
    Permission.USE_ARES_BASIC
  ],
  
  [UserRole.DISPATCHER]: [
    Permission.VIEW_JOBS,
    Permission.MANAGE_JOBS,
    Permission.VIEW_TASKS,
    Permission.ASSIGN_TASKS,
    Permission.USE_MESSAGING,
    Permission.VIEW_CUSTOMER_CONTACTS,
    Permission.USE_ARES_BASIC,
    Permission.VIEW_BASIC_REPORTS
  ],
  
  [UserRole.OFFICE_STAFF]: [
    Permission.VIEW_JOBS,
    Permission.VIEW_TASKS,
    Permission.USE_MESSAGING,
    Permission.VIEW_CUSTOMER_CONTACTS,
    Permission.USE_ARES_BASIC,
    Permission.VIEW_BASIC_REPORTS,
    Permission.USE_POWER_PLATFORM
  ],
  
  [UserRole.FPM]: [
    Permission.VIEW_JOBS,
    Permission.MANAGE_JOBS,
    Permission.VIEW_TASKS,
    Permission.ASSIGN_TASKS,
    Permission.USE_MESSAGING,
    Permission.VIEW_CUSTOMER_CONTACTS,
    Permission.USE_ARES_BASIC,
    Permission.USE_ARES_ADVANCED,
    Permission.USE_COPILOT,
    Permission.VIEW_BASIC_REPORTS,
    Permission.VIEW_ML_INSIGHTS,
    Permission.USE_POWER_PLATFORM
  ],
  
  [UserRole.SUPERVISOR]: [
    Permission.VIEW_JOBS,
    Permission.MANAGE_JOBS,
    Permission.VIEW_TASKS,
    Permission.ASSIGN_TASKS,
    Permission.COMPLETE_TASKS,
    Permission.USE_MESSAGING,
    Permission.VIEW_CUSTOMER_CONTACTS,
    Permission.USE_ARES_BASIC,
    Permission.USE_ARES_ADVANCED,
    Permission.USE_COPILOT,
    Permission.VIEW_BASIC_REPORTS,
    Permission.VIEW_ML_INSIGHTS,
    Permission.USE_POWER_PLATFORM,
    Permission.VIEW_SECURITY_DASHBOARD
  ],
  
  [UserRole.DIRECTOR]: [
    Permission.VIEW_JOBS,
    Permission.MANAGE_JOBS,
    Permission.VIEW_TASKS,
    Permission.ASSIGN_TASKS,
    Permission.USE_MESSAGING,
    Permission.VIEW_CUSTOMER_CONTACTS,
    Permission.USE_ARES_BASIC,
    Permission.USE_ARES_ADVANCED,
    Permission.USE_COPILOT,
    Permission.VIEW_BASIC_REPORTS,
    Permission.VIEW_ML_INSIGHTS,
    Permission.VIEW_STRATEGIC_PLANNING,
    Permission.USE_POWER_PLATFORM,
    Permission.MANAGE_INTEGRATIONS,
    Permission.VIEW_SECURITY_DASHBOARD,
    Permission.USE_RFB,
    Permission.USE_STRATEGIC_PLANNING
  ],
  
  [UserRole.EXECUTIVE]: [
    Permission.VIEW_JOBS,
    Permission.MANAGE_JOBS,
    Permission.VIEW_TASKS,
    Permission.ASSIGN_TASKS,
    Permission.USE_MESSAGING,
    Permission.VIEW_CUSTOMER_CONTACTS,
    Permission.USE_ARES_BASIC,
    Permission.USE_ARES_ADVANCED,
    Permission.USE_COPILOT,
    Permission.VIEW_BASIC_REPORTS,
    Permission.VIEW_ML_INSIGHTS,
    Permission.VIEW_STRATEGIC_PLANNING,
    Permission.USE_POWER_PLATFORM,
    Permission.MANAGE_INTEGRATIONS,
    Permission.VIEW_SECURITY_DASHBOARD,
    Permission.MANAGE_USERS,
    Permission.USE_RFB,
    Permission.USE_STRATEGIC_PLANNING
  ],
  
  [UserRole.ADMIN]: Object.values(Permission) // All permissions
};

/**
 * Permission service to check user access rights
 */
export class PermissionService {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(userRoles: UserRole[], permission: Permission): boolean {
    return userRoles.some(role => 
      rolePermissions[role]?.includes(permission)
    );
  }
  
  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(userRoles: UserRole[], permissions: Permission[]): boolean {
    return permissions.some(permission => 
      this.hasPermission(userRoles, permission)
    );
  }
  
  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(userRoles: UserRole[], permissions: Permission[]): boolean {
    return permissions.every(permission => 
      this.hasPermission(userRoles, permission)
    );
  }
  
  /**
   * Get all permissions for a user based on their roles
   */
  static getUserPermissions(userRoles: UserRole[]): Set<Permission> {
    const permissions = new Set<Permission>();
    
    userRoles.forEach(role => {
      rolePermissions[role]?.forEach(permission => {
        permissions.add(permission);
      });
    });
    
    return permissions;
  }
  
  /**
   * Check if a user can access a specific feature
   * This is a convenience method for common feature checks
   */
  static canAccessFeature(userRoles: UserRole[], feature: string): boolean {
    switch (feature) {
      case 'strategic_planning':
        return this.hasPermission(userRoles, Permission.USE_STRATEGIC_PLANNING);
      case 'rfb':
        return this.hasPermission(userRoles, Permission.USE_RFB);
      case 'ml_insights':
        return this.hasPermission(userRoles, Permission.VIEW_ML_INSIGHTS);
      case 'power_platform':
        return this.hasPermission(userRoles, Permission.USE_POWER_PLATFORM);
      case 'security_dashboard':
        return this.hasPermission(userRoles, Permission.VIEW_SECURITY_DASHBOARD);
      case 'ares_advanced':
        return this.hasPermission(userRoles, Permission.USE_ARES_ADVANCED);
      case 'copilot':
        return this.hasPermission(userRoles, Permission.USE_COPILOT);
      default:
        return false;
    }
  }
}

/**
 * React hook for permission checking
 */
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export function usePermissions() {
  const { user } = useContext(UserContext);
  const userRoles = user?.roles || [];
  
  return {
    hasPermission: (permission: Permission) => 
      PermissionService.hasPermission(userRoles, permission),
    
    hasAnyPermission: (permissions: Permission[]) => 
      PermissionService.hasAnyPermission(userRoles, permissions),
    
    hasAllPermissions: (permissions: Permission[]) => 
      PermissionService.hasAllPermissions(userRoles, permissions),
    
    getUserPermissions: () => 
      PermissionService.getUserPermissions(userRoles),
    
    canAccessFeature: (feature: string) => 
      PermissionService.canAccessFeature(userRoles, feature)
  };
}
