# GitHub Copilot Instructions for GooseOps Neural Empire

## Mission & Architecture

This is **GooseOps** - an AI-powered business operations platform with two primary configurations:

1. **GooseOps Unlocked** (Main App) - For Directors/CEOs with everything unlocked, enabling development of new ideas with advanced AI agents that scrape, crawl, create Power Platform automations, connect to Dataverse/MCP/ML, and generate leads for RDS (beverage installation company)

2. **GooseOps Light** (Mobile Shell) - Stable foundation with minimal requirements, rapidly expandable with modular architecture for role-based deployments:
   - **GooseOps Lite-Tech** - Field technician mobile app with **RDS_Assist** AI
   - **FPM Edition** - Field Project Manager tools  
   - **Office Edition** - Administrative roles

### Core Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + GitHub Spark
- **UI Framework**: Radix UI + Tailwind CSS (mobile-first design)
- **State Management**: Spark's `useKV` hook for offline-first persistence
- **AI Integration**: Named AI agents in main app, **RDS_Assist** in mobile
- **Business Logic**: ML optimization + Power Platform automation
- **Icons**: Phosphor Icons with auto-proxy via `createIconImportProxy()`

## Key Architectural Patterns

#### 1. Modular Foundation System (`src/lib/rdsFoundation.ts`)
```tsx
interface RDSModule {
  scope: 'beverage' | 'hvac' | 'electrical' | 'general' | 'all'
  aiCapabilities: string[]
  category: 'core' | 'ai-scope' | 'utility' | 'integration'
}
```
- Modules can be dynamically loaded/unloaded for different role configurations
- AI capabilities are scope-specific (RDS_Assist for mobile, named AIs for main app)

#### 2. Role-Based Access Control (`src/lib/directorProfile.ts`)
```tsx
interface DirectorProfile {
  accessLevel: 'director' | 'executive' | 'admin'
  permissions: DirectorPermissions
  canAccessAllModules: boolean
}
```
- Executive roles get full GooseOps Unlocked access
- Field roles get stripped-down GooseOps Light with specific modules

#### 3. Offline-First Data Strategy
```tsx
const [selectedJob, setSelectedJob] = useKV<Job | null>('selected-job', null)
const [syncPending, setSyncPending] = useKV<string[]>('sync-pending', [])
```
- Critical for field technician mobile usage
- Queue operations for sync when connectivity returns

#### 4. AI Agent Architecture
**Main App (Named AIs):**
- Nova AI (`src/components/NovaAI.tsx`) - Personal AI twin
- Jarvis AI (`src/components/JarvisAI.tsx`) - Operational intelligence  
- SuperAres (`src/components/SuperAres.tsx`) - Cybersecurity

**Mobile App (Anonymous AI):**
- **RDS_Assist** only - consistent branding for field operations

## Development Workflows

#### Multi-Configuration Development
```bash
npm run dev          # Full GooseOps development
npm run build        # Production build with role detection
npm run optimize     # Module optimization for GooseOps Light
```

#### Module System Management
```tsx
// Loading scope-specific modules
const rdsModules = rds.getModulesByScope('beverage')
const aiModules = rds.getAIModules()
```

#### Role-Based Component Rendering
```tsx
{userRole === 'director' && <AIOrchestrationDashboard />}
{userRole === 'field-tech' && <JobMap showOptimization={false} />}
```

## Critical Conventions

#### 1. AI Agent Naming
- **Main App**: Use specific AI names (Nova, Jarvis, SuperAres, etc.)
- **Mobile App**: Always use **RDS_Assist** for consistency
- **Context Switching**: AI agents know their deployment context

#### 2. Module Configuration
```tsx
// Always check module availability before using features
const module = rds.getModule('beverage-optimization')
if (module?.isActive) {
  // Use advanced features
}
```

