// Logo Integration System for GooseOps and RDS
// "Powered by GooseOps Backed by RDS" - Creation is the only true memory engine

export interface LogoConfig {
  gooseOps: {
    src: string
    alt: string
    width: number
    height: number
    className: string
  }
  rds: {
    src: string
    alt: string
    width: number
    height: number
    className: string
  }
  slogan: {
    text: string
    className: string
  }
  principle: {
    text: string
    className: string
  }
}

export interface BrandIdentity {
  name: string
  tagline: string
  principle: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  fonts: {
    primary: string
    secondary: string
  }
  logos: LogoConfig
}

export class BrandManager {
  private config: BrandIdentity

  constructor() {
    this.config = {
      name: 'GooseOps Lite',
      tagline: 'Powered by GooseOps Backed by RDS',
      principle: 'Creation is the only true memory engine',
      colors: {
        primary: '#00ff88', // GooseOps neon green
        secondary: '#0066cc', // RDS blue
        accent: '#ff6600', // Orange accent
        background: '#000000' // Black background
      },
      fonts: {
        primary: 'Inter, sans-serif',
        secondary: 'JetBrains Mono, monospace'
      },
      logos: {
        gooseOps: {
          src: '/logos/gooseops-logo.png',
          alt: 'GooseOps Logo',
          width: 200,
          height: 80,
          className: 'gooseops-logo'
        },
        rds: {
          src: '/logos/rds-logo.jpg',
          alt: 'RDS Logo',
          width: 150,
          height: 60,
          className: 'rds-logo'
        },
        slogan: {
          text: 'Powered by GooseOps Backed by RDS',
          className: 'brand-slogan'
        },
        principle: {
          text: 'Creation is the only true memory engine',
          className: 'brand-principle'
        }
      }
    }
  }

  getBrandIdentity(): BrandIdentity {
    return this.config
  }

  updateLogoConfig(logoType: 'gooseOps' | 'rds', config: Partial<LogoConfig['gooseOps'] | LogoConfig['rds']>) {
    if (logoType === 'gooseOps') {
      this.config.logos.gooseOps = { ...this.config.logos.gooseOps, ...config }
    } else {
      this.config.logos.rds = { ...this.config.logos.rds, ...config }
    }
  }

  updateSlogan(slogan: string) {
    this.config.logos.slogan.text = slogan
  }

  updatePrinciple(principle: string) {
    this.config.logos.principle.text = principle
  }

  getLogoSrc(logoType: 'gooseOps' | 'rds'): string {
    return logoType === 'gooseOps' ? this.config.logos.gooseOps.src : this.config.logos.rds.src
  }

  getLogoAlt(logoType: 'gooseOps' | 'rds'): string {
    return logoType === 'gooseOps' ? this.config.logos.gooseOps.alt : this.config.logos.rds.alt
  }

  getLogoDimensions(logoType: 'gooseOps' | 'rds'): { width: number; height: number } {
    const logo = logoType === 'gooseOps' ? this.config.logos.gooseOps : this.config.logos.rds
    return { width: logo.width, height: logo.height }
  }

  getLogoClassName(logoType: 'gooseOps' | 'rds'): string {
    return logoType === 'gooseOps' ? this.config.logos.gooseOps.className : this.config.logos.rds.className
  }

  getSlogan(): string {
    return this.config.logos.slogan.text
  }

  getPrinciple(): string {
    return this.config.logos.principle.text
  }

  getSloganClassName(): string {
    return this.config.logos.slogan.className
  }

  getPrincipleClassName(): string {
    return this.config.logos.principle.className
  }

