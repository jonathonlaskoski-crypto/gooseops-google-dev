/**
 * GooseOps Lite Offline Sync Service
 * 
 * Provides robust offline capability with background sync, conflict resolution,
 * and queue management for field technicians using the GooseOps Lite mobile experience.
 * 
 * GooseOps Lite is the dedicated field technician version of the platform, optimized for
 * mobile devices and field operations, while the full GooseOps Neural Empire provides
 * expanded functionality for directors and office staff on desktop environments.
 */

import { toast } from 'sonner';
import { supabase } from './supabase';

// Types for sync items
export type SyncAction = 'create' | 'update' | 'delete';

export interface SyncItem {
  id: string;
  timestamp: number;
  table: string;
  action: SyncAction;
  data: any;
  priority: number;
  retries: number;
  conflictResolution?: 'client-wins' | 'server-wins' | 'manual';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

// SyncQueue class
class SyncQueue {
  private queue: SyncItem[] = [];
  private isProcessing: boolean = false;
  private maxRetries: number = 3;
  private syncInterval: number = 30000; // 30 seconds
  private intervalId: ReturnType<typeof setInterval> | null = null;
  
  constructor() {
    // Load queue from localStorage on init
    this.loadQueue();
    
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    // Initial check
    if (navigator.onLine) {
      this.startProcessing();
    }
  }
  
