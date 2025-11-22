// A.R.E.S Environment Configuration - Consolidated
// Centralized configuration for all ARES systems and integrations

export interface ARESEnvironmentConfig {
  // Azure OpenAI Configuration
  azureOpenAI: {
    apiKey: string;
    endpoint: string;
    deployment: string;
  };
  
  // Azure Active Directory Configuration
  azureAD: {
    tenantId: string;
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
  };
  
  // Supabase Configuration
  supabase: {
    url: string;
    anonKey: string;
  };
  
  // Copilot Studio Configuration
  copilotStudio: {
    endpoint: string;
    apiVersion: string;
    botId: string;
    apiKey?: string;
  };
  
  // ARES Schema Configuration
  ares: {
    schema: string;
  };
  
  // Alternative Channel Credentials
  channels: {
    slack: {
      botToken?: string;
    };
    asana: {
      apiKey?: string;
    };
    onedrive: {
      token?: string;
    };
    teams: {
      token?: string;
    };
  };
  
  // Microsoft 365 Integration
  microsoft365: {
    tenantId: string;
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
  };
  
  // Power Platform Integration
  powerPlatform: {
    powerApps: {
      environmentId?: string;
      appId?: string;
      apiKey?: string;
    };
    powerPages: {
      siteId?: string;
      apiKey?: string;
      customDomain?: string;
    };
  };
  
  // Dataverse Configuration
  dataverse: {
    environmentUrl?: string;
    apiKey?: string;
    tablePrefix: string;
  };
  
  // Teams Configuration
  teams: {
    tenantId: string;
    botId?: string;
    apiKey?: string;
  };
  
  // OneDrive Configuration
  oneDrive: {
    businessTenantId: string;
    personalToken?: string;
    businessToken?: string;
  };
  
  // Environment
  environment: {
    nodeEnv: string;
  };
}

// Consolidated ARES Environment Configuration
export const aresEnvironmentConfig: ARESEnvironmentConfig = {
  // Azure OpenAI Configuration
  azureOpenAI: {
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY ?? '',
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT ?? '',
    deployment: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT ?? ''
  },
  
  // Azure Active Directory Configuration
  azureAD: {
    tenantId: import.meta.env.VITE_AZURE_TENANT_ID ?? '',
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID ?? '',
    clientSecret: import.meta.env.VITE_AZURE_CLIENT_SECRET ?? '',
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI ?? ''
  },
  
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL ?? '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
  },
  
  // Copilot Studio Configuration
  copilotStudio: {
    endpoint: import.meta.env.VITE_COPILOT_STUDIO_ENDPOINT ?? '',
    apiVersion: import.meta.env.VITE_COPILOT_API_VERSION ?? '',
    botId: import.meta.env.VITE_COPILOT_BOT_ID ?? '',
    apiKey: import.meta.env.VITE_COPILOT_API_KEY ?? ''
  },
  
  // ARES Schema Configuration
  ares: {
    schema: import.meta.env.VITE_ARES_SCHEMA ?? ''
  },
  
  // Alternative Channel Credentials
  channels: {
    slack: {
      botToken: import.meta.env.VITE_SLACK_BOT_TOKEN ?? ''
    },
    asana: {
      apiKey: import.meta.env.VITE_ASANA_API_KEY ?? ''
    },
    onedrive: {
      token: import.meta.env.VITE_ONEDRIVE_TOKEN ?? ''
    },
    teams: {
      token: import.meta.env.VITE_TEAMS_TOKEN ?? ''
    }
  },
  
  // Microsoft 365 Integration
  microsoft365: {
    tenantId: import.meta.env.VITE_MICROSOFT_TENANT_ID ?? '',
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID ?? '',
    clientSecret: import.meta.env.VITE_MICROSOFT_CLIENT_SECRET ?? '',
    redirectUri: import.meta.env.VITE_MICROSOFT_REDIRECT_URI ?? ''
  },
  
  // Power Platform Integration
  powerPlatform: {
    powerApps: {
      environmentId: import.meta.env.VITE_POWERAPPS_ENVIRONMENT_ID ?? '',
      appId: import.meta.env.VITE_POWERAPPS_APP_ID ?? '',
      apiKey: import.meta.env.VITE_POWERAPPS_API_KEY ?? ''
    },
    powerPages: {
      siteId: import.meta.env.VITE_POWERPAGES_SITE_ID ?? '',
      apiKey: import.meta.env.VITE_POWERPAGES_API_KEY ?? '',
      customDomain: import.meta.env.VITE_POWERPAGES_CUSTOM_DOMAIN ?? ''
    }
  },
  
  // Dataverse Configuration
  dataverse: {
    environmentUrl: import.meta.env.VITE_DATAVERSE_ENVIRONMENT_URL ?? '',
    apiKey: import.meta.env.VITE_DATAVERSE_API_KEY ?? '',
    tablePrefix: import.meta.env.VITE_DATAVERSE_TABLE_PREFIX ?? ''
  },
  
  // Teams Configuration
  teams: {
    tenantId: import.meta.env.VITE_TEAMS_TENANT_ID ?? '',
    botId: import.meta.env.VITE_TEAMS_BOT_ID ?? '',
    apiKey: import.meta.env.VITE_TEAMS_API_KEY ?? ''
  },
  
  // OneDrive Configuration
  oneDrive: {
    businessTenantId: import.meta.env.VITE_ONEDRIVE_BUSINESS_TENANT_ID ?? '',
    personalToken: import.meta.env.VITE_ONEDRIVE_PERSONAL_TOKEN ?? '',
    businessToken: import.meta.env.VITE_ONEDRIVE_BUSINESS_TOKEN ?? ''
  },
  
  // Environment
  environment: {
    nodeEnv: import.meta.env.NODE_ENV ?? 'development'
  }
};

