# Enterprise Plan Rules Store

An illustrative MERN prototype for maintaining synthetic wireless and Internet plans and exact directional plan-eligibility rules. It is an administrative prototype only; its sample data and rules are not production policy or legal guidance.

## Requirements

- Node.js 20 or newer
- MongoDB 6 or newer running locally or at an accessible development URI

## Run locally

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` if needed.
2. In `server/`, run `npm install`, then `npm run seed` to load synthetic sample plans and rules.
3. In `server/`, run `npm run dev`. The API listens on port 4000.
4. In `client/`, run `npm install`, then `npm run dev`. Open the URL printed by Vite.

The client proxies `/api` requests to `http://localhost:4000`. The API binds to `127.0.0.1` by default; set `PORT`, `HOST`, and `MONGODB_URI` in `server/.env` to override local defaults. Database indexes, including the unique active-direction constraint, are initialized before the API accepts requests.

## API overview

- `GET/POST /api/plans`, `GET/PUT/DELETE /api/plans/:id`
- `GET/POST /api/plan-rules`, `GET /api/plan-rules/:id`
- `PUT /api/plan-rules/:id` saves a new DRAFT revision; it does not overwrite the old version.
- `POST /api/plan-rules/:id/activate` activates a draft and retires the prior active version for that exact pair.
- `DELETE /api/plan-rules/:id` removes draft/retired revisions. Deleting an active revision retires and retains it.
- `GET /api/plan-rules/:fromPlanId/:toPlanId` returns only an effective active rule for that direction, both plan records, and the complete rule/version fields.
- `GET /api/eligibility/:fromPlanId/:toPlanId` returns an explicit `eligible: false` result when no effective active rule exists.

MongoDB enforces at most one ACTIVE revision per ordered plan pair. The reverse direction is a separate relationship. Plan deletion is rejected while any revision references it.
The rule form supports an optional `Effective To` date; rules past that date cannot be activated. The UI displays effective dates as UTC calendar dates to match the API values.

## Using the interface

- Type in any dropdown to filter its choices, then click a result or use the arrow keys and Enter to select it.
- If an eligibility check finds no active rule, **Add Plan Rule** starts with the checked plans selected; you can still change either plan before creating the draft.
- Use the brightness icon in the upper-right corner to switch between light and dark marine themes. The selection lasts until the page is reloaded.

## Verification

Run `npm test` in both `server/` and `client/`; run `npm run build` in `client/`.
