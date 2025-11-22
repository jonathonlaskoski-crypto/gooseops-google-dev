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

import {
  securityService,
  type SecurityEvent,
  type SecurityEventType,
  type SecurityLevel
} from '@/lib/securityService';

import {
  Shield,
  ShieldCheck,
  ShieldWarning,
  ShieldSlash as ShieldX,
  Key,
  Lock,
  Eye,
  EyeSlash,
  GearSix,
  FileText,
  FolderLock,
  Database,
  Graph,
  List,
  PencilLine
} from '@phosphor-icons/react';

export function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [filterLevel, setFilterLevel] = useState<SecurityLevel | 'all'>('all');
  const [filterType, setFilterType] = useState<SecurityEventType | 'all'>('all');
  const [persistenceEnabled, setPersistenceEnabled] = useState(false);
  const [persistenceEndpoint, setPersistenceEndpoint] = useState('');
  const [persistenceApiKey, setPersistenceApiKey] = useState('');
  const [eventStats, setEventStats] = useState({
    critical: 0,
    warning: 0,
    info: 0,
    blocked: 0,
    total: 0
  });

  // Load security events
  useEffect(() => {
    const filter: any = {};
    if (filterLevel !== 'all') filter.level = filterLevel;
    if (filterType !== 'all') filter.type = filterType;

    const events = securityService.auditJournal.getEvents(filter);
    setSecurityEvents(events);

    // Calculate stats
    const stats = {
      critical: 0,
      warning: 0,
      info: 0,
      blocked: 0,
      total: events.length
    };

    events.forEach(event => {
      if (event.level === 'critical' || event.level === 'emergency') stats.critical++;
      if (event.level === 'warning') stats.warning++;
      if (event.level === 'info') stats.info++;
      if (event.status === 'blocked') stats.blocked++;
    });

    setEventStats(stats);
  }, [filterLevel, filterType]);

  // Save persistence settings
  const handleSavePersistence = () => {
    securityService.auditJournal.saveSettings({
      persistenceEnabled,
      persistenceEndpoint,
      persistenceApiKey
    });

    securityService.logSecurityEvent({
      type: 'system',
      level: 'info',
      action: 'update_audit_settings',
      status: 'success',
      details: {
        persistenceEnabled,
        persistenceEndpoint: persistenceEndpoint ? '***' : ''
      }
    });

    // Refresh events
    const events = securityService.auditJournal.getEvents();
    setSecurityEvents(events);
  };

  // Add test security event
  const handleAddTestEvent = () => {
    securityService.logSecurityEvent({
      type: 'system',
      level: 'info',
      action: 'test_security_event',
      status: 'success',
      details: {
        message: 'This is a test security event',
        timestamp: new Date().toISOString()
      }
    });

    // Refresh events
    const events = securityService.auditJournal.getEvents();
    setSecurityEvents(events);
  };

  const renderLevelBadge = (level: SecurityLevel) => {
    switch (level) {
      case 'emergency':
      case 'critical':
        return <Badge variant="destructive">
          <ShieldX className="mr-1 h-3 w-3" />
          {level}
        </Badge>;
      case 'warning':
        return <Badge variant="warning">
          <ShieldWarning className="mr-1 h-3 w-3" />
          {level}
        </Badge>;
      case 'info':
      default:
        return <Badge variant="outline">
          <ShieldCheck className="mr-1 h-3 w-3" />
          {level}
        </Badge>;
    }
  };

  const renderStatusBadge = (status: 'success' | 'failure' | 'blocked') => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'failure':
        return <Badge variant="destructive">Failed</Badge>;
      case 'blocked':
        return <Badge variant="warning">Blocked</Badge>;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Total events logged</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{eventStats.critical}</div>
            <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{eventStats.warning}</div>
            <p className="text-xs text-muted-foreground mt-1">Potential security issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{eventStats.blocked}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully blocked threats</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            View and manage security events from the GooseOps Audit Journal
          </CardDescription>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter-level">Level</Label>
              <select
                id="filter-level"
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as SecurityLevel | 'all')}
              >
                <option value="all">All Levels</option>
                <option value="emergency">Emergency</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter-type">Type</Label>
              <select
                id="filter-type"
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as SecurityEventType | 'all')}
              >
                <option value="all">All Types</option>
                <option value="authentication">Authentication</option>
                <option value="authorization">Authorization</option>
                <option value="data_access">Data Access</option>
                <option value="system">System</option>
                <option value="api">API</option>
              </select>
            </div>
            <Button variant="outline" onClick={handleAddTestEvent} className="ml-auto">
              Add Test Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.length > 0 ? (
                securityEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs">
                      {new Date(event.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {renderLevelBadge(event.level)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.type}</Badge>
                    </TableCell>
                    <TableCell>{event.action}</TableCell>
                    <TableCell>
                      {renderStatusBadge(event.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No security events found. Try changing your filters or add a test event.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfigTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit Journal Configuration</CardTitle>
          <CardDescription>
            Configure how security events are logged and persisted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enable Persistent Logging</h4>
                <p className="text-sm text-muted-foreground">
                  Store security events in a remote persistent storage
                </p>
              </div>
              <Switch
                checked={persistenceEnabled}
                onCheckedChange={setPersistenceEnabled}
              />
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="persistence-endpoint">Persistence Endpoint</Label>
                <Input
                  id="persistence-endpoint"
                  placeholder="https://your-logging-endpoint.com/api/logs"
                  value={persistenceEndpoint}
                  onChange={(e) => setPersistenceEndpoint(e.target.value)}
                  disabled={!persistenceEnabled}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="persistence-api-key">API Key</Label>
                <Input
                  id="persistence-api-key"
                  type="password"
                  placeholder="Your API key"
                  value={persistenceApiKey}
                  onChange={(e) => setPersistenceApiKey(e.target.value)}
                  disabled={!persistenceEnabled}
                />
              </div>

              <Button onClick={handleSavePersistence}>
                Save Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Security Policy</CardTitle>
          <CardDescription>
            Configure your Content Security Policy settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-xs whitespace-pre-wrap border p-4 rounded-md bg-muted">
            {securityService.cspManager.generateCSPString()}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Key className="h-4 w-4" />
        <AlertTitle>Security Settings</AlertTitle>
        <AlertDescription>
          Changes to security settings are logged in the audit journal and may require additional authentication in production environments.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage application security settings
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Shield className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="audit">
            <FileText className="mr-2 h-4 w-4" />
            Audit Journal
          </TabsTrigger>
          <TabsTrigger value="config">
            <GearSix className="mr-2 h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4">
          {renderOverviewTab()}
        </TabsContent>
        <TabsContent value="audit" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Audit Journal</CardTitle>
              <CardDescription>
                Complete log of all security-related events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-xs">
                        {new Date(event.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {renderLevelBadge(event.level)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.type}</Badge>
                      </TableCell>
                      <TableCell>{event.userName || '-'}</TableCell>
                      <TableCell>{event.action}</TableCell>
                      <TableCell>{event.resource || '-'}</TableCell>
                      <TableCell>
                        {renderStatusBadge(event.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="config" className="pt-4">
          {renderConfigTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
