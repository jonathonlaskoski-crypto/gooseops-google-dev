import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OfflineStatus } from '@/components/ui/offline-status';
import { VoiceControl } from '@/components/VoiceControl';
import { useDevice } from '@/hooks/use-mobile';

import {
  List,
  House,
  MapPin,
  CheckCircle,
  ChatCircle,
  Lightning as Zap,
  GearSix,
  SignOut,
  User,
  ArrowLeft
} from '@phosphor-icons/react';

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userName?: string;
  availableTabs: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
  }>;
  onLogout?: () => void;
  header?: React.ReactNode;
}

export function MobileLayout({
  children,
  activeTab,
  onTabChange,
  userName,
  availableTabs,
  onLogout,
  header
}: MobileLayoutProps) {
  // Filter out any advanced tabs that technicians don't need to see
  // This keeps the interface clean and focused on essential field tasks
  const essentialTabs = availableTabs.filter(tab =>
    ['map', 'job-details', 'tasks', 'communication', 'ares-chat'].includes(tab.id)
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const { isPortrait } = useDevice();

  // Select tabs that should appear in the bottom nav (max 5)
  // Only use essential tabs for technicians to keep the interface clean
  const bottomNavTabs = essentialTabs
    .filter(tab => !tab.disabled)
    .slice(0, 5);

  // Rest of the tabs go to drawer menu (still filtered to essentials)
  const drawerTabs = essentialTabs.filter(
    tab => !bottomNavTabs.some(navTab => navTab.id === tab.id)
  );

  // Close sheet when tab changes
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setSheetOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="border-b p-2 flex items-center justify-between">
        {activeTab !== 'map' ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTabChange('map')}
          >
            <ArrowLeft size={18} />
          </Button>
        ) : (
          <div className="flex items-center">
            <House size={18} className="mr-2" />
            <span className="font-semibold">GooseOps</span>
            <Badge variant="outline" className="ml-2 text-xs">Field Tech</Badge>
          </div>
        )}

        <div className="flex items-center">
          <OfflineStatus className="mr-2" />

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <List size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side={isPortrait ? "right" : "left"}>
              <ScrollArea className="h-full">
                <div className="py-4">
                  <div className="flex items-center mb-6">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-2">
                      <User size={24} />
                    </div>
                    <div>
                      <div className="font-medium">{userName || 'User'}</div>
                      <Badge variant="outline" className="text-xs">Field Technician</Badge>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    {drawerTabs.map(tab => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        disabled={tab.disabled}
                        onClick={() => handleTabClick(tab.id)}
                      >
                        {tab.icon}
                        <span className="ml-2">{tab.label}</span>
                      </Button>
                    ))}

                    <Separator className="my-4" />

                    {onLogout && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive"
                        onClick={onLogout}
                      >
                        <SignOut className="mr-2" size={18} />
                        Sign Out
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Optional Sub-Header */}
      {header && (
        <div className="border-b p-2">
          {header}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <Card className="rounded-none border-t">
        <CardContent className="p-0">
          <div className="grid grid-cols-5">
            {bottomNavTabs.map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`flex flex-col items-center justify-center h-16 rounded-none ${activeTab === tab.id ? 'bg-accent' : ''
                  }`}
                onClick={() => handleTabClick(tab.id)}
                disabled={tab.disabled}
              >
                {tab.icon}
                <span className="text-xs mt-1">{tab.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice Control for hands-free operation */}
      <VoiceControl
        onNavigate={(location) => {
          // Handle navigation command
          handleTabClick('map');
          // Additional navigation logic would go here
        }}
        onCheckIn={() => {
          // Handle check-in command
          if (activeTab !== 'job-details') {
            handleTabClick('job-details');
          }
          // Additional check-in logic would be implemented in App.tsx
        }}
        onCompleteTask={(taskId) => {
          // Handle task completion command
          handleTabClick('tasks');
          // Additional task completion logic would be implemented in App.tsx
        }}
        onTakePhoto={() => {
          // Handle photo capture command
          // Photo capture logic would be implemented in App.tsx
        }}
      />
    </div>
  );
}