  // Add item to sync queue
  public addItem(item: Omit<SyncItem, 'id' | 'timestamp' | 'retries' | 'status'>): string {
    const id = `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const syncItem: SyncItem = {
      ...item,
      id,
      timestamp: Date.now(),
      retries: 0,
      status: 'pending'
    };
    
    this.queue.push(syncItem);
    this.saveQueue();
    
    if (navigator.onLine && !this.isProcessing) {
      this.startProcessing();
    }
    
    return id;
  }
  
  // Process queue items
  private async processQueue(): Promise<void> {
    if (this.queue.length === 0 || !navigator.onLine) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    
    // Sort by priority (higher number = higher priority)
    const sortedQueue = [...this.queue]
      .filter(item => item.status === 'pending')
      .sort((a, b) => b.priority - a.priority);
    
    if (sortedQueue.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    // Take first item
    const item = sortedQueue[0];
    item.status = 'in-progress';
    this.saveQueue();
    
    try {
      await this.processSyncItem(item);
      
      // Mark as completed
      const index = this.queue.findIndex(i => i.id === item.id);
      if (index >= 0) {
        this.queue[index].status = 'completed';
        this.saveQueue();
      }
      
      // Continue with next item
      setTimeout(() => this.processQueue(), 100);
    } catch (error) {
      console.error('Sync error:', error);
      
      // Update retry count
      const index = this.queue.findIndex(i => i.id === item.id);
      if (index >= 0) {
        this.queue[index].retries += 1;
        this.queue[index].status = 
          this.queue[index].retries >= this.maxRetries ? 'failed' : 'pending';
        this.saveQueue();
        
        if (this.queue[index].status === 'failed') {
          toast.error(`Sync failed after ${this.maxRetries} attempts: ${this.queue[index].table}`);
        }
      }
      
      // Continue with next item after delay
      setTimeout(() => this.processQueue(), 1000);
    }
  }
  
  // Process a single sync item
  private async processSyncItem(item: SyncItem): Promise<void> {
    switch (item.action) {
      case 'create':
        await this.handleCreate(item);
        break;
      case 'update':
        await this.handleUpdate(item);
        break;
      case 'delete':
        await this.handleDelete(item);
        break;
      default:
        throw new Error(`Unknown sync action: ${item.action}`);
    }
  }
  
  // Handle create action
  private async handleCreate(item: SyncItem): Promise<void> {
    const { error } = await supabase
      .from(item.table)
      .insert(item.data);
    
    if (error) throw error;
  }
  
  // Handle update action with conflict resolution
  private async handleUpdate(item: SyncItem): Promise<void> {
    // First check for conflicts if configured
    if (item.conflictResolution) {
      const { data, error } = await supabase
        .from(item.table)
        .select('*')
        .eq('id', item.data.id)
        .single();
      
      if (error) throw error;
      
      // Check if server version is newer than the client's base version
      if (data && data.updated_at && new Date(data.updated_at).getTime() > item.timestamp) {
        // Handle conflict based on resolution strategy
        if (item.conflictResolution === 'server-wins') {
          // Do nothing, server version wins
          return;
        } else if (item.conflictResolution === 'manual') {
          // Add to conflicts for manual resolution
          this.addConflict(item, data);
          return;
        }
        // Otherwise client-wins, proceed with update
      }
    }
    
    // Proceed with update
    const { error } = await supabase
      .from(item.table)
      .update(item.data)
      .eq('id', item.data.id);
    
    if (error) throw error;
  }
  
  // Handle delete action
  private async handleDelete(item: SyncItem): Promise<void> {
    const { error } = await supabase
      .from(item.table)
      .delete()
      .eq('id', item.data.id);
    
    if (error) throw error;
  }
  
  // Store conflicts for manual resolution
  private addConflict(item: SyncItem, serverData: any): void {
    // In a real app, store this conflict for manual resolution
    console.warn('Sync conflict detected:', { 
      item, 
      serverData 
    });
    
    // For now, just notify the user
    toast.warning('Data conflict detected. Please refresh and try again.');
  }
  
  // Start background processing
  private startProcessing(): void {
    if (this.isProcessing) return;
    
    // Process queue immediately
    this.processQueue();
    
    // Set up interval for continuous processing
    if (this.intervalId === null) {
      this.intervalId = setInterval(() => {
        if (navigator.onLine && !this.isProcessing) {
          this.processQueue();
        }
      }, this.syncInterval);
    }
  }
  
  // Stop background processing
  private stopProcessing(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isProcessing = false;
  }
  
  // Handle online event
  private handleOnline = (): void => {
    toast.success('Back online. Syncing pending changes...');
    this.startProcessing();
  };
  
  // Handle offline event
  private handleOffline = (): void => {
    toast.warning('You are offline. Changes will sync when connection is restored.');
    this.stopProcessing();
  };
  
  // Load queue from localStorage
  private loadQueue(): void {
    try {
      const savedQueue = localStorage.getItem('gooseops-lite-sync-queue');
      if (savedQueue) {
        this.queue = JSON.parse(savedQueue);
      }
    } catch (error) {
      console.error('Failed to load sync queue from localStorage:', error);
      this.queue = [];
    }
  }
  
  // Save queue to localStorage
  private saveQueue(): void {
    try {
      localStorage.setItem('gooseops-lite-sync-queue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save sync queue to localStorage:', error);
    }
  }
  
  // Get pending count
  public getPendingCount(): number {
    return this.queue.filter(item => item.status === 'pending').length;
  }
  
  // Get queue status
  public getStatus(): {
    pending: number;
    completed: number;
    failed: number;
    total: number;
  } {
    const pending = this.queue.filter(item => item.status === 'pending').length;
    const completed = this.queue.filter(item => item.status === 'completed').length;
    const failed = this.queue.filter(item => item.status === 'failed').length;
    
    return {
      pending,
      completed,
      failed,
      total: this.queue.length
    };
  }
  
  // Clear completed items
  public clearCompleted(): void {
    this.queue = this.queue.filter(item => item.status !== 'completed');
    this.saveQueue();
  }
  
  // Retry failed items
  public retryFailed(): void {
    this.queue.forEach(item => {
      if (item.status === 'failed') {
        item.status = 'pending';
        item.retries = 0;
      }
    });
    this.saveQueue();
    
    if (navigator.onLine && !this.isProcessing) {
      this.startProcessing();
    }
  }
  
  // Cleanup on destroy
  public destroy(): void {
    this.stopProcessing();
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }
}

// Export singleton instance
export const syncQueue = new SyncQueue();

// Helper functions for common operations
export const offlineSync = {
  // Create record with offline support
  createRecord: async <T>(table: string, data: T, priority: number = 5): Promise<string> => {
    if (navigator.onLine) {
      try {
        const { data: result, error } = await supabase
          .from(table)
          .insert(data)
          .select();
        
        if (error) throw error;
        
        return result?.[0]?.id || '';
      } catch (error) {
        console.error(`Failed to create ${table} record:`, error);
        
        // Fall back to offline queue
        return syncQueue.addItem({
          table,
          action: 'create',
          data,
          priority
        });
      }
    } else {
      // Offline mode - add to queue
      return syncQueue.addItem({
        table,
        action: 'create',
        data,
        priority
      });
    }
  },
  
  // Update record with offline support
  updateRecord: async <T extends { id: string }>(
    table: string, 
    data: T, 
    priority: number = 5,
    conflictResolution: 'client-wins' | 'server-wins' | 'manual' = 'client-wins'
  ): Promise<boolean> => {
    if (navigator.onLine) {
      try {
        const { error } = await supabase
          .from(table)
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
        
        return true;
      } catch (error) {
        console.error(`Failed to update ${table} record:`, error);
        
        // Fall back to offline queue
        syncQueue.addItem({
          table,
          action: 'update',
          data,
          priority,
          conflictResolution
        });
        
        return false;
      }
    } else {
      // Offline mode - add to queue
      syncQueue.addItem({
        table,
        action: 'update',
        data,
        priority,
        conflictResolution
      });
      
      return false;
    }
  },
  
  // Delete record with offline support
  deleteRecord: async (
    table: string, 
    id: string, 
    priority: number = 5
  ): Promise<boolean> => {
    if (navigator.onLine) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        return true;
      } catch (error) {
        console.error(`Failed to delete ${table} record:`, error);
        
        // Fall back to offline queue
        syncQueue.addItem({
          table,
          action: 'delete',
          data: { id },
          priority
        });
        
        return false;
      }
    } else {
      // Offline mode - add to queue
      syncQueue.addItem({
        table,
        action: 'delete',
        data: { id },
        priority
      });
      
      return false;
    }
  },
  
  // Get sync status
  getSyncStatus: (): {
    pending: number;
    completed: number;
    failed: number;
    total: number;
  } => {
    return syncQueue.getStatus();
  },
  
  // Clear completed sync items
  clearCompleted: (): void => {
    syncQueue.clearCompleted();
  },
  
  // Retry failed sync items
  retryFailed: (): void => {
    syncQueue.retryFailed();
  }
};

// Background sync for handling complex sync operations
export class BackgroundSync {
  private static syncInProgress = false;
  
  // Sync check-in data
  public static async syncCheckIn(checkInData: any): Promise<boolean> {
    if (BackgroundSync.syncInProgress) return false;
    
    try {
      BackgroundSync.syncInProgress = true;
      
      // First upload the photo if present
      if (checkInData.photo) {
        try {
          const photoPath = `gooseops-lite/check-ins/${checkInData.jobId}/${Date.now()}.jpg`;
          
          if (navigator.onLine) {
            // Online mode - upload directly
            const { error: uploadError } = await supabase.storage
              .from('job-photos')
              .upload(photoPath, BackgroundSync.dataURItoBlob(checkInData.photo));
              
            if (uploadError) throw uploadError;
            
            // Update photo URL in data
            checkInData.photoUrl = photoPath;
            delete checkInData.photo; // Remove base64 data to save space
          } else {
            // Store photo for later upload
            checkInData.pendingPhotoPath = photoPath;
          }
        } catch (error) {
          console.error('Failed to upload check-in photo:', error);
          // Continue with sync but note the photo upload failure
        }
      }
      
      // Now sync the check-in data
      await offlineSync.createRecord('check-ins', checkInData, 8);
      
      return true;
    } catch (error) {
      console.error('Background sync error for check-in:', error);
      return false;
    } finally {
      BackgroundSync.syncInProgress = false;
    }
  }
  
  // Sync task completion
  public static async syncTaskCompletion(task: any, jobId: string): Promise<boolean> {
    if (BackgroundSync.syncInProgress) return false;
    
    try {
      BackgroundSync.syncInProgress = true;
      
      // First upload the photo if present
      if (task.photo) {
        try {
          const photoPath = `tasks/${jobId}/${task.id}/${Date.now()}.jpg`;
          
          if (navigator.onLine) {
            // Online mode - upload directly
            const { error: uploadError } = await supabase.storage
              .from('task-photos')
              .upload(photoPath, BackgroundSync.dataURItoBlob(task.photo));
              
            if (uploadError) throw uploadError;
            
            // Update photo URL in data
            task.photoUrl = photoPath;
            delete task.photo; // Remove base64 data to save space
          } else {
            // Store photo for later upload
            task.pendingPhotoPath = photoPath;
          }
        } catch (error) {
          console.error('Failed to upload task photo:', error);
          // Continue with sync but note the photo upload failure
        }
      }
      
      // Now sync the task data
      const taskData = { 
        ...task,
        jobId,
        syncedAt: new Date().toISOString()
      };
      
      await offlineSync.createRecord('task_completions', taskData, 7);
      
      return true;
    } catch (error) {
      console.error('Background sync error for task completion:', error);
      return false;
    } finally {
      BackgroundSync.syncInProgress = false;
    }
  }
  
  // Helper method to convert data URI to Blob
  private static dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  }
}

// Online status hook with enhanced state management
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState(() => syncQueue.getStatus());
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Update sync status periodically
    const interval = setInterval(() => {
      setSyncStatus(syncQueue.getStatus());
    }, 5000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);
  
  return { isOnline, syncStatus };
}

// Import missing useEffect and useState at the top of the file
import { useEffect, useState } from 'react';
