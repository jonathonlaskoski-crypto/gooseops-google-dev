import { useReducer, useCallback, useMemo, useEffect } from 'react';
import { supabase, NeuralSystemRecord } from '@/lib/supabase';

// 🧠 NEURAL EMPIRE STATE MANAGEMENT - FIELD TECH INTEGRATION

export interface NeuralSystemState {
  // Core Intelligence Systems
  enterpriseIntelligence: boolean;
  enterpriseLearning: boolean;
  teamLearning: boolean;
  teamBrainstorm: boolean;
  teamPredictor: boolean;
  performanceOptimizer: boolean;
  
  // Master Neural Systems
  masterOrchestrator: boolean;
  aiArmy: boolean;
  multiPlatform: boolean;
  neuralEmpireActivated: boolean;
  
  // Field Operations
  fieldOptimization: boolean;
  routeIntelligence: boolean;
  predictiveMaintenance: boolean;
  customerIntelligence: boolean;
  equipmentMonitoring: boolean;
  safetySentinel: boolean;
  
  // Performance Control
  performanceMode: 'tactical' | 'enterprise' | 'domination';
  aiTone: string;
}

export interface UIState {
  // NOVA Twin
  showNova: boolean;
  novaAuthenticated: boolean;
  novaExternalCommand: string;
  showNovaPersonalConnection: boolean;
  
  // Interface Controls
  showQuickLaunch: boolean;
  voiceEnabled: boolean;
  globalSearchActive: boolean;
  voiceInputActive: boolean;
  enterpriseMode: boolean;
  systemReady: boolean;
  
  // Field Tech Specific
  fieldMode: boolean;
  jobContext: string | null;
  offlineMode: boolean;
}

export interface DataState {
  // Intelligence Data
  teamConversationData: any[];
  teamLearningPatterns: any[];
  enterpriseIntelligenceData: any;
  crossSystemIntelligence: any[];
  systemPerformanceMetrics: any;
  
  // Field Operations Data
  jobOptimizationData: any;
  routeData: any[];
  equipmentData: any[];
  customerData: any[];
  
  // Deployment State
  deploymentZones: {[key: string]: any[]};
  narratorMessages: any[];
  cinematicOverlay: {
    type: 'deploy' | 'success' | 'alert' | 'flyover' | 'enterprise' | 'field' | null;
    message?: string;
  };
}

type NeuralEmpireState = {
  neural: NeuralSystemState;
  ui: UIState;
  data: DataState;
};

// 🚀 ACTION TYPES - FIELD TECH TACTICAL COMMANDS
export type NeuralEmpireAction = 
  | { type: 'TOGGLE_NEURAL_SYSTEM'; payload: keyof NeuralSystemState }
  | { type: 'ACTIVATE_NEURAL_EMPIRE' }
  | { type: 'RESET_NEURAL_SYSTEMS' }
  | { type: 'SET_PERFORMANCE_MODE'; payload: 'tactical' | 'enterprise' | 'domination' }
  | { type: 'SET_AI_TONE'; payload: string }
  | { type: 'TOGGLE_NOVA'; payload?: boolean }
  | { type: 'SET_NOVA_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_NOVA_COMMAND'; payload: string }
  | { type: 'TOGGLE_UI_ELEMENT'; payload: keyof UIState }
  | { type: 'SET_FIELD_MODE'; payload: boolean }
  | { type: 'SET_JOB_CONTEXT'; payload: string | null }
  | { type: 'SET_OFFLINE_MODE'; payload: boolean }
  | { type: 'UPDATE_DEPLOYMENT_ZONES'; payload: {zoneId: string; tile: any} }
  | { type: 'ADD_NARRATOR_MESSAGE'; payload: any }
  | { type: 'SET_CINEMATIC_OVERLAY'; payload: {type: any; message?: string} }
  | { type: 'SYNC_NEURAL_SYSTEMS'; payload: NeuralSystemRecord[] };

// 🧠 INITIAL STATE - FIELD TECH NEURAL DOMINANCE
const initialState: NeuralEmpireState = {
  neural: {
    // Core Intelligence - FIELD OPTIMIZED
    enterpriseIntelligence: false,
    enterpriseLearning: false,
    teamLearning: false,
    teamBrainstorm: false,
    teamPredictor: false,
    performanceOptimizer: false,
    
    // Master Neural Systems - FIELD COMMAND
    masterOrchestrator: false,
    aiArmy: false,
    multiPlatform: false,
    neuralEmpireActivated: false,
    
    // Field Operations - TACTICAL INTELLIGENCE
    fieldOptimization: false,
    routeIntelligence: false,
    predictiveMaintenance: false,
    customerIntelligence: false,
    equipmentMonitoring: false,
    safetySentinel: false,
    
    // Performance Settings - FIELD CONTROL
    performanceMode: 'tactical',
    aiTone: 'field-tactical'
  },
  ui: {
    // NOVA Neural Twin
    showNova: false,
    novaAuthenticated: false,
    novaExternalCommand: '',
    showNovaPersonalConnection: false,
    
    // Interface Controls
    showQuickLaunch: false,
    voiceEnabled: false,
    globalSearchActive: false,
    voiceInputActive: false,
    enterpriseMode: false,
    systemReady: false,
    
    // Field Tech Specific
    fieldMode: false,
    jobContext: null,
    offlineMode: false
  },
  data: {
    // Intelligence Collections
    teamConversationData: [],
    teamLearningPatterns: [],
    enterpriseIntelligenceData: {},
    crossSystemIntelligence: [],
    systemPerformanceMetrics: {},
    
    // Field Operations Data
    jobOptimizationData: {},
    routeData: [],
    equipmentData: [],
    customerData: [],
    
    // Operational Data
    deploymentZones: {},
    narratorMessages: [],
    cinematicOverlay: { type: null }
  }
};

