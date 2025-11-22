import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useKV } from '@github/spark/hooks';

import {
  PowerAutomateFlow,
  PowerAppConfig,
  powerPlatform,
  DataverseConfig
} from '@/lib/powerPlatform';

import { 
  Play, 
  Pause, 
  Gear, 
  Info, 
  PlusCircle, 
  GearSix, 
  Database, 
  ArrowsClockwise,
  CheckCircle,
  WarningCircle,
  LightningSlash
} from '@phosphor-icons/react';

export function PowerPlatformDashboard() {
  const [activeTab, setActiveTab] = useState('flows');
  const [flows, setFlows] = useState<PowerAutomateFlow[]>([]);
  const [apps, setApps] = useState<PowerAppConfig[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [powerAutomateApiKey, setPowerAutomateApiKey] = useKV<string>('power-automate-api-key', '');
  const [powerAutomateEnvironment, setPowerAutomateEnvironment] = useKV<string>('power-automate-environment', '');
  const [dataverseApiKey, setDataverseApiKey] = useKV<string>('dataverse-api-key', '');
  const [dataverseEnvironment, setDataverseEnvironment] = useKV<string>('dataverse-environment', '');
  const [powerAppsEnvironment, setPowerAppsEnvironment] = useKV<string>('powerapps-environment', '');
  
  useEffect(() => {
    // Check if Power Platform is configured
    const configured = powerPlatform.isConfigured();
    setIsConfigured(configured);
    
    // If not configured, show dialog
    if (!configured && !showConfigDialog) {
      setShowConfigDialog(true);
    }
    
    // Get flows and apps
    setFlows(powerPlatform.powerAutomate.getFlows());
    setApps(powerPlatform.powerApps.getApps());
  }, [showConfigDialog]);
  
  const handleSaveConfig = () => {
    // In a real app, we would apply these settings to the services
    // For now, we'll just close the dialog
    setShowConfigDialog(false);
  };
  
  const handleToggleFlow = (flowId: string, enabled: boolean) => {
    const status = enabled ? 'enabled' : 'disabled';
    const success = powerPlatform.powerAutomate.setFlowStatus(flowId, status);
    
    if (success) {
      setFlows([...powerPlatform.powerAutomate.getFlows()]);
    }
  };
  
  // Sample Dataverse schema for initialization
  const initializeDataverse = () => {
    const config: DataverseConfig = {
      environmentUrl: `https://${dataverseEnvironment}.crm.dynamics.com`,
      tables: {
        'jobs': {
          displayName: 'Jobs',
          apiName: 'rds_jobs',
          primaryKey: 'rds_jobid',
          fields: {
            'rds_name': {
              displayName: 'Name',
              type: 'String',
              required: true
            },
            'rds_jobtype': {
              displayName: 'Job Type',
              type: 'OptionSet',
              required: true
            },
            'rds_customer': {
              displayName: 'Customer',
              type: 'Lookup',
              required: true
            },
            'rds_scheduledstart': {
              displayName: 'Scheduled Start',
              type: 'DateTime',
              required: true
            }
          }
        },
        'tasks': {
          displayName: 'Tasks',
          apiName: 'rds_tasks',
          primaryKey: 'rds_taskid',
          fields: {
            'rds_name': {
              displayName: 'Name',
              type: 'String',
              required: true
            },
            'rds_job': {
              displayName: 'Job',
              type: 'Lookup',
              required: true
            },
            'rds_completed': {
              displayName: 'Completed',
              type: 'Boolean',
              required: false
            }
          }
        }
      }
    };
    
    powerPlatform.initDataverse(config);
    setIsConfigured(true);
  };
  
  const renderFlowsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Power Automate Flows</h3>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Flow
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Trigger</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flows.map((flow) => (
            <TableRow key={flow.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{flow.name}</div>
                  <div className="text-sm text-muted-foreground">{flow.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{flow.triggerType}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Badge 
                    variant={flow.status === 'enabled' ? 'default' : 'secondary'}
                    className="mr-2"
                  >
                    {flow.status === 'enabled' ? 'Enabled' : 'Disabled'}
                  </Badge>
                  {flow.lastStatus && (
                    <Badge 
                      variant={flow.lastStatus === 'success' ? 'success' : 'destructive'}
                    >
                      {flow.lastStatus === 'success' ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <WarningCircle className="mr-1 h-3 w-3" />
                      )}
                      {flow.lastStatus}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {flow.lastRun ? new Date(flow.lastRun).toLocaleString() : 'Never'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Switch
                    checked={flow.status === 'enabled'}
                    onCheckedChange={(checked) => handleToggleFlow(flow.id, checked)}
                  />
                  <Button variant="ghost" size="icon">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Gear className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {flows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No flows configured yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Power Automate</AlertTitle>
        <AlertDescription>
          Power Automate flows can be triggered from your app to automate business processes. 
          Configure flows in the Power Automate portal and add them here to integrate with your app.
        </AlertDescription>
      </Alert>
    </div>
  );
  
  const renderAppsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Power Apps</h3>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add App
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
              <CardDescription>{app.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">URL:</span>
                  <a 
                    href={app.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Open
                  </a>
                </div>
                <Button variant="default" size="sm" className="w-full">
                  Embed
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {apps.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No apps configured yet.
          </div>
        )}
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Power Apps</AlertTitle>
        <AlertDescription>
          Power Apps can be embedded in your application to provide custom business logic. 
          Create apps in the Power Apps portal and add them here to embed in your app.
        </AlertDescription>
      </Alert>
    </div>
  );
  
  const renderDataverseTab = () => {
    const isDataverseConfigured = powerPlatform.dataverse.isConfigured();
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Dataverse</h3>
          {isDataverseConfigured && (
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Table
            </Button>
          )}
        </div>
        
        {isDataverseConfigured ? (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>API Name</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Jobs</div>
                  </TableCell>
                  <TableCell>rds_jobs</TableCell>
                  <TableCell>4 fields</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Schema</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Tasks</div>
                  </TableCell>
                  <TableCell>rds_tasks</TableCell>
                  <TableCell>3 fields</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Schema</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center space-y-4 border rounded-lg">
            <LightningSlash className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">Dataverse Not Configured</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Dataverse provides a secure and scalable data service for your app. 
              Configure Dataverse to enable data storage and integration with Power Apps and Power Automate.
            </p>
            <Button onClick={initializeDataverse}>Initialize Dataverse</Button>
          </div>
        )}
        
        <Alert>
          <Database className="h-4 w-4" />
          <AlertTitle>Dataverse</AlertTitle>
          <AlertDescription>
            Dataverse is a secure and scalable data service for your app. 
            It provides a foundation for Power Apps and Power Automate workflows.
          </AlertDescription>
        </Alert>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Power Platform Integration</h2>
          <p className="text-muted-foreground">
            Manage your Microsoft Power Platform integrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={isConfigured ? "default" : "destructive"}
            className="text-xs"
          >
            {isConfigured ? 'Configured' : 'Not Configured'}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowConfigDialog(true)}
          >
            <GearSix className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="flows">
            <ArrowsClockwise className="mr-2 h-4 w-4" />
            Power Automate
          </TabsTrigger>
          <TabsTrigger value="apps">
            <Play className="mr-2 h-4 w-4" />
            Power Apps
          </TabsTrigger>
          <TabsTrigger value="dataverse">
            <Database className="mr-2 h-4 w-4" />
            Dataverse
          </TabsTrigger>
        </TabsList>
        <TabsContent value="flows" className="pt-4">
          {renderFlowsTab()}
        </TabsContent>
        <TabsContent value="apps" className="pt-4">
          {renderAppsTab()}
        </TabsContent>
        <TabsContent value="dataverse" className="pt-4">
          {renderDataverseTab()}
        </TabsContent>
      </Tabs>
      
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Configure Power Platform Integration</DialogTitle>
            <DialogDescription>
              Enter your Power Platform connection details to enable integration with Power Automate, Power Apps, and Dataverse.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Power Automate</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="powerAutomateApiKey">API Key</Label>
                  <Input
                    id="powerAutomateApiKey"
                    type="password"
                    value={powerAutomateApiKey}
                    onChange={(e) => setPowerAutomateApiKey(e.target.value)}
                    placeholder="Enter your Power Automate API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="powerAutomateEnvironment">Environment</Label>
                  <Input
                    id="powerAutomateEnvironment"
                    value={powerAutomateEnvironment}
                    onChange={(e) => setPowerAutomateEnvironment(e.target.value)}
                    placeholder="e.g., contoso-prod"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dataverse</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dataverseApiKey">API Key</Label>
                  <Input
                    id="dataverseApiKey"
                    type="password"
                    value={dataverseApiKey}
                    onChange={(e) => setDataverseApiKey(e.target.value)}
                    placeholder="Enter your Dataverse API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataverseEnvironment">Environment</Label>
                  <Input
                    id="dataverseEnvironment"
                    value={dataverseEnvironment}
                    onChange={(e) => setDataverseEnvironment(e.target.value)}
                    placeholder="e.g., contoso-prod"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Power Apps</h3>
              <div className="space-y-2">
                <Label htmlFor="powerAppsEnvironment">Environment</Label>
                <Input
                  id="powerAppsEnvironment"
                  value={powerAppsEnvironment}
                  onChange={(e) => setPowerAppsEnvironment(e.target.value)}
                  placeholder="e.g., contoso-prod"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>Save Configuration</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
