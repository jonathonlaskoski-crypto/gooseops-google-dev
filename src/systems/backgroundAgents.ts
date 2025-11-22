// GooseOps Background Agent Scheduler (lightweight runtime)
// 10 agents: 4 free pool, 1 idle monitor, 1 todo tracker, 2 research scouts, 1 orchestration, 1 performance auditor.
// Uses in-memory loop; integrate with Supabase or external APIs later.

interface Agent {
  id: string;
  role: string;
  status: 'idle' | 'working' | 'error';
  lastRun: number;
  intervalMs: number;
  run: () => Promise<void>;
}

const AGENT_TICK_MS = 2000; // base tick

// Shared state (extend with persistence later)
const agentState: Record<string, any> = {
  todoList: [],
  driftAlerts: [],
  researchFindings: [],
  idleAlerts: [],
  performanceLog: []
};

function now() { return Date.now(); }

// Placeholder utility
async function safeRun(label: string, fn: () => Promise<void>) {
  try { await fn(); } catch (e) { console.warn(`[Agent:${label}] error`, e); }
}

// Define agents
const agents: Agent[] = [
  // 4 free agents (available for ad-hoc assignment)
  ...Array.from({ length: 4 }).map((_, i) => ({
    id: `free_${i + 1}`,
    role: 'free',
    status: 'idle' as const,
    lastRun: 0,
    intervalMs: 15000,
    run: async () => { /* stand-by */ }
  })),
  {
    id: 'idle_monitor',
    role: 'monitor-idle',
    status: 'idle',
    lastRun: 0,
    intervalMs: 5000,
    run: async () => {
      const idleAgents = agents.filter(a => a.role !== 'monitor-idle' && a.status === 'idle');
      if (idleAgents.length > 0) {
        agentState.idleAlerts.push({ ts: now(), idleAgents: idleAgents.map(a => a.id) });
        console.log('[IdleMonitor] Idle agents:', idleAgents.map(a => a.id));
      }
    }
  },
  {
    id: 'todo_tracker',
    role: 'todo-tracker',
    status: 'idle',
    lastRun: 0,
    intervalMs: 7000,
    run: async () => {
      // Simple drift check: if no research findings in last cycle, flag drift
      const recentResearch = agentState.researchFindings.filter((r: any) => now() - r.ts < 300000);
      if (recentResearch.length === 0) {
        agentState.driftAlerts.push({ ts: now(), reason: 'No recent research findings' });
        console.log('[TodoTracker] Drift: no recent research findings');
      }
    }
  },
  // 2 research scouts
  ...['research_scout_1', 'research_scout_2'].map(id => ({
    id,
    role: 'research',
    status: 'idle' as const,
    lastRun: 0,
    intervalMs: 20000,
    run: async () => {
      // Placeholder: in real impl call internal knowledge update or external API fetch
      const finding = { ts: now(), summary: 'Placeholder best-practice scan (local only).' };
      agentState.researchFindings.push(finding);
      console.log(`[Research] ${id} logged finding.`);
    }
  })),
  {
    id: 'orchestrator',
    role: 'orchestration',
    status: 'idle',
    lastRun: 0,
    intervalMs: 8000,
    run: async () => {
      // Assign one idle free agent to assist research if findings backlog < 5
      const backlog = agentState.researchFindings.length;
      if (backlog < 5) {
        const free = agents.find(a => a.role === 'free' && a.status === 'idle');
        if (free) {
          free.status = 'working';
          console.log('[Orchestrator] Assigned', free.id, 'to assist research');
          setTimeout(() => { free.status = 'idle'; }, 5000);
        }
      }
    }
  },
  {
    id: 'performance_auditor',
    role: 'performance',
    status: 'idle',
    lastRun: 0,
    intervalMs: 10000,
    run: async () => {
      const avgIdle = agents.filter(a => a.role === 'free').reduce((acc, a) => acc + (a.status === 'idle' ? 1 : 0), 0);
      agentState.performanceLog.push({ ts: now(), freeIdle: avgIdle });
      console.log('[PerformanceAuditor] Free idle count:', avgIdle);
    }
  }
];

let loopHandle: number | null = null;

function tick() {
  const current = now();
  agents.forEach(agent => {
    if (current - agent.lastRun >= agent.intervalMs) {
      agent.lastRun = current;
      safeRun(agent.id, async () => {
        agent.status = 'working';
        await agent.run();
        agent.status = 'idle';
      });
    }
  });
}

export function startBackgroundAgents() {
  if (loopHandle !== null) return;
  loopHandle = setInterval(tick, AGENT_TICK_MS) as unknown as number;
  console.log('[BackgroundAgents] Scheduler started');
}

export function stopBackgroundAgents() {
  if (loopHandle) { clearInterval(loopHandle as any); loopHandle = null; }
  console.log('[BackgroundAgents] Scheduler stopped');
}

export function getAgentSnapshot() {
  return {
    agents: agents.map(a => ({ id: a.id, role: a.role, status: a.status, lastRun: a.lastRun })),
    idleAlerts: agentState.idleAlerts.slice(-10),
    driftAlerts: agentState.driftAlerts.slice(-10),
    researchCount: agentState.researchFindings.length,
    performanceLog: agentState.performanceLog.slice(-10)
  };
}

// Auto-start if running in browser (optional)
if (typeof window !== 'undefined') {
  // Delay start to let app initialize
  setTimeout(() => startBackgroundAgents(), 1500);
}
