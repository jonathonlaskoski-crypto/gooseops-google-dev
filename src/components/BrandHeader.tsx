import React from 'react'
import { brandManager } from '@/lib/logoIntegration'
import { Brain, Zap, Crown, Shield } from 'lucide-react'

interface BrandHeaderProps {
  isOfficeMode?: boolean
  showPrinciple?: boolean
  variant?: 'header' | 'footer' | 'standalone'
}

export function BrandHeader({ 
  isOfficeMode = false, 
  showPrinciple = true, 
  variant = 'header' 
}: BrandHeaderProps) {
  const brand = brandManager.getBrandIdentity()

  if (variant === 'standalone') {
    return (
      <div className={`brand-standalone flex flex-col items-center space-y-6 p-8 ${isOfficeMode ? 'glass' : 'bg-muted/50'} rounded-lg`}>
        {/* Logo Section */}
        <div className="flex items-center space-x-8">
          {/* GooseOps Logo */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <img 
                src={brand.logos.gooseOps.src} 
                alt={brand.logos.gooseOps.alt} 
                width={brand.logos.gooseOps.width} 
                height={brand.logos.gooseOps.height} 
                className={`${brand.logos.gooseOps.className} ${isOfficeMode ? 'drop-shadow-[0_0_20px_rgba(0,255,136,0.5)]' : ''}`}
              />
              {isOfficeMode && (
                <div className="absolute -top-2 -right-2">
                  <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-muted-foreground">GOOSEOPS</span>
          </div>

          {/* Divider */}
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-px h-16 ${isOfficeMode ? 'bg-gradient-to-b from-cyan-400 to-purple-400' : 'bg-border'}`} />
            <Brain className={`w-6 h-6 ${isOfficeMode ? 'text-cyan-400 animate-pulse' : 'text-primary'}`} />
            <div className={`w-px h-16 ${isOfficeMode ? 'bg-gradient-to-b from-purple-400 to-blue-400' : 'bg-border'}`} />
          </div>

          {/* RDS Logo */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <img 
                src={brand.logos.rds.src} 
                alt={brand.logos.rds.alt} 
                width={brand.logos.rds.width} 
                height={brand.logos.rds.height} 
                className={`${brand.logos.rds.className} ${isOfficeMode ? 'drop-shadow-[0_0_15px_rgba(0,102,204,0.5)]' : ''}`}
              />
              {isOfficeMode && (
                <div className="absolute -top-2 -right-2">
                  <Shield className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-muted-foreground">RDS</span>
          </div>
        </div>

        {/* Slogan */}
        <div className="text-center space-y-2">
          <div className={`${brand.logos.slogan.className} text-xl font-bold ${isOfficeMode ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent' : ''}`}>
            {brand.logos.slogan.text}
          </div>
          {showPrinciple && (
            <div className={`${brand.logos.principle.className} text-lg ${isOfficeMode ? 'text-orange-400' : 'text-muted-foreground'}`}>
              {brand.logos.principle.text}
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        {isOfficeMode && (
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse" />
            <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse" />
          </div>
        )}
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div className={`brand-footer flex items-center justify-center p-6 space-x-8 ${isOfficeMode ? 'glass border-t border-white/10' : 'border-t bg-muted/50'}`}>
        {/* GooseOps Logo */}
        <div className="flex items-center space-x-2">
          <img 
            src={brand.logos.gooseOps.src} 
            alt={brand.logos.gooseOps.alt} 
            width={120} 
            height={48} 
            className={`${brand.logos.gooseOps.className} ${isOfficeMode ? 'drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]' : ''}`}
          />
          <span className="text-xs font-semibold text-muted-foreground">GOOSEOPS</span>
        </div>

        {/* Slogan */}
        <div className="text-center">
          <div className={`${brand.logos.slogan.className} text-sm font-semibold ${isOfficeMode ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent' : ''}`}>
            {brand.logos.slogan.text}
          </div>
          {showPrinciple && (
            <div className={`${brand.logos.principle.className} text-xs ${isOfficeMode ? 'text-orange-400' : 'text-muted-foreground'}`}>
              {brand.logos.principle.text}
            </div>
          )}
        </div>

        {/* RDS Logo */}
        <div className="flex items-center space-x-2">
          <img 
            src={brand.logos.rds.src} 
            alt={brand.logos.rds.alt} 
            width={90} 
            height={36} 
            className={`${brand.logos.rds.className} ${isOfficeMode ? 'drop-shadow-[0_0_10px_rgba(0,102,204,0.3)]' : ''}`}
          />
          <span className="text-xs font-semibold text-muted-foreground">RDS</span>
        </div>
      </div>
    )
  }

  // Default header variant
  return (
    <div className={`brand-header flex items-center justify-between p-4 ${isOfficeMode ? 'glass border-b border-white/10' : 'border-b bg-muted/50'}`}>
      {/* Left Section - GooseOps */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img 
            src={brand.logos.gooseOps.src} 
            alt={brand.logos.gooseOps.alt} 
            width={160} 
            height={64} 
            className={`${brand.logos.gooseOps.className} ${isOfficeMode ? 'drop-shadow-[0_0_15px_rgba(0,255,136,0.4)]' : ''}`}
          />
          {isOfficeMode && (
            <div className="absolute -top-1 -right-1">
              <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground">GOOSEOPS</span>
          {showPrinciple && (
            <div className={`${brand.logos.principle.className} text-xs ${isOfficeMode ? 'text-orange-400' : 'text-muted-foreground'}`}>
              {brand.logos.principle.text}
            </div>
          )}
        </div>
      </div>

      {/* Center Section - Slogan */}
      <div className="text-center">
        <div className={`${brand.logos.slogan.className} text-lg font-bold ${isOfficeMode ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent' : ''}`}>
          {brand.logos.slogan.text}
        </div>
      </div>

      {/* Right Section - RDS */}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col text-right">
          <span className="text-xs font-semibold text-muted-foreground">RDS</span>
          {showPrinciple && (
            <div className={`${brand.logos.principle.className} text-xs ${isOfficeMode ? 'text-orange-400' : 'text-muted-foreground'}`}>
              {brand.logos.principle.text}
            </div>
          )}
        </div>
        <div className="relative">
          <img 
            src={brand.logos.rds.src} 
            alt={brand.logos.rds.alt} 
            width={120} 
            height={48} 
            className={`${brand.logos.rds.className} ${isOfficeMode ? 'drop-shadow-[0_0_15px_rgba(0,102,204,0.4)]' : ''}`}
          />
          {isOfficeMode && (
            <div className="absolute -top-1 -right-1">
              <Shield className="w-3 h-3 text-blue-400 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrandHeader
