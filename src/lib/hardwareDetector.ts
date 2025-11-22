/**
 * Hardware Detection & Adaptive Performance System
 * 
 * Automatically detects device capabilities and adapts features:
 * - ProArt S16 (32GB RAM, RTX mobile GPU): Balanced mode
 * - Desktop (4090): Maximum performance mode
 */

import React from 'react';

// GPU Detection using WebGL
export interface HardwareProfile {
    deviceType: 'laptop' | 'desktop' | 'mobile' | 'unknown';
    gpuTier: 'integrated' | 'entry' | 'mid' | 'high' | 'ultra';
    gpuName: string;
    ramGB: number;
    cpuCores: number;
    screenSize: { width: number; height: number };
    performanceMode: 'light' | 'balanced' | 'maximum';
}

export class HardwareDetector {
    private profile: HardwareProfile | null = null;

    async detectHardware(): Promise<HardwareProfile> {
        const gpu = await this.detectGPU();
        const ram = this.estimateRAM();
        const cpu = navigator.hardwareConcurrency || 4;
        const screen = {
            width: window.screen.width,
            height: window.screen.height
        };

        // Classify device
        const deviceType = this.classifyDevice(screen, gpu);
        const gpuTier = this.classifyGPU(gpu);
        const performanceMode = this.determinePerformanceMode(gpuTier, ram, deviceType);

        this.profile = {
            deviceType,
            gpuTier,
            gpuName: gpu,
            ramGB: ram,
            cpuCores: cpu,
            screenSize: screen,
            performanceMode
        };

        console.log('[HardwareDetector] Detected profile:', this.profile);
        return this.profile;
    }

    private async detectGPU(): Promise<string> {
        try {
            const canvas = document.createElement('canvas');
            const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;

            if (!gl) return 'Unknown GPU';

            const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
            if (!debugInfo) return 'WebGL GPU';

            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            return renderer || 'Unknown GPU';
        } catch (e) {
            return 'Unknown GPU';
        }
    }

    private estimateRAM(): number {
        // @ts-ignore - navigator.deviceMemory is experimental
        const deviceMemory = navigator.deviceMemory;
        if (deviceMemory) return deviceMemory;

        // Fallback estimate based on other factors
        const cores = navigator.hardwareConcurrency || 4;
        if (cores >= 16) return 32; // Likely high-end
        if (cores >= 8) return 16;
        if (cores >= 4) return 8;
        return 4;
    }

    private classifyDevice(screen: { width: number; height: number }, gpu: string): HardwareProfile['deviceType'] {
        const isTouch = 'ontouchstart' in window;
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

        if (isMobile) return 'mobile';

        // Desktop/laptop distinction based on screen and typical usage
        const screenDiagonal = Math.sqrt(screen.width ** 2 + screen.height ** 2);
        const pixelRatio = window.devicePixelRatio || 1;

        // High-end desktop indicators
        if (gpu.includes('RTX 4090') || gpu.includes('RTX 4080')) {
            return 'desktop';
        }

        // Laptop indicators (ProArt S16, etc.)
        if (screenDiagonal < 2000 && pixelRatio >= 2) {
            return 'laptop';
        }

        // Default to desktop for larger screens
        return screenDiagonal > 2500 ? 'desktop' : 'laptop';
    }

    private classifyGPU(gpuName: string): HardwareProfile['gpuTier'] {
        const name = gpuName.toLowerCase();

        // Ultra tier - RTX 4090, 4080
        if (name.includes('4090') || name.includes('4080')) {
            return 'ultra';
        }

        // High tier - RTX 4070, 3090, 3080
        if (name.includes('4070') || name.includes('3090') || name.includes('3080') || name.includes('3070')) {
            return 'high';
        }

        // Mid tier - RTX 4060, 3060, Quadro
        if (name.includes('4060') || name.includes('3060') || name.includes('quadro') ||
            name.includes('rtx a') || name.includes('geforce rtx')) {
            return 'mid';
        }

        // Entry tier - GTX series
        if (name.includes('gtx') || name.includes('1660') || name.includes('1650')) {
            return 'entry';
        }

        // Integrated - Intel, AMD integrated
        if (name.includes('intel') || name.includes('uhd') || name.includes('iris') ||
            name.includes('radeon') && !name.includes('rx')) {
            return 'integrated';
        }

        // Default to mid for unknown modern GPUs
        return 'mid';
    }

    private determinePerformanceMode(
        gpuTier: HardwareProfile['gpuTier'],
        ramGB: number,
        deviceType: HardwareProfile['deviceType']
    ): HardwareProfile['performanceMode'] {
        // RTX 4090 desktop = maximum
        if (gpuTier === 'ultra' && deviceType === 'desktop') {
            return 'maximum';
        }

        // High-end laptop or powerful desktop = balanced
        if ((gpuTier === 'high' || gpuTier === 'mid') && ramGB >= 16) {
            return 'balanced';
        }

        // Everything else = light
        return 'light';
    }

    getProfile(): HardwareProfile | null {
        return this.profile;
    }

    // Feature flags based on hardware
    canUseGPUInference(): boolean {
        return this.profile?.performanceMode !== 'light';
    }

    canUse3DVisualizations(): boolean {
        return this.profile?.gpuTier !== 'integrated';
    }

    canUseRealtimeUpdates(): boolean {
        return this.profile?.performanceMode !== 'light';
    }

    getOptimalUpdateInterval(): number {
        switch (this.profile?.performanceMode) {
            case 'maximum': return 100; // 10 updates/sec
            case 'balanced': return 500; // 2 updates/sec
            case 'light': return 2000;   // 0.5 updates/sec
            default: return 1000;
        }
    }

    getMaxConcurrentAIModels(): number {
        switch (this.profile?.gpuTier) {
            case 'ultra': return 10;     // RTX 4090
            case 'high': return 5;       // RTX 3080/4070
            case 'mid': return 3;        // RTX 3060/4060
            case 'entry': return 2;      // GTX series
            case 'integrated': return 1; // Integrated GPU
            default: return 2;
        }
    }

    getVisualizationQuality(): 'low' | 'medium' | 'high' | 'ultra' {
        switch (this.profile?.performanceMode) {
            case 'maximum': return 'ultra';
            case 'balanced': return 'high';
            case 'light': return 'medium';
            default: return 'medium';
        }
    }
}

// Singleton instance
export const hardwareDetector = new HardwareDetector();

// React hook for hardware-aware features
export function useHardwareProfile() {
    const [profile, setProfile] = React.useState<HardwareProfile | null>(null);

    React.useEffect(() => {
        hardwareDetector.detectHardware().then(setProfile);
    }, []);

    return {
        profile,
        isDesktop: profile?.deviceType === 'desktop',
        isLaptop: profile?.deviceType === 'laptop',
        isMaximumPerformance: profile?.performanceMode === 'maximum',
        isBalanced: profile?.performanceMode === 'balanced',
        canUseGPU: hardwareDetector.canUseGPUInference(),
        canUse3D: hardwareDetector.canUse3DVisualizations(),
        updateInterval: hardwareDetector.getOptimalUpdateInterval(),
        visualizationQuality: hardwareDetector.getVisualizationQuality()
    };
}
