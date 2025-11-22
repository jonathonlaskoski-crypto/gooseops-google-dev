# Field Tech Job Management System

A comprehensive mobile-first application for field technicians to discover jobs, navigate to sites, document work completion, and communicate with managers - all with offline-first functionality.

**Experience Qualities**:
1. **Efficient** - Streamlined workflows that minimize time between tasks and maximize productivity
2. **Reliable** - Robust offline functionality ensures work continues regardless of connectivity
3. **Professional** - Clean, trustworthy interface that inspires confidence in documentation and communication

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Requires user authentication, GPS integration, camera access, offline data sync, real-time messaging, and comprehensive state management across multiple interconnected workflows

## Essential Features

### Job Discovery & Selection
- **Functionality**: Interactive map showing available jobs with filtering and search capabilities
- **Purpose**: Allows techs to find and select appropriate work assignments based on location, skill requirements, and availability
- **Trigger**: Tech opens app and navigates to job map
- **Progression**: View map → Filter available jobs → Select job → View details → Accept assignment → Navigate to location
- **Success criteria**: Tech can successfully find, select, and navigate to job sites within 60 seconds

### GPS Navigation Integration
- **Functionality**: Direct integration with device's default map application for turn-by-turn directions
- **Purpose**: Ensures techs can efficiently reach job sites without app switching
- **Trigger**: After accepting a job, tech taps "Get Directions" button
- **Progression**: Select job → Tap directions → External map app opens → Navigate to site
- **Success criteria**: Navigation launches successfully and provides accurate routing to job coordinates

### Time-Stamped Check-in System
- **Functionality**: Photo-based check-in with automatic timestamp and GPS coordinates
- **Purpose**: Provides verifiable proof of arrival and departure times for billing and accountability
- **Trigger**: Tech arrives at job site and opens check-in screen
- **Progression**: Arrive at site → Open check-in → Take arrival photo → Auto-capture timestamp/GPS → Begin work
- **Success criteria**: Check-in photo, timestamp, and location are captured and stored locally with sync queue

### Task Management with Photo Documentation
- **Functionality**: 20-item customizable checklist with mandatory photo or note documentation per task
- **Purpose**: Ensures work quality, provides documentation trail, and enables progress tracking
- **Trigger**: After check-in, tech accesses task list for current job
- **Progression**: View task list → Select task → Complete work → Take photo OR add detailed notes → Mark complete → Move to next task
- **Success criteria**: All tasks documented with either photo evidence or comprehensive notes, progress auto-saved

### Integrated AI Assistant (Copilot)
- **Functionality**: Context-aware AI help for task guidance, missing documentation alerts, and next-step recommendations
- **Purpose**: Reduces errors, provides real-time support, and ensures compliance with job requirements
- **Trigger**: Tech taps help icon or AI assistant proactively suggests improvements
- **Progression**: Encounter issue → Request help → Receive contextual guidance → Apply suggestion → Continue work
- **Success criteria**: Assistant provides relevant, actionable guidance that reduces task completion time and improves documentation quality

### Manager Communication System
- **Functionality**: Automated Slack messaging for job completion, early departure requests, and issue escalation
- **Purpose**: Keeps management informed and enables quick decision-making for scheduling and resource allocation
- **Trigger**: Job completion or need to leave site before all tasks completed
- **Progression**: Complete all tasks → Auto-generate completion message → Send to manager OR Need to leave early → Compose departure request → Send for approval
- **Success criteria**: Messages delivered successfully with job details, completion status, and any outstanding issues clearly communicated

### Offline-First Architecture
- **Functionality**: Full app functionality without internet connection, with automatic sync when connectivity returns
- **Purpose**: Ensures productivity continues in areas with poor cellular coverage or network outages
- **Trigger**: App detects network loss and switches to offline mode
- **Progression**: Lose connectivity → Continue working offline → Complete tasks and documentation → Regain connectivity → Auto-sync all data
- **Success criteria**: No data loss during offline periods, seamless sync upon reconnection, clear indication of sync status

