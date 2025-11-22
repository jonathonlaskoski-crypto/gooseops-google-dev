import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useOnlineStatus, offlineSync } from '@/lib/offlineSync';
import { WifiHigh, WifiSlash, ArrowClockwise, CloudArrowUp } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface OfflineStatusProps {
  className?: string;
  showSyncDetails?: boolean;
}

export function OfflineStatus({ className = '', showSyncDetails = false }: OfflineStatusProps) {
  const { isOnline, syncStatus } = useOnlineStatus();

  const handleRetrySync = () => {
    offlineSync.retryFailed();
    toast.success('Retrying failed sync items...');
  };

  const handleClearCompleted = () => {
    offlineSync.clearCompleted();
    toast.success('Cleared completed sync items');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={isOnline ? "default" : "destructive"}>
        {isOnline ? <WifiHigh className="mr-1" size={14} /> : <WifiSlash className="mr-1" size={14} />}
        {isOnline ? 'Online' : 'Offline'}
      </Badge>

      {/* If there are pending items, show count badge */}
      {syncStatus.pending > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary">
                <CloudArrowUp className="mr-1" size={14} />
                {syncStatus.pending} pending
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Items waiting to sync when back online</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* If there are failed items, show count badge with retry option */}
      {syncStatus.failed > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="destructive"
                className="cursor-pointer"
                onClick={handleRetrySync}
              >
                <ArrowClockwise className="mr-1" size={14} />
                {syncStatus.failed} failed
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to retry failed sync operations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Detailed sync status for admin view */}
      {showSyncDetails && (
        <div className="ml-4 p-2 bg-muted rounded text-xs">
          <div className="flex items-center gap-4">
            <span>Total: {syncStatus.total}</span>
            <span>Completed: {syncStatus.completed}</span>
            <span>Pending: {syncStatus.pending}</span>
            <span>Failed: {syncStatus.failed}</span>
            {syncStatus.completed > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearCompleted}
                className="h-6 text-xs"
              >
                Clear Completed
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
