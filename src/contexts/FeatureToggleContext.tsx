import React, { createContext, useContext, useState, useEffect } from 'react';

// Feature Toggle Configuration
export interface FeatureToggles {
  // Core Business Features (Always On)
  leadGeneration: boolean;
  powerAutomateIntegration: boolean;
  dataFarming: boolean;
  rfpAutomation: boolean;

  // AI Features (High Priority)
  aresBasic: boolean;
  claudeIntegration: boolean;
  predictiveAnalytics: boolean;

  // Visual Features (Medium Priority)
  professionalPhotography: boolean;
  videoTutorials: boolean;
  advancedDashboards: boolean;

  // Advanced Features (Low Priority - Can be toggled off)
  realTimeSync: boolean;
  multiAgentOrchestration: boolean;
  advancedReporting: boolean;
  globalCdn: boolean;

  // Experimental Features (Off by default)
  voiceInterface: boolean;
  multiModalAI: boolean;
  advancedMachineLearning: boolean;
}

export const defaultFeatureToggles: FeatureToggles = {
  // Core Business - Always Enabled
  leadGeneration: true,
  powerAutomateIntegration: true,
  dataFarming: true,
  rfpAutomation: true,

  // AI Features - High Priority
  aresBasic: true,
  claudeIntegration: false, // Requires SDK installation
  predictiveAnalytics: true,

  // Visual Features - Medium Priority
  professionalPhotography: true,
  videoTutorials: false, // Can be heavy for mobile
  advancedDashboards: true,

  // Advanced Features - Can be toggled
  realTimeSync: false, // Performance impact
  multiAgentOrchestration: false, // Complexity
  advancedReporting: false, // Resource intensive
  globalCdn: false, // Cost consideration

  // Experimental - Off by default
  voiceInterface: false,
  multiModalAI: false,
  advancedMachineLearning: false,
};

// Feature Toggle Context
interface FeatureToggleContextType {
  toggles: FeatureToggles;
  updateToggle: (feature: keyof FeatureToggles, enabled: boolean) => void;
  isFeatureEnabled: (feature: keyof FeatureToggles) => boolean;
  getActiveFeatures: () => (keyof FeatureToggles)[];
  getPerformanceMode: () => 'light' | 'standard' | 'full';
}

const FeatureToggleContext = createContext<FeatureToggleContextType | undefined>(undefined);

export const useFeatureToggle = () => {
  const context = useContext(FeatureToggleContext);
  if (!context) {
    throw new Error('useFeatureToggle must be used within a FeatureToggleProvider');
  }
  return context;
};

// Performance Modes
export const PERFORMANCE_MODES = {
  light: {
    name: 'Light Mode',
    description: 'Essential features only - maximum performance',
    maxFeatures: 8,
    targetLoadTime: 1.5,
    targetBundleSize: 2, // MB
  },
  standard: {
    name: 'Standard Mode',
    description: 'Balanced features and performance',
    maxFeatures: 12,
    targetLoadTime: 2.5,
    targetBundleSize: 3.5,
  },
  full: {
    name: 'Full Mode',
    description: 'All features enabled - maximum functionality',
    maxFeatures: 20,
    targetLoadTime: 4.0,
    targetBundleSize: 5.0,
  },
};

interface FeatureToggleProviderProps {
  children: React.ReactNode;
  initialMode?: 'light' | 'standard' | 'full';
}

export const FeatureToggleProvider: React.FC<FeatureToggleProviderProps> = ({
  children,
  initialMode = 'standard'
}) => {
  const [toggles, setToggles] = useState<FeatureToggles>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('gooseops-feature-toggles');
    if (saved) {
      try {
        return { ...defaultFeatureToggles, ...JSON.parse(saved) };
      } catch (e) {
        console.warn('Failed to parse saved feature toggles');
      }
    }

    // Apply initial mode
    return applyPerformanceMode(defaultFeatureToggles, initialMode);
  });

  // Save to localStorage whenever toggles change
  useEffect(() => {
    localStorage.setItem('gooseops-feature-toggles', JSON.stringify(toggles));
  }, [toggles]);

  const updateToggle = (feature: keyof FeatureToggles, enabled: boolean) => {
    setToggles(prev => ({ ...prev, [feature]: enabled }));
  };

  const isFeatureEnabled = (feature: keyof FeatureToggles): boolean => {
    return toggles[feature];
  };

  const getActiveFeatures = (): (keyof FeatureToggles)[] => {
    return Object.keys(toggles).filter(key => toggles[key as keyof FeatureToggles]) as (keyof FeatureToggles)[];
  };

  const getPerformanceMode = (): 'light' | 'standard' | 'full' => {
    const activeCount = getActiveFeatures().length;

    if (activeCount <= PERFORMANCE_MODES.light.maxFeatures) return 'light';
    if (activeCount <= PERFORMANCE_MODES.standard.maxFeatures) return 'standard';
    return 'full';
  };

  const value: FeatureToggleContextType = {
    toggles,
    updateToggle,
    isFeatureEnabled,
    getActiveFeatures,
    getPerformanceMode,
  };

  return (
    <FeatureToggleContext.Provider value={value}>
      {children}
    </FeatureToggleContext.Provider>
  );
};

