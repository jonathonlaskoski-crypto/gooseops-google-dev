import React, { useEffect, useState } from 'react';
import { getAgentSnapshot } from '@/systems/backgroundAgents';

interface Snapshot {
  agents: { id: string; role: string; status: string; lastRun: number }[];
  idleAlerts: any[];
  driftAlerts: any[];
  researchCount: number;
  performanceLog: { ts: number; freeIdle: number }[];
}

export const AgentStatusPanel: React.FC = () => {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [refreshMs, setRefreshMs] = useState(3000);

  useEffect(() => {
    const tick = () => setSnap(getAgentSnapshot() as Snapshot);
    tick();
    const id = setInterval(tick, refreshMs);
    return () => clearInterval(id);
  }, [refreshMs]);

  if (!snap) return <div className="contrast-panel p-4 text-sm">Loading agent status...</div>;

  return (
    <div className="contrast-panel p-4 space-y-4 rounded-md">
      <div className="flex items-center justify-between">
        <h2 className="contrast-heading text-lg font-semibold">Background Agents</h2>
        <select
          className="contrast-btn text-xs py-1 px-2"
          value={refreshMs}
          onChange={e => setRefreshMs(Number(e.target.value))}
        >
          <option value={2000}>2s</option>
          <option value={5000}>5s</option>
          <option value={10000}>10s</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {snap.agents.map(a => (
          <div key={a.id} className={`text-xs border rounded p-2 ${a.status === 'idle' ? 'border-[#0A84FF]' : 'border-[#00C8FF]'}`}> 
            <div className="font-medium">{a.id}</div>
            <div className="opacity-80">{a.role}</div>
            <div className={`mt-1 font-semibold ${a.status === 'idle' ? 'text-[#008CFF]' : 'text-[#00C8FF]'}`}>{a.status}</div>
          </div>
        ))}
      </div>
      <div className="text-xs space-y-1">
        <div>Research findings: <span className="font-semibold text-[#00C8FF]">{snap.researchCount}</span></div>
        <div>Idle alerts: {snap.idleAlerts.length}</div>
        <div>Drift alerts: {snap.driftAlerts.length}</div>
        <div>Performance samples: {snap.performanceLog.length}</div>
      </div>
      {(snap.driftAlerts.slice(-1)[0]) && (
        <div className="text-xs bg-[#0A1930] border border-[#0A84FF] p-2 rounded">
          <strong>Latest Drift:</strong> {snap.driftAlerts.slice(-1)[0].reason}
        </div>
      )}
      <button
        type="button"
        onClick={() => setSnap(getAgentSnapshot() as Snapshot)}
        className="contrast-btn w-full"
      >Manual Refresh</button>
    </div>
  );
};

export default AgentStatusPanel;
