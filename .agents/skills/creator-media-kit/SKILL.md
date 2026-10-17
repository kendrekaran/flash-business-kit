---
name: creator-media-kit
description: Build a compact creator profile with audience charts, a selectable sponsorship rate card and a downloadable partnership brief. Use when a creator wants a shareable sponsor page.
license: MIT
---

Build a sponsor-facing page with a distinct visual identity.

1. Load `frontend-design` or read `references/design.md`. Inspect the user's attached reference if supplied. If no screenshot is available, state this and choose an original direction. Never pretend to match an unseen image.
2. Collect the creator's name, niche, work samples, verified audience metrics with date/platform/source, audience geography and approved contact details. Use fictional names and conspicuously labelled sample metrics for demos.
3. Copy `assets/` as an editable starter. Use the attached reference as the layout brief. The starter combines a tilted illustrated profile card, identity and metric grid, audience breakdowns, and a sticky sponsorship selector. Keep the white/blue profile aesthetic distinct from marketing landing pages. Keep package scope explicit: formats, quantity, usage rights and exclusivity should be negotiated, not silently granted.
4. Make the selectable rate card recalculate its total, disable the CTA for an empty selection, and open an accessible campaign-planning dialog. Include brand, goal, optional date and contact, a downloadable/copyable brief and print styling. Prices and durations live in `config.js`; tested selection and brief logic lives in `partnership.mjs`. Do not fake sponsor endorsements or imply illustrative artwork depicts the fictional creator.
5. Configure a real enquiry recipient only from the user's approved contact details. Until then, provide a local copyable draft; never show a false sent confirmation.
6. Verify mobile, keyboard interaction, long names, image fallback, print layout and all CTA destinations.

Return the page, editable configuration and one copy-paste prompt for future customization.
