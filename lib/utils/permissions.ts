// lib/utils/permissions.ts

/**
 * Permission Management Utilities
 * Centralized permission definitions and helper functions
 *

import { AuthContext, Permission } from '@/lib/middleware/auth';

/**
 * Default permissions by role
 * Used when creating new users or resetting permissions
 *
export const DefaultPermissions = {
  ADMIN: [
    { resource: '*', actions: ['*'] } // Full access to everything
  ],
  
  MANAGER: [
    { resource: 'STAFF', actions: ['READ', 'CREATE', 'UPDATE'] },
    { resource: 'USERS', actions: ['READ', 'UPDATE'] },
    { resource: 'INVENTORY', actions: ['READ', 'CREATE', 'UPDATE', 'DELETE'] },
    { resource: 'ORDERS', actions: ['READ', 'CREATE', 'UPDATE', 'DELETE'] },
    { resource: 'REPORTS', actions: ['READ', 'CREATE'] },
    { resource: 'SETTINGS', actions: ['READ', 'UPDATE'] },
    { resource: 'SECURITY_LOG', actions: ['READ'] }
  ],
  
  SUPERVISOR: [
    { resource: 'STAFF', actions: ['READ'], conditions: { ownDepartmentOnly: true } },
    { resource: 'INVENTORY', actions: ['READ', 'UPDATE'] },
    { resource: 'ORDERS', actions: ['READ', 'CREATE', 'UPDATE'] },
    { resource: 'REPORTS', actions: ['READ'] }
  ],
  
  STAFF: [
    { resource: 'INVENTORY', actions: ['READ'] },
    { resource: 'ORDERS', actions: ['READ', 'CREATE'], conditions: { ownRecordsOnly: true } },
    { resource: 'CUSTOMERS', actions: ['READ', 'CREATE'] }
  ],
  
  INTERN: [
    { resource: 'INVENTORY', actions: ['READ'] },
    { resource: 'ORDERS', actions: ['READ'] }
  ]
};

/**
 * Resource definitions with available actions
 *
export const ResourceDefinitions = {
  STAFF: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ADMIN'],
    description: 'Staff management'
  },
  USERS: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ADMIN'],
    description: 'User account management'
  },
  INVENTORY: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ADMIN'],
    description: 'Inventory and products'
  },
  ORDERS: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ADMIN'],
    description: 'Order management'
  },
  CUSTOMERS: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
    description: 'Customer management'
  },
  REPORTS: {
    actions: ['READ', 'CREATE', 'EXPORT'],
    description: 'Reports and analytics'
  },
  SETTINGS: {
    actions: ['READ', 'UPDATE', 'ADMIN'],
    description: 'System settings'
  },
  SECURITY_LOG: {
    actions: ['READ', 'UPDATE', 'ACKNOWLEDGE', 'ADMIN'],
    description: 'Security audit logs'
  },
  FINANCE: {
    actions: ['READ', 'CREATE', 'UPDATE', 'APPROVE', 'ADMIN'],
    description: 'Financial operations',
    conditions: ['maxValue']
  },
  VENDORS: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE'],
    description: 'Vendor management'
  }
};

/**
 * Check if action is valid for resource
 *
export function isValidAction(resource: string, action: string): boolean {
  const definition = ResourceDefinitions[resource as keyof typeof ResourceDefinitions];
  if (!definition) return false;
  return definition.actions.includes(action) || action === '*';
}

/**
 * Get available actions for a resource
 *
export function getAvailableActions(resource: string): string[] {
  const definition = ResourceDefinitions[resource as keyof typeof ResourceDefinitions];
  return definition?.actions || [];
}

/**
 * Validate permission structure
 *
export function validatePermission(permission: Permission): { valid: boolean; error?: string } {
  // Check resource exists
  if (!permission.resource) {
    return { valid: false, error: 'Resource is required' };
  }

  // Check actions exist
  if (!permission.actions || !Array.isArray(permission.actions) || permission.actions.length === 0) {
    return { valid: false, error: 'At least one action is required' };
  }

  // Validate each action
  for (const action of permission.actions) {
    if (!isValidAction(permission.resource, action)) {
      return { valid: false, error: `Invalid action '${action}' for resource '${permission.resource}'` };
    }
  }

  // Validate conditions if present
  if (permission.conditions) {
    const definition = ResourceDefinitions[permission.resource as keyof typeof ResourceDefinitions];
    
    // Check if conditions are allowed for this resource
    if (definition?.conditions) {
      const validConditions = definition.conditions;
      for (const key of Object.keys(permission.conditions)) {
        if (!validConditions.includes(key) && key !== 'ownRecordsOnly' && key !== 'maxValue') {
          return { valid: false, error: `Invalid condition '${key}' for resource '${permission.resource}'` };
        }
      }
    }

    // Validate maxValue is numeric
    if (permission.conditions.maxValue !== undefined) {
      if (typeof permission.conditions.maxValue !== 'number' || permission.conditions.maxValue < 0) {
        return { valid: false, error: 'maxValue must be a positive number' };
      }
    }

    // Validate ownRecordsOnly is boolean
    if (permission.conditions.ownRecordsOnly !== undefined) {
      if (typeof permission.conditions.ownRecordsOnly !== 'boolean') {
        return { valid: false, error: 'ownRecordsOnly must be a boolean' };
      }
    }
  }

  return { valid: true };
}

/**
 * Merge permissions arrays, resolving conflicts
 * Later permissions override earlier ones for same resource
 *
export function mergePermissions(base: Permission[], override: Permission[]): Permission[] {
  const merged = new Map<string, Permission>();

  // Add base permissions
  for (const perm of base) {
    merged.set(perm.resource, perm);
  }

  // Override with new permissions
  for (const perm of override) {
    const existing = merged.get(perm.resource);
    
    if (existing) {
      // Merge actions (union)
      const actions = [...new Set([...existing.actions, ...perm.actions])];
      
      // Merge conditions (override takes precedence)
      const conditions = {
        ...existing.conditions,
        ...perm.conditions
      };

      merged.set(perm.resource, {
        resource: perm.resource,
        actions,
        conditions: Object.keys(conditions).length > 0 ? conditions : undefined
      });
    } else {
      merged.set(perm.resource, perm);
    }
  }

  return Array.from(merged.values());
}

/**
 * Remove permissions from set
 *
export function removePermissions(from: Permission[], toRemove: Permission[]): Permission[] {
  const result = new Map<string, Permission>();

  // Start with existing permissions
  for (const perm of from) {
    result.set(perm.resource, perm);
  }

  // Remove specified permissions
  for (const perm of toRemove) {
    const existing = result.get(perm.resource);
    
    if (existing) {
      // Remove specified actions
      const remainingActions = existing.actions.filter(
        action => !perm.actions.includes(action)
      );

      if (remainingActions.length === 0) {
        // Remove entire permission if no actions left
        result.delete(perm.resource);
      } else {
        result.set(perm.resource, {
          ...existing,
          actions: remainingActions
        });
      }
    }
  }

  return Array.from(result.values());
}

/**
 * Get permissions for a specific role
 *
export function getDefaultPermissionsForRole(role: string): Permission[] {
  return DefaultPermissions[role as keyof typeof DefaultPermissions] || 
         DefaultPermissions.STAFF;
}

/**
 * Check if user can perform action on resource with value limit
 *
export function canPerformWithLimit(
  user: AuthContext,
  resource: string,
  action: string,
  value: number
): boolean {
  const permission = user.permissions.find(p => p.resource === resource);
  
  if (!permission) return false;
  
  // Check action
  if (!permission.actions.includes(action) && !permission.actions.includes('ADMIN')) {
    return false;
  }

  // Check value limit
  if (permission.conditions?.maxValue !== undefined) {
    return value <= permission.conditions.maxValue;
  }

  return true;
}

/**
 * Format permissions for display
 *
export function formatPermissions(permissions: Permission[]): string[] {
  return permissions.map(perm => {
    const actions = perm.actions.join(', ');
    const conditions = perm.conditions 
      ? ` (${Object.entries(perm.conditions).map(([k, v]) => `${k}: ${v}`).join(', ')})`
      : '';
    return `${perm.resource}: ${actions}${conditions}`;
  });
}

/**
 * Permission builder for fluent API
 *
export class PermissionBuilder {
  private permissions: Permission[] = [];

  add(resource: string, actions: string[], conditions?: Permission['conditions']): this {
    this.permissions.push({
      resource,
      actions,
      conditions
    });
    return this;
  }

  remove(resource: string, actions?: string[]): this {
    if (!actions) {
      // Remove entire resource
      this.permissions = this.permissions.filter(p => p.resource !== resource);
    } else {
      // Remove specific actions
      this.permissions = this.permissions.map(p => {
        if (p.resource === resource) {
          return {
            ...p,
            actions: p.actions.filter(a => !actions.includes(a))
          };
        }
        return p;
      }).filter(p => p.actions.length > 0);
    }
    return this;
  }

  build(): Permission[] {
    return mergePermissions([], this.permissions); // Clean merge to deduplicate
  }

  static create(): PermissionBuilder {
    return new PermissionBuilder();
  }
}

/**
 * Middleware helper to check specific permission with value limit
 *
export function checkValueLimit(resource: string, action: string, getValue: (req: any) => number) {
  return (user: AuthContext, request: any): boolean => {
    const value = getValue(request);
    return canPerformWithLimit(user, resource, action, value);
  };
}

/**
 * Get all resources list
 *
export function getAllResources(): string[] {
  return Object.keys(ResourceDefinitions);
}

/**
 * Check if resource exists
 *
export function resourceExists(resource: string): boolean {
  return resource in ResourceDefinitions || resource === '*';
}

/**
 * Serialize permissions for storage (remove any circular references or functions)
 *
export function serializePermissions(permissions: Permission[]): string {
  return JSON.stringify(permissions);
}

/**
 * Deserialize permissions from storage
 *
export function deserializePermissions(serialized: string): Permission[] {
  try {
    return JSON.parse(serialized);
  } catch {
    return [];
  }
}

/**
 * Compare two permission sets for equality
 *
export function permissionsEqual(a: Permission[], b: Permission[]): boolean {
  if (a.length !== b.length) return false;
  
  const sortedA = [...a].sort((x, y) => x.resource.localeCompare(y.resource));
  const sortedB = [...b].sort((x, y) => x.resource.localeCompare(y.resource));
  
  return JSON.stringify(sortedA) === JSON.stringify(sortedB);
}

/**
 * Get permission summary for audit logs
 *
export function getPermissionSummary(permissions: Permission[]): string {
  return permissions.map(p => `${p.resource}(${p.actions.length})`).join(', ');
}*/