// Helper function to apply performance mode
function applyPerformanceMode(toggles: FeatureToggles, mode: 'light' | 'standard' | 'full'): FeatureToggles {
  const modeConfig = PERFORMANCE_MODES[mode];

  // For light mode, disable advanced features
  if (mode === 'light') {
    return {
      ...toggles,
      videoTutorials: false,
      realTimeSync: false,
      multiAgentOrchestration: false,
      advancedReporting: false,
      globalCdn: false,
      voiceInterface: false,
      multiModalAI: false,
      advancedMachineLearning: false,
    };
  }

  // For standard mode, enable some advanced features but not experimental
  if (mode === 'standard') {
    return {
      ...toggles,
      videoTutorials: true,
      realTimeSync: false, // Still off for performance
      multiAgentOrchestration: false, // Complexity
      advancedReporting: false, // Resource intensive
      globalCdn: false, // Cost
      voiceInterface: false,
      multiModalAI: false,
      advancedMachineLearning: false,
    };
  }

  // Full mode - all features available
  return toggles;
}

// Feature Toggle UI Component
export const FeatureTogglePanel: React.FC = () => {
  const { toggles, updateToggle, getActiveFeatures, getPerformanceMode } = useFeatureToggle();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeCount = getActiveFeatures().length;
  const performanceMode = getPerformanceMode();
  const modeConfig = PERFORMANCE_MODES[performanceMode];

  const featureGroups = {
    core: {
      title: 'Core Business Features',
      description: 'Essential for operations - always recommended',
      features: ['leadGeneration', 'powerAutomateIntegration', 'dataFarming', 'rfpAutomation'] as const,
      color: 'green'
    },
    ai: {
      title: 'AI Features',
      description: 'Intelligence and automation capabilities',
      features: ['aresBasic', 'claudeIntegration', 'predictiveAnalytics'] as const,
      color: 'blue'
    },
    visual: {
      title: 'Visual Features',
      description: 'User interface and experience enhancements',
      features: ['professionalPhotography', 'videoTutorials', 'advancedDashboards'] as const,
      color: 'purple'
    },
    advanced: {
      title: 'Advanced Features',
      description: 'High-performance and complex capabilities',
      features: ['realTimeSync', 'multiAgentOrchestration', 'advancedReporting', 'globalCdn'] as const,
      color: 'orange'
    },
    experimental: {
      title: 'Experimental Features',
      description: 'Cutting-edge capabilities (may impact performance)',
      features: ['voiceInterface', 'multiModalAI', 'advancedMachineLearning'] as const,
      color: 'red'
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Mode Indicator */}
      <div className={`p-4 rounded-lg border-2 ${
        performanceMode === 'light' ? 'border-green-200 bg-green-50' :
        performanceMode === 'standard' ? 'border-blue-200 bg-blue-50' :
        'border-purple-200 bg-purple-50'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{modeConfig.name}</h3>
            <p className="text-sm text-muted-foreground">{modeConfig.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{activeCount}/{modeConfig.maxFeatures}</div>
            <div className="text-sm text-muted-foreground">Features Active</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Performance Target</span>
            <span>&lt; {modeConfig.targetLoadTime}s load time</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                performanceMode === 'light' ? 'bg-green-500' :
                performanceMode === 'standard' ? 'bg-blue-500' : 'bg-purple-500'
              }`}
              style={{ width: `${(activeCount / modeConfig.maxFeatures) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feature Groups */}
      <div className="space-y-6">
        {Object.entries(featureGroups).map(([groupKey, group]) => {
          const isAdvanced = groupKey === 'advanced' || groupKey === 'experimental';
          if (isAdvanced && !showAdvanced) return null;

          return (
            <div key={groupKey} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-lg">{group.title}</h4>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  group.color === 'green' ? 'bg-green-100 text-green-800' :
                  group.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  group.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                  group.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {group.features.filter(f => toggles[f]).length}/{group.features.length} Active
                </div>
              </div>

              <div className="space-y-3">
                {group.features.map(feature => (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium cursor-pointer">
                        {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      {feature === 'claudeIntegration' && (
                        <div className="text-xs text-orange-600 mt-1">
                          ⚠️ Requires SDK installation
                        </div>
                      )}
                      {feature === 'videoTutorials' && (
                        <div className="text-xs text-blue-600 mt-1">
                          📱 May impact mobile performance
                        </div>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={toggles[feature]}
                      onChange={(e) => updateToggle(feature, e.target.checked)}
                      className="ml-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={groupKey === 'core'} // Core features can't be disabled
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show Advanced Toggle */}
      {!showAdvanced && (
        <div className="text-center">
          <button
            onClick={() => setShowAdvanced(true)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Show Advanced & Experimental Features
          </button>
        </div>
      )}

      {/* Performance Warning */}
      {performanceMode === 'full' && activeCount > PERFORMANCE_MODES.standard.maxFeatures && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-yellow-400">⚠️</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Performance Warning
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You have many features enabled. Consider switching to Standard or Light mode for better performance, especially on mobile devices.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};