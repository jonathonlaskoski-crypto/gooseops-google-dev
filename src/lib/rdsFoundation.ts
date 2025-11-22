// RDS Foundation - Retail Dispense Solutions Core System
// Stable foundation for GooseOps Lite with scope-specific AI modules

export interface RDSModule {
  id: string
  name: string
  version: string
  description: string
  category: 'core' | 'ai-scope' | 'utility' | 'integration'
  component: React.ComponentType<any>
  dependencies: string[]
  permissions: string[]
  isActive: boolean
  isRequired: boolean
  scope: 'beverage' | 'hvac' | 'electrical' | 'general' | 'all'
  aiCapabilities: string[]
  config?: Record<string, any>
}

export interface RDSFoundation {
  modules: Map<string, RDSModule>
  activeModules: Set<string>
  scopeModules: Map<string, RDSModule[]>
  loadModule: (moduleId: string) => Promise<void>
  unloadModule: (moduleId: string) => Promise<void>
  getModule: (moduleId: string) => RDSModule | undefined
  getActiveModules: () => RDSModule[]
  getModulesByScope: (scope: string) => RDSModule[]
  getAIModules: () => RDSModule[]
}

export interface RDSConfig {
  baseUrl: string
  storageKey: string
  permissions: string[]
  scopes: string[]
  aiProviders: string[]
}

// Core RDS modules that are always loaded
export const RDS_CORE_MODULES: RDSModule[] = [
  {
    id: 'rds-auth',
    name: 'RDS Authentication',
    version: '1.0.0',
    description: 'User authentication and role management for RDS operations',
    category: 'core',
    component: () => null,
    dependencies: [],
    permissions: ['auth:read', 'auth:write'],
    isActive: true,
    isRequired: true,
    scope: 'all',
    aiCapabilities: []
  },
  {
    id: 'rds-job-management',
    name: 'RDS Job Management',
    version: '1.0.0',
    description: 'Core job management for retail dispense solutions',
    category: 'core',
    component: () => null,
    dependencies: ['rds-auth'],
    permissions: ['jobs:read', 'jobs:write'],
    isActive: true,
    isRequired: true,
    scope: 'all',
    aiCapabilities: []
  },
  {
    id: 'rds-field-sync',
    name: 'RDS Field Sync',
    version: '1.0.0',
    description: 'Offline-first synchronization for field operations',
    category: 'core',
    component: () => null,
    dependencies: ['rds-auth', 'rds-job-management'],
    permissions: ['sync:read', 'sync:write'],
    isActive: true,
    isRequired: true,
    scope: 'all',
    aiCapabilities: []
  },
  {
    id: 'rds-mission-intelligence',
    name: 'RDS Mission Intelligence',
    version: '1.0.0',
    description: 'Central data model for RDS operations',
    category: 'core',
    component: () => null,
    dependencies: ['rds-auth', 'rds-job-management'],
    permissions: ['intelligence:read', 'intelligence:write'],
    isActive: true,
    isRequired: true,
    scope: 'all',
    aiCapabilities: []
  }
]