  // Generate CSS for brand styling
  generateBrandCSS(): string {
    return `
      .gooseops-logo {
        filter: drop-shadow(0 0 10px ${this.config.colors.primary});
        transition: all 0.3s ease;
      }
      
      .gooseops-logo:hover {
        filter: drop-shadow(0 0 20px ${this.config.colors.primary});
        transform: scale(1.05);
      }
      
      .rds-logo {
        filter: drop-shadow(0 0 5px ${this.config.colors.secondary});
        transition: all 0.3s ease;
      }
      
      .rds-logo:hover {
        filter: drop-shadow(0 0 15px ${this.config.colors.secondary});
        transform: scale(1.05);
      }
      
      .brand-slogan {
        font-family: ${this.config.fonts.primary};
        color: ${this.config.colors.primary};
        text-shadow: 0 0 10px ${this.config.colors.primary};
        font-weight: 600;
        letter-spacing: 1px;
      }
      
      .brand-principle {
        font-family: ${this.config.fonts.secondary};
        color: ${this.config.colors.accent};
        text-shadow: 0 0 5px ${this.config.colors.accent};
        font-weight: 500;
        font-style: italic;
      }
      
      .brand-header {
        background: linear-gradient(135deg, ${this.config.colors.background} 0%, #1a1a1a 100%);
        border-bottom: 2px solid ${this.config.colors.primary};
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
      }
      
      .brand-footer {
        background: linear-gradient(135deg, #1a1a1a 0%, ${this.config.colors.background} 100%);
        border-top: 2px solid ${this.config.colors.secondary};
        box-shadow: 0 0 20px rgba(0, 102, 204, 0.3);
      }
    `
  }

  // Apply brand styling to element
  applyBrandStyling(element: HTMLElement, type: 'header' | 'footer' | 'logo' | 'slogan' | 'principle') {
    const classMap = {
      header: 'brand-header',
      footer: 'brand-footer',
      logo: 'gooseops-logo',
      slogan: 'brand-slogan',
      principle: 'brand-principle'
    }
    
    element.className = `${element.className} ${classMap[type]}`.trim()
  }

  // Create brand HTML
  createBrandHTML(type: 'header' | 'footer' | 'standalone'): string {
    const gooseOpsLogo = this.config.logos.gooseOps
    const rdsLogo = this.config.logos.rds
    const slogan = this.config.logos.slogan
    const principle = this.config.logos.principle

    if (type === 'header') {
      return `
        <div class="brand-header flex items-center justify-between p-4">
          <div class="flex items-center space-x-4">
            <img 
              src="${gooseOpsLogo.src}" 
              alt="${gooseOpsLogo.alt}" 
              width="${gooseOpsLogo.width}" 
              height="${gooseOpsLogo.height}" 
              class="${gooseOpsLogo.className}"
            />
            <div class="flex flex-col">
              <span class="${slogan.className}">${slogan.text}</span>
              <span class="${principle.className}">${principle.text}</span>
            </div>
          </div>
          <img 
            src="${rdsLogo.src}" 
            alt="${rdsLogo.alt}" 
            width="${rdsLogo.width}" 
            height="${rdsLogo.height}" 
            class="${rdsLogo.className}"
          />
        </div>
      `
    } else if (type === 'footer') {
      return `
        <div class="brand-footer flex items-center justify-center p-4 space-x-8">
          <img 
            src="${gooseOpsLogo.src}" 
            alt="${gooseOpsLogo.alt}" 
            width="${gooseOpsLogo.width}" 
            height="${gooseOpsLogo.height}" 
            class="${gooseOpsLogo.className}"
          />
          <div class="text-center">
            <div class="${slogan.className}">${slogan.text}</div>
            <div class="${principle.className}">${principle.text}</div>
          </div>
          <img 
            src="${rdsLogo.src}" 
            alt="${rdsLogo.alt}" 
            width="${rdsLogo.width}" 
            height="${rdsLogo.height}" 
            class="${rdsLogo.className}"
          />
        </div>
      `
    } else {
      return `
        <div class="brand-standalone flex flex-col items-center space-y-4 p-8">
          <div class="flex items-center space-x-6">
            <img 
              src="${gooseOpsLogo.src}" 
              alt="${gooseOpsLogo.alt}" 
              width="${gooseOpsLogo.width}" 
              height="${gooseOpsLogo.height}" 
              class="${gooseOpsLogo.className}"
            />
            <img 
              src="${rdsLogo.src}" 
              alt="${rdsLogo.alt}" 
              width="${rdsLogo.width}" 
              height="${rdsLogo.height}" 
              class="${rdsLogo.className}"
            />
          </div>
          <div class="text-center">
            <div class="${slogan.className} text-xl">${slogan.text}</div>
            <div class="${principle.className} text-lg mt-2">${principle.text}</div>
          </div>
        </div>
      `
    }
  }
}

// Create global brand manager
export const brandManager = new BrandManager()

export default brandManager
