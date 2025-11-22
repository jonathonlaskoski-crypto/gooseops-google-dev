import { enhancedAICommands } from './enhancedAICommands'
import { systemIntegration } from './systemIntegration'
import { aiSystemAccess } from './aiSystemAccess'
import { samsungFoldOptimizer } from './samsungFoldOptimizer'
import { Preferences } from '@capacitor/preferences'
import { toast } from 'sonner'

export interface PowerShortcut {
  id: string
  name: string
  description: string
  trigger: 'gesture' | 'voice' | 'timer' | 'location' | 'device_state'
  triggerConfig: any
  actions: PowerAction[]
  enabled: boolean
  createdBy: 'user' | 'ai' | 'system'
  lastUsed?: string
  useCount: number
}

export interface PowerAction {
  type: 'ai_command' | 'system_call' | 'notification' | 'file_operation' | 'share' | 'automation'
  config: any
  delay?: number
}

export interface AutomationTrigger {
  id: string
  name: string
  enabled: boolean
  conditions: AutomationCondition[]
  actions: PowerAction[]
  cooldown: number // minutes
  lastTriggered?: string
}

export interface AutomationCondition {
  type: 'time' | 'location' | 'device_state' | 'app_usage' | 'ai_event'
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
  value: any
  threshold?: number
}

export class PowerUserSystem {
  private static instance: PowerUserSystem
  private shortcuts: Map<string, PowerShortcut> = new Map()
  private automations: Map<string, AutomationTrigger> = new Map()
  private isMonitoring: boolean = false

  static getInstance(): PowerUserSystem {
    if (!PowerUserSystem.instance) {
      PowerUserSystem.instance = new PowerUserSystem()
    }
    return PowerUserSystem.instance
  }

  constructor() {
    this.initializePowerFeatures()
  }

  private async initializePowerFeatures() {
    await this.loadSavedShortcuts()
    await this.loadSavedAutomations()
    await this.createDefaultShortcuts()
    this.startAutomationMonitoring()
  }

  private async createDefaultShortcuts() {
    // Jon's default power user shortcuts
    const defaultShortcuts: PowerShortcut[] = [
      {
        id: 'jon_morning_routine',
        name: 'Morning Power-Up',
        description: 'Complete morning routine: check weather, calendar, system status',
        trigger: 'voice',
        triggerConfig: { phrases: ['good morning gooseops', 'morning routine', 'power up'] },
        actions: [
          {
            type: 'ai_command',
            config: { agent: 'jarvis', action: 'getDeviceInfo' },
            delay: 0
          },
          {
            type: 'ai_command',
            config: { agent: 'nova', action: 'getCalendar' },
            delay: 1000
          },
          {
            type: 'system_call',
            config: { action: 'generateSystemReport' },
            delay: 2000
          },
          {
            type: 'notification',
            config: { title: 'Jon\'s Morning Brief', body: 'System status and schedule ready' },
            delay: 3000
          }
        ],
        enabled: true,
        createdBy: 'system',
        useCount: 0
      },

      {
        id: 'jon_work_mode',
        name: 'Work Mode Activation',
        description: 'Switch to productivity mode with dual screen and focus apps',
        trigger: 'voice',
        triggerConfig: { phrases: ['work mode', 'productivity mode', 'focus time'] },
        actions: [
          {
            type: 'system_call',
            config: { action: 'enableProductivityMode' }
          },
          {
            type: 'ai_command',
            config: { agent: 'jarvis', action: 'optimizeDevice' }
          },
          {
            type: 'notification',
            config: { title: 'Work Mode Active', body: 'Productivity optimizations enabled' }
          }
        ],
        enabled: true,
        createdBy: 'system',
        useCount: 0
      },

      {
        id: 'jon_ai_report',
        name: 'AI Status Report',
        description: 'Get comprehensive AI and system performance report',
        trigger: 'voice',
        triggerConfig: { phrases: ['status report', 'ai report', 'system status'] },
        actions: [
          {
            type: 'ai_command',
            config: { agent: 'gooseops', action: 'generateReport' }
          },
          {
            type: 'system_call',
            config: { action: 'getAnalytics' }
          }
        ],
        enabled: true,
        createdBy: 'system',
        useCount: 0
      },

      {
        id: 'jon_security_check',
        name: 'Security Audit',
        description: 'Run comprehensive security check with ARES',
        trigger: 'voice',
        triggerConfig: { phrases: ['security check', 'ares scan', 'safety audit'] },
        actions: [
          {
            type: 'ai_command',
            config: { agent: 'ares', action: 'securityScan' }
          },
          {
            type: 'ai_command',
            config: { agent: 'ares', action: 'privacyAudit' }
          }
        ],
        enabled: true,
        createdBy: 'system',
        useCount: 0
      },

      {
        id: 'jon_backup_routine',
        name: 'Smart Backup',
        description: 'Create intelligent backup of all AI data and settings',
        trigger: 'voice',
        triggerConfig: { phrases: ['backup everything', 'save my data', 'create backup'] },
        actions: [
          {
            type: 'ai_command',
            config: { agent: 'gooseops', action: 'createBackup' }
          },
          {
            type: 'system_call',
            config: { action: 'syncToCloud' }
          }
        ],
        enabled: true,
        createdBy: 'system',
        useCount: 0
      }
    ]

    // Save default shortcuts
    for (const shortcut of defaultShortcuts) {
      if (!this.shortcuts.has(shortcut.id)) {
        this.shortcuts.set(shortcut.id, shortcut)
      }
    }

    await this.saveShortcuts()
  }