// Scope-specific AI modules
export const RDS_AI_MODULES: RDSModule[] = [
  {
    id: 'ai-beverage-expert',
    name: 'Beverage AI Expert',
    version: '1.0.0',
    description: 'AI assistant specialized in beverage equipment and installations',
    category: 'ai-scope',
    component: () => null,
    dependencies: ['rds-auth', 'rds-mission-intelligence'],
    permissions: ['ai:read', 'ai:write'],
    isActive: false,
    isRequired: false,
    scope: 'beverage',
    aiCapabilities: [
      'equipment-identification',
      'installation-guidance',
      'troubleshooting',
      'maintenance-scheduling',
      'parts-recommendation'
    ]
  },
  {
    id: 'ai-hvac-expert',
    name: 'HVAC AI Expert',
    version: '1.0.0',
    description: 'AI assistant specialized in HVAC-R systems and refrigeration',
    category: 'ai-scope',
    component: () => null,
    dependencies: ['rds-auth', 'rds-mission-intelligence'],
    permissions: ['ai:read', 'ai:write'],
    isActive: false,
    isRequired: false,
    scope: 'hvac',
    aiCapabilities: [
      'system-diagnosis',
      'energy-optimization',
      'refrigerant-management',
      'climate-control',
      'emergency-repair'
    ]
  },
  {
    id: 'ai-electrical-expert',
    name: 'Electrical AI Expert',
    version: '1.0.0',
    description: 'AI assistant specialized in electrical systems and power management',
    category: 'ai-scope',
    component: () => null,
    dependencies: ['rds-auth', 'rds-mission-intelligence'],
    permissions: ['ai:read', 'ai:write'],
    isActive: false,
    isRequired: false,
    scope: 'electrical',
    aiCapabilities: [
      'circuit-analysis',
      'power-optimization',
      'safety-compliance',
      'load-calculation',
      'wiring-diagrams'
    ]
  },
  {
    id: 'ai-general-expert',
    name: 'General AI Expert',
    version: '1.0.0',
    description: 'General-purpose AI assistant for RDS operations',
    category: 'ai-scope',
    component: () => null,
    dependencies: ['rds-auth', 'rds-mission-intelligence'],
    permissions: ['ai:read', 'ai:write'],
    isActive: false,
    isRequired: false,
    scope: 'general',
    aiCapabilities: [
      'general-guidance',
      'documentation-help',
      'customer-communication',
      'scheduling-optimization',
      'quality-assurance'
    ]
  }
]

// Utility modules
export const RDS_UTILITY_MODULES: RDSModule[] = [
  {
    id: 'rds-camera',
    name: 'RDS Camera System',
    version: '1.0.0',
    description: 'High-quality photo capture with AI analysis',
    category: 'utility',
    component: () => null,
    dependencies: ['rds-auth'],
    permissions: ['camera:read', 'camera:write'],
    isActive: false,
    isRequired: false,
    scope: 'all',
    aiCapabilities: ['image-analysis', 'quality-detection', 'equipment-recognition']
  },
  {
    id: 'rds-navigation',
    name: 'RDS Navigation',
    version: '1.0.0',
    description: 'GPS navigation and route optimization',
    category: 'utility',
    component: () => null,
    dependencies: ['rds-auth', 'rds-job-management'],
    permissions: ['navigation:read'],
    isActive: false,
    isRequired: false,
    scope: 'all',
    aiCapabilities: ['route-optimization', 'traffic-analysis', 'eta-calculation']
  },
  {
    id: 'rds-communication',
    name: 'RDS Communication',
    version: '1.0.0',
    description: 'Real-time communication and messaging',
    category: 'utility',
    component: () => null,
    dependencies: ['rds-auth'],
    permissions: ['communication:read', 'communication:write'],
    isActive: false,
    isRequired: false,
    scope: 'all',
    aiCapabilities: ['message-translation', 'sentiment-analysis', 'auto-responses']
  }
]

export class RDSFoundationManager implements RDSFoundation {
  public modules: Map<string, RDSModule> = new Map()
  public activeModules: Set<string> = new Set()
  public scopeModules: Map<string, RDSModule[]> = new Map()
  private config: RDSConfig

  constructor(config: RDSConfig) {
    this.config = config
    this.initializeCoreModules()
    this.initializeScopeModules()
  }

  private initializeCoreModules() {
    // Load core RDS modules
    RDS_CORE_MODULES.forEach(module => {
      this.modules.set(module.id, module)
      if (module.isRequired) {
        this.activeModules.add(module.id)
      }
    })
  }

  private initializeScopeModules() {
    // Initialize scope modules map
    this.config.scopes.forEach(scope => {
      this.scopeModules.set(scope, [])
    })

    // Add AI modules to their respective scopes
    RDS_AI_MODULES.forEach(module => {
      this.modules.set(module.id, module)
      if (module.scope !== 'all') {
        const scopeModules = this.scopeModules.get(module.scope) || []
        scopeModules.push(module)
        this.scopeModules.set(module.scope, scopeModules)
      }
    })

    // Add utility modules
    RDS_UTILITY_MODULES.forEach(module => {
      this.modules.set(module.id, module)
    })
  }

