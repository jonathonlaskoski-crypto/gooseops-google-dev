// GooseOps Platform Permissions System
// Three-tier platform: Field Tech, Office Manager, Full Access

export type UserRole = 'field-tech' | 'office-manager' | 'full-access'

export interface FeaturePermissions {
  ai: {
    basicAssistance: boolean
    officeAssistance: boolean
    neuralEmpire: boolean
    jarvisAI: boolean
    aresAI: boolean
    nextGenAI: boolean
    predictiveIntelligence: boolean
    missionIntelligence: boolean
  }
  analytics: {
    jobReports: boolean
    teamReports: boolean
    performanceMetrics: boolean
    enterpriseAnalytics: boolean
    realTimeBroadcasting: boolean
    missionIntelligence: boolean
  }
  collaboration: {
    teamChat: boolean
    teamManagement: boolean
    customerCommunication: boolean
    realTimeBroadcasting: boolean
    missionTemplates: boolean
    multiTeamCoordination: boolean
  }
  integrations: {
    basicSync: boolean
    officeIntegrations: boolean
    microsoft365: boolean
    supabase: boolean
    communicationLanes: boolean
    allIntegrations: boolean
  }
  system: {
    jobManagement: boolean
    equipmentManagement: boolean
    timeTracking: boolean
    photoDocumentation: boolean
    locationServices: boolean
    offlineSync: boolean
    systemControl: boolean
    evolution: boolean
    gamechanging: boolean
  }
}

export interface PlatformConfig {
  role: UserRole
  permissions: FeaturePermissions
  features: string[]
  restrictions: string[]
  theme: 'lite' | 'office' | 'full'
  branding: 'gooseops-lite' | 'gooseops-office' | 'gooseops-full'
}

export class PlatformPermissionManager {
  private static instance: PlatformPermissionManager
  private currentRole: UserRole = 'field-tech'
  private configs: Map<UserRole, PlatformConfig> = new Map()

  constructor() {
    this.initializeConfigs()
  }

  static getInstance(): PlatformPermissionManager {
    if (!PlatformPermissionManager.instance) {
      PlatformPermissionManager.instance = new PlatformPermissionManager()
    }
    return PlatformPermissionManager.instance
  }

  private initializeConfigs() {
    // Field Tech Platform (GooseOps Lite)
    this.configs.set('field-tech', {
      role: 'field-tech',
      permissions: {
        ai: {
          basicAssistance: true,
          officeAssistance: false,
          neuralEmpire: false,
          jarvisAI: false,
          aresAI: false,
          nextGenAI: false,
          predictiveIntelligence: false,
          missionIntelligence: false
        },
        analytics: {
          jobReports: true,
          teamReports: false,
          performanceMetrics: false,
          enterpriseAnalytics: false,
          realTimeBroadcasting: false,
          missionIntelligence: false
        },
        collaboration: {
          teamChat: true,
          teamManagement: false,
          customerCommunication: false,
          realTimeBroadcasting: false,
          missionTemplates: false,
          multiTeamCoordination: false
        },
        integrations: {
          basicSync: true,
          officeIntegrations: false,
          microsoft365: false,
          supabase: false,
          communicationLanes: false,
          allIntegrations: false
        },
        system: {
          jobManagement: true,
          equipmentManagement: true,
          timeTracking: true,
          photoDocumentation: true,
          locationServices: true,
          offlineSync: true,
          systemControl: false,
          evolution: false,
          gamechanging: false
        }
      },
      features: [
        'job-management',
        'task-tracking',
        'photo-capture',
        'gps-tracking',
        'offline-sync',
        'basic-ai',
        'team-chat',
        'equipment-management',
        'time-tracking'
      ],
      restrictions: [
        'enterprise-features',
        'advanced-ai',
        'system-control',
        'evolution',
        'gamechanging'
      ],
      theme: 'lite',
      branding: 'gooseops-lite'
    })

    // Office Manager Platform (GooseOps Office)
    this.configs.set('office-manager', {
      role: 'office-manager',
      permissions: {
        ai: {
          basicAssistance: true,
          officeAssistance: true,
          neuralEmpire: false,
          jarvisAI: false,
          aresAI: false,
          nextGenAI: false,
          predictiveIntelligence: false,
          missionIntelligence: false
        },
        analytics: {
          jobReports: true,
          teamReports: true,
          performanceMetrics: true,
          enterpriseAnalytics: false,
          realTimeBroadcasting: false,
          missionIntelligence: false
        },
        collaboration: {
          teamChat: true,
          teamManagement: true,
          customerCommunication: true,
          realTimeBroadcasting: false,
          missionTemplates: false,
          multiTeamCoordination: false
        },
        integrations: {
          basicSync: true,
          officeIntegrations: true,
          microsoft365: false,
          supabase: false,
          communicationLanes: false,
          allIntegrations: false
        },
        system: {
          jobManagement: true,
          equipmentManagement: true,
          timeTracking: true,
          photoDocumentation: true,
          locationServices: true,
          offlineSync: true,
          systemControl: false,
          evolution: false,
          gamechanging: false
        }
      },
      features: [
        'job-management',
        'task-tracking',
        'team-management',
        'customer-communication',
        'performance-reports',
        'office-integrations',
        'scheduling',
        'resource-allocation',
        'kpi-tracking'
      ],
      restrictions: [
        'neural-empire',
        'advanced-ai',
        'system-control',
        'evolution',
        'gamechanging',
        'real-time-broadcasting'
      ],
      theme: 'office',
      branding: 'gooseops-office'
    })

    // Full Access Platform (GooseOps Full)
    this.configs.set('full-access', {
      role: 'full-access',
      permissions: {
        ai: {
          basicAssistance: true,
          officeAssistance: true,
          neuralEmpire: true,
          jarvisAI: true,
          aresAI: true,
          nextGenAI: true,
          predictiveIntelligence: true,
          missionIntelligence: true
        },
        analytics: {
          jobReports: true,
          teamReports: true,
          performanceMetrics: true,
          enterpriseAnalytics: true,
          realTimeBroadcasting: true,
          missionIntelligence: true
        },
        collaboration: {
          teamChat: true,
          teamManagement: true,
          customerCommunication: true,
          realTimeBroadcasting: true,
          missionTemplates: true,
          multiTeamCoordination: true
        },
        integrations: {
          basicSync: true,
          officeIntegrations: true,
          microsoft365: true,
          supabase: true,
          communicationLanes: true,
          allIntegrations: true
        },
        system: {
          jobManagement: true,
          equipmentManagement: true,
          timeTracking: true,
          photoDocumentation: true,
          locationServices: true,
          offlineSync: true,
          systemControl: true,
          evolution: true,
          gamechanging: true
        }
      },
      features: [
        'job-management',
        'task-tracking',
        'neural-empire',
        'jarvis-ai',
        'ares-ai',
        'nextgen-ai',
        'predictive-intelligence',
        'mission-intelligence',
        'enterprise-analytics',
        'real-time-broadcasting',
        'mission-templates',
        'multi-team-coordination',
        'microsoft-365',
        'supabase',
        'communication-lanes',
        'system-control',
        'evolution',
        'gamechanging'
      ],
      restrictions: [],
      theme: 'full',
      branding: 'gooseops-full'
    })
  }

