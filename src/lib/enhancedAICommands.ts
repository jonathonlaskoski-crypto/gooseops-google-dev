import { aiSystemAccess } from './aiSystemAccess'
import { systemIntegration } from './systemIntegration'
import { toast } from 'sonner'

export interface AICommand {
  command: string
  description: string
  agent: string
  action: string
  parameters?: any
  voiceTriggers: string[]
  systemAccess: boolean
}

export class EnhancedAICommands {
  private static instance: EnhancedAICommands
  private commands: Map<string, AICommand> = new Map()
  
  static getInstance(): EnhancedAICommands {
    if (!EnhancedAICommands.instance) {
      EnhancedAICommands.instance = new EnhancedAICommands()
    }
    return EnhancedAICommands.instance
  }

  constructor() {
    this.initializeCommands()
  }

  private initializeCommands() {
    // Jon's Personal AI Commands with Full System Access
    const commands: AICommand[] = [
      // === NOVA AI COMMANDS (Personal Assistant) ===
      {
        command: 'nova_contacts',
        description: 'Nova can access and search your contacts',
        agent: 'nova',
        action: 'getContacts',
        voiceTriggers: ['nova show contacts', 'nova find contact', 'nova call someone'],
        systemAccess: true
      },
      {
        command: 'nova_schedule',
        description: 'Nova can manage your calendar and schedule',
        agent: 'nova',
        action: 'getCalendar',
        voiceTriggers: ['nova check schedule', 'nova what\'s next', 'nova free time'],
        systemAccess: true
      },
      {
        command: 'nova_files',
        description: 'Nova can access and organize your files',
        agent: 'nova',
        action: 'getFiles',
        voiceTriggers: ['nova find file', 'nova recent documents', 'nova open folder'],
        systemAccess: true
      },
      {
        command: 'nova_share',
        description: 'Nova can share content from your device',
        agent: 'nova',
        action: 'share',
        voiceTriggers: ['nova share this', 'nova send to', 'nova export'],
        systemAccess: true
      },

      // === JARVIS AI COMMANDS (Operational Intelligence) ===
      {
        command: 'jarvis_analytics',
        description: 'Jarvis analyzes your device and app usage patterns',
        agent: 'jarvis',
        action: 'getDeviceInfo',
        voiceTriggers: ['jarvis device status', 'jarvis system report', 'jarvis analytics'],
        systemAccess: true
      },
      {
        command: 'jarvis_optimize',
        description: 'Jarvis optimizes your device performance',
        agent: 'jarvis',
        action: 'optimizeDevice',
        voiceTriggers: ['jarvis optimize', 'jarvis clean up', 'jarvis performance'],
        systemAccess: true
      },
      {
        command: 'jarvis_automate',
        description: 'Jarvis creates automations based on your patterns',
        agent: 'jarvis',
        action: 'createAutomation',
        voiceTriggers: ['jarvis automate this', 'jarvis remember this', 'jarvis routine'],
        systemAccess: true
      },

      // === ARES AI COMMANDS (Security & System Protection) ===
      {
        command: 'ares_security_scan',
        description: 'ARES performs security analysis of your device',
        agent: 'ares',
        action: 'securityScan',
        voiceTriggers: ['ares security check', 'ares scan device', 'ares protect'],
        systemAccess: true
      },
      {
        command: 'ares_secure_file',
        description: 'ARES can encrypt and secure sensitive files',
        agent: 'ares',
        action: 'secureFile',
        voiceTriggers: ['ares secure this', 'ares encrypt file', 'ares protect data'],
        systemAccess: true
      },
      {
        command: 'ares_privacy_check',
        description: 'ARES audits app permissions and privacy settings',
        agent: 'ares',
        action: 'privacyAudit',
        voiceTriggers: ['ares privacy check', 'ares audit permissions', 'ares security status'],
        systemAccess: true
      },

      // === RDS ASSIST COMMANDS (Field Operations) ===
      {
        command: 'rds_photo_analysis',
        description: 'RDS Assist analyzes photos of equipment and provides guidance',
        agent: 'rds_assist',
        action: 'analyzePhoto',
        voiceTriggers: ['rds analyze photo', 'rds what is this', 'rds equipment check'],
        systemAccess: true
      },
      {
        command: 'rds_location_help',
        description: 'RDS Assist provides location-based assistance and navigation',
        agent: 'rds_assist',
        action: 'locationAssist',
        voiceTriggers: ['rds where am i', 'rds navigate to', 'rds location help'],
        systemAccess: true
      },
      {
        command: 'rds_report_generate',
        description: 'RDS Assist generates and shares field reports',
        agent: 'rds_assist',
        action: 'generateReport',
        voiceTriggers: ['rds create report', 'rds send report', 'rds documentation'],
        systemAccess: true
      },

      // === GOOSEOPS SYSTEM COMMANDS (Jon's Personal Control) ===
      {
        command: 'gooseops_full_access',
        description: 'GooseOps system with unrestricted access to everything',
        agent: 'gooseops',
        action: 'systemControl',
        voiceTriggers: ['gooseops take control', 'gooseops full access', 'gooseops system mode'],
        systemAccess: true
      },
      {
        command: 'gooseops_backup',
        description: 'GooseOps creates full system backup of AI data and settings',
        agent: 'gooseops',
        action: 'createBackup',
        voiceTriggers: ['gooseops backup everything', 'gooseops save state', 'gooseops export data'],
        systemAccess: true
      },
      {
        command: 'gooseops_debug',
        description: 'GooseOps enables debug mode for development',
        agent: 'gooseops',
        action: 'enableDebug',
        voiceTriggers: ['gooseops debug mode', 'gooseops developer tools', 'gooseops diagnostic'],
        systemAccess: true
      }
    ]

    // Register all commands
    commands.forEach(cmd => this.commands.set(cmd.command, cmd))
  }