// lib/utils/permissions.ts

/**
 * Permission Management Utilities
 * Centralized permission definitions and helper functions
 */

import { AuthContext, Permission } from '@/lib/middleware/auth';

/**
 * Permission condition types
 */
export type PermissionConditionType = 'maxValue' | 'ownRecordsOnly' | 'ownDepartmentOnly';

/**
 * Resource definition with optional conditions
 */
export interface ResourceDefinition {
  actions: string[];
  description: string;
  conditions?: PermissionConditionType[];
}

/**
 * Default permissions by role
 * Used when creating new users or resetting permissions
 */
export const DefaultPermissions: Record<string, Permission[]> = {
  ADMIN: [
    { resource: '*', actions: ['*'] } // Full access to everything
  ],
  
  MANAGER: [
    { resource: 'STAFF', actions: ['READ', 'CREATE', 'UPDATE'] },
    { resource: 'USERS', actions: ['READ', 'UPDATE'] },
    { resource: 'INVENTORY', actions: ['READ', 'CREATE', 'UPDATE', 'DELETE'] },
    { resource: 'ORDERS', actions: ['READ', 'CREATE', 'UPDATE', 'DELETE'] },
    { resource: 'REPORTS', actions: ['READ', 'CREATE'] },
    { resource: 'SETTINGS', actions: ['READ', 'UPDATE'] },
    { resource: 'SECURITY_LOG', actions: ['READ'] }
  ],
  
  SUPERVISOR: [
    { resource: 'STAFF', actions: ['READ'], conditions: { ownDepartmentOnly: true } },
    { resource: 'INVENTORY', actions: ['READ', 'UPDATE'] },
    { resource: 'ORDERS', actions: ['READ', 'CREATE', 'UPDATE'] },
    { resource: 'REPORTS', actions: ['READ'] }
  ],
  
  STAFF: [
    { resource: 'INVENTORY', actions: ['READ'] },
    { resource: 'ORDERS', actions: ['READ', 'CREATE'], conditions: { ownRecordsOnly: true } },
    { resource: 'CUSTOMERS', actions: ['READ', 'CREATE'] }
  ],
  
  INTERN: [
    { resource: 'INVENTORY', actions: ['READ'] },
    { resource: 'ORDERS', actions: ['READ'] }
  ]
};