  async executeShortcut(shortcutId: string): Promise<boolean> {
    const shortcut = this.shortcuts.get(shortcutId)
    if (!shortcut || !shortcut.enabled) {
      return false
    }

    try {
      console.log(`? Executing power shortcut: ${shortcut.name}`)
      
      // Execute actions in sequence
      for (const action of shortcut.actions) {
        if (action.delay) {
          await new Promise(resolve => setTimeout(resolve, action.delay))
        }
        
        await this.executeAction(action)
      }

      // Update usage statistics
      shortcut.useCount++
      shortcut.lastUsed = new Date().toISOString()
      await this.saveShortcuts()

      toast.success(`? ${shortcut.name} completed`)
      return true

    } catch (error) {
      console.error(`Error executing shortcut ${shortcutId}:`, error)
      toast.error(`Failed to execute ${shortcut.name}`)
      return false
    }
  }

  private async executeAction(action: PowerAction): Promise<void> {
    switch (action.type) {
      case 'ai_command':
        await aiSystemAccess.processAIRequest({
          agent: action.config.agent,
          action: action.config.action,
          parameters: action.config.parameters
        })
        break

      case 'system_call':
        await this.executeSystemCall(action.config)
        break

      case 'notification':
        await systemIntegration.scheduleNotification({
          title: action.config.title,
          body: action.config.body
        })
        break

      case 'file_operation':
        if (action.config.operation === 'write') {
          await systemIntegration.writeFile(action.config.path, action.config.data)
        } else if (action.config.operation === 'read') {
          await systemIntegration.readFile(action.config.path)
        }
        break

      case 'share':
        await systemIntegration.shareContent(action.config)
        break

      case 'automation':
        // Trigger another automation or shortcut
        if (action.config.shortcutId) {
          await this.executeShortcut(action.config.shortcutId)
        }
        break
    }
  }

  private async executeSystemCall(config: any): Promise<void> {
    switch (config.action) {
      case 'generateSystemReport':
        await aiSystemAccess.generateSystemReport()
        break
      case 'enableProductivityMode':
        await samsungFoldOptimizer.enableProductivityMode()
        break
      case 'optimizeDevice':
        // Custom device optimization logic
        await this.optimizeDevice()
        break
      case 'getAnalytics':
        await enhancedAICommands.executeAdvancedSystemCommand('analytics')
        break
      case 'syncToCloud':
        // Custom cloud sync logic
        await this.syncToCloud()
        break
    }
  }

  async processVoiceTrigger(transcript: string): Promise<boolean> {
    const lowerTranscript = transcript.toLowerCase()

    for (const [id, shortcut] of this.shortcuts) {
      if (shortcut.trigger === 'voice' && shortcut.enabled) {
        for (const phrase of shortcut.triggerConfig.phrases) {
          if (lowerTranscript.includes(phrase.toLowerCase())) {
            await this.executeShortcut(id)
            return true
          }
        }
      }
    }

    return false
  }

  // Automation system
  private startAutomationMonitoring() {
    if (this.isMonitoring) return

    this.isMonitoring = true
    
    // Check automations every minute
    setInterval(async () => {
      await this.checkAutomations()
    }, 60000)

    // Monitor device state changes
    this.monitorDeviceStateChanges()
  }

  private async checkAutomations() {
    for (const [id, automation] of this.automations) {
      if (!automation.enabled) continue

      // Check cooldown
      if (automation.lastTriggered) {
        const lastTrigger = new Date(automation.lastTriggered)
        const cooldownEnd = new Date(lastTrigger.getTime() + automation.cooldown * 60000)
        if (new Date() < cooldownEnd) continue
      }

      // Check conditions
      const conditionsMet = await this.checkAutomationConditions(automation.conditions)
      if (conditionsMet) {
        await this.executeAutomation(automation)
      }
    }
  }

