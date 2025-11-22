/**
 * Power Platform Integration Service
 * 
 * Provides integration with Microsoft Power Platform components:
 * - Power Automate: Custom workflows and automations
 * - Dataverse: Structured data storage
 * - Power Apps: Custom business applications
 * - Power Pages: External-facing portals
 */

// Types
export interface PowerAutomateFlow {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  requiresAuth: boolean;
  triggerType: 'http' | 'scheduled' | 'event' | 'dataverse';
  status: 'enabled' | 'disabled';
  lastRun?: Date;
  lastStatus?: 'success' | 'failed';
}

export interface PowerAppConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  embed?: {
    width: string;
    height: string;
    allowFullScreen: boolean;
  }
}

export interface DataverseConfig {
  environmentUrl: string;
  tables: Record<string, {
    displayName: string;
    apiName: string;
    primaryKey: string;
    fields: Record<string, {
      displayName: string;
      type: string;
      required: boolean;
    }>
  }>
}

// Power Automate Integration
export class PowerAutomateService {
  private flows: PowerAutomateFlow[] = [];
  private apiKey: string;
  private environment: string;
  
  constructor(apiKey: string = '', environment: string = '') {
    this.apiKey = apiKey || import.meta.env.VITE_POWER_AUTOMATE_API_KEY || '';
    this.environment = environment || import.meta.env.VITE_POWER_AUTOMATE_ENVIRONMENT || '';
    
    this.initializeFlows();
  }
  
  private initializeFlows() {
    // These would come from configuration in a real app
    this.flows = [
      {
        id: 'flow-lead-notification',
        name: 'Lead Generation Notification',
        description: 'Notifies sales team of new leads via Teams message',
        endpoint: 'https://prod-27.eastus.logic.azure.com:443/workflows/123456/triggers/manual/paths/invoke',
        requiresAuth: true,
        triggerType: 'http',
        status: 'enabled',
      },
      {
        id: 'flow-rfp-automation',
        name: 'RFP Automation Processing',
        description: 'Processes new RFP opportunities and routes them to the correct team',
        endpoint: 'https://prod-15.eastus.logic.azure.com:443/workflows/789012/triggers/manual/paths/invoke',
        requiresAuth: true,
        triggerType: 'http',
        status: 'enabled',
      },
      {
        id: 'flow-job-scheduling',
        name: 'Field Job Scheduling',
        description: 'Schedules jobs and syncs with Outlook calendars',
        endpoint: 'https://prod-33.eastus.logic.azure.com:443/workflows/345678/triggers/manual/paths/invoke',
        requiresAuth: true,
        triggerType: 'http',
        status: 'disabled',
      },
      {
        id: 'flow-dataverse-sync',
        name: 'Dataverse Job Sync',
        description: 'Synchronizes job data with Dataverse',
        endpoint: 'https://prod-42.eastus.logic.azure.com:443/workflows/901234/triggers/manual/paths/invoke',
        requiresAuth: true,
        triggerType: 'dataverse',
        status: 'disabled',
      }
    ];
  }
  
  /**
   * Triggers a Power Automate flow with provided data
   * 
   * @param flowId The ID of the flow to trigger
   * @param data The data to send to the flow
   * @returns Response from the flow or null if flow not found/failed
   */
  public async triggerFlow<T = any, U = any>(flowId: string, data: T): Promise<U | null> {
    const flow = this.flows.find(f => f.id === flowId);
    if (!flow) {
      console.error(`Flow ${flowId} not found`);
      return null;
    }
    
    if (flow.status === 'disabled') {
      console.warn(`Flow ${flowId} is disabled`);
      return null;
    }
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (flow.requiresAuth && this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      
      const response = await fetch(flow.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Flow response: ${response.status} ${response.statusText}`);
      }
      
      // Update flow metadata
      flow.lastRun = new Date();
      flow.lastStatus = 'success';
      
      // Return response
      const result = await response.json();
      return result as U;
    } catch (error) {
      console.error(`Error triggering flow ${flowId}:`, error);
      
      // Update flow metadata
      flow.lastRun = new Date();
      flow.lastStatus = 'failed';
      
      return null;
    }
  }
  
  /**
   * Get all configured flows
   */
  public getFlows(): PowerAutomateFlow[] {
    return this.flows;
  }
  
  /**
   * Enable or disable a flow
   */
  public setFlowStatus(flowId: string, status: 'enabled' | 'disabled'): boolean {
    const flow = this.flows.find(f => f.id === flowId);
    if (!flow) return false;
    
    flow.status = status;
    return true;
  }
  
  /**
   * Check if the Power Automate integration is properly configured
   */
  public isConfigured(): boolean {
    return Boolean(this.apiKey) && Boolean(this.environment);
  }
}

// Dataverse Integration
export class DataverseService {
  private config: DataverseConfig | null = null;
  private apiKey: string;
  private environment: string;
  
  constructor(apiKey: string = '', environment: string = '') {
    this.apiKey = apiKey || import.meta.env.VITE_DATAVERSE_API_KEY || '';
    this.environment = environment || import.meta.env.VITE_DATAVERSE_ENVIRONMENT || '';
  }
  
  /**
   * Initialize the Dataverse service with table configurations
   * 
   * @param config Dataverse configuration
   */
  public init(config: DataverseConfig) {
    this.config = config;
  }
  
  /**
   * Create a record in Dataverse
   */
  public async createRecord<T>(tableName: string, data: T): Promise<string | null> {
    if (!this.isConfigured() || !this.config) {
      console.error('Dataverse not configured');
      return null;
    }
    
    const table = this.config.tables[tableName];
    if (!table) {
      console.error(`Table ${tableName} not found in configuration`);
      return null;
    }
    
    try {
      const url = `${this.config.environmentUrl}/api/data/v9.2/${table.apiName}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Dataverse response: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result[table.primaryKey];
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error);
      return null;
    }
  }
  
  /**
   * Retrieve a record from Dataverse
   */
  public async getRecord<T>(tableName: string, id: string): Promise<T | null> {
    if (!this.isConfigured() || !this.config) {
      console.error('Dataverse not configured');
      return null;
    }
    
    const table = this.config.tables[tableName];
    if (!table) {
      console.error(`Table ${tableName} not found in configuration`);
      return null;
    }
    
    try {
      const url = `${this.config.environmentUrl}/api/data/v9.2/${table.apiName}(${id})`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Dataverse response: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result as T;
    } catch (error) {
      console.error(`Error retrieving record from ${tableName}:`, error);
      return null;
    }
  }
  
  /**
   * Update a record in Dataverse
   */
  public async updateRecord<T>(tableName: string, id: string, data: T): Promise<boolean> {
    if (!this.isConfigured() || !this.config) {
      console.error('Dataverse not configured');
      return false;
    }
    
    const table = this.config.tables[tableName];
    if (!table) {
      console.error(`Table ${tableName} not found in configuration`);
      return false;
    }
    
    try {
      const url = `${this.config.environmentUrl}/api/data/v9.2/${table.apiName}(${id})`;
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Dataverse response: ${response.status} ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error updating record in ${tableName}:`, error);
      return false;
    }
  }
  
  /**
   * Delete a record from Dataverse
   */
  public async deleteRecord(tableName: string, id: string): Promise<boolean> {
    if (!this.isConfigured() || !this.config) {
      console.error('Dataverse not configured');
      return false;
    }
    
    const table = this.config.tables[tableName];
    if (!table) {
      console.error(`Table ${tableName} not found in configuration`);
      return false;
    }
    
    try {
      const url = `${this.config.environmentUrl}/api/data/v9.2/${table.apiName}(${id})`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Dataverse response: ${response.status} ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting record from ${tableName}:`, error);
      return false;
    }
  }
  
  /**
   * Query records from Dataverse using OData
   */
  public async queryRecords<T>(tableName: string, query: string): Promise<T[]> {
    if (!this.isConfigured() || !this.config) {
      console.error('Dataverse not configured');
      return [];
    }
    
    const table = this.config.tables[tableName];
    if (!table) {
      console.error(`Table ${tableName} not found in configuration`);
      return [];
    }
    
    try {
      const url = `${this.config.environmentUrl}/api/data/v9.2/${table.apiName}?${query}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Dataverse response: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.value as T[];
    } catch (error) {
      console.error(`Error querying records from ${tableName}:`, error);
      return [];
    }
  }
  
  /**
   * Check if the Dataverse integration is properly configured
   */
  public isConfigured(): boolean {
    return Boolean(this.apiKey) && Boolean(this.environment) && Boolean(this.config);
  }
  
  /**
   * Get the table schema
   */
  public getTableSchema(tableName: string) {
    if (!this.config) return null;
    return this.config.tables[tableName] || null;
  }
}

// Power Apps Integration
export class PowerAppsService {
  private apps: PowerAppConfig[] = [];
  private environment: string;
  
  constructor(environment: string = '') {
    this.environment = environment || import.meta.env.VITE_POWERAPPS_ENVIRONMENT || '';
    
    this.initializeApps();
  }
  
  private initializeApps() {
    // These would come from configuration in a real app
    this.apps = [
      {
        id: 'app-job-management',
        name: 'Field Job Management',
        description: 'Comprehensive job management for field technicians',
        url: 'https://apps.powerapps.com/play/123456',
        embed: {
          width: '100%',
          height: '600px',
          allowFullScreen: true
        }
      },
      {
        id: 'app-lead-tracker',
        name: 'Lead Tracker',
        description: 'Track and manage sales leads and opportunities',
        url: 'https://apps.powerapps.com/play/789012',
        embed: {
          width: '100%',
          height: '600px',
          allowFullScreen: true
        }
      },
      {
        id: 'app-equipment-inventory',
        name: 'Equipment Inventory',
        description: 'Track equipment inventory and maintenance history',
        url: 'https://apps.powerapps.com/play/345678',
        embed: {
          width: '100%',
          height: '600px',
          allowFullScreen: true
        }
      }
    ];
  }
  
  /**
   * Get all configured Power Apps
   */
  public getApps(): PowerAppConfig[] {
    return this.apps;
  }
  
  /**
   * Get a specific Power App by ID
   */
  public getApp(appId: string): PowerAppConfig | null {
    return this.apps.find(app => app.id === appId) || null;
  }
  
  /**
   * Generate an iframe embed code for a Power App
   */
  public getEmbedCode(appId: string): string | null {
    const app = this.getApp(appId);
    if (!app || !app.embed) return null;
    
    const { width, height, allowFullScreen } = app.embed;
    return `<iframe width="${width}" height="${height}" src="${app.url}" allowfullscreen="${allowFullScreen}"></iframe>`;
  }
  
  /**
   * Check if the Power Apps integration is properly configured
   */
  public isConfigured(): boolean {
    return Boolean(this.environment) && this.apps.length > 0;
  }
}

// Export singleton instances
export const powerAutomate = new PowerAutomateService();
export const dataverse = new DataverseService();
export const powerApps = new PowerAppsService();

// Combined service for easy usage
export const powerPlatform = {
  powerAutomate,
  dataverse,
  powerApps,
  
  isConfigured(): boolean {
    return powerAutomate.isConfigured() || dataverse.isConfigured() || powerApps.isConfigured();
  },
  
  initDataverse(config: DataverseConfig) {
    dataverse.init(config);
  }
};