  async executeCommand(commandId: string, parameters?: any): Promise<any> {
    const command = this.commands.get(commandId)
    if (!command) {
      throw new Error(`Command not found: ${commandId}`)
    }

    try {
      console.log(`?? Executing ${command.agent} command: ${command.command}`)
      
      // Log command execution
      await aiSystemAccess.logAISystemInteraction(
        command.agent, 
        'commandExecute', 
        { success: true, command: commandId, parameters }
      )

      // Execute the command through AI system access
      const result = await aiSystemAccess.processAIRequest({
        agent: command.agent as any,
        action: command.action,
        parameters: { ...command.parameters, ...parameters }
      })

      if (result.success) {
        toast.success(`? ${command.agent.toUpperCase()}: Command completed`)
        return result.data
      } else {
        toast.error(`? ${command.agent.toUpperCase()}: ${result.error}`)
        throw new Error(result.error)
      }
    } catch (error) {
      console.error(`Error executing command ${commandId}:`, error)
      throw error
    }
  }

  // Voice command processing for Jon's personal build
  async processVoiceCommand(transcript: string): Promise<boolean> {
    const lowerTranscript = transcript.toLowerCase()
    
    // Find matching command by voice trigger
    for (const [commandId, command] of this.commands) {
      for (const trigger of command.voiceTriggers) {
        if (lowerTranscript.includes(trigger.toLowerCase())) {
          try {
            await this.executeCommand(commandId)
            return true
          } catch (error) {
            console.error(`Voice command failed: ${trigger}`, error)
            return false
          }
        }
      }
    }
    
    // If no specific command found, try general AI processing
    return await this.processGeneralAICommand(transcript)
  }

  private async processGeneralAICommand(transcript: string): Promise<boolean> {
    const lowerTranscript = transcript.toLowerCase()

    // Determine which AI agent should handle this
    let agent: string = 'gooseops' // Default to full access

    if (lowerTranscript.includes('nova')) agent = 'nova'
    else if (lowerTranscript.includes('jarvis')) agent = 'jarvis'
    else if (lowerTranscript.includes('ares')) agent = 'ares'
    else if (lowerTranscript.includes('rds')) agent = 'rds_assist'

    try {
      // Process through general AI system
      const result = await aiSystemAccess.processAIRequest({
        agent: agent as any,
        action: 'processNaturalLanguage',
        parameters: { 
          transcript, 
          context: 'voice_command',
          fullSystemAccess: true // Jon's personal build
        }
      })

      if (result.success) {
        toast.success(`??? ${agent.toUpperCase()}: Processing your request`)
        return true
      }
    } catch (error) {
      console.error('General AI command processing failed:', error)
    }

    return false
  }

  // Get all available commands for Jon
  getAllCommands(): AICommand[] {
    return Array.from(this.commands.values())
  }

  // Get commands by agent
  getCommandsByAgent(agentName: string): AICommand[] {
    return Array.from(this.commands.values()).filter(cmd => cmd.agent === agentName)
  }

  // Advanced system commands for Jon's personal use
  async executeAdvancedSystemCommand(type: 'backup' | 'restore' | 'debug' | 'analytics'): Promise<any> {
    switch (type) {
      case 'backup':
        return await this.createFullSystemBackup()
      case 'restore':
        return await this.restoreSystemFromBackup()
      case 'debug':
        return await this.enableDebugMode()
      case 'analytics':
        return await this.generateAdvancedAnalytics()
    }
  }

  private async createFullSystemBackup(): Promise<any> {
    const deviceInfo = await systemIntegration.getDeviceInfo()
    const systemReport = await aiSystemAccess.generateSystemReport()
    const aiLogs = await aiSystemAccess.getAISystemLogs()
    
    const backup = {
      timestamp: new Date().toISOString(),
      deviceInfo,
      systemReport,
      aiLogs,
      appVersion: '1.0.0-jon-personal',
      backupType: 'full_system'
    }
    
    // Save backup to device
    await aiSystemAccess.saveAIData('gooseops', `backup-${Date.now()}.json`, backup)
    
    toast.success('?? Full system backup created')
    return backup
  }

  private async enableDebugMode(): Promise<any> {
    // Enable advanced logging and debug features for Jon
    (window as any).jonDebugMode = {
      enabled: true,
      commands: this.commands,
      systemIntegration,
      aiSystemAccess,
      executeCommand: this.executeCommand.bind(this),
      logs: await aiSystemAccess.getAISystemLogs()
    }
    
    toast.success('?? Debug mode enabled - Check window.jonDebugMode')
    
    return {
      debugModeEnabled: true,
      availableCommands: this.commands.size,
      systemAccess: true
    }
  }

  private async generateAdvancedAnalytics(): Promise<any> {
    const systemReport = await aiSystemAccess.generateSystemReport()
    const deviceInfo = await systemIntegration.getDeviceInfo()
    const foldState = await systemIntegration.getFoldState()
    
    const analytics = {
      ...systemReport,
      deviceSpecific: {
        foldState,
        isFoldable: deviceInfo.isFoldable,
        platform: deviceInfo.platform,
        batteryLevel: deviceInfo.battery?.level,
        isCharging: deviceInfo.battery?.isCharging
      },
      aiPerformance: {
        commandsAvailable: this.commands.size,
        systemAccessEnabled: true,
        voiceCommandsEnabled: true
      }
    }
    
    return analytics
  }
}

// Export singleton instance
export const enhancedAICommands = EnhancedAICommands.getInstance()