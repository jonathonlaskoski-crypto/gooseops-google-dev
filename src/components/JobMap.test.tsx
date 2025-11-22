import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { JobMap } from './JobMap';
import { FieldServiceMLEngine } from '@/lib/mlInsights';

// Mock dependencies
vi.mock('react-leaflet', () => ({
  MapContainer: vi.fn().mockImplementation(({ children }) => (
    <div data-testid="map-container">{children}</div>
  )),
  TileLayer: vi.fn().mockImplementation(() => <div data-testid="tile-layer" />),
  Marker: vi.fn().mockImplementation(({ children }) => (
    <div data-testid="map-marker">{children}</div>
  )),
  Popup: vi.fn().mockImplementation(({ children }) => (
    <div data-testid="map-popup">{children}</div>
  )),
  Polyline: vi.fn().mockImplementation(() => <div data-testid="map-polyline" />),
}));

vi.mock('@/lib/mlInsights', () => ({
  FieldServiceMLEngine: vi.fn().mockImplementation(() => ({
    generateDashboardInsights: vi.fn().mockResolvedValue([
      {
        type: 'prediction',
        confidence: 0.85,
        title: 'Route Optimization Available',
        description: 'Optimizing the route can save 15% travel time',
        actionable: true,
        impact: 'medium',
      },
    ]),
  })),
}));

describe('JobMap', () => {
  const mockJobs = [
    {
      id: '1',
      title: 'HVAC Repair',
      address: '123 Main St',
      lat: 40.7128,
      lng: -74.0060,
      priority: 'high' as 'high',
      estimatedHours: 2,
      skillsRequired: ['HVAC'],
      description: 'Fix broken HVAC system',
    },
    {
      id: '2',
      title: 'Network Setup',
      address: '456 Park Ave',
      lat: 40.7580,
      lng: -73.9855,
      priority: 'medium' as 'medium',
      estimatedHours: 3,
      skillsRequired: ['Networking'],
      description: 'Setup new network',
    },
  ];

  const mockUserLocation = { lat: 40.7300, lng: -74.0000 };
  const mockOnJobSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(
      <JobMap
        jobs={mockJobs}
        userLocation={mockUserLocation}
        onJobSelect={mockOnJobSelect}
      />
    );

    expect(getByTestId('map-container')).toBeInTheDocument();
  });

  it('displays optimize route button when showOptimization is true', () => {
    const { getByText } = render(
      <JobMap
        jobs={mockJobs}
        userLocation={mockUserLocation}
        onJobSelect={mockOnJobSelect}
        showOptimization={true}
      />
    );

    expect(getByText(/optimize route/i)).toBeInTheDocument();
  });

  it('does not display optimize route button when showOptimization is false', () => {
    const { queryByText } = render(
      <JobMap
        jobs={mockJobs}
        userLocation={mockUserLocation}
        onJobSelect={mockOnJobSelect}
        showOptimization={false}
      />
    );

    expect(queryByText(/optimize route/i)).not.toBeInTheDocument();
  });

  it('renders a marker for each job', () => {
    const { getAllByTestId } = render(
      <JobMap
        jobs={mockJobs}
        userLocation={mockUserLocation}
        onJobSelect={mockOnJobSelect}
      />
    );

    // MapContainer (1) + Markers for user (1) + Markers for jobs (2)
    const allMarkers = getAllByTestId('map-marker');
    expect(allMarkers.length).toBe(mockJobs.length + 1); // Jobs + user location
  });

  it('renders a loading state when userLocation is null', () => {
    const { getByText } = render(
      <JobMap
        jobs={mockJobs}
        userLocation={null}
        onJobSelect={mockOnJobSelect}
      />
    );

    expect(getByText(/loading map/i)).toBeInTheDocument();
  });
});
