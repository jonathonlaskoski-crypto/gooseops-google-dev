import { Capacitor } from '@capacitor/core'
import { Contacts } from '@capacitor-community/contacts'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Device } from '@capacitor/device'
import { App } from '@capacitor/app'
import { Share } from '@capacitor/share'
import { Clipboard } from '@capacitor/clipboard'
import { LocalNotifications } from '@capacitor/local-notifications'
import { Preferences } from '@capacitor/preferences'
import { toast } from 'sonner'

export interface SystemCapabilities {
  contacts: boolean
  calendar: boolean
  storage: boolean
  camera: boolean
  location: boolean
  microphone: boolean
  phone: boolean
  sms: boolean
  notifications: boolean
  biometric: boolean
  bluetooth: boolean
  nfc: boolean
}

export class SystemIntegration {
  private static instance: SystemIntegration
  private capabilities: SystemCapabilities = {
    contacts: false,
    calendar: false,
    storage: false,
    camera: false,
    location: false,
    microphone: false,
    phone: false,
    sms: false,
    notifications: false,
    biometric: false,
    bluetooth: false,
    nfc: false
  }
  
  private constructor() {
    this.initializeCapabilities()
  }
  
  static getInstance(): SystemIntegration {
    if (!SystemIntegration.instance) {
      SystemIntegration.instance = new SystemIntegration()
    }
    return SystemIntegration.instance
  }

  private async initializeCapabilities() {
    // Check which capabilities are available on this device
    const info = await Device.getInfo()
    console.log('?? GooseOps Device Info:', info)
    
    // Store device info for AI access
    await Preferences.set({
      key: 'deviceInfo',
      value: JSON.stringify(info)
    })
  }

  async requestAllPermissions(): Promise<SystemCapabilities> {
    console.log('?? Requesting all system permissions for GooseOps Powerhouse...')
    
    try {
      // Contacts permission
      if (Capacitor.isNativePlatform()) {
        try {
          const contactPerm = await Contacts.requestPermissions()
          this.capabilities.contacts = contactPerm.contacts === 'granted'
          if (this.capabilities.contacts) {
            toast.success('? Contacts access granted')
          }
        } catch (e) {
          console.error('Contacts permission error:', e)
        }

        // Notifications permission
        try {
          const notifPerm = await LocalNotifications.requestPermissions()
          this.capabilities.notifications = notifPerm.display === 'granted'
          if (this.capabilities.notifications) {
            toast.success('? Notifications access granted')
          }
        } catch (e) {
          console.error('Notifications permission error:', e)
        }
      }

      // File system is usually granted by default
      this.capabilities.storage = true
      
      // Camera, location, microphone handled by existing permissions
      this.capabilities.camera = true
      this.capabilities.location = true
      this.capabilities.microphone = true
      
      toast.success('?? GooseOps System Integration Active')
      
    } catch (error) {
      console.error('Permission request error:', error)
      toast.error('Some permissions were denied - continuing with available features')
    }
    
    // Save capabilities state
    await Preferences.set({
      key: 'systemCapabilities',
      value: JSON.stringify(this.capabilities)
    })
    
    return this.capabilities
  }

  async getContacts(filter?: string): Promise<any[]> {
    if (!this.capabilities.contacts || !Capacitor.isNativePlatform()) {
      console.log('Contacts not available or not on native platform')
      return []
    }
    
    try {
      const result = await Contacts.getContacts({
        projection: {
          name: true,
          phones: true,
          emails: true,
          organization: true
        }
      })
      
      if (filter) {
        return result.contacts.filter(c => 
          c.name?.display?.toLowerCase().includes(filter.toLowerCase())
        )
      }
      
      return result.contacts
    } catch (error) {
      console.error('Error getting contacts:', error)
      return []
    }
  }

  async getDeviceInfo(): Promise<any> {
    const info = await Device.getInfo()
    const battery = await Device.getBatteryInfo()
    const id = await Device.getId()
    
    return {
      ...info,
      battery,
      deviceId: id.identifier,
      isFoldable: info.model?.includes('Fold') || false,
      isPersonalDevice: true,
      platform: Capacitor.getPlatform(),
      isNative: Capacitor.isNativePlatform()
    }
  }

