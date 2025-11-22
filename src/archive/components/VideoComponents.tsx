import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizedVideo, HeroBackground } from '@/components/ui/visual-assets';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface OnboardingVideoProps {
  title: string;
  description: string;
  videoSrc: string;
  thumbnailSrc?: string;
  duration?: string;
  category?: string;
  autoPlay?: boolean;
}

export const OnboardingVideo: React.FC<OnboardingVideoProps> = ({
  title,
  description,
  videoSrc,
  thumbnailSrc,
  duration = "3:45",
  category = "Tutorial",
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
        <OptimizedVideo
          src={videoSrc}
          poster={thumbnailSrc}
          className="w-full h-full"
          autoPlay={autoPlay}
          muted={isMuted}
          loop={false}
          controls={false}
        />

        {/* Custom Controls Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white/90 hover:bg-white text-black"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="bg-white/90 hover:bg-white text-black"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white text-black"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Duration Badge */}
        <Badge className="absolute top-2 right-2 bg-black/70 text-white">
          {duration}
        </Badge>

        {/* Category Badge */}
        <Badge variant="secondary" className="absolute top-2 left-2">
          {category}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
    </Card>
  );
};

// Video Gallery Component
interface VideoGalleryProps {
  videos: OnboardingVideoProps[];
  title?: string;
  description?: string;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  title = "Video Tutorials",
  description = "Learn how to use GooseOps features effectively"
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <OnboardingVideo key={index} {...video} />
        ))}
      </div>
    </div>
  );
};

// Feature Demo Video Component
export const FeatureDemoVideo: React.FC = () => {
  const demoVideos: OnboardingVideoProps[] = [
    {
      title: "ARES AI Assistant",
      description: "Learn how to interact with Super ARES for complex problem-solving and strategic insights",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: "4:32",
      category: "AI Features"
    },
    {
      title: "Dashboard Analytics",
      description: "Master the BI dashboard for real-time business intelligence and reporting",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      duration: "3:18",
      category: "Analytics"
    },
    {
      title: "Field Operations",
      description: "Complete guide to mobile field operations and equipment management",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "5:21",
      category: "Operations"
    },
    {
      title: "Strategic Planning",
      description: "Advanced strategic planning tools and predictive analytics",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: "6:15",
      category: "Strategy"
    },
    {
      title: "Team Collaboration",
      description: "Real-time collaboration features and communication tools",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      duration: "3:45",
      category: "Collaboration"
    },
    {
      title: "Integration Setup",
      description: "Connect with Dataverse, Dynamics 365, and Power Platform",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      duration: "7:02",
      category: "Integration"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <HeroBackground variant="gradient" className="mb-12 rounded-2xl">
          <div className="text-center text-white py-12">
            <h1 className="text-4xl font-bold mb-4">GooseOps Feature Demos</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Watch our comprehensive video tutorials to master every aspect of the GooseOps Neural Empire platform
            </p>
          </div>
        </HeroBackground>

        <VideoGallery videos={demoVideos} />
      </div>
    </div>
  );
};