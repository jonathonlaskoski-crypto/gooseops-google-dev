import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  calculateJobPriority,
  optimizeRoute,
  scheduleJobs,
  predictJobDuration,
  type Job,
  type TechProfile,
} from './optimization';

describe('optimization', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const result = calculateDistance(40.7128, -74.0060, 40.7137, -74.0070);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1); // Less than 1 km for these close points
    });

    it('should return 0 for identical points', () => {
      const result = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
      expect(result).toBe(0);
    });
  });

  describe('calculateJobPriority', () => {
    const mockJob: Job = {
      id: 'job1',
      title: 'Test Job',
      address: '123 Main St',
      lat: 40.7128,
      lng: -74.0060,
      priority: 'high' as 'high',
      estimatedHours: 2,
      skillsRequired: ['HVAC', 'Electrical'],
      description: 'Test job description',
    };

    const mockTechProfile: TechProfile = {
      skills: ['HVAC', 'Networking'],
      efficiency: 8,
      experience: 5,
      currentLocation: { lat: 40.7135, lng: -74.0075 },
      workingHours: { start: 8, end: 17 },
      preferredJobTypes: ['HVAC'],
    };

    it('should calculate job priority based on multiple factors', () => {
      const result = calculateJobPriority(mockJob, mockTechProfile);
      expect(result).toBeGreaterThan(0);
    });

    it('should prioritize jobs with matching skills', () => {
      const highMatchJob = { ...mockJob, skillsRequired: ['HVAC', 'Networking'] };
      const lowMatchJob = { ...mockJob, skillsRequired: ['Plumbing', 'Security'] };

      const highMatchScore = calculateJobPriority(highMatchJob, mockTechProfile);
      const lowMatchScore = calculateJobPriority(lowMatchJob, mockTechProfile);

      expect(highMatchScore).toBeGreaterThan(lowMatchScore);
    });

    it('should prioritize jobs with higher priority levels', () => {
      const highPrioJob = { ...mockJob, priority: 'high' as 'high' };
      const mediumPrioJob = { ...mockJob, priority: 'medium' as 'medium' };
      const lowPrioJob = { ...mockJob, priority: 'low' as 'low' };

      const highScore = calculateJobPriority(highPrioJob, mockTechProfile);
      const mediumScore = calculateJobPriority(mediumPrioJob, mockTechProfile);
      const lowScore = calculateJobPriority(lowPrioJob, mockTechProfile);

      expect(highScore).toBeGreaterThan(mediumScore);
      expect(mediumScore).toBeGreaterThan(lowScore);
    });
  });

  describe('optimizeRoute', () => {
    const mockJobs: Job[] = [
      {
        id: 'job1',
        title: 'Job 1',
        address: '123 Main St',
        lat: 40.7128,
        lng: -74.0060,
        priority: 'high' as 'high',
        estimatedHours: 2,
        skillsRequired: ['HVAC'],
        description: 'Job 1 description',
      },
      {
        id: 'job2',
        title: 'Job 2',
        address: '456 Park Ave',
        lat: 40.7135,
        lng: -74.0075,
        priority: 'medium' as 'medium',
        estimatedHours: 1,
        skillsRequired: ['Electrical'],
        description: 'Job 2 description',
      },
      {
        id: 'job3',
        title: 'Job 3',
        address: '789 Broadway',
        lat: 40.7120,
        lng: -74.0050,
        priority: 'low' as 'low',
        estimatedHours: 3,
        skillsRequired: ['Networking'],
        description: 'Job 3 description',
      },
    ];

    const mockTechProfile: TechProfile = {
      skills: ['HVAC', 'Electrical', 'Networking'],
      efficiency: 8,
      experience: 5,
      currentLocation: { lat: 40.7140, lng: -74.0080 },
      workingHours: { start: 8, end: 17 },
      preferredJobTypes: ['HVAC', 'Electrical'],
    };

    it('should optimize route based on priority and distance', () => {
      const startLocation = { lat: 40.7140, lng: -74.0080 };
      const result = optimizeRoute(mockJobs, startLocation, mockTechProfile);

      expect(result.optimizedJobs).toHaveLength(mockJobs.length);
      expect(result.totalDistance).toBeGreaterThan(0);
      expect(result.estimatedTime).toBeGreaterThan(0);
    });

    it('should return empty result for empty job list', () => {
      const startLocation = { lat: 40.7140, lng: -74.0080 };
      const result = optimizeRoute([], startLocation, mockTechProfile);

      expect(result.optimizedJobs).toHaveLength(0);
      expect(result.totalDistance).toBe(0);
      expect(result.estimatedTime).toBe(0);
    });
  });

  describe('scheduleJobs', () => {
    const mockJobs: Job[] = [
      {
        id: 'job1',
        title: 'Job 1',
        address: '123 Main St',
        lat: 40.7128,
        lng: -74.0060,
        priority: 'high' as 'high',
        estimatedHours: 2,
        skillsRequired: ['HVAC'],
        description: 'Job 1 description',
      },
      {
        id: 'job2',
        title: 'Job 2',
        address: '456 Park Ave',
        lat: 40.7135,
        lng: -74.0075,
        priority: 'medium' as 'medium',
        estimatedHours: 1,
        skillsRequired: ['Electrical'],
        description: 'Job 2 description',
      },
    ];

    const mockTechProfile: TechProfile = {
      skills: ['HVAC', 'Electrical'],
      efficiency: 8,
      experience: 5,
      currentLocation: { lat: 40.7140, lng: -74.0080 },
      workingHours: { start: 8, end: 17 },
      preferredJobTypes: ['HVAC', 'Electrical'],
    };

    it('should schedule jobs with proper start and end times', () => {
      const startTime = new Date();
      const result = scheduleJobs(mockJobs, mockTechProfile, startTime);

      expect(result).toHaveLength(mockJobs.length);
      expect(result[0].scheduledStart).toBeInstanceOf(Date);
      expect(result[0].scheduledEnd).toBeInstanceOf(Date);
      expect(result[0].travelTime).toBeGreaterThan(0);

      // Second job should start after first job ends
      expect(result[1].scheduledStart.getTime()).toBeGreaterThanOrEqual(
        result[0].scheduledEnd.getTime()
      );
    });
  });

  describe('predictJobDuration', () => {
    const mockJob: Job = {
      id: 'job1',
      title: 'Test Job',
      address: '123 Main St',
      lat: 40.7128,
      lng: -74.0060,
      priority: 'high' as 'high',
      estimatedHours: 2,
      skillsRequired: ['HVAC', 'Electrical'],
      description: 'Test job description',
      equipmentComplexity: 1.2,
    };

    const mockTechProfile: TechProfile = {
      skills: ['HVAC', 'Networking'],
      efficiency: 8,
      experience: 5,
      currentLocation: { lat: 40.7135, lng: -74.0075 },
      workingHours: { start: 8, end: 17 },
      preferredJobTypes: ['HVAC'],
    };

    it('should predict job duration based on skills and complexity', () => {
      const result = predictJobDuration(mockJob, mockTechProfile);
      expect(result).toBeGreaterThan(0);

      // Result should be different from estimated hours due to adjustments
      expect(result).not.toBe(mockJob.estimatedHours);
    });

    it('should adjust duration for skill proficiency', () => {
      const highSkillTech = { ...mockTechProfile, skills: ['HVAC', 'Electrical', 'Networking'] };
      const lowSkillTech = { ...mockTechProfile, skills: ['Plumbing'] };

      const highSkillDuration = predictJobDuration(mockJob, highSkillTech);
      const lowSkillDuration = predictJobDuration(mockJob, lowSkillTech);

      expect(lowSkillDuration).toBeGreaterThan(highSkillDuration);
    });
  });
});