/**
 * Resource definitions with available actions
 */
export const ResourceDefinitions: Record<string, ResourceDefinition> = {
  STAFF: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ADMIN'],
    description: 'Staff management'
  },
  USERS: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ADMIN'],
    description: 'User account management'
  },
  INVENTORY: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ADMIN'],
    description: 'Inventory and products'
  },
  ORDERS: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ADMIN'],
    description: 'Order management'
  },
  CUSTOMERS: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
    description: 'Customer management'
  },
  REPORTS: {
    actions: ['READ', 'CREATE', 'EXPORT'],
    description: 'Reports and analytics'
  },
  SETTINGS: {
    actions: ['READ', 'UPDATE', 'ADMIN'],
    description: 'System settings'
  },
  SECURITY_LOG: {
    actions: ['READ', 'UPDATE', 'ACKNOWLEDGE', 'ADMIN'],
    description: 'Security audit logs'
  },
  FINANCE: {
    actions: ['READ', 'CREATE', 'UPDATE', 'APPROVE', 'ADMIN'],
    description: 'Financial operations',
    conditions: ['maxValue']
  },
  VENDORS: {
    actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE'],
    description: 'Vendor management'
  }
};

/**
 * Type guard to check if resource definition has conditions
 */
function hasConditions(definition: ResourceDefinition | undefined): definition is ResourceDefinition & { conditions: PermissionConditionType[] } {
  return !!definition && Array.isArray(definition.conditions) && definition.conditions.length > 0;
}