// Configuration validation
export function validateARESConfig(): {
  isValid: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Required configurations
  if (!aresEnvironmentConfig.azureOpenAI.apiKey) {
    missing.push('Azure OpenAI API Key');
  }
  
  if (!aresEnvironmentConfig.azureAD.tenantId) {
    missing.push('Azure Tenant ID');
  }
  
  if (!aresEnvironmentConfig.azureAD.clientId) {
    missing.push('Azure Client ID');
  }
  
  if (!aresEnvironmentConfig.supabase.url) {
    missing.push('Supabase URL');
  }
  
  if (!aresEnvironmentConfig.supabase.anonKey) {
    missing.push('Supabase Anon Key');
  }
  
  // Optional but recommended configurations
  if (!aresEnvironmentConfig.channels.slack.botToken) {
    warnings.push('Slack Bot Token not configured - Slack integration disabled');
  }
  
  if (!aresEnvironmentConfig.channels.asana.apiKey) {
    warnings.push('Asana API Key not configured - Asana integration disabled');
  }
  
  if (!aresEnvironmentConfig.channels.onedrive.token) {
    warnings.push('OneDrive Token not configured - OneDrive integration disabled');
  }
  
  if (!aresEnvironmentConfig.channels.teams.token) {
    warnings.push('Teams Token not configured - Teams integration disabled');
  }
  
  if (!aresEnvironmentConfig.microsoft365.clientSecret) {
    warnings.push('Microsoft 365 Client Secret not configured - OAuth flow disabled');
  }
  
  return {
    isValid: missing.length === 0,
    missing,
    warnings
  };
}

// Get configuration status
export function getARESConfigStatus(): {
  azureOpenAI: boolean;
  azureAD: boolean;
  supabase: boolean;
  copilotStudio: boolean;
  channels: {
    slack: boolean;
    asana: boolean;
    onedrive: boolean;
    teams: boolean;
  };
  microsoft365: boolean;
  powerPlatform: boolean;
  dataverse: boolean;
} {
  return {
    azureOpenAI: !!aresEnvironmentConfig.azureOpenAI.apiKey,
    azureAD: !!(aresEnvironmentConfig.azureAD.tenantId && aresEnvironmentConfig.azureAD.clientId),
    supabase: !!(aresEnvironmentConfig.supabase.url && aresEnvironmentConfig.supabase.anonKey),
    copilotStudio: !!(aresEnvironmentConfig.copilotStudio.endpoint && aresEnvironmentConfig.copilotStudio.botId),
    channels: {
      slack: !!aresEnvironmentConfig.channels.slack.botToken,
      asana: !!aresEnvironmentConfig.channels.asana.apiKey,
      onedrive: !!aresEnvironmentConfig.channels.onedrive.token,
      teams: !!aresEnvironmentConfig.channels.teams.token
    },
    microsoft365: !!(aresEnvironmentConfig.microsoft365.tenantId && aresEnvironmentConfig.microsoft365.clientId),
    powerPlatform: !!(aresEnvironmentConfig.powerPlatform.powerApps.environmentId || aresEnvironmentConfig.powerPlatform.powerPages.siteId),
    dataverse: !!(aresEnvironmentConfig.dataverse.environmentUrl && aresEnvironmentConfig.dataverse.apiKey)
  };
}

// Export singleton instance
export default aresEnvironmentConfig;
