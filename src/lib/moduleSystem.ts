// GooseOps Lite Module System
// Stable base system with pluggable modules for scope-specific functionality

import React from 'react';

export interface Module {
  id: string
  name: string
  version: string
  description: string
  category: 'core' | 'scope' | 'ai' | 'utility'
  component: React.ComponentType<any>
  dependencies: string[]
  permissions: string[]
  isActive: boolean
  isRequired: boolean
  config?: Record<string, any>
}

export interface ModuleRegistry {
  modules: Map<string, Module>
  activeModules: Set<string>
  loadModule: (moduleId: string) => Promise<void>
  unloadModule: (moduleId: string) => Promise<void>
  getModule: (moduleId: string) => Module | undefined
  getActiveModules: () => Module[]
  getModulesByCategory: (category: string) => Module[]
}

export interface ModuleConfig {
  baseUrl: string
  storageKey: string
  permissions: string[]
  categories: string[]
}

// Core modules that are always loaded
export const CORE_MODULES: Module[] = [
  {
    id: 'auth',
    name: 'Authentication',
    version: '1.0.0',
    description: 'User authentication and role management',
    category: 'core',
    component: () => null, // Will be replaced with actual component
    dependencies: [],
    permissions: ['auth:read', 'auth:write'],
    isActive: true,
    isRequired: true
  },
  {
    id: 'job-management',
    name: 'Job Management',
    version: '1.0.0',
    description: 'Core job management functionality',
    category: 'core',
    component: () => null,
    dependencies: ['auth'],
    permissions: ['jobs:read', 'jobs:write'],
    isActive: true,
    isRequired: true
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    version: '1.0.0',
    description: 'Super ARES AI agent for field support',
    category: 'core',
    component: () => null,
    dependencies: ['auth'],
    permissions: ['ai:read', 'ai:write'],
    isActive: true,
    isRequired: true
  }
]

// Scope-specific modules that can be loaded as needed
export const SCOPE_MODULES: Module[] = [
  {
    id: 'lead-generation',
    name: 'Lead Generation Engine',
    version: '1.0.0',
    description: 'AI-powered lead discovery and qualification for beverage industry',
    category: 'scope',
    component: React.lazy(() => import('@/components/modules/BusinessCoreModules').then(m => ({ default: m.LeadGenerationModule }))),
    dependencies: ['auth', 'ai-assistant'],
    permissions: ['leads:read', 'leads:write', 'leads:generate'],
    isActive: false,
    isRequired: false
  },
  {
    id: 'power-automate',
    name: 'Power Automate Integration',
    version: '1.0.0',
    description: 'Seamless Microsoft Power Platform automation for workflows',
    category: 'scope',
    component: React.lazy(() => import('@/components/modules/BusinessCoreModules').then(m => ({ default: m.PowerAutomateModule }))),
    dependencies: ['auth'],
    permissions: ['automate:read', 'automate:write', 'automate:connect'],
    isActive: false,
    isRequired: false
  },
  {
    id: 'data-farming',
    name: 'Data Farming Engine',
    version: '1.0.0',
    description: 'Intelligent data collection and enrichment from multiple sources',
    category: 'scope',
    component: React.lazy(() => import('@/components/modules/BusinessCoreModules').then(m => ({ default: m.DataFarmingModule }))),
    dependencies: ['auth', 'ai-assistant'],
    permissions: ['data:read', 'data:write', 'data:harvest'],
    isActive: false,
    isRequired: false
  },
  {
    id: 'rfp-automation',
    name: 'RFP Automation Engine',
    version: '1.0.0',
    description: 'AI-powered RFP response generation and management',
    category: 'scope',
    component: React.lazy(() => import('@/components/modules/BusinessCoreModules').then(m => ({ default: m.RFPAutomationModule }))),
    dependencies: ['auth', 'ai-assistant'],
    permissions: ['rfp:read', 'rfp:write', 'rfp:generate'],
    isActive: false,
    isRequired: false
  },
  {
    id: 'contract-modifier',
    name: 'Contract Modifier',
    version: '1.0.0',
    description: 'Drag-and-drop contract and scope modification',
    category: 'scope',
    component: () => null,
    dependencies: ['auth', 'ai-assistant'],
    permissions: ['contracts:read', 'contracts:write'],
    isActive: false,
    isRequired: false
  },
  {
    id: 'punch-list-manager',
    name: 'Punch List Manager',
    version: '1.0.0',
    description: 'Visual punch list and go-back management',
    category: 'scope',
    component: () => null,
    dependencies: ['auth', 'job-management'],
    permissions: ['punchlists:read', 'punchlists:write'],
    isActive: false,
    isRequired: false
  },
  {
    id: 'manual-summary-generator',
    name: 'Manual Summary Generator',
    version: '1.0.0',
    description: 'AI-powered manual summary with test/train function',
    category: 'ai',
    component: () => null,
    dependencies: ['auth', 'ai-assistant'],
    permissions: ['summaries:read', 'summaries:write'],
    isActive: false,
    isRequired: false
  },
  {
    id: 'plans-drawing-interpreter',
    name: 'Plans Drawing Interpreter',
    version: '1.0.0',
    description: 'Drawing tool with AI interpretation for field techs',
    category: 'scope',
    component: () => null,
    dependencies: ['auth', 'ai-assistant'],
    permissions: ['drawings:read', 'drawings:write'],
    isActive: false,
    isRequired: false
  },
  {
    id: 'resource-backup-system',
    name: 'Resource Backup System',
    version: '1.0.0',
    description: 'Local storage with cloud sync for field resources',
    category: 'utility',
    component: () => null,
    dependencies: ['auth'],
    permissions: ['resources:read', 'resources:write'],
    isActive: false,
    isRequired: false
  }
]

