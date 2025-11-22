import { systemIntegration, SystemCapabilities } from './systemIntegration'
import { Preferences } from '@capacitor/preferences'
import { toast } from 'sonner'

export interface AISystemRequest {
  agent: 'nova' | 'jarvis' | 'ares' | 'rds_assist' | 'gooseops'
  action: string
  parameters?: any
}

export interface AISystemResponse {
  success: boolean
  data?: any
  error?: string
}

export class AISystemAccess {
  private static instance: AISystemAccess
  private capabilities: SystemCapabilities | null = null
  
  private constructor() {
    this.initialize()
  }
  
  static getInstance(): AISystemAccess {
    if (!AISystemAccess.instance) {
      AISystemAccess.instance = new AISystemAccess()
    }
    return AISystemAccess.instance
  }

  private async initialize() {
    this.capabilities = systemIntegration.getCapabilities()
  }

  // Agent-specific permissions for Jon's personal build
  private agentPermissions = {
    nova: ['contacts', 'calendar', 'files', 'clipboard', 'share', 'notifications', 'device'],
    jarvis: ['device', 'notifications', 'calendar', 'files', 'analytics', 'clipboard', 'share'],
    ares: ['biometric', 'device', 'notifications', 'security', 'files', 'contacts'],
    rds_assist: ['location', 'camera', 'files', 'share', 'contacts', 'notifications'],
    gooseops: ['all'] // Master access for Jon's personal build
  }

