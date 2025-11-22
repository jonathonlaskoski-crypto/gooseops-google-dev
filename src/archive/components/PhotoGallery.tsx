import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfessionalPhoto, OptimizedImage, HeroBackground } from '@/components/ui/visual-assets';
import { Camera, Users, Building, Wrench, Truck, Award } from 'lucide-react';

interface PhotoGalleryProps {
  title?: string;
  description?: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  title = "GooseOps Visual Showcase",
  description = "Professional photography showcasing our operations, team, and facilities"
}) => {
  const [activeTab, setActiveTab] = useState('team');

  const photoCategories = [
    {
      id: 'team',
      label: 'Our Team',
      icon: Users,
      description: 'Meet the professionals behind GooseOps Neural Empire',
      photos: [
        {
          type: 'executive' as const,
          title: 'Executive Leadership',
          description: 'Strategic vision and business development'
        },
        {
          type: 'team' as const,
          title: 'Operations Team',
          description: 'Field operations and project management'
        },
        {
          type: 'team' as const,
          title: 'Technical Specialists',
          description: 'AI, analytics, and system integration'
        }
      ]
    },
    {
      id: 'facilities',
      label: 'Facilities',
      icon: Building,
      description: 'State-of-the-art facilities and equipment',
      photos: [
        {
          type: 'facility' as const,
          title: 'Corporate Headquarters',
          description: 'Modern office complex with advanced technology'
        },
        {
          type: 'office' as const,
          title: 'Operations Center',
          description: '24/7 monitoring and control center'
        },
        {
          type: 'facility' as const,
          title: 'Equipment Warehouse',
          description: 'Advanced inventory management system'
        }
      ]
    },
    {
      id: 'operations',
      label: 'Field Operations',
      icon: Wrench,
      description: 'Real-world beverage equipment installations',
      photos: [
        {
          type: 'field-work' as const,
          title: 'Equipment Installation',
          description: 'Professional beverage system setup'
        },
        {
          type: 'equipment' as const,
          title: 'Advanced Machinery',
          description: 'State-of-the-art beverage processing equipment'
        },
        {
          type: 'field-work' as const,
          title: 'Quality Assurance',
          description: 'Rigorous testing and quality control'
        }
      ]
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      description: 'Milestones and industry recognition',
      photos: [
        {
          type: 'facility' as const,
          title: 'Industry Awards',
          description: 'Recognition for excellence in beverage services'
        },
        {
          type: 'team' as const,
          title: 'Project Milestones',
          description: 'Successful large-scale installations'
        },
        {
          type: 'executive' as const,
          title: 'Client Partnerships',
          description: 'Long-term relationships with industry leaders'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <HeroBackground
        variant="image"
        imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=600&fit=crop"
        className="mb-12"
      >
        <div className="text-center text-white py-16">
          <Camera className="h-16 w-16 mx-auto mb-4 text-blue-300" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </HeroBackground>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {photoCategories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {photoCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">{category.label}</h2>
                <p className="text-muted-foreground text-lg">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.photos.map((photo, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="aspect-[4/3] overflow-hidden">
                      <ProfessionalPhoto
                        type={photo.type}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        alt={photo.title}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{photo.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{photo.description}</p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

// Company Overview Component with Professional Imagery
export const CompanyOverview: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Stats Section */}
      <HeroBackground variant="gradient" className="rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          <div className="text-center text-white">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-blue-200">Projects Completed</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl font-bold mb-2">98.5%</div>
            <div className="text-blue-200">Client Satisfaction</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-blue-200">Support Available</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl font-bold mb-2">15+</div>
            <div className="text-blue-200">Years Experience</div>
          </div>
        </div>
      </HeroBackground>

      {/* Professional Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="overflow-hidden">
          <ProfessionalPhoto
            type="executive"
            className="w-full h-64 object-cover"
            alt="Executive Team"
          />
          <CardHeader>
            <CardTitle>Leadership Excellence</CardTitle>
            <p className="text-muted-foreground">
              Our executive team brings decades of industry experience and strategic vision to every project.
            </p>
          </CardHeader>
        </Card>

        <Card className="overflow-hidden">
          <ProfessionalPhoto
            type="facility"
            className="w-full h-64 object-cover"
            alt="Modern Facilities"
          />
          <CardHeader>
            <CardTitle>State-of-the-Art Facilities</CardTitle>
            <p className="text-muted-foreground">
              Advanced equipment and technology ensure precision and efficiency in all operations.
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Field Operations Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <ProfessionalPhoto
            type="field-work"
            className="w-full h-48 object-cover"
            alt="Field Operations"
          />
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Expert Installation</h3>
            <p className="text-sm text-muted-foreground">
              Professional beverage equipment installation with precision and care.
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <ProfessionalPhoto
            type="equipment"
            className="w-full h-48 object-cover"
            alt="Advanced Equipment"
          />
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Cutting-Edge Technology</h3>
            <p className="text-sm text-muted-foreground">
              Latest beverage processing technology for optimal performance.
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <ProfessionalPhoto
            type="team"
            className="w-full h-48 object-cover"
            alt="Dedicated Team"
          />
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Dedicated Professionals</h3>
            <p className="text-sm text-muted-foreground">
              Skilled technicians committed to excellence in every project.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};