## Edge Case Handling

- **GPS Failure**: Fallback to manual address entry with photo verification of location signage
- **Camera Malfunction**: Enhanced note-taking interface with voice-to-text and detailed requirement prompts
- **Network Sync Conflicts**: Timestamp-based conflict resolution with manager notification for critical discrepancies
- **Battery Depletion**: Critical data auto-save every 30 seconds with low-battery warnings and power-save mode
- **Incomplete Task Lists**: Flexible task modification with manager approval and automatic deadline adjustments
- **Slack Integration Failure**: Fallback to in-app messaging queue with manual retry and alternative contact methods

## Design Direction

Professional, mobile-first interface that feels like essential work equipment rather than consumer entertainment, emphasizing clarity and efficiency over visual flourish while maintaining modern usability standards.

## Color Selection

Triadic (three equally spaced colors) - Using professional blue, safety orange, and neutral gray to create a trustworthy yet energetic palette that communicates reliability and urgency appropriately.

- **Primary Color**: Professional Blue (oklch(0.55 0.15 240)) - Communicates trust, reliability, and corporate professionalism
- **Secondary Colors**: Neutral Gray (oklch(0.65 0.02 280)) for backgrounds and supporting elements, Safety Orange (oklch(0.70 0.18 40)) for alerts and action items
- **Accent Color**: Safety Orange (oklch(0.70 0.18 40)) - High-visibility color for critical actions, warnings, and incomplete items requiring attention
- **Foreground/Background Pairings**:
  - Background (White oklch(1 0 0)): Dark Gray text (oklch(0.25 0.02 280)) - Ratio 8.2:1 ✓
  - Card (Light Gray oklch(0.98 0.01 280)): Dark Gray text (oklch(0.25 0.02 280)) - Ratio 7.8:1 ✓
  - Primary (Professional Blue oklch(0.55 0.15 240)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Secondary (Neutral Gray oklch(0.65 0.02 280)): Dark Gray text (oklch(0.25 0.02 280)) - Ratio 4.8:1 ✓
  - Accent (Safety Orange oklch(0.70 0.18 40)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓

## Font Selection

Sans-serif typography emphasizing legibility in bright sunlight and various field conditions, with clear hierarchy supporting quick scanning and task completion.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/24px/tight letter spacing
  - H2 (Screen Headers): Inter SemiBold/20px/normal spacing  
  - H3 (Section Titles): Inter Medium/18px/normal spacing
  - Body Text: Inter Regular/16px/relaxed leading for readability
  - Small Text (Timestamps, Meta): Inter Regular/14px/tight leading
  - Button Text: Inter Medium/16px/normal spacing for clarity

## Animations

Subtle, functional animations that communicate state changes and guide user attention without delaying critical workflows - prioritizing instant feedback over decorative motion.

- **Purposeful Meaning**: Quick micro-interactions (100-200ms) for task completion feedback, smooth transitions for navigation, and pulsing indicators for sync status
- **Hierarchy of Movement**: Task completion gets satisfying check animation, critical alerts use attention-grabbing pulses, navigation transitions are swift and directional

## Component Selection

- **Components**: Card for job listings and task items, Button for primary actions, Input for search and notes, Dialog for photo capture and confirmation, Badge for status indicators, Progress for task completion, Alert for warnings and sync status
- **Customizations**: Custom camera component with overlay guides, specialized map integration component, offline indicator banner, photo grid with zoom capability
- **States**: Buttons show loading states during sync, inputs indicate required vs optional, cards show selection and completion states, overall app shows offline/online status
- **Icon Selection**: Camera for photo tasks, MapPin for navigation, CheckCircle for completion, AlertTriangle for warnings, Wifi/WifiOff for connectivity, Clock for timestamps
- **Spacing**: Consistent 16px base spacing with 8px for tight layouts and 24px for section separation using Tailwind's scale
- **Mobile**: Bottom navigation for core functions, swipe gestures for task navigation, large touch targets (44px minimum), collapsible sections for complex forms, thumb-friendly button placement