  setRole(role: UserRole) {
    this.currentRole = role
  }

  getCurrentRole(): UserRole {
    return this.currentRole
  }

  getCurrentConfig(): PlatformConfig {
    return this.configs.get(this.currentRole)!
  }

  hasPermission(feature: string): boolean {
    const config = this.getCurrentConfig()
    return config.features.includes(feature)
  }

  isRestricted(feature: string): boolean {
    const config = this.getCurrentConfig()
    return config.restrictions.includes(feature)
  }

  canAccess(feature: string): boolean {
    return this.hasPermission(feature) && !this.isRestricted(feature)
  }

  getAvailableFeatures(): string[] {
    const config = this.getCurrentConfig()
    return config.features
  }

  getRestrictedFeatures(): string[] {
    const config = this.getCurrentConfig()
    return config.restrictions
  }

  getTheme(): 'lite' | 'office' | 'full' {
    const config = this.getCurrentConfig()
    return config.theme
  }

  getBranding(): 'gooseops-lite' | 'gooseops-office' | 'gooseops-full' {
    const config = this.getCurrentConfig()
    return config.branding
  }

  // Feature-specific permission checks
  canAccessAI(feature: keyof FeaturePermissions['ai']): boolean {
    const config = this.getCurrentConfig()
    return config.permissions.ai[feature]
  }

  canAccessAnalytics(feature: keyof FeaturePermissions['analytics']): boolean {
    const config = this.getCurrentConfig()
    return config.permissions.analytics[feature]
  }

  canAccessCollaboration(feature: keyof FeaturePermissions['collaboration']): boolean {
    const config = this.getCurrentConfig()
    return config.permissions.collaboration[feature]
  }

  canAccessIntegrations(feature: keyof FeaturePermissions['integrations']): boolean {
    const config = this.getCurrentConfig()
    return config.permissions.integrations[feature]
  }

  canAccessSystem(feature: keyof FeaturePermissions['system']): boolean {
    const config = this.getCurrentConfig()
    return config.permissions.system[feature]
  }

  // Platform-specific UI helpers
  shouldShowFeature(feature: string): boolean {
    return this.canAccess(feature)
  }

  shouldHideFeature(feature: string): boolean {
    return !this.canAccess(feature)
  }

  getFeatureClassName(feature: string): string {
    if (this.canAccess(feature)) {
      return 'feature-enabled'
    } else {
      return 'feature-disabled'
    }
  }

  // Platform-specific styling
  getPlatformStyles(): Record<string, string> {
    const theme = this.getTheme()
    const branding = this.getBranding()

    const baseStyles = {
      '--platform-theme': theme,
      '--platform-branding': branding
    }

    switch (theme) {
      case 'lite':
        return {
          ...baseStyles,
          '--primary-color': '#3b82f6',
          '--secondary-color': '#64748b',
          '--accent-color': '#10b981',
          '--background-color': '#ffffff',
          '--text-color': '#1f2937'
        }
      case 'office':
        return {
          ...baseStyles,
          '--primary-color': '#6366f1',
          '--secondary-color': '#8b5cf6',
          '--accent-color': '#f59e0b',
          '--background-color': '#f8fafc',
          '--text-color': '#334155'
        }
      case 'full':
        return {
          ...baseStyles,
          '--primary-color': '#00ff88',
          '--secondary-color': '#0066cc',
          '--accent-color': '#ff6600',
          '--background-color': '#000000',
          '--text-color': '#ffffff'
        }
      default:
        return baseStyles
    }
  }
}

// Export singleton instance
export const platformPermissions = PlatformPermissionManager.getInstance()

// Export convenience functions
export const usePlatformPermissions = () => {
  return platformPermissions
}

export const hasPermission = (feature: string) => {
  return platformPermissions.hasPermission(feature)
}

export const canAccess = (feature: string) => {
  return platformPermissions.canAccess(feature)
}

export const shouldShowFeature = (feature: string) => {
  return platformPermissions.shouldShowFeature(feature)
}

export const shouldHideFeature = (feature: string) => {
  return platformPermissions.shouldHideFeature(feature)
}

export default platformPermissions