  async getFiles(path: string = ''): Promise<any[]> {
    try {
      const result = await Filesystem.readdir({
        path: path || '',
        directory: Directory.Documents
      })
      return result.files
    } catch (error) {
      console.error('Error reading files:', error)
      return []
    }
  }

  async readFile(path: string): Promise<string> {
    try {
      const result = await Filesystem.readFile({
        path,
        directory: Directory.Documents
      })
      return result.data as string
    } catch (error) {
      console.error('Error reading file:', error)
      return ''
    }
  }

  async writeFile(path: string, data: string): Promise<void> {
    try {
      await Filesystem.writeFile({
        path,
        data,
        directory: Directory.Documents
      })
      toast.success(`File saved: ${path}`)
    } catch (error) {
      console.error('Error writing file:', error)
      toast.error('Failed to save file')
    }
  }

  async shareContent(content: {
    title?: string
    text?: string
    url?: string
    files?: string[]
  }): Promise<void> {
    try {
      await Share.share(content)
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  async setClipboard(text: string): Promise<void> {
    await Clipboard.write({ string: text })
    toast.success('Copied to clipboard')
  }

  async getClipboard(): Promise<string> {
    const { value } = await Clipboard.read()
    return value || ''
  }

  async scheduleNotification(notification: {
    title: string
    body: string
    id?: number
    schedule?: { at: Date }
  }): Promise<void> {
    if (!this.capabilities.notifications) {
      console.log('Notification permission not granted')
      return
    }
    
    try {
      await LocalNotifications.schedule({
        notifications: [{
          ...notification,
          id: notification.id || Date.now()
        }]
      })
    } catch (error) {
      console.error('Error scheduling notification:', error)
    }
  }

  async getAppInfo(): Promise<any> {
    return await App.getInfo()
  }

  async minimizeApp(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await App.minimizeApp()
    }
  }

  // Samsung Fold 7 specific features
  async getFoldState(): Promise<'open' | 'closed' | 'half'> {
    const info = await this.getDeviceInfo()
    
    // Check screen dimensions to determine fold state
    // This is a simplified version - real implementation would use Samsung SDK
    const width = window.innerWidth
    const height = window.innerHeight
    const ratio = width / height
    
    // Enhanced detection for Fold 7
    if (info.isFoldable) {
      if (ratio > 1.8) return 'open'  // Wide aspect ratio = unfolded
      if (ratio < 0.6) return 'closed' // Narrow = folded
      return 'half'  // In between = flex mode
    }
    
    // Fallback for non-foldable devices
    if (ratio > 1.5) return 'open'
    if (ratio < 0.8) return 'closed'
    return 'half'
  }

  async enableDualScreenMode(): Promise<void> {
    // Signal to the app that dual screen mode is available
    await Preferences.set({
      key: 'dualScreenMode',
      value: 'enabled'
    })
    
    toast.success('?? Dual screen mode enabled for Fold 7')
  }

  getCapabilities(): SystemCapabilities {
    return this.capabilities
  }

  // Advanced Samsung Fold 7 optimizations
  async configureFoldOptimizations(): Promise<void> {
    const info = await this.getDeviceInfo()
    
    if (info.isFoldable && info.model?.includes('Fold')) {
      // Configure for Samsung Fold 7
      await Preferences.set({
        key: 'foldOptimizations',
        value: JSON.stringify({
          dualScreenSupport: true,
          stylusIntegration: true,
          highResolutionDisplay: true,
          advancedMultitasking: true,
          aiAccelerated: true
        })
      })
      
      // Set viewport meta for optimal display
      const viewport = document.querySelector('meta[name=viewport]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover')
      }
      
      toast.success('?? Samsung Fold 7 optimizations activated!')
    }
  }
}

// Export singleton instance
export const systemIntegration = SystemIntegration.getInstance()