/**
 * Check if action is valid for resource
 */
export function isValidAction(resource: string, action: string): boolean {
  const definition = ResourceDefinitions[resource];
  if (!definition) return false;
  return definition.actions.includes(action) || action === '*';
}

/**
 * Get available actions for a resource
 */
export function getAvailableActions(resource: string): string[] {
  const definition = ResourceDefinitions[resource];
  return definition?.actions || [];
}

/**
 * Get allowed conditions for a resource
 */
export function getAllowedConditions(resource: string): PermissionConditionType[] {
  const definition = ResourceDefinitions[resource];
  return definition?.conditions || [];
}

/**
 * Validate permission structure
 */
export function validatePermission(permission: Permission): { valid: boolean; error?: string } {
  // Check resource exists
  if (!permission.resource) {
    return { valid: false, error: 'Resource is required' };
  }

  // Check actions exist
  if (!permission.actions || !Array.isArray(permission.actions) || permission.actions.length === 0) {
    return { valid: false, error: 'At least one action is required' };
  }

  // Validate each action
  for (const action of permission.actions) {
    if (!isValidAction(permission.resource, action)) {
      return { valid: false, error: `Invalid action '${action}' for resource '${permission.resource}'` };
    }
  }

  // Validate conditions if present
  if (permission.conditions) {
    const definition = ResourceDefinitions[permission.resource];
    
    // Check if conditions are allowed for this resource
    if (hasConditions(definition)) {
      const validConditions = definition.conditions;
      for (const key of Object.keys(permission.conditions)) {
        if (!validConditions.includes(key as PermissionConditionType) && 
            !['ownRecordsOnly', 'maxValue', 'ownDepartmentOnly'].includes(key)) {
          return { valid: false, error: `Invalid condition '${key}' for resource '${permission.resource}'` };
        }
      }
    }

    // Validate maxValue is numeric
    if (permission.conditions.maxValue !== undefined) {
      if (typeof permission.conditions.maxValue !== 'number' || permission.conditions.maxValue < 0) {
        return { valid: false, error: 'maxValue must be a positive number' };
      }
    }

    // Validate ownRecordsOnly is boolean
    if (permission.conditions.ownRecordsOnly !== undefined) {
      if (typeof permission.conditions.ownRecordsOnly !== 'boolean') {
        return { valid: false, error: 'ownRecordsOnly must be a boolean' };
      }
    }

    // Validate ownDepartmentOnly is boolean
    if (permission.conditions.ownDepartmentOnly !== undefined) {
      if (typeof permission.conditions.ownDepartmentOnly !== 'boolean') {
        return { valid: false, error: 'ownDepartmentOnly must be a boolean' };
      }
    }
  }

  return { valid: true };
}

