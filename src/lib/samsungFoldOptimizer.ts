import { systemIntegration } from './systemIntegration'
import { Preferences } from '@capacitor/preferences'
import { toast } from 'sonner'

export interface FoldOptimizations {
  dualScreenMode: boolean
  stylusSupport: boolean
  flexMode: boolean
  continuityFeatures: boolean
  adaptiveUI: boolean
}

export interface FoldState {
  isOpen: boolean
  angle: number
  mode: 'closed' | 'flex' | 'open'
  screenConfiguration: 'single' | 'dual' | 'adaptive'
}

export class SamsungFoldOptimizer {
  private static instance: SamsungFoldOptimizer
  private foldState: FoldState = {
    isOpen: true,
    angle: 180,
    mode: 'open',
    screenConfiguration: 'single'
  }
  private optimizations: FoldOptimizations = {
    dualScreenMode: false,
    stylusSupport: false,
    flexMode: false,
    continuityFeatures: false,
    adaptiveUI: false
  }

  static getInstance(): SamsungFoldOptimizer {
    if (!SamsungFoldOptimizer.instance) {
      SamsungFoldOptimizer.instance = new SamsungFoldOptimizer()
    }
    return SamsungFoldOptimizer.instance
  }

  constructor() {
    this.initializeFoldDetection()
  }

  private async initializeFoldDetection() {
    // Check if device is a Samsung Fold
    const deviceInfo = await systemIntegration.getDeviceInfo()
    
    if (deviceInfo.isFoldable || deviceInfo.model?.includes('Fold')) {
      console.log('?? Samsung Fold detected - Initializing optimizations')
      await this.enableAllOptimizations()
      this.startFoldStateMonitoring()
    }
  }

  async enableAllOptimizations(): Promise<void> {
    try {
      // Enable all Fold 7 optimizations for Jon's personal build
      this.optimizations = {
        dualScreenMode: true,
        stylusSupport: true,
        flexMode: true,
        continuityFeatures: true,
        adaptiveUI: true
      }

      // Apply CSS optimizations for Fold 7
      this.applyFoldCSS()
      
      // Configure viewport for optimal display
      this.configureViewport()
      
      // Enable stylus support
      this.enableStylusSupport()
      
      // Save optimization settings
      await Preferences.set({
        key: 'foldOptimizations',
        value: JSON.stringify(this.optimizations)
      })

      toast.success('?? Samsung Fold 7 optimizations activated!')
      console.log('? All Fold optimizations enabled:', this.optimizations)
      
    } catch (error) {
      console.error('? Error enabling Fold optimizations:', error)
    }
  }

  private applyFoldCSS(): void {
    // Inject CSS optimizations for Samsung Fold 7
    const style = document.createElement('style')
    style.textContent = `
      /* Samsung Fold 7 Optimizations */
      @media (spanning: single-fold-vertical) {
        .fold-dual-screen {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: env(fold-width, 16px);
        }
      }
      
      @media (spanning: single-fold-horizontal) {
        .fold-dual-screen-horizontal {
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: env(fold-height, 16px);
        }
      }
      
      /* Flex mode optimizations */
      @media (screen-spanning: single-fold-horizontal) and (orientation: landscape) {
        .fold-flex-mode {
          display: grid;
          grid-template-rows: 1fr auto;
        }
        
        .fold-flex-top {
          grid-row: 1;
          padding: 1rem;
        }
        
        .fold-flex-bottom {
          grid-row: 2;
          background: rgba(0, 0, 0, 0.05);
          padding: 0.5rem;
          min-height: 120px;
        }
      }
      
      /* High DPI optimizations for Fold 7 */
      @media (min-resolution: 3dppx) {
        .high-dpi-text {
          font-weight: 400;
          text-rendering: optimizeLegibility;
        }
        
        .high-dpi-icons {
          filter: none;
          image-rendering: crisp-edges;
        }
      }
      
      /* Stylus-friendly touch targets */
      .stylus-friendly {
        min-width: 32px;
        min-height: 32px;
        padding: 8px;
      }
      
      /* Adaptive margins for fold crease */
      .fold-aware-content {
        padding-left: max(16px, env(safe-area-inset-left));
        padding-right: max(16px, env(safe-area-inset-right));
        margin-left: env(fold-left, 0px);
        margin-right: env(fold-right, 0px);
      }
      
      /* Enhanced touch precision for stylus */
      .stylus-input {
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
    `
    document.head.appendChild(style)
  }