export class ModuleManager implements ModuleRegistry {
  public modules: Map<string, Module> = new Map()
  public activeModules: Set<string> = new Set()
  private config: ModuleConfig

  constructor(config: ModuleConfig) {
    this.config = config
    this.initializeCoreModules()
  }

  private initializeCoreModules() {
    // Load core modules
    CORE_MODULES.forEach(module => {
      this.modules.set(module.id, module)
      if (module.isRequired) {
        this.activeModules.add(module.id)
      }
    })
  }

  async loadModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId)
    if (!module) {
      throw new Error(`Module ${moduleId} not found`)
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
      throw new Error(`Module ${moduleId} not found`)
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

  getModule(moduleId: string): Module | undefined {
    return this.modules.get(moduleId)
  }

  getActiveModules(): Module[] {
    return Array.from(this.activeModules)
      .map(id => this.modules.get(id))
      .filter((module): module is Module => module !== undefined)
  }

  getModulesByCategory(category: string): Module[] {
    return Array.from(this.modules.values())
      .filter(module => module.category === category)
  }

  private saveModuleState() {
    const state = {
      activeModules: Array.from(this.activeModules),
      timestamp: Date.now()
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
      console.error('Failed to load module state:', error)
    }
  }

  // Add scope modules to registry
  addScopeModules(modules: Module[]) {
    modules.forEach(module => {
      this.modules.set(module.id, module)
    })
  }

  // Get available scope modules
  getAvailableScopeModules(): Module[] {
    return this.getModulesByCategory('scope')
      .filter(module => !module.isActive)
  }

  // Get active scope modules
  getActiveScopeModules(): Module[] {
    return this.getModulesByCategory('scope')
      .filter(module => module.isActive)
  }
}

// Create global module manager instance
export const moduleManager = new ModuleManager({
  baseUrl: '/modules',
  storageKey: 'gooseops-lite-modules',
  permissions: ['auth:read', 'auth:write'],
  categories: ['core', 'scope', 'ai', 'utility']
})

// Initialize with scope modules
moduleManager.addScopeModules(SCOPE_MODULES)
moduleManager.loadModuleState()

export default moduleManager