// 🚀 NEURAL EMPIRE REDUCER - FIELD TECH STATE MACHINE
const neuralEmpireReducer = (state: NeuralEmpireState, action: NeuralEmpireAction): NeuralEmpireState => {
  switch (action.type) {
    case 'TOGGLE_NEURAL_SYSTEM':
      return {
        ...state,
        neural: {
          ...state.neural,
          [action.payload]: !state.neural[action.payload]
        }
      };
      
    case 'ACTIVATE_NEURAL_EMPIRE':
      return {
        ...state,
        neural: {
          ...state.neural,
          neuralEmpireActivated: true,
          performanceMode: 'domination'
        },
        ui: {
          ...state.ui,
          enterpriseMode: true,
          systemReady: true
        }
      };
      
    case 'RESET_NEURAL_SYSTEMS':
      return {
        ...state,
        neural: {
          ...initialState.neural,
          performanceMode: state.neural.performanceMode,
          aiTone: state.neural.aiTone
        }
      };
      
    case 'SET_PERFORMANCE_MODE':
      return {
        ...state,
        neural: {
          ...state.neural,
          performanceMode: action.payload
        }
      };
      
    case 'SET_AI_TONE':
      return {
        ...state,
        neural: {
          ...state.neural,
          aiTone: action.payload
        }
      };
      
    case 'TOGGLE_NOVA':
      return {
        ...state,
        ui: {
          ...state.ui,
          showNova: action.payload !== undefined ? action.payload : !state.ui.showNova
        }
      };
      
    case 'SET_NOVA_AUTHENTICATED':
      return {
        ...state,
        ui: {
          ...state.ui,
          novaAuthenticated: action.payload
        }
      };
      
    case 'SET_NOVA_COMMAND':
      return {
        ...state,
        ui: {
          ...state.ui,
          novaExternalCommand: action.payload
        }
      };
      
    case 'TOGGLE_UI_ELEMENT':
      return {
        ...state,
        ui: {
          ...state.ui,
          [action.payload]: !state.ui[action.payload]
        }
      };
      
    case 'SET_FIELD_MODE':
      return {
        ...state,
        ui: {
          ...state.ui,
          fieldMode: action.payload
        }
      };
      
    case 'SET_JOB_CONTEXT':
      return {
        ...state,
        ui: {
          ...state.ui,
          jobContext: action.payload
        }
      };
      
    case 'SET_OFFLINE_MODE':
      return {
        ...state,
        ui: {
          ...state.ui,
          offlineMode: action.payload
        }
      };
      
    case 'UPDATE_DEPLOYMENT_ZONES':
      return {
        ...state,
        data: {
          ...state.data,
          deploymentZones: {
            ...state.data.deploymentZones,
            [action.payload.zoneId]: [
              ...(state.data.deploymentZones[action.payload.zoneId] || []),
              action.payload.tile
            ]
          }
        }
      };
      
    case 'ADD_NARRATOR_MESSAGE':
      return {
        ...state,
        data: {
          ...state.data,
          narratorMessages: [
            ...state.data.narratorMessages.slice(-19), // Keep last 20 messages for performance
            action.payload
          ]
        }
      };
      
    case 'SET_CINEMATIC_OVERLAY':
      return {
        ...state,
        data: {
          ...state.data,
          cinematicOverlay: action.payload
        }
      };
      
    case 'SYNC_NEURAL_SYSTEMS': {
      const syncedSystems = action.payload.reduce((acc, system) => {
        acc[system.system_id] = system.active;
        return acc;
      }, {} as Record<string, boolean>);
      
      return {
        ...state,
        neural: {
          ...state.neural,
          ...syncedSystems
        }
      };
    }
      
    default:
      return state;
  }
};

// 🚀 NEURAL EMPIRE HOOK - FIELD TECH COMMAND CENTER
export const useNeuralEmpireState = (techId?: string) => {
  const [state, dispatch] = useReducer(neuralEmpireReducer, initialState);
  
  // 🎯 ACTION CREATORS - MEMOIZED FOR PERFORMANCE
  const actions = useMemo(() => ({
    toggleNeuralSystem: (systemId: keyof NeuralSystemState) => 
      dispatch({ type: 'TOGGLE_NEURAL_SYSTEM', payload: systemId }),
    
    activateNeuralEmpire: () => 
      dispatch({ type: 'ACTIVATE_NEURAL_EMPIRE' }),
    
    resetNeuralSystems: () => 
      dispatch({ type: 'RESET_NEURAL_SYSTEMS' }),
    
    setPerformanceMode: (mode: 'tactical' | 'enterprise' | 'domination') => 
      dispatch({ type: 'SET_PERFORMANCE_MODE', payload: mode }),
    
    setAiTone: (tone: string) => 
      dispatch({ type: 'SET_AI_TONE', payload: tone }),
    
    toggleNova: (show?: boolean) => 
      dispatch({ type: 'TOGGLE_NOVA', payload: show }),
    
    setNovaAuthenticated: (authenticated: boolean) => 
      dispatch({ type: 'SET_NOVA_AUTHENTICATED', payload: authenticated }),
    
    setNovaCommand: (command: string) => 
      dispatch({ type: 'SET_NOVA_COMMAND', payload: command }),
    
    toggleUIElement: (element: keyof UIState) => 
      dispatch({ type: 'TOGGLE_UI_ELEMENT', payload: element }),
    
    setFieldMode: (fieldMode: boolean) => 
      dispatch({ type: 'SET_FIELD_MODE', payload: fieldMode }),
    
    setJobContext: (jobContext: string | null) => 
      dispatch({ type: 'SET_JOB_CONTEXT', payload: jobContext }),
    
    setOfflineMode: (offlineMode: boolean) => 
      dispatch({ type: 'SET_OFFLINE_MODE', payload: offlineMode }),
    
    updateDeploymentZones: (zoneId: string, tile: any) => 
      dispatch({ type: 'UPDATE_DEPLOYMENT_ZONES', payload: { zoneId, tile } }),
    
    addNarratorMessage: (message: any) => 
      dispatch({ type: 'ADD_NARRATOR_MESSAGE', payload: message }),
    
    setCinematicOverlay: (overlay: {type: any; message?: string}) => 
      dispatch({ type: 'SET_CINEMATIC_OVERLAY', payload: overlay }),
    
    syncNeuralSystems: (systems: NeuralSystemRecord[]) => 
      dispatch({ type: 'SYNC_NEURAL_SYSTEMS', payload: systems })
  }), []);
  
  // 🧠 COMPUTED VALUES - FIELD TECH OPTIMIZED
  const computed = useMemo(() => {
    // Active System Count
    const activeSystems = Object.values(state.neural).filter(Boolean).length;
    
    // Neural Empire Status
    const isNeuralEmpireReady = state.neural.neuralEmpireActivated && state.ui.systemReady;
    
    // Performance Status
    const isHighPerformanceMode = state.neural.performanceMode === 'domination';
    
    // System Health
    const systemHealth = Math.min(100, (activeSystems / 15) * 100);
    
    // Field Evolution Stage
    const evolutionStage = 
      state.neural.neuralEmpireActivated ? 'FIELD EMPIRE ACTIVATED' :
      activeSystems > 8 ? 'ADVANCED FIELD MESH' :
      activeSystems > 4 ? 'TACTICAL FIELD COORDINATION' :
      activeSystems > 0 ? 'FIELD SYSTEM INITIALIZATION' : 'FIELD STANDBY MODE';

    return {
      activeSystems,
      isNeuralEmpireReady,
      isHighPerformanceMode,
      systemHealth,
      evolutionStage
    };
  }, [state.neural, state.ui.systemReady]);
  
  // 🚀 NEURAL MESSAGE HANDLER
  const addNarratorMessage = useCallback((content: string, type: string = 'info') => {
    const message = {
      id: Date.now(),
      content,
      type,
      timestamp: new Date().toISOString(),
      source: 'neural-empire-field'
    };
    actions.addNarratorMessage(message);
  }, [actions]);
  
  // 🎯 SYSTEM INITIALIZATION
  useEffect(() => {
    if (!state.ui.systemReady) {
      setTimeout(() => {
        dispatch({ type: 'TOGGLE_UI_ELEMENT', payload: 'systemReady' });
        addNarratorMessage('🚀 Field Tech Neural Empire systems online - Tactical dominance mode activated', 'success');
      }, 1000);
    }
  }, [state.ui.systemReady, addNarratorMessage]);
  
  // 🔄 SUPABASE SYNC
  useEffect(() => {
    if (techId && state.ui.systemReady) {
      const syncSystems = async () => {
        try {
          const systems = await supabase
            .from('neural_systems')
            .select('*')
            .eq('tech_id', techId);
          
          if (systems.data) {
            actions.syncNeuralSystems(systems.data);
          }
        } catch (error) {
          console.error('Neural systems sync error:', error);
        }
      };
      
      syncSystems();
    }
  }, [techId, state.ui.systemReady, actions]);
  
  return {
    ...state,
    actions,
    computed,
    addNarratorMessage
  };
};