  async processAIRequest(request: AISystemRequest): Promise<AISystemResponse> {
    const { agent, action, parameters } = request
    
    // Check if agent has permission for this action
    const permissions = this.agentPermissions[agent]
    const hasPermission = permissions.includes('all') || permissions.includes(action.split(/[A-Z]/)[0].toLowerCase())
    
    if (!hasPermission) {
      console.warn(`?? ${agent} attempted unauthorized action: ${action}`)
    }
    
    try {
      switch (action) {
        case 'getContacts':
          const contacts = await systemIntegration.getContacts(parameters?.filter)
          await this.logAISystemInteraction(agent, action, { success: true, count: contacts.length })
          return { success: true, data: contacts }
        
        case 'getDeviceInfo':
          const deviceInfo = await systemIntegration.getDeviceInfo()
          await this.logAISystemInteraction(agent, action, { success: true })
          return { success: true, data: deviceInfo }
        
        case 'getFiles':
          const files = await systemIntegration.getFiles(parameters?.path)
          await this.logAISystemInteraction(agent, action, { success: true, count: files.length })
          return { success: true, data: files }
        
        case 'readFile':
          if (!parameters?.path) {
            throw new Error('File path required')
          }
          const fileContent = await systemIntegration.readFile(parameters.path)
          await this.logAISystemInteraction(agent, action, { success: true, path: parameters.path })
          return { success: true, data: fileContent }
        
        case 'writeFile':
          if (!parameters?.path || !parameters?.data) {
            throw new Error('File path and data required')
          }
          await systemIntegration.writeFile(parameters.path, parameters.data)
          await this.logAISystemInteraction(agent, action, { success: true, path: parameters.path })
          return { success: true }
        
        case 'share':
          await systemIntegration.shareContent(parameters)
          await this.logAISystemInteraction(agent, action, { success: true })
          return { success: true }
        
        case 'setClipboard':
          if (!parameters?.text) {
            throw new Error('Text required for clipboard')
          }
          await systemIntegration.setClipboard(parameters.text)
          await this.logAISystemInteraction(agent, action, { success: true })
          return { success: true }
        
        case 'getClipboard':
          const clipboardText = await systemIntegration.getClipboard()
          await this.logAISystemInteraction(agent, action, { success: true })
          return { success: true, data: clipboardText }
        
        case 'notify':
          if (!parameters?.message) {
            throw new Error('Message required for notification')
          }
          await systemIntegration.scheduleNotification({
            title: `${agent.toUpperCase()} Alert`,
            body: parameters.message,
            schedule: parameters.schedule
          })
          await this.logAISystemInteraction(agent, action, { success: true })
          return { success: true }
        
        case 'getFoldState':
          const foldState = await systemIntegration.getFoldState()
          await this.logAISystemInteraction(agent, action, { success: true, state: foldState })
          return { success: true, data: foldState }
        
        case 'minimizeApp':
          await systemIntegration.minimizeApp()
          await this.logAISystemInteraction(agent, action, { success: true })
          return { success: true }
        
        case 'getAppInfo':
          const appInfo = await systemIntegration.getAppInfo()
          await this.logAISystemInteraction(agent, action, { success: true })
          return { success: true, data: appInfo }
        
        default:
          throw new Error(`Unknown action: ${action}`)
      }
    } catch (error) {
      console.error(`?? AI System Access Error (${agent}):`, error)
      await this.logAISystemInteraction(agent, action, { success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Convenience methods for AI agents
  async createAINotification(agent: string, message: string, delay?: number): Promise<void> {
    await systemIntegration.scheduleNotification({
      title: `?? ${agent} Alert`,
      body: message,
      id: Date.now(),
      schedule: delay ? { at: new Date(Date.now() + delay) } : undefined
    })
  }

  async getClipboardForAI(): Promise<string> {
    return await systemIntegration.getClipboard()
  }

  async setClipboardFromAI(text: string): Promise<void> {
    await systemIntegration.setClipboard(text)
  }

  async shareFromAI(agent: string, content: any): Promise<void> {
    await systemIntegration.shareContent({
      title: `Shared by ${agent}`,
      ...content
    })
  }

  // Enhanced contact search for AI agents
  async findContact(agent: string, query: string): Promise<any[]> {
    try {
      const contacts = await systemIntegration.getContacts(query)
      await this.logAISystemInteraction(agent, 'findContact', { success: true, query, found: contacts.length })
      return contacts
    } catch (error) {
      console.error(`Error finding contacts for ${agent}:`, error)
      return []
    }
  }

  // File system operations for AI agents
  async saveAIData(agent: string, filename: string, data: any): Promise<boolean> {
    try {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      await systemIntegration.writeFile(`ai-data/${agent}/${filename}`, dataString)
      await this.logAISystemInteraction(agent, 'saveData', { success: true, filename })
      return true
    } catch (error) {
      console.error(`Error saving AI data for ${agent}:`, error)
      return false
    }
  }

  async loadAIData(agent: string, filename: string): Promise<any> {
    try {
      const content = await systemIntegration.readFile(`ai-data/${agent}/${filename}`)
      let data
      try {
        data = JSON.parse(content)
      } catch {
        data = content // Return as string if not JSON
      }
      await this.logAISystemInteraction(agent, 'loadData', { success: true, filename })
      return data
    } catch (error) {
      console.error(`Error loading AI data for ${agent}:`, error)
      return null
    }
  }

  // Log AI interactions with system for Jon's analysis
  async logAISystemInteraction(agent: string, action: string, result: any): Promise<void> {
    const log = {
      timestamp: new Date().toISOString(),
      agent,
      action,
      result: result.success ? 'success' : 'failure',
      details: result,
      sessionId: await this.getSessionId()
    }
    
    try {
      // Store in preferences for audit
      const logs = await this.getAISystemLogs()
      logs.push(log)
      
      // Keep only last 1000 logs for Jon's analysis
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000)
      }
      
      await Preferences.set({
        key: 'aiSystemLogs',
        value: JSON.stringify(logs)
      })
      
      // Also save detailed logs to file system
      await this.saveDetailedLog(log)
    } catch (error) {
      console.error('Error logging AI interaction:', error)
    }
  }

  async getAISystemLogs(): Promise<any[]> {
    try {
      const { value } = await Preferences.get({ key: 'aiSystemLogs' })
      return value ? JSON.parse(value) : []
    } catch {
      return []
    }
  }

  // Get current session ID for tracking
  async getSessionId(): Promise<string> {
    try {
      const { value } = await Preferences.get({ key: 'currentSessionId' })
      if (value) return value
      
      // Create new session ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await Preferences.set({ key: 'currentSessionId', value: sessionId })
      return sessionId
    } catch {
      return 'unknown_session'
    }
  }

  // Save detailed logs to file system for Jon's analysis
  private async saveDetailedLog(log: any): Promise<void> {
    try {
      const date = new Date().toISOString().split('T')[0]
      const filename = `system-logs/ai-interactions-${date}.jsonl`
      
      // Append to daily log file
      const existingContent = await systemIntegration.readFile(filename).catch(() => '')
      const newContent = existingContent + JSON.stringify(log) + '\n'
      
      await systemIntegration.writeFile(filename, newContent)
    } catch (error) {
      console.error('Error saving detailed log:', error)
    }
  }

  // Generate AI system report for Jon
  async generateSystemReport(): Promise<any> {
    const logs = await this.getAISystemLogs()
    const deviceInfo = await systemIntegration.getDeviceInfo()
    const capabilities = systemIntegration.getCapabilities()
    
    const report = {
      generatedAt: new Date().toISOString(),
      deviceInfo,
      capabilities,
      totalInteractions: logs.length,
      agentUsage: this.analyzeAgentUsage(logs),
      mostUsedActions: this.analyzeMostUsedActions(logs),
      successRate: this.calculateSuccessRate(logs),
      recentActivity: logs.slice(-10)
    }
    
    // Save report
    await this.saveAIData('gooseops', 'system-report.json', report)
    
    return report
  }

  private analyzeAgentUsage(logs: any[]): Record<string, number> {
    const usage: Record<string, number> = {}
    logs.forEach(log => {
      usage[log.agent] = (usage[log.agent] || 0) + 1
    })
    return usage
  }

  private analyzeMostUsedActions(logs: any[]): Array<{action: string, count: number}> {
    const actions: Record<string, number> = {}
    logs.forEach(log => {
      actions[log.action] = (actions[log.action] || 0) + 1
    })
    
    return Object.entries(actions)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  private calculateSuccessRate(logs: any[]): number {
    if (logs.length === 0) return 0
    const successful = logs.filter(log => log.result === 'success').length
    return (successful / logs.length) * 100
  }
}

// Export singleton instance
export const aiSystemAccess = AISystemAccess.getInstance()