/**
 * Merge permissions arrays, resolving conflicts
 * Later permissions override earlier ones for same resource
 */
export function mergePermissions(base: Permission[], override: Permission[]): Permission[] {
  const merged = new Map<string, Permission>();

  // Add base permissions
  for (const perm of base) {
    merged.set(perm.resource, perm);
  }

  // Override with new permissions
  for (const perm of override) {
    const existing = merged.get(perm.resource);
    
    if (existing) {
      // Merge actions (union)
      const actions = [...new Set([...existing.actions, ...perm.actions])];
      
      // Merge conditions (override takes precedence)
      const conditions = {
        ...existing.conditions,
        ...perm.conditions
      };

      merged.set(perm.resource, {
        resource: perm.resource,
        actions,
        conditions: Object.keys(conditions).length > 0 ? conditions : undefined
      });
    } else {
      merged.set(perm.resource, perm);
    }
  }

  return Array.from(merged.values());
}

/**
 * Remove permissions from set
 */
export function removePermissions(from: Permission[], toRemove: Permission[]): Permission[] {
  const result = new Map<string, Permission>();

  // Start with existing permissions
  for (const perm of from) {
    result.set(perm.resource, perm);
  }

  // Remove specified permissions
  for (const perm of toRemove) {
    const existing = result.get(perm.resource);
    
    if (existing) {
      // Remove specified actions
      const remainingActions = existing.actions.filter(
        action => !perm.actions.includes(action)
      );

      if (remainingActions.length === 0) {
        // Remove entire permission if no actions left
        result.delete(perm.resource);
      } else {
        result.set(perm.resource, {
          ...existing,
          actions: remainingActions
        });
      }
    }
  }

  return Array.from(result.values());
}

/**
 * Get permissions for a specific role
 */
export function getDefaultPermissionsForRole(role: string): Permission[] {
  return DefaultPermissions[role] || DefaultPermissions.STAFF;
}

/**
 * Check if user can perform action on resource with value limit
 */
export function canPerformWithLimit(
  user: AuthContext,
  resource: string,
  action: string,
  value: number
): boolean {
  const permission = user.permissions.find(p => p.resource === resource);
  
  if (!permission) return false;
  
  // Check action
  if (!permission.actions.includes(action) && !permission.actions.includes('ADMIN') && !permission.actions.includes('*')) {
    return false;
  }

  // Check value limit
  if (permission.conditions?.maxValue !== undefined) {
    return value <= permission.conditions.maxValue;
  }

  return true;
}

/**
 * Format permissions for display
 */
export function formatPermissions(permissions: Permission[]): string[] {
  return permissions.map(perm => {
    const actions = perm.actions.join(', ');
    const conditions = perm.conditions 
      ? ` (${Object.entries(perm.conditions).map(([k, v]) => `${k}: ${v}`).join(', ')})`
      : '';
    return `${perm.resource}: ${actions}${conditions}`;
  });
}

/**
 * Permission builder for fluent API
 */
export class PermissionBuilder {
  private permissions: Permission[] = [];

  add(resource: string, actions: string[], conditions?: Permission['conditions']): this {
    // Validate permission before adding
    const validation = validatePermission({ resource, actions, conditions });
    if (!validation.valid) {
      throw new Error(`Invalid permission: ${validation.error}`);
    }

    this.permissions.push({
      resource,
      actions,
      conditions
    });
    return this;
  }

