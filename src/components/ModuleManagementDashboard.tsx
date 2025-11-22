import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Settings,
  Zap,
  Target,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react';
import { moduleManager, Module } from '@/lib/moduleSystem';

interface ModuleCardProps {
  module: Module;
  onToggle: (moduleId: string, enabled: boolean) => void;
  isLoading: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onToggle, isLoading }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'scope': return <Target className="h-5 w-5 text-blue-500" />;
      case 'ai': return <Zap className="h-5 w-5 text-purple-500" />;
      case 'utility': return <Settings className="h-5 w-5 text-gray-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-green-100 text-green-800';
      case 'scope': return 'bg-blue-100 text-blue-800';
      case 'ai': return 'bg-purple-100 text-purple-800';
      case 'utility': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-all ${module.isActive ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getCategoryIcon(module.category)}
            <div>
              <h3 className="text-lg font-semibold">{module.name}</h3>
              <p className="text-sm text-muted-foreground">v{module.version}</p>
            </div>
          </div>
          <Badge className={getCategoryColor(module.category)}>
            {module.category}
          </Badge>
        </div>

        <p className="text-muted-foreground mb-4">{module.description}</p>

        {module.dependencies.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Dependencies:</p>
            <div className="flex flex-wrap gap-1">
              {module.dependencies.map(dep => (
                <Badge key={dep} variant="outline" className="text-xs">
                  {dep}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={module.isActive}
              onCheckedChange={(checked) => onToggle(module.id, checked)}
              disabled={module.isRequired || isLoading}
            />
            <span className="text-sm">
              {module.isActive ? 'Enabled' : 'Disabled'}
            </span>
            {module.isRequired && (
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            )}
          </div>

          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const ModuleManagementDashboard: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModule, setLoadingModule] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = () => {
    const allModules = [
      ...moduleManager.getModulesByCategory('core'),
      ...moduleManager.getModulesByCategory('scope'),
      ...moduleManager.getModulesByCategory('ai'),
      ...moduleManager.getModulesByCategory('utility')
    ];
    setModules(allModules);
  };

  const handleModuleToggle = async (moduleId: string, enabled: boolean) => {
    setLoadingModule(moduleId);
    setError(null);
    setSuccess(null);

    try {
      if (enabled) {
        await moduleManager.loadModule(moduleId);
        setSuccess(`Module "${moduleManager.getModule(moduleId)?.name}" enabled successfully`);
      } else {
        await moduleManager.unloadModule(moduleId);
        setSuccess(`Module "${moduleManager.getModule(moduleId)?.name}" disabled successfully`);
      }
      loadModules(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle module');
    } finally {
      setLoadingModule(null);
    }
  };

  const coreModules = modules.filter(m => m.category === 'core');
  const scopeModules = modules.filter(m => m.category === 'scope');
  const aiModules = modules.filter(m => m.category === 'ai');
  const utilityModules = modules.filter(m => m.category === 'utility');

  const activeCount = modules.filter(m => m.isActive).length;
  const totalCount = modules.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Module Management</h2>
          <p className="text-muted-foreground">Configure GooseOps modules for optimal performance</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{activeCount}/{totalCount}</div>
          <div className="text-sm text-muted-foreground">Modules Active</div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Performance Mode Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Performance Mode</span>
            </div>
            <Badge variant="outline">
              {activeCount <= 3 ? 'Light' : activeCount <= 6 ? 'Standard' : 'Full'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Current configuration: {activeCount <= 3 ? 'Minimal features for maximum performance' :
                                   activeCount <= 6 ? 'Balanced features and performance' :
                                   'Full feature set with comprehensive capabilities'}
          </p>
        </CardContent>
      </Card>

      {/* Core Modules */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Core Modules</span>
          <Badge variant="secondary">{coreModules.length}</Badge>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreModules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              onToggle={handleModuleToggle}
              isLoading={loadingModule === module.id}
            />
          ))}
        </div>
      </div>

      {/* Business Core Modules */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-500" />
          <span>Business Core Modules</span>
          <Badge variant="secondary">{scopeModules.length}</Badge>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scopeModules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              onToggle={handleModuleToggle}
              isLoading={loadingModule === module.id}
            />
          ))}
        </div>
      </div>

      {/* AI Modules */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-purple-500" />
          <span>AI Enhancement Modules</span>
          <Badge variant="secondary">{aiModules.length}</Badge>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiModules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              onToggle={handleModuleToggle}
              isLoading={loadingModule === module.id}
            />
          ))}
        </div>
      </div>

      {/* Utility Modules */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Settings className="h-5 w-5 text-gray-500" />
          <span>Utility Modules</span>
          <Badge variant="secondary">{utilityModules.length}</Badge>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {utilityModules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              onToggle={handleModuleToggle}
              isLoading={loadingModule === module.id}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                // Enable only core business modules
                const businessModules = ['lead-generation', 'power-automate', 'data-farming', 'rfp-automation'];
                businessModules.forEach(id => handleModuleToggle(id, true));
              }}
            >
              <Target className="h-4 w-4 mr-2" />
              Enable Business Core
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                // Enable minimal set for performance
                const minimalModules = ['auth', 'job-management', 'ai-assistant'];
                modules.forEach(module => {
                  if (!minimalModules.includes(module.id) && !module.isRequired) {
                    handleModuleToggle(module.id, false);
                  }
                });
              }}
            >
              <Zap className="h-4 w-4 mr-2" />
              Performance Mode
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                // Reset to default state
                moduleManager.loadModuleState();
                loadModules();
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};