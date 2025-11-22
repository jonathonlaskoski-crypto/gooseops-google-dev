// Configuration Health Check System
// Validates all required API keys and configurations on startup

import { validateARESConfig, getARESConfigStatus } from '@/config/aresEnvironment'
import { toast } from 'sonner'

export interface ConfigHealthStatus {
  isHealthy: boolean
  criticalIssues: string[]
  warnings: string[]
  activeServices: string[]
  inactiveServices: string[]
}

export const validateAllConfigurations = (): ConfigHealthStatus => {
  const aresValidation = validateARESConfig()
  const aresStatus = getARESConfigStatus()
  
  const criticalIssues: string[] = []
  const warnings: string[] = []
  const activeServices: string[] = []
  const inactiveServices: string[] = []

  // Check critical services
  if (aresStatus.azureOpenAI) {
    activeServices.push('Azure OpenAI')
  } else {
    criticalIssues.push('Azure OpenAI API Key missing - AI features disabled')
    inactiveServices.push('Azure OpenAI')
  }

  if (aresStatus.supabase) {
    activeServices.push('Supabase Database')
  } else {
    criticalIssues.push('Supabase configuration missing - Data persistence disabled')
    inactiveServices.push('Supabase')
  }

  if (aresStatus.azureAD) {
    activeServices.push('Azure Active Directory')
  } else {
    warnings.push('Azure AD not configured - Advanced auth disabled')
    inactiveServices.push('Azure AD')
  }

  // Check optional services
  if (aresStatus.channels.slack) {
    activeServices.push('Slack Integration')
  } else {
    warnings.push('Slack integration not configured')
    inactiveServices.push('Slack')
  }

  if (aresStatus.channels.asana) {
    activeServices.push('Asana Integration')
  } else {
    warnings.push('Asana integration not configured')
    inactiveServices.push('Asana')
  }

  if (aresStatus.powerPlatform) {
    activeServices.push('Power Platform')
  } else {
    warnings.push('Power Platform not configured - Advanced automations disabled')
    inactiveServices.push('Power Platform')
  }

  if (aresStatus.dataverse) {
    activeServices.push('Dataverse')
  } else {
    warnings.push('Dataverse not configured - Enterprise data features disabled')
    inactiveServices.push('Dataverse')
  }

  return {
    isHealthy: criticalIssues.length === 0,
    criticalIssues,
    warnings,
    activeServices,
    inactiveServices
  }
}

export const displayConfigurationStatus = () => {
  const status = validateAllConfigurations()
  
  if (status.isHealthy) {
    toast.success(`GooseOps Online! ${status.activeServices.length} services active`)
    console.log('🦆 GooseOps Configuration Status:', {
      status: 'HEALTHY',
      activeServices: status.activeServices,
      warnings: status.warnings
    })
  } else {
    toast.error(`Configuration Issues: ${status.criticalIssues.length} critical`)
    console.error('🚨 GooseOps Configuration Issues:', {
      criticalIssues: status.criticalIssues,
      warnings: status.warnings,
      activeServices: status.activeServices,
      inactiveServices: status.inactiveServices
    })
  }

  return status
}

export const generateConfigurationReport = (): string => {
  const status = validateAllConfigurations()
  
  let report = `# GooseOps Configuration Report\n\n`
  
  if (status.isHealthy) {
    report += `✅ **STATUS: HEALTHY**\n\n`
  } else {
    report += `🚨 **STATUS: ISSUES DETECTED**\n\n`
  }
  
  report += `## Active Services (${status.activeServices.length})\n`
  status.activeServices.forEach(service => {
    report += `✅ ${service}\n`
  })
  
  if (status.inactiveServices.length > 0) {
    report += `\n## Inactive Services (${status.inactiveServices.length})\n`
    status.inactiveServices.forEach(service => {
      report += `❌ ${service}\n`
    })
  }
  
  if (status.criticalIssues.length > 0) {
    report += `\n## Critical Issues (${status.criticalIssues.length})\n`
    status.criticalIssues.forEach(issue => {
      report += `🚨 ${issue}\n`
    })
  }
  
  if (status.warnings.length > 0) {
    report += `\n## Warnings (${status.warnings.length})\n`
    status.warnings.forEach(warning => {
      report += `⚠️ ${warning}\n`
    })
  }
  
  report += `\n## Next Steps\n`
  if (!status.isHealthy) {
    report += `1. Copy .env.template to .env\n`
    report += `2. Add missing API keys\n`
    report += `3. Restart the application\n`
  } else {
    report += `🎉 All critical systems operational!\n`
    report += `Consider adding optional integrations for enhanced functionality.\n`
  }
  
  return report
}