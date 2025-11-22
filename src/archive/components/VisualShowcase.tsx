import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    HeroBackground,
    ProfessionalPhoto,
    OptimizedImage,
    OptimizedVideo
} from '@/components/ui/visual-assets';
import { PhotoGallery, CompanyOverview } from './PhotoGallery';
import { FeatureDemoVideo } from './VideoComponents';
import { PerformanceDashboard } from './ResourceOptimizer';
import {
    Sparkles,
    Camera,
    Video,
    Zap,
    Users,
    Building,
    Award,
    TrendingUp
} from 'lucide-react';

export const VisualShowcase: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Main Hero Section */}
            <HeroBackground
                variant="image"
                imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=800&fit=crop"
                className="mb-16"
            >
                <div className="text-center text-white py-20">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                            <Sparkles className="h-12 w-12 text-blue-300" />
                        </div>
                    </div>
                    <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                        Ultra-Real Visual Experience
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                        Experience GooseOps Neural Empire with stunning professional photography,
                        immersive video content, and optimized performance that doesn&apos;t compromise on visual quality.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                            <Camera className="h-4 w-4 mr-2" />
                            Professional Photography
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                            <Video className="h-4 w-4 mr-2" />
                            HD Video Content
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                            <Zap className="h-4 w-4 mr-2" />
                            Optimized Performance
                        </Badge>
                    </div>
                </div>
            </HeroBackground>

            <div className="max-w-7xl mx-auto px-6 space-y-16">
                {/* Feature Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="text-center hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <div className="mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 w-fit mb-4">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle>Professional Photography</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                High-resolution images showcasing our team, facilities, and operations
                                with professional composition and lighting.
                            </p>
                            <ul className="text-sm text-left space-y-1">
                                <li>• Executive portraits</li>
                                <li>• Facility showcases</li>
                                <li>• Field operations</li>
                                <li>• Equipment galleries</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="text-center hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <div className="mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-full p-4 w-fit mb-4">
                                <Video className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle>Immersive Videos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Cinematic video content for onboarding, feature demos, and
                                interactive learning experiences.
                            </p>
                            <ul className="text-sm text-left space-y-1">
                                <li>• Product tutorials</li>
                                <li>• Feature demonstrations</li>
                                <li>• Team introductions</li>
                                <li>• Process walkthroughs</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="text-center hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <div className="mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mb-4">
                                <Zap className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle>Performance Optimized</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Advanced optimization techniques ensure fast loading without
                                sacrificing visual quality.
                            </p>
                            <ul className="text-sm text-left space-y-1">
                                <li>• Lazy loading</li>
                                <li>• Smart compression</li>
                                <li>• CDN delivery</li>
                                <li>• Cache optimization</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Interactive Showcase */}
                <Tabs defaultValue="photos" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="photos" className="flex items-center space-x-2">
                            <Camera className="h-4 w-4" />
                            <span>Photo Gallery</span>
                        </TabsTrigger>
                        <TabsTrigger value="videos" className="flex items-center space-x-2">
                            <Video className="h-4 w-4" />
                            <span>Video Demos</span>
                        </TabsTrigger>
                        <TabsTrigger value="company" className="flex items-center space-x-2">
                            <Building className="h-4 w-4" />
                            <span>Company Overview</span>
                        </TabsTrigger>
                        <TabsTrigger value="performance" className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>Performance</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="photos">
                        <PhotoGallery />
                    </TabsContent>

                    <TabsContent value="videos">
                        <FeatureDemoVideo />
                    </TabsContent>

                    <TabsContent value="company">
                        <CompanyOverview />
                    </TabsContent>

                    <TabsContent value="performance">
                        <PerformanceDashboard />
                    </TabsContent>
                </Tabs>

                {/* Call to Action */}
                <HeroBackground variant="gradient" className="rounded-2xl">
                    <div className="text-center text-white py-16">
                        <Award className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
                        <h2 className="text-4xl font-bold mb-4">
                            Experience the Visual Excellence
                        </h2>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                            Our ultra-real visual experience combines professional photography,
                            immersive video content, and optimized performance to create an
                            unparalleled user experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                                <Users className="h-5 w-5 mr-2" />
                                Explore Team Gallery
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                                <Video className="h-5 w-5 mr-2" />
                                Watch Feature Demos
                            </Button>
                        </div>
                    </div>
                </HeroBackground>
            </div>
        </div>
    );
};

// Quick Visual Stats Component
export const VisualStats: React.FC = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
                <CardContent className="pt-6">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-muted-foreground">Professional Photos</div>
                </CardContent>
            </Card>

            <Card className="text-center">
                <CardContent className="pt-6">
                    <Video className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-sm text-muted-foreground">Video Tutorials</div>
                </CardContent>
            </Card>

            <Card className="text-center">
                <CardContent className="pt-6">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm text-muted-foreground">Faster Loading</div>
                </CardContent>
            </Card>

            <Card className="text-center">
                <CardContent className="pt-6">
                    <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">4K</div>
                    <div className="text-sm text-muted-foreground">Ultra HD Quality</div>
                </CardContent>
            </Card>
        </div>
    );
};