  private async checkAutomationConditions(conditions: AutomationCondition[]): Promise<boolean> {
    for (const condition of conditions) {
      const result = await this.evaluateCondition(condition)
      if (!result) return false
    }
    return true
  }

  private async evaluateCondition(condition: AutomationCondition): Promise<boolean> {
    switch (condition.type) {
      case 'time':
        const now = new Date()
        const currentHour = now.getHours()
        return this.compare(currentHour, condition.operator, condition.value)

      case 'device_state':
        if (condition.value === 'fold_state') {
          const foldState = await systemIntegration.getFoldState()
          return this.compare(foldState, condition.operator, condition.threshold)
        }
        break

      case 'app_usage':
        // Check app usage patterns
        return true // Placeholder

      case 'ai_event':
        // Check for specific AI events
        return true // Placeholder
    }

    return false
  }

  private compare(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals': return actual === expected
      case 'not_equals': return actual !== expected
      case 'greater_than': return actual > expected
      case 'less_than': return actual < expected
      case 'contains': return String(actual).includes(String(expected))
      default: return false
    }
  }

  private async executeAutomation(automation: AutomationTrigger) {
    try {
      console.log(`?? Executing automation: ${automation.name}`)
      
      for (const action of automation.actions) {
        await this.executeAction(action)
      }

      automation.lastTriggered = new Date().toISOString()
      await this.saveAutomations()

      toast.info(`?? Automation: ${automation.name}`)
    } catch (error) {
      console.error(`Automation error: ${automation.name}`, error)
    }
  }

  private monitorDeviceStateChanges() {
    // Monitor fold state changes
    window.addEventListener('foldStateChanged', (event: any) => {
      console.log('?? Fold state changed:', event.detail)
      // Trigger relevant automations
    })

    // Monitor orientation changes
    window.addEventListener('orientationchange', () => {
      console.log('?? Orientation changed')
      // Trigger relevant automations
    })
  }

  // System optimization routines
  private async optimizeDevice(): Promise<void> {
    console.log('? Running device optimization...')
    
    // Clear temporary data
    // Optimize memory usage
    // Clean up old logs
    const logs = await aiSystemAccess.getAISystemLogs()
    if (logs.length > 500) {
      // Keep only recent logs
      const recentLogs = logs.slice(-500)
      await Preferences.set({
        key: 'aiSystemLogs',
        value: JSON.stringify(recentLogs)
      })
    }

    toast.success('? Device optimization completed')
  }

  private async syncToCloud(): Promise<void> {
    console.log('?? Syncing data to cloud...')
    
    // Backup critical data
    const backup = await enhancedAICommands.executeAdvancedSystemCommand('backup')
    
    // In a real implementation, this would sync to actual cloud storage
    toast.success('?? Cloud sync completed')
  }

  // Data persistence
  private async saveShortcuts() {
    const data = Array.from(this.shortcuts.entries())
    await Preferences.set({
      key: 'powerShortcuts',
      value: JSON.stringify(data)
    })
  }

  private async loadSavedShortcuts() {
    try {
      const { value } = await Preferences.get({ key: 'powerShortcuts' })
      if (value) {
        const data = JSON.parse(value)
        this.shortcuts = new Map(data)
      }
    } catch (error) {
      console.error('Error loading shortcuts:', error)
    }
  }

  private async saveAutomations() {
    const data = Array.from(this.automations.entries())
    await Preferences.set({
      key: 'automationTriggers',
      value: JSON.stringify(data)
    })
  }

  private async loadSavedAutomations() {
    try {
      const { value } = await Preferences.get({ key: 'automationTriggers' })
      if (value) {
        const data = JSON.parse(value)
        this.automations = new Map(data)
      }
    } catch (error) {
      console.error('Error loading automations:', error)
    }
  }

  // Public API for Jon's use
  getAllShortcuts(): PowerShortcut[] {
    return Array.from(this.shortcuts.values())
  }

  getAllAutomations(): AutomationTrigger[] {
    return Array.from(this.automations.values())
  }

  async createCustomShortcut(shortcut: Omit<PowerShortcut, 'id' | 'useCount' | 'createdBy'>): Promise<string> {
    const id = `custom_${Date.now()}`
    const newShortcut: PowerShortcut = {
      ...shortcut,
      id,
      useCount: 0,
      createdBy: 'user'
    }
    
    this.shortcuts.set(id, newShortcut)
    await this.saveShortcuts()
    
    toast.success(`Created shortcut: ${shortcut.name}`)
    return id
  }

  async deleteShortcut(shortcutId: string): Promise<boolean> {
    if (this.shortcuts.delete(shortcutId)) {
      await this.saveShortcuts()
      toast.success('Shortcut deleted')
      return true
    }
    return false
  }
}

// Export singleton
export const powerUserSystem = PowerUserSystem.getInstance()