  remove(resource: string, actions?: string[]): this {
    if (!actions) {
      // Remove entire resource
      this.permissions = this.permissions.filter(p => p.resource !== resource);
    } else {
      // Remove specific actions
      this.permissions = this.permissions.map(p => {
        if (p.resource === resource) {
          return {
            ...p,
            actions: p.actions.filter(a => !actions.includes(a))
          };
        }
        return p;
      }).filter(p => p.actions.length > 0);
    }
    return this;
  }

  build(): Permission[] {
    return mergePermissions([], this.permissions); // Clean merge to deduplicate
  }

  static create(): PermissionBuilder {
    return new PermissionBuilder();
  }
}

/**
 * Middleware helper to check specific permission with value limit
 */
export function checkValueLimit(resource: string, action: string, getValue: (req: any) => number) {
  return (user: AuthContext, request: any): boolean => {
    const value = getValue(request);
    return canPerformWithLimit(user, resource, action, value);
  };
}

/**
 * Get all resources list
 */
export function getAllResources(): string[] {
  return Object.keys(ResourceDefinitions);
}

/**
 * Check if resource exists
 */
export function resourceExists(resource: string): boolean {
  return resource in ResourceDefinitions || resource === '*';
}

/**
 * Serialize permissions for storage (remove any circular references or functions)
 */
export function serializePermissions(permissions: Permission[]): string {
  return JSON.stringify(permissions);
}

/**
 * Deserialize permissions from storage
 */
export function deserializePermissions(serialized: string): Permission[] {
  try {
    return JSON.parse(serialized);
  } catch {
    return [];
  }
}

/**
 * Compare two permission sets for equality
 */
export function permissionsEqual(a: Permission[], b: Permission[]): boolean {
  if (a.length !== b.length) return false;
  
  const sortedA = [...a].sort((x, y) => x.resource.localeCompare(y.resource));
  const sortedB = [...b].sort((x, y) => x.resource.localeCompare(y.resource));
  
  return JSON.stringify(sortedA) === JSON.stringify(sortedB);
}

/**
 * Get permission summary for audit logs
 */
export function getPermissionSummary(permissions: Permission[]): string {
  return permissions.map(p => `${p.resource}(${p.actions.length})`).join(', ');
}

/**
 * Check if user has specific permission with context
 */
export function checkPermission(
  user: AuthContext,
  resource: string,
  action: string,
  context?: { value?: number; isOwner?: boolean; departmentId?: string; [key: string]: any }
): boolean {
  // Admin has all permissions
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return true;
  }

  // Find permission for resource
  const permission = user.permissions.find((p: Permission) => p.resource === resource);
  
  if (!permission) {
    return false;
  }

  // Check if action is allowed
  const hasAction = permission.actions.includes(action) || 
                   permission.actions.includes('ADMIN') ||
                   permission.actions.includes('*');

  if (!hasAction) {
    return false;
  }

  // Check conditions if present
  if (permission.conditions && context) {
    // Check max value limit
    if (permission.conditions.maxValue !== undefined && context.value !== undefined) {
      if (context.value > permission.conditions.maxValue) {
        return false;
      }
    }

    // Check owner-only restriction
    if (permission.conditions.ownRecordsOnly === true && context.isOwner === false) {
      return false;
    }

    // Check department-only restriction
    if (permission.conditions.ownDepartmentOnly === true && context.departmentId !== undefined) {
      // This would need user's department information to fully implement
      // For now, it's a placeholder for department-based access control
      return false;
    }

    // Check custom conditions
    for (const [key, conditionValue] of Object.entries(permission.conditions)) {
      if (key === 'maxValue' || key === 'ownRecordsOnly' || key === 'ownDepartmentOnly') continue;
      
      const contextValue = context[key];
      if (contextValue !== undefined && contextValue !== conditionValue) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Filter permissions by resource
 */
export function filterPermissionsByResource(permissions: Permission[], resource: string): Permission[] {
  return permissions.filter(p => p.resource === resource || p.resource === '*');
}

/**
 * Filter permissions by action
 */
export function filterPermissionsByAction(permissions: Permission[], action: string): Permission[] {
  return permissions.filter(p => 
    p.actions.includes(action) || p.actions.includes('*') || p.actions.includes('ADMIN')
  );
}