  async loadModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId)
    if (!module) {
      throw new Error(`RDS Module ${moduleId} not found`)
    }

    // Check dependencies
    for (const depId of module.dependencies) {
      if (!this.activeModules.has(depId)) {
        throw new Error(`Dependency ${depId} not loaded for module ${moduleId}`)
      }
    }

    // Load module
    this.activeModules.add(moduleId)
    module.isActive = true

    // Save to localStorage
    this.saveModuleState()
  }

  async unloadModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId)
    if (!module) {
      throw new Error(`RDS Module ${moduleId} not found`)
    }

    if (module.isRequired) {
      throw new Error(`Cannot unload required module ${moduleId}`)
    }

    // Check if other modules depend on this one
    for (const [id, mod] of this.modules) {
      if (mod.dependencies.includes(moduleId) && this.activeModules.has(id)) {
        throw new Error(`Cannot unload ${moduleId} - required by ${id}`)
      }
    }

    // Unload module
    this.activeModules.delete(moduleId)
    module.isActive = false

    // Save to localStorage
    this.saveModuleState()
  }

  getModule(moduleId: string): RDSModule | undefined {
    return this.modules.get(moduleId)
  }

  getActiveModules(): RDSModule[] {
    return Array.from(this.activeModules)
      .map(id => this.modules.get(id))
      .filter((module): module is RDSModule => module !== undefined)
  }

  getModulesByScope(scope: string): RDSModule[] {
    return this.scopeModules.get(scope) || []
  }

  getAIModules(): RDSModule[] {
    return Array.from(this.modules.values())
      .filter(module => module.category === 'ai-scope')
  }

  getActiveAIModules(): RDSModule[] {
    return this.getAIModules()
      .filter(module => module.isActive)
  }

  getModulesForScope(scope: string): RDSModule[] {
    const scopeModules = this.getModulesByScope(scope)
    const generalModules = this.getModulesByScope('general')
    const allModules = this.modules.values()
    
    return [
      ...scopeModules,
      ...generalModules,
      ...Array.from(allModules).filter(module => module.scope === 'all')
    ]
  }

  private saveModuleState() {
    const state = {
      activeModules: Array.from(this.activeModules),
      timestamp: Date.now(),
      version: '1.0.0'
    }
    localStorage.setItem(this.config.storageKey, JSON.stringify(state))
  }

  loadModuleState() {
    try {
      const state = localStorage.getItem(this.config.storageKey)
      if (state) {
        const parsed = JSON.parse(state)
        // Only load modules that are still available
        parsed.activeModules.forEach((moduleId: string) => {
          if (this.modules.has(moduleId)) {
            this.activeModules.add(moduleId)
            const module = this.modules.get(moduleId)!
            module.isActive = true
          }
        })
      }
    } catch (error) {
      console.error('Failed to load RDS module state:', error)
    }
  }

  // Get AI capabilities for a specific scope
  getAICapabilitiesForScope(scope: string): string[] {
    const modules = this.getModulesForScope(scope)
    const capabilities = new Set<string>()
    
    modules.forEach(module => {
      module.aiCapabilities.forEach(capability => {
        capabilities.add(capability)
      })
    })
    
    return Array.from(capabilities)
  }

  // Check if a scope has specific AI capability
  hasAICapability(scope: string, capability: string): boolean {
    const capabilities = this.getAICapabilitiesForScope(scope)
    return capabilities.includes(capability)
  }
}

// Create global RDS foundation manager
export const rdsFoundation = new RDSFoundationManager({
  baseUrl: '/rds-modules',
  storageKey: 'rds-foundation-modules',
  permissions: ['auth:read', 'auth:write', 'jobs:read', 'jobs:write'],
  scopes: ['beverage', 'hvac', 'electrical', 'general'],
  aiProviders: ['azure-openai', 'ollama', 'local']
})

// Initialize with saved state
rdsFoundation.loadModuleState()

export default rdsFoundation
