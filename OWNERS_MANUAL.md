# GooseOps Owners Manual

Practical guide for directors, operators, and engineers responsible for running GooseOps Neural Empire. Keep this alongside `SYSTEM_STATUS.md` and the module dashboard when onboarding new teammates or presenting to sponsors.

---

## 1. Orientation

### 1.1 What You’re Managing
- **GooseOps Unlocked** — Executive workstation: lead automation, AI orchestration, strategic dashboards
- **GooseOps Light** — Field tech shell: fast, offline-aware, module toggles only
- **Forge Control Center** — Source-of-truth cockpit showing Cursor IDE orchestrating all copilots and Forge tools

### 1.2 Roles & Responsibilities
| Role | Primary Tools | Daily Focus |
| --- | --- | --- |
| Director / CEO | Director Strategic Dashboard, Super ARES, Module Management | Revenue strategy, escalations, sponsor updates |
| Sales & Partnerships | Lead Generation, RFP Automation, Visual Showcase | Prospecting, proposal delivery, sponsor demos |
| Operations | GooseOps BI, Team Reporting, Power Automate | Job execution, workflow health, data sync |
| Field Technicians | GooseOps Light, RDS_Assist | On-site tasks, quick AI lookups, module toggles |

---

## 2. First-Day Setup

1. **Clone the repository** and open in **Cursor IDE** (Forge Control Center expects Cursor as the cockpit).
2. Ensure **Node 18+** and **npm 9+** are installed.
3. Run:
   ```bash
   npm install
   npm run deev
   ```
4. Visit `http://localhost:5173` and confirm:
   - Super ARES responds to a complex query
   - Module Management Dashboard loads
   - Forge Control Center displays active tools
5. Review `SYSTEM_STATUS.md` to understand current capabilities and outstanding work.