  private configureViewport(): void {
    // Optimize viewport for Samsung Fold 7
    let viewport = document.querySelector('meta[name=viewport]')
    if (!viewport) {
      viewport = document.createElement('meta')
      viewport.setAttribute('name', 'viewport')
      document.head.appendChild(viewport)
    }
    
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, ' +
      'interactive-widget=resizes-content'
    )
  }

  private enableStylusSupport(): void {
    // Enhanced stylus support for Samsung Fold 7
    document.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'pen') {
        // Handle S-Pen input
        document.body.classList.add('stylus-active')
        this.handleStylusInput(e)
      }
    })

    document.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'pen') {
        document.body.classList.remove('stylus-active')
      }
    })

    // Air command support (hover events)
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'pen' && e.buttons === 0) {
        // Stylus hovering - show preview or enhanced tooltips
        this.handleStylusHover(e)
      }
    })
  }

  private handleStylusInput(event: PointerEvent): void {
    // Enhanced precision for stylus input
    const target = event.target as HTMLElement
    
    if (target) {
      // Add stylus-specific styling
      target.classList.add('stylus-touched')
      
      // Remove after animation
      setTimeout(() => {
        target.classList.remove('stylus-touched')
      }, 150)
    }
    
    // Log stylus usage for analytics
    console.log('?? S-Pen input detected at:', event.clientX, event.clientY)
  }

  private handleStylusHover(event: PointerEvent): void {
    // Handle S-Pen air command and hover effects
    const target = event.target as HTMLElement
    
    if (target && target.hasAttribute('data-tooltip')) {
      // Show enhanced tooltip for stylus hover
      this.showStylusTooltip(target, event)
    }
  }

  private showStylusTooltip(element: HTMLElement, event: PointerEvent): void {
    // Create enhanced tooltip for stylus interaction
    const tooltip = document.createElement('div')
    tooltip.className = 'stylus-tooltip'
    tooltip.textContent = element.getAttribute('data-tooltip') || ''
    tooltip.style.position = 'absolute'
    tooltip.style.left = `${event.clientX + 10}px`
    tooltip.style.top = `${event.clientY - 30}px`
    tooltip.style.background = 'rgba(0, 0, 0, 0.8)'
    tooltip.style.color = 'white'
    tooltip.style.padding = '4px 8px'
    tooltip.style.borderRadius = '4px'
    tooltip.style.fontSize = '12px'
    tooltip.style.zIndex = '10000'
    
    document.body.appendChild(tooltip)
    
    // Remove tooltip after delay
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip)
      }
    }, 2000)
  }

  private startFoldStateMonitoring(): void {
    // Monitor fold state changes
    setInterval(async () => {
      await this.updateFoldState()
    }, 1000)

    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleOrientationChange(), 100)
    })

    // Listen for resize events (fold/unfold)
    window.addEventListener('resize', () => {
      this.handleFoldStateChange()
    })
  }

  private async updateFoldState(): Promise<void> {
    const currentState = await systemIntegration.getFoldState()
    const newFoldState: FoldState = {
      isOpen: currentState === 'open',
      angle: currentState === 'open' ? 180 : currentState === 'half' ? 90 : 0,
      mode: currentState,
      screenConfiguration: this.determineScreenConfiguration(currentState)
    }

    if (newFoldState.mode !== this.foldState.mode) {
      this.foldState = newFoldState
      this.handleFoldStateChange()
      
      // Notify about fold state change
      toast.info(`?? Fold: ${currentState}`)
    }
  }

  private determineScreenConfiguration(mode: string): 'single' | 'dual' | 'adaptive' {
    if (mode === 'open' && window.innerWidth > 1000) {
      return 'dual'
    } else if (mode === 'half') {
      return 'adaptive'
    } else {
      return 'single'
    }
  }

  private handleFoldStateChange(): void {
    // Apply appropriate classes to body for CSS optimizations
    document.body.classList.remove('fold-closed', 'fold-half', 'fold-open')
    document.body.classList.add(`fold-${this.foldState.mode}`)
    
    // Apply screen configuration classes
    document.body.classList.remove('screen-single', 'screen-dual', 'screen-adaptive')
    document.body.classList.add(`screen-${this.foldState.screenConfiguration}`)
    
    // Trigger layout recalculation for components that need it
    window.dispatchEvent(new CustomEvent('foldStateChanged', {
      detail: this.foldState
    }))
    
    console.log('?? Fold state changed:', this.foldState)
  }

  private handleOrientationChange(): void {
    // Handle orientation changes specific to Fold 7
    console.log('?? Orientation changed, updating fold optimizations')
    this.updateFoldState()
  }

  // Public methods for Jon's app to use
  getFoldState(): FoldState {
    return this.foldState
  }

  getOptimizations(): FoldOptimizations {
    return this.optimizations
  }

  async enableDualScreenMode(): Promise<void> {
    if (this.foldState.isOpen && this.foldState.screenConfiguration === 'dual') {
      document.body.classList.add('dual-screen-active')
      
      // Configure dual screen layout
      const mainContent = document.querySelector('.main-content')
      if (mainContent) {
        mainContent.classList.add('fold-dual-screen')
      }
      
      toast.success('?? Dual screen mode activated')
    }
  }

  async enableFlexMode(): Promise<void> {
    if (this.foldState.mode === 'half') {
      document.body.classList.add('flex-mode-active')
      
      // Configure flex mode layout
      const mainContent = document.querySelector('.main-content')
      if (mainContent) {
        mainContent.classList.add('fold-flex-mode')
      }
      
      toast.success('?? Flex mode activated')
    }
  }

  // Enhanced features for Jon's productivity
  async enableProductivityMode(): Promise<void> {
    // Multi-window simulation for enhanced productivity
    const productivityCSS = `
      .productivity-mode .main-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        height: 100vh;
      }
      
      .productivity-mode .left-panel {
        border-right: 1px solid #e2e8f0;
        padding-right: 16px;
      }
      
      .productivity-mode .right-panel {
        padding-left: 16px;
      }
    `
    
    const style = document.createElement('style')
    style.textContent = productivityCSS
    document.head.appendChild(style)
    
    document.body.classList.add('productivity-mode')
    toast.success('?? Productivity mode enabled for dual screen')
  }
}

// Export singleton instance
export const samsungFoldOptimizer = SamsungFoldOptimizer.getInstance()