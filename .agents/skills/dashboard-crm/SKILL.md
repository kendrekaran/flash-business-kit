---
name: dashboard-crm
description: Turn a CSV into a polished KPI dashboard or simple browser-local CRM. Use for sales reporting, client pipelines and small-business dashboards.
license: MIT
---

Choose the tool around the customer's workflow, not around a generic grid of cards.

## Required design guidance
Load `kpi-dashboard-design` for metric selection, hierarchy and calculation context; load `frontend-design` for visual execution. Both are bundled alongside this skill. If used standalone, read `references/kpi-summary.md` and `references/design.md` instead. Detailed upstream examples are guidance, not verified executable analytics; check formulas against the user's data.

## Decide the mode
- Dashboard: uploaded records -> filters -> KPIs -> chart -> underlying rows.
- CRM: add/edit contacts or deals -> change stage -> searchable pipeline -> export. A browser-local demo is not a shared multi-user CRM.
The starter supports both using one sales dataset. Preserve a requested narrower scope.

## Build
1. Inspect a sample CSV before choosing metrics. State each field, units, missing-value rules, time basis, currency and unique ID. The starter schema is in `references/schema.md`.
2. Use 4-6 useful KPIs; show period and definitions. Only show trends when a comparable previous period exists. Distinguish booked/won deal value from cash collected and open pipeline from realized revenue.
3. Use consistent filters across metrics, chart and rows. Add useful empty/error states. Import atomically: invalid rows must not partially replace valid data. Render uploaded strings as text, never executable HTML.
4. Build readable tables, restrained chart color, visible selection, accessible controls and a responsive compact navigation. Do not fill space with invented alerts or trend arrows.
5. For the static starter, imports remain in memory; persistence must be an explicit local action, with a delete control. A real shared CRM needs authentication, server storage, access controls and a separate implementation scope.
6. Validate totals with hand-calculated fixtures, quoted CSV fields, invalid dates/numbers/stages, filters, empty results, edits and safe CSV export. Show zero-baseline bars and an accessible data table.

Return the app, sample CSV, data dictionary, run instructions and an honest storage explanation.