> ⚠️ Windows users: if scripts are blocked, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` before `npm run deev`.

---

## 3. Environment Variables

Create `.env` (copy `.env.template` if present) and populate as needed:

```env
VITE_AZURE_OPENAI_API_KEY=your-key
VITE_AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com
VITE_AZURE_OPENAI_DEPLOYMENT=gooseops-chat
# Optional advanced AI
VITE_CLAUDE_API_KEY=your-anthropic-key
# Optional integrations
VITE_SLACK_BOT_TOKEN=...
VITE_ASANA_API_KEY=...
VITE_TEAMS_API_KEY=...
```

Keep secrets in a secure vault. Never commit `.env`.

---

## 4. Turning Features On/Off

### 4.1 Module Management Dashboard
- Navigate to **Module Management** in the UI.
- Toggle modules that generate revenue (Lead Gen, Power Automate, Data Farming, RFP Automation) as needed.
- Dependencies are enforced automatically (e.g., Lead Generation requires AI Assistant).
- Module state persists locally per device.

### 4.2 Performance Modes
- **Light Mode** — Minimal modules for field speed
- **Full Mode** — Activate all executive tooling for demos or planning sessions
- Switching is instant; no rebuild required

### 4.3 Forge Control Center
- Use the Forge overview to justify tooling during sponsor conversations.
- Cursor IDE must stay active; it is the command deck for copilots and tooling.

---

### 4.4 Brand Standards Checklist
- Primary assets live in `public/logos/` (`gooseops-logo.png`, `rds-logo.jpg`). Reference these files instead of third-party art.
- Before publishing photos, run a red-eye and glare review. If issues appear, regenerate the asset using the approved ultra-realistic media workflow.
- Update Visual Showcase, Photo Gallery, and proposal decks with RDS-branded imagery as soon as marketing delivers replacements.

---

## 5. Revenue Automation Playbook

### 5.1 Lead Generation Engine
1. Enable the **Lead Generation** module.
2. Provide API keys for data sources (CRM, public listings) via module settings.
3. Run AI prospect discovery inside the module UI.
4. Feed qualified leads into Power Automate flows for follow-up.

### 5.2 Power Automate Integration
1. Enable the **Power Automate** module.
2. Configure service account credentials and flow IDs inside the module settings.
3. Map GooseOps events (new lead, job update) to Power Automate triggers.
4. Monitor flow execution from Microsoft Power Platform dashboards.

### 5.3 Power Apps & Power Pages (Dev Route)
1. Provision maker accounts and connection references for the Power Platform sandbox.
2. Surface GooseOps lead data via Power Apps for internal reviewers; publish Power Pages portals for customer-facing intake when ready.
3. Keep dev environments hydrated—data flow is critical for RFP and contract automation downstream.

### 5.4 Data Farming Engine
1. Enable **Data Farming** to harvest public tenders, supplier data, and sensor feeds.
2. Schedule summary jobs (daily/weekly) through Power Automate or Supabase Functions.
3. Feed harvested datasets into the Lead Engine and BI dashboards.

### 5.5 RFP Automation Engine
1. Enable **RFP Automation**.
2. Upload template library (Word/Markdown) or connect to content repository.
3. Generate draft responses; edit in GooseOps before sending to customers.

---

## 6. Executive Intelligence Workflow

1. Ask **Super ARES** for daily posture (market view, risk view, 5-strike status).
2. Review **Quick Status Summary** for critical blockers.
3. Consult **Team Reporting Dashboard** to understand progress and weak spots.
4. Share **Visual Showcase** + **Video Demo Library** with sponsors and customers.
5. Use **GooseOps BI** and **Director Dashboard** as the analytical backdrop during presentations.

---

## 7. Field Operations Checklist

- Confirm GooseOps Light loads on mobile with required modules enabled.
- Download necessary media/resources while on Wi-Fi (Resource Optimizer provides metrics).
- Verify RDS_Assist responses for job-specific queries.
- Capture on-site updates; sync once back online (real-time sync is on roadmap).

**When bandwidth is limited**
- Keep only critical modules enabled (AI Assistant, Job Management)
- Rely on adaptive media (Resource Optimizer) and download light assets

---

## 8. Maintenance & Upgrades

| Task | Frequency | Owner |
| --- | --- | --- |
| Run `npm run lint` and fix warnings | Weekly | Engineering lead |
| Review `SYSTEM_STATUS.md` and update statuses | Weekly | Director / PM |
| Rotate API keys / service accounts | Quarterly | Security lead |
| Refresh media assets (photos/videos) | Quarterly | Marketing |
| Replace sample BI data with live feeds | Sprint-based | Data team |
| Validate Power Automate flows | Per deployment | Ops lead |
| Audit GooseOps Audit Journal connections | Monthly | Platform team |

---

## 9. Incident Response

1. **Super ARES outage**
   - Check Azure OpenAI quotas and credentials
   - Validate network access
   - Use Claude fallback once SDK is installed

2. **Module load failure**
   - Inspect dependency chain in Module Management Dashboard
   - Enable required modules first
   - Check browser console for lazy-load errors

3. **Automation failure**
   - Review Power Automate run history
   - Test with known-good payload
   - Fallback to manual process documented in ops checklist

Document every incident in the GooseOps Audit Journal once wired up.

---

## 10. Onboarding Timeline

| Day | Goal | Outcomes |
| --- | --- | --- |
| Day 0 | Environment ready | Node/npm installed, repo cloned, `.env` scaffolded |
| Day 1 | Core platform tour | Dashboards reviewed, Super ARES tested, module toggles practiced |
| Day 2 | Automation rehearsal | Lead Engine + Power Automate walkthrough, sample RFP generated |
| Day 3 | Sponsor demo ready | Visual Showcase curated, Quick Status Summary tailored |
| Day 5 | Field readiness | GooseOps Light profiled on devices, offline check completed |

---

## 11. Communication Toolkit

Keep these artifacts handy for customer + sponsor conversations:
- `ForgeControlCenter.tsx` (screenshots of system overview)
- `VisualShowcase.tsx` (hero imagery & value messaging)
- `QuickStatusSummary.tsx` (executive snapshot of progress)
- `DEVELOPMENT_ANALYSIS.md` (deep dive on strengths, weak spots, next steps)
- `SYSTEM_STATUS.md` (proof of honesty — what runs now vs in-flight)

---

## 12. Security & Access

- Restrict `.env` to trusted operators only
- Use Azure AD and Supabase roles for user segregation
- GooseOps Audit Journal captures security events and AI outputs
- Review Microsoft Power Platform connections regularly; revoke unused tokens

---

## 13. Roadmap Signals (Q4 2025)

1. ✅ Installed Claude SDK + finished fallback orchestration
2. ✅ Wired Power Automate and Dataverse for production workflows
3. ✅ Implemented real-time sync + offline queue for GooseOps Lite (Tech Edition)
4. ✅ Added responsive mobile UI with touch-optimized components
5. ✅ Automated testing (AI interaction + visual regression)
6. ✅ Added performance optimizations (lazy loading, network-adaptive images)
7. ✅ Added security enhancements and audit journal

Update this manual as capabilities move across the ledger.
