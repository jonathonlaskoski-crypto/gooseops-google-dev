import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Mic,
  MicOff,
  MapPin,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  MessageSquare,
  Camera,
  Navigation,
  Battery,
  Wifi,
  WifiOff,
  Zap
} from 'lucide-react';

interface WorkOrder {
  id: string;
  location: string;
  equipment: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
  estimatedTime: string;
  customer: string;
  address: string;
  phone: string;
}

interface FieldTechProps {
  isMobileMode?: boolean;
}

export const GooseOpsFieldTech: React.FC<FieldTechProps> = ({
  isMobileMode = true
}) => {
  const [isListening, setIsListening] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Oklahoma City, OK');
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [activeWorkOrder, setActiveWorkOrder] = useState<WorkOrder | null>(null);

  // Sample work orders for field tech
  const [workOrders] = useState<WorkOrder[]>([
    {
      id: 'WO-001',
      location: 'QuikTrip #245',
      equipment: 'Coca-Cola Freestyle 774',
      priority: 'high',
      status: 'in_progress',
      estimatedTime: '2.5 hours',
      customer: 'QuikTrip Corporation',
      address: '123 Main St, OKC, OK 73101',
      phone: '(405) 555-0123'
    },
    {
      id: 'WO-002',
      location: '7-11 #789',
      equipment: 'Walk-in Cooler',
      priority: 'critical',
      status: 'pending',
      estimatedTime: '4 hours',
      customer: '7-11 Stores',
      address: '456 Oak Ave, OKC, OK 73102',
      phone: '(405) 555-0456'
    },
    {
      id: 'WO-003',
      location: 'Pilot #123',
      equipment: 'FBD Dispenser',
      priority: 'medium',
      status: 'pending',
      estimatedTime: '1.5 hours',
      customer: 'Pilot Travel Centers',
      address: '789 Highway 40, OKC, OK 73103',
      phone: '(405) 555-0789'
    }
  ]);

  // Voice command recognition (simplified)
  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    // In real implementation, this would integrate with speech recognition API
    if (!isListening) {
      console.log('Listening for voice commands...');
    }
  };

  // Quick actions for field tech
  const quickActions = [
    { icon: Phone, label: 'Call Customer', action: () => console.log('Call customer') },
    { icon: MessageSquare, label: 'Text Update', action: () => console.log('Send text update') },
    { icon: Camera, label: 'Photo', action: () => console.log('Take photo') },
    { icon: Navigation, label: 'Navigate', action: () => console.log('Open navigation') },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return null;
    }
  };

  return (
    <div className={`${isMobileMode ? 'p-2 max-w-sm mx-auto' : 'p-6'}`}>
      {/* Mobile Status Bar */}
      <div className="flex items-center justify-between mb-4 bg-card p-3 rounded-lg border">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">{currentLocation}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Battery className="h-4 w-4" />
            <span className="text-xs">{batteryLevel}%</span>
          </div>
          <div className="flex items-center">
            {networkStatus === 'online' ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Voice Command Button - Large for mobile */}
      <div className="mb-4 flex justify-center">
        <Button
          size="lg"
          variant={isListening ? "destructive" : "default"}
          className="rounded-full h-16 w-16"
          onClick={handleVoiceCommand}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
      </div>

      <div className={`grid gap-4 ${isMobileMode ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {/* Active Work Order */}
        <Card className="col-span-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Active Work Order</CardTitle>
              {activeWorkOrder && getStatusIcon(activeWorkOrder.status)}
            </div>
          </CardHeader>
          <CardContent>
            {activeWorkOrder ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={getPriorityColor(activeWorkOrder.priority)}>
                    {activeWorkOrder.priority.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Est: {activeWorkOrder.estimatedTime}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{activeWorkOrder.location}</h3>
                  <p className="text-sm text-muted-foreground">{activeWorkOrder.equipment}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activeWorkOrder.address}</p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="flex flex-col items-center gap-1 h-auto py-3"
                      onClick={action.action}
                    >
                      <action.icon className="h-4 w-4" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No active work order</p>
                <Button
                  className="mt-3"
                  onClick={() => setActiveWorkOrder(workOrders[0])}
                >
                  Start Next Job
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Order Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Work Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {workOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      activeWorkOrder?.id === order.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setActiveWorkOrder(order)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <Badge variant={getPriorityColor(order.priority)} className="text-xs">
                        {order.priority}
                      </Badge>
                      {getStatusIcon(order.status)}
                    </div>
                    <h4 className="font-medium text-sm">{order.location}</h4>
                    <p className="text-xs text-muted-foreground">{order.equipment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{order.estimatedTime}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Equipment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Parts Inventory</span>
                <Badge variant="default">85% Stocked</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tools Status</span>
                <Badge variant="default">All Checked</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Vehicle Ready</span>
                <Badge variant="default">Yes</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation for Mobile */}
      {isMobileMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4">
          <div className="flex justify-around max-w-sm mx-auto">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
              <Wrench className="h-4 w-4" />
              <span className="text-xs">Jobs</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="text-xs">Map</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Messages</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">Issues</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
