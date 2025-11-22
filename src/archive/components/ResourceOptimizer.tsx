import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  HardDrive,
  Wifi,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
  Video,
  Globe
} from 'lucide-react';

interface ResourceMetrics {
  imagesLoaded: number;
  videosLoaded: number;
  totalSize: number;
  loadTime: number;
  bandwidthSaved: number;
  cacheHitRate: number;
}

interface ResourceOptimizerProps {
  showMetrics?: boolean;
  autoOptimize?: boolean;
}

export const ResourceOptimizer: React.FC<ResourceOptimizerProps> = ({
  showMetrics = true,
  autoOptimize = true
}) => {
  const [metrics, setMetrics] = useState<ResourceMetrics>({
    imagesLoaded: 0,
    videosLoaded: 0,
    totalSize: 0,
    loadTime: 0,
    bandwidthSaved: 0,
    cacheHitRate: 0
  });

  const [optimizationStatus, setOptimizationStatus] = useState<'idle' | 'optimizing' | 'complete'>('idle');

  // Simulate resource monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        imagesLoaded: prev.imagesLoaded + Math.floor(Math.random() * 3),
        videosLoaded: prev.videosLoaded + Math.floor(Math.random() * 2),
        totalSize: prev.totalSize + Math.floor(Math.random() * 50000),
        loadTime: Math.max(0.1, prev.loadTime + (Math.random() - 0.5) * 0.1),
        bandwidthSaved: prev.bandwidthSaved + Math.floor(Math.random() * 10000),
        cacheHitRate: Math.min(99, Math.max(85, prev.cacheHitRate + (Math.random() - 0.5) * 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const runOptimization = async () => {
    setOptimizationStatus('optimizing');
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setOptimizationStatus('complete');
    setTimeout(() => setOptimizationStatus('idle'), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Images Loaded */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images Loaded</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.imagesLoaded}</div>
              <p className="text-xs text-muted-foreground">Optimized & cached</p>
            </CardContent>
          </Card>

          {/* Videos Loaded */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos Loaded</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.videosLoaded}</div>
              <p className="text-xs text-muted-foreground">Stream optimized</p>
            </CardContent>
          </Card>

          {/* Bandwidth Saved */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bandwidth Saved</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(metrics.bandwidthSaved)}</div>
              <p className="text-xs text-muted-foreground">Compression & caching</p>
            </CardContent>
          </Card>

          {/* Cache Hit Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Performance optimized</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Resource Optimization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Auto Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Automatically compress and optimize media resources
              </p>
            </div>
            <Badge variant={autoOptimize ? "default" : "secondary"}>
              {autoOptimize ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Image Compression</span>
              <span>85% quality</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Video Optimization</span>
              <span>Adaptive bitrate</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>CDN Delivery</span>
              <span>Global edge network</span>
            </div>
            <Progress value={98} className="h-2" />
          </div>

          <Button
            onClick={runOptimization}
            disabled={optimizationStatus === 'optimizing'}
            className="w-full"
          >
            {optimizationStatus === 'optimizing' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Optimizing Resources...
              </>
            ) : optimizationStatus === 'complete' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Optimization Complete
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Run Optimization
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      <Alert>
        <Globe className="h-4 w-4" />
        <AlertDescription>
          <strong>Performance Status:</strong> All resources are optimized and loading efficiently.
          Average load time: {metrics.loadTime.toFixed(2)}s |
          Total data transferred: {formatBytes(metrics.totalSize)}
        </AlertDescription>
      </Alert>

      {/* Optimization Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5" />
            <span>Optimization Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✅ Implemented</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Lazy loading for images and videos</li>
                <li>• WebP format with fallbacks</li>
                <li>• CDN delivery optimization</li>
                <li>• Browser caching strategies</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">🔄 Active</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Real-time compression</li>
                <li>• Adaptive video streaming</li>
                <li>• Performance monitoring</li>
                <li>• Bandwidth optimization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Performance Dashboard Component
export const PerformanceDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Resource Performance Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and optimize media resource delivery across GooseOps platforms
        </p>
      </div>

      <ResourceOptimizer showMetrics={true} autoOptimize={true} />

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Load Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Images (avg)</span>
                <span className="font-medium">0.8s</span>
              </div>
              <Progress value={85} className="h-2" />

              <div className="flex justify-between items-center">
                <span className="text-sm">Videos (avg)</span>
                <span className="font-medium">2.1s</span>
              </div>
              <Progress value={65} className="h-2" />

              <div className="flex justify-between items-center">
                <span className="text-sm">Total Page Load</span>
                <span className="font-medium">3.2s</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Compression Ratio</span>
                <Badge variant="secondary">78% smaller</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Format Optimization</span>
                <Badge variant="secondary">WebP + AVIF</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">CDN Coverage</span>
                <Badge variant="secondary">Global (250+ PoPs)</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Cache Strategy</span>
                <Badge variant="secondary">Smart preloading</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};