#### 3. Business Intelligence Integration
```tsx
import { GooseOpsBIDashboard } from '@/components/GooseOpsBIDashboard'
// Revenue building and lead generation for RDS
```

#### 4. Power Platform Integration
```tsx
import { microsoft365Integration } from '@/lib/microsoft365Integration'
// Power Automate, Apps, Pages, Dataverse connections
```

## Design System Specifics

#### Mobile-First Field Operations
- **Color Scheme**: Professional blue + safety orange + neutral gray
- **Touch Interfaces**: `coarse: { raw: "(pointer: coarse)" }`
- **Field Visibility**: High contrast for outdoor use
- **Offline Indicators**: Clear sync status throughout UI

#### Role-Based UI Adaptation
```tsx
// Executive dashboards - full feature set
<Tabs>
  <TabsTrigger value="revenue">Revenue</TabsTrigger>
  <TabsTrigger value="analytics">Analytics</TabsTrigger>
</Tabs>

// Field tech interface - essential tools only
<SimpleJobList onJobSelect={handleJobSelect} />
```

## Integration Points

#### Power Platform Automation
```tsx
import { communicationLanes } from '@/lib/communicationLanes'
// Dataverse connections, Power Automate workflows
```

#### RDS Lead Generation
```tsx
import { FieldServiceMLEngine } from '@/lib/mlInsights'
// Customer profiling, revenue opportunities, contract optimization
```

#### Geographic Intelligence
```tsx
import { optimizeRoute } from '@/lib/optimization'
// Haversine calculations, traffic analysis, field tech efficiency
```

## Common Development Tasks

#### Adding New Business Modules
1. Define module in `src/lib/rdsFoundation.ts`
2. Set appropriate scope and AI capabilities
3. Register with module loader
4. Test role-based access controls

#### AI Agent Customization
1. **Main App**: Create new component in `src/components/[AgentName]AI.tsx`
2. **Mobile App**: Extend RDS_Assist capabilities only
3. Implement scope-aware personality and capabilities

#### Revenue/Analytics Features
1. Integrate with `src/components/GooseOpsBIDashboard.tsx`
2. Connect to ML insights engine
3. Ensure director-level access controls
4. Add RDS lead generation hooks

#### Figma Integration Workflow
1. Design tokens managed in `theme.json`
2. Component designs follow Radix UI patterns
3. Mobile-first breakpoints in `tailwind.config.js`
4. Update UI components in `src/components/ui/`

## 🛠️ GooseOps Forge Tool Cluster (Cursor as Command Deck)

**Cursor IDE** is the **centerpiece cockpit** where all copilots/extensions run and code is generated/refined. The complete forge cluster:

- **Cursor IDE** → The primary command deck where all copilots plug in and development happens
- **Nuxt v4 (Vue)** → Cockpit shell / main frame for advanced deployments
- **React + shadcn/ui islands** → Modular UI arsenal (current implementation)
- **Excalidraw** → Operator-proof design canvas for system architecture
- **Fabric.js / Konva.js** → Advanced drawing/interaction for technical diagrams
- **LangChain / CrewAI / AutoGen** → AI orchestration layer (wiring copilots together)
- **Supabase** → Auth, DB, storage backend with real-time capabilities
- **Power Platform** → Business automation (Power Automate, Apps, Pages, Dataverse)
- **Vercel / Netlify** → Deployment targets with edge computing
- **Registry + MCP** → Supply chain for distributing/versioning modules
- **GooseOps Audit Journal** → Comprehensive logging of all AI outputs and operations
- **GitHub** → Source of truth repos, CI/CD pipelines, and development workflow

**Development Workflow with Cursor:**
1. All AI agents (Claude, Gemini, etc.) operate through Cursor extensions
2. Forge tools are scaffolded and refined directly in Cursor
3. Real-time collaboration between multiple AI copilots in single IDE
4. Cursor handles the orchestration of complex multi-file operations
5. All code generation, debugging, and optimization flows through Cursor interface