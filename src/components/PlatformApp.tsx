import React, { useState, useEffect } from 'react'
import { platformPermissions, UserRole } from '@/lib/platformPermissions'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Settings, 
  Users, 
  Crown, 
  Shield, 
  Zap, 
  Brain, 
  Target,
  BarChart3,
  MessageSquare,
  Camera,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wifi,
  WifiOff as WifiSlash,
  Database,
  Network,
  Activity,
  Sparkles,
  Building,
  Globe,
  Star,
  Award,
  Command,
  Lock,
  Unlock
} from 'lucide-react'
import { BrandHeader } from './BrandHeader'

interface PlatformAppProps {
  initialRole?: UserRole
}

export function PlatformApp({ initialRole = 'field-tech' }: PlatformAppProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    platformPermissions.setRole(currentRole)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [currentRole])

  const config = platformPermissions.getCurrentConfig()
  const availableFeatures = platformPermissions.getAvailableFeatures()
  const restrictedFeatures = platformPermissions.getRestrictedFeatures()

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role)
    platformPermissions.setRole(role)
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'field-tech': return <Target className="w-4 h-4" />
      case 'office-manager': return <Users className="w-4 h-4" />
      case 'full-access': return <Crown className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'field-tech': return 'text-blue-400'
      case 'office-manager': return 'text-purple-400'
      case 'full-access': return 'text-yellow-400'
    }
  }

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'field-tech': return 'Field technician with job-specific access'
      case 'office-manager': return 'Office manager with team oversight capabilities'
      case 'full-access': return 'Complete system access with evolution capabilities'
    }
  }

  return (
    <div className={`min-h-screen ${config.theme === 'full' ? 'bg-gradient-to-br from-gray-900 via-black to-purple-900' : 'bg-background'}`}>
      {/* Brand Header */}
      <BrandHeader 
        isOfficeMode={config.theme === 'full'} 
        showPrinciple={true} 
        variant="header" 
      />
      
      {/* Platform Status Bar */}
      <div className={`${config.theme === 'full' ? 'bg-black/90 backdrop-blur-sm border-b-2 border-cyan-400/30' : 'bg-card border-b'} p-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? <Wifi className="mr-1" /> : <WifiSlash className="mr-1" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          <Badge variant="outline" className={getRoleColor(currentRole)}>
            {getRoleIcon(currentRole)}
            <span className="ml-1">{currentRole.replace('-', ' ').toUpperCase()}</span>
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            {availableFeatures.length} Features Available
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {getRoleDescription(currentRole)}
          </span>
        </div>
      </div>

      {/* Platform Selector */}
      <div className="p-4">
        <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Platform Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={currentRole === 'field-tech' ? 'default' : 'outline'}
                className={`${currentRole === 'field-tech' ? 'bg-blue-500' : ''} ${config.theme === 'full' ? 'glass' : ''}`}
                onClick={() => handleRoleChange('field-tech')}
              >
                <Target className="w-4 h-4 mr-2" />
                GooseOps Lite
                <Badge variant="secondary" className="ml-2">Field Tech</Badge>
              </Button>
              <Button
                variant={currentRole === 'office-manager' ? 'default' : 'outline'}
                className={`${currentRole === 'office-manager' ? 'bg-purple-500' : ''} ${config.theme === 'full' ? 'glass' : ''}`}
                onClick={() => handleRoleChange('office-manager')}
              >
                <Users className="w-4 h-4 mr-2" />
                GooseOps Office
                <Badge variant="secondary" className="ml-2">Office Manager</Badge>
              </Button>
              <Button
                variant={currentRole === 'full-access' ? 'default' : 'outline'}
                className={`${currentRole === 'full-access' ? 'bg-yellow-500' : ''} ${config.theme === 'full' ? 'glass' : ''}`}
                onClick={() => handleRoleChange('full-access')}
              >
                <Crown className="w-4 h-4 mr-2" />
                GooseOps Full
                <Badge variant="secondary" className="ml-2">Full Access</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Platform Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className={`grid w-full ${config.theme === 'full' ? 'bg-black/90 border-cyan-400/30' : ''} grid-cols-8`}>
          <TabsTrigger value="dashboard" className={config.theme === 'full' ? 'text-cyan-400 data-[state=active]:bg-cyan-900/40' : ''}>
            <Activity className="mr-1" size={16} />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="jobs" className={config.theme === 'full' ? 'text-cyan-400 data-[state=active]:bg-cyan-900/40' : ''}>
            <Target className="mr-1" size={16} />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="tasks" className={config.theme === 'full' ? 'text-cyan-400 data-[state=active]:bg-cyan-900/40' : ''}>
            <CheckCircle className="mr-1" size={16} />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="communication" className={config.theme === 'full' ? 'text-cyan-400 data-[state=active]:bg-cyan-900/40' : ''}>
            <MessageSquare className="mr-1" size={16} />
            Messages
          </TabsTrigger>
          <TabsTrigger value="analytics" disabled={!platformPermissions.canAccess('analytics')} className={config.theme === 'full' ? 'text-cyan-400 data-[state=active]:bg-cyan-900/40' : ''}>
            <BarChart3 className="mr-1" size={16} />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="ai" disabled={!platformPermissions.canAccess('ai')} className={config.theme === 'full' ? 'text-cyan-400 data-[state=active]:bg-cyan-900/40' : ''}>
            <Brain className="mr-1" size={16} />
            AI
          </TabsTrigger>
          <TabsTrigger value="integrations" disabled={!platformPermissions.canAccess('integrations')} className={config.theme === 'full' ? 'text-cyan-400 data-[state=active]:bg-cyan-900/40' : ''}>
            <Network className="mr-1" size={16} />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="system" disabled={!platformPermissions.canAccess('system-control')} className={config.theme === 'full' ? 'text-cyan-400 data-[state=active]:bg-cyan-900/40' : ''}>
            <Settings className="mr-1" size={16} />
            System
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="p-4">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Platform Dashboard</h2>

            {/* Platform Status */}
            <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Platform Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{availableFeatures.length}</div>
                    <div className="text-xs text-muted-foreground">Available Features</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{restrictedFeatures.length}</div>
                    <div className="text-xs text-muted-foreground">Restricted Features</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{config.theme}</div>
                    <div className="text-xs text-muted-foreground">Platform Theme</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Features */}
            <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span>Available Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableFeatures.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Restricted Features */}
            {restrictedFeatures.length > 0 && (
              <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    <span>Restricted Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {restrictedFeatures.map((feature) => (
                      <Badge key={feature} variant="destructive" className="text-xs">
                        {feature.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Job Management</h2>
            <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Job management interface will be implemented here</p>
                  <p className="text-sm mt-2">Platform: {config.branding}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Task Management</h2>
            <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Task management interface will be implemented here</p>
                  <p className="text-sm mt-2">Platform: {config.branding}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Communication</h2>
            <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Communication interface will be implemented here</p>
                  <p className="text-sm mt-2">Platform: {config.branding}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics interface will be implemented here</p>
                  <p className="text-sm mt-2">Platform: {config.branding}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Tab */}
        <TabsContent value="ai" className="p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">AI Systems</h2>
            <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>AI systems interface will be implemented here</p>
                  <p className="text-sm mt-2">Platform: {config.branding}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Integrations</h2>
            <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Integrations interface will be implemented here</p>
                  <p className="text-sm mt-2">Platform: {config.branding}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">System Control</h2>
            <Card className={config.theme === 'full' ? 'glass border-white/20' : ''}>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>System control interface will be implemented here</p>
                  <p className="text-sm mt-2">Platform: {config.branding}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Brand Footer */}
      <BrandHeader 
        isOfficeMode={config.theme === 'full'} 
        showPrinciple={true} 
        variant="footer" 
      />
    </div>
  )
}

export default PlatformApp
