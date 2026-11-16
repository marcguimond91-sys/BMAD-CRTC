<!-- bmad:context -->
<!-- Verified 2026-11-16 against 2c8f667. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## BMAD-CRTC Telecommunications Regulatory Analysis

Reference implementation for CRTC telecommunications regulations (CRTC 2026-78) with planning, architecture, and prototype implementations. TypeScript/Node.js stack with MongoDB; planning and implementation guidance in `_bmad-output/`, custom BMAD skills configured in `_bmad/`. This is a reference architecture — not legal advice, only analysis of publicly available requirements.

## Policy

- All work is reference implementation only; do not treat analysis output as legal, compliance, or regulatory guidance.
- BMAD skills are the primary workflow; follow invocation patterns in `.agents/skills/` and configuration from `_bmad/config.toml`.
- Do not modify BMAD skill files in `.agents/`; customizations go in `_bmad/custom/` to survive reinstalls.
- Prototype implementations (Node.js/MERN in `prototype/`) are illustrative only; production deployments require security hardening and compliance review beyond this repository.
- Code in `_bmad/` is installer-managed; edits outside `_bmad/custom/` are overwritten on install refresh.

## Where things are

- **Planning and analysis**: Output lives in `_bmad-output/planning-artifacts/` and `_bmad-output/implementation-artifacts/`.
- **BMAD skills and customization**: `.agents/skills/` holds the full skill library; `_bmad/custom/` holds team and personal overrides.
- **Agent configuration**: `_bmad/config.toml` defines agent names, roles, and skill settings; modify only via installer or `.agents/skills/*.agent.md` for custom agents.
- **Custom agents**: `.github/agents/` holds five custom BMAD agents (Mary, John, Sally, Winston, Amelia) with `.agent.md` manifest files; each loads its corresponding skill from `.agents/skills/`.
- **Prototype implementation**: `prototype/enterprise-plan-rules-store/` is a working MERN example for plan eligibility rules; Node 20+, MongoDB 6+, see README there for setup.
- **Regulatory source**: `source/` contains the original CRTC policy PDF.

## Running and verifying

- **BMAD workflow**: Agents and skills run in VS Code Copilot Chat; invoke via agent name (Mary, John, Sally, Winston, Amelia) or skill name (e.g. `bmad-prd`, `bmad-spec`). The workflow is plan → ship → retrospective; see `.agents/skills/bmad-help/SKILL.md` for navigation.
- **BMAD configuration resolution**: Use `uv run _bmad/scripts/resolve_config.py --project-root .` to merge installer-managed config with custom overrides; outputs JSON with resolved paths and all settings.
- **Prototype Node.js stack**: In `prototype/enterprise-plan-rules-store/server/`, copy `.env.example` to `.env`, run `npm install && npm run seed && npm run dev` to start API on port 4000. In `client/`, run `npm install && npm run dev`. Integration tests require `docker compose up -d` first. Run `npm test` and `npm run build` to verify.
- **BMAD skill tests**: Individual skills are documentation + conversational; no automated test suite. Verify a skill by running it end-to-end; see `bmad-project-context` SKILL.md for auditability.

## Conventions that differ from defaults

- **Document format**: BMAD workflows output Markdown files in `_bmad-output/`; planning artifacts and implementation artifacts live in separate subdirectories. File names include date and ID for traceability.
- **Configuration language**: BMAD uses TOML in `_bmad/config.toml` and Python scripts in `_bmad/scripts/` for config resolution; no JSON configuration layer.
- **Agent identification**: Agents are named (Mary, John, Sally, Winston, Amelia) in conversation and manifested in `.github/agents/` and `_bmad/config.toml`; skills use kebab-case names.
- **Prototype routing**: The Node.js prototype proxies `/api` to `http://localhost:4000`; never hardcode a production database URI in `server/.env`.

## Known pitfalls

- **Config not resolved automatically**: The installer-managed `_bmad/config.toml` is read-only; run the resolver script to see merged config with custom overrides from `_bmad/custom/`. Do not edit the installer-managed file directly.
- **BMAD skill output paths**: Output directory is controlled by `output_folder` in resolved config; check the resolver output before assuming `_bmad-output/` if custom overrides exist.
- **Prototype DB constraints**: MongoDB enforces exactly one ACTIVE rule revision per ordered plan pair; the UI reflects this. The reverse direction (plan A → B vs. B → A) is a separate rule and can have different eligibility. Deleting a plan fails if any active rule references it.
- **Prototype API versioning**: The API is v0 (illustrative); no versioning strategy is in place. Changes to endpoints must coordinate with the client proxy configuration.
- **Regulatory analysis scope**: Analysis documents reference only publicly available CRTC policy (CRTC 2026-78 and earlier); no proprietary carrier data or non-public guidance is included. Always link back to the official CRTC source when referencing findings.
- **Git history**: The repository was imported in one commit; use `git log` to find feature branches and analysis-specific commits only after the initial import at `9248e2d`.

<!-- /bmad:context -->
