import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
  MessageSquare, 
  Send, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Network,
  Users,
  Mail,
  Phone,
  Slack,
  Calendar,
  FileText,
  Zap,
  Brain,
  Shield,
  Activity,
  BarChart3,
  Globe,
  Bot
} from 'lucide-react'
import { aresCommunication, CommunicationChannel, CommunicationMessage } from '@/lib/communicationLanes'
import { brandManager } from '@/lib/logoIntegration'

interface ARESCommunicationProps {
  isOfficeMode?: boolean
}

export function ARESCommunication({ isOfficeMode = false }: ARESCommunicationProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'channels' | 'messages' | 'settings' | 'test'>('dashboard')
  const [channels, setChannels] = useState<CommunicationChannel[]>([])
  const [messages, setMessages] = useState<CommunicationMessage[]>([])
  const [status, setStatus] = useState<any>(null)
  const [testMessage, setTestMessage] = useState({
    channelId: '',
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  })

  useEffect(() => {
    loadChannels()
    loadMessages()
    loadStatus()
    
    const interval = setInterval(() => {
      loadMessages()
      loadStatus()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const loadChannels = () => {
    const channelArray = Array.from(aresCommunication['config'].channels.values())
    setChannels(channelArray)
  }

  const loadMessages = () => {
    const messageHistory = aresCommunication.getMessageHistory(20)
    setMessages(messageHistory)
  }

  const loadStatus = () => {
    const communicationStatus = aresCommunication.getStatus()
    setStatus(communicationStatus)
  }

  const toggleChannel = async (channelId: string) => {
    const channel = aresCommunication['config'].channels.get(channelId)
    if (channel) {
      channel.isActive = !channel.isActive
      loadChannels()
    }
  }

  const sendTestMessage = async () => {
    if (!testMessage.channelId || !testMessage.title || !testMessage.content) return

    try {
      const messageId = await aresCommunication.sendMessage({
        channelId: testMessage.channelId,
        type: 'notification',
        title: testMessage.title,
        content: testMessage.content,
        priority: testMessage.priority,
        metadata: {
          testMessage: true,
          timestamp: new Date().toISOString()
        }
      })

      // Clear form
      setTestMessage({
        channelId: '',
        title: '',
        content: '',
        priority: 'medium'
      })

      // Reload messages
      setTimeout(() => {
        loadMessages()
      }, 1000)

      console.log(`Test message sent with ID: ${messageId}`)
    } catch (error) {
      console.error('Failed to send test message:', error)
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'asana': return <Calendar className="w-4 h-4" />
      case 'highlevel': return <Users className="w-4 h-4" />
      case 'slack': return <Slack className="w-4 h-4" />
      case 'teams': return <Network className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'sms': return <Phone className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'delivered': return <CheckCircle className="w-4 h-4 text-blue-400" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400'
      case 'high': return 'bg-orange-500/20 text-orange-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'low': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className={`h-screen flex flex-col ${isOfficeMode ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white' : 'bg-background text-foreground'}`}>
      {/* Header */}
      <header className={`p-4 ${isOfficeMode ? 'glass border-b border-white/10' : 'border-b'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Bot className={`w-8 h-8 ${isOfficeMode ? 'text-cyan-400 animate-pulse' : 'text-primary'}`} />
            <h1 className={`text-xl font-bold ${isOfficeMode ? 'bg-gradient-to-r from-red-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent' : ''}`}>
              ARES Communication Lanes
            </h1>
            <div className="flex items-center space-x-2">
              <Badge className={status?.isEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {status?.isEnabled ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline" className={isOfficeMode ? 'glass' : ''}>
                {status?.activeChannels || 0} Channels
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'glass' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              <Activity className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'glass' : ''}
              onClick={() => setActiveTab('channels')}
            >
              <Network className="w-4 h-4 mr-2" />
              Channels
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'glass' : ''}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'glass' : ''}
              onClick={() => setActiveTab('test')}
            >
              <Zap className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isOfficeMode ? 'glass' : ''}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Communication Dashboard</h2>

              {/* Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Channels</p>
                        <p className="text-2xl font-bold">{status?.activeChannels || 0}</p>
                      </div>
                      <Network className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Queued Messages</p>
                        <p className="text-2xl font-bold">{status?.queuedMessages || 0}</p>
                      </div>
                      <Clock className="w-8 h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Failed Messages</p>
                        <p className="text-2xl font-bold">{status?.failedMessages || 0}</p>
                      </div>
                      <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Channels</p>
                        <p className="text-2xl font-bold">{status?.totalChannels || 0}</p>
                      </div>
                      <Globe className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Messages */}
              <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <span>Recent Messages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {messages.slice(0, 5).map((message) => (
                      <div key={message.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(message.status)}
                          <div>
                            <p className="font-semibold">{message.title}</p>
                            <p className="text-sm text-muted-foreground">{message.content.substring(0, 50)}...</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Channels Tab */}
        {activeTab === 'channels' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Communication Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {channels.map((channel) => (
                  <Card key={channel.id} className={isOfficeMode ? 'glass border-white/20' : ''}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(channel.type)}
                          <span className="text-sm">{channel.name}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className={channel.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                          onClick={() => toggleChannel(channel.id)}
                        >
                          {channel.isActive ? 'Active' : 'Inactive'}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">Type:</span>
                          <span className="text-xs ml-2">{channel.type}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">Priority:</span>
                          <span className="text-xs ml-2">{channel.priority}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">Capabilities:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {channel.capabilities.slice(0, 3).map((capability) => (
                              <Badge key={capability} variant="outline" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                            {channel.capabilities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{channel.capabilities.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Message History</h2>
              <div className="space-y-3">
                {messages.map((message) => (
                  <Card key={message.id} className={isOfficeMode ? 'glass border-white/20' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getStatusIcon(message.status)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{message.title}</h3>
                              <Badge className={getPriorityColor(message.priority)}>
                                {message.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{message.content}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Channel: {message.channelId}</span>
                              <span>Type: {message.type}</span>
                              <span>Retries: {message.retryCount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Test Tab */}
        {activeTab === 'test' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Test Communication</h2>

              <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>Send Test Message</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Channel</label>
                      <Select value={testMessage.channelId} onValueChange={(value) => setTestMessage(prev => ({ ...prev, channelId: value }))}>
                        <SelectTrigger className={isOfficeMode ? 'glass' : ''}>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          {channels.filter(c => c.isActive).map((channel) => (
                            <SelectItem key={channel.id} value={channel.id}>
                              <div className="flex items-center space-x-2">
                                {getChannelIcon(channel.type)}
                                <span>{channel.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Title</label>
                      <Input
                        value={testMessage.title}
                        onChange={(e) => setTestMessage(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter message title"
                        className={isOfficeMode ? 'glass' : ''}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Content</label>
                      <Textarea
                        value={testMessage.content}
                        onChange={(e) => setTestMessage(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter message content"
                        className={isOfficeMode ? 'glass' : ''}
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Priority</label>
                      <Select value={testMessage.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setTestMessage(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger className={isOfficeMode ? 'glass' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={sendTestMessage}
                      disabled={!testMessage.channelId || !testMessage.title || !testMessage.content}
                      className={isOfficeMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Test Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Test Actions */}
              <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span>Quick Test Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      className={`${isOfficeMode ? 'glass' : ''} border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black`}
                      onClick={() => aresCommunication.sendTaskUpdate('TEST-001', 'Test task update from ARES')}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Test Asana
                    </Button>
                    <Button
                      variant="outline"
                      className={`${isOfficeMode ? 'glass' : ''} border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black`}
                      onClick={() => aresCommunication.sendCustomerNotification('CUST-001', 'Test customer notification from ARES')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Test HighLevel
                    </Button>
                    <Button
                      variant="outline"
                      className={`${isOfficeMode ? 'glass' : ''} border-green-400 text-green-400 hover:bg-green-400 hover:text-black`}
                      onClick={() => aresCommunication.sendTeamAlert('Test alert from ARES communication system')}
                    >
                      <Slack className="w-4 h-4 mr-2" />
                      Test Slack
                    </Button>
                    <Button
                      variant="outline"
                      className={`${isOfficeMode ? 'glass' : ''} border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black`}
                      onClick={() => aresCommunication.sendReport({ test: 'data', timestamp: new Date().toISOString() })}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Test Teams
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Communication Settings</h2>

              <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span>System Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Communication System</span>
                      <Badge className={status?.isEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {status?.isEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Max Retries</span>
                      <span className="text-sm text-muted-foreground">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Retry Delay</span>
                      <span className="text-sm text-muted-foreground">5 seconds</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Batch Size</span>
                      <span className="text-sm text-muted-foreground">10 messages</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={isOfficeMode ? 'glass border-white/20' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{status?.activeChannels || 0}</div>
                      <div className="text-xs text-muted-foreground">Active Channels</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{status?.totalChannels || 0}</div>
                      <div className="text-xs text-muted-foreground">Total Channels</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">{status?.queuedMessages || 0}</div>
                      <div className="text-xs text-muted-foreground">Queued Messages</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-red-400">{status?.failedMessages || 0}</div>
                      <div className="text-xs text-muted-foreground">Failed Messages</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ARESCommunication
