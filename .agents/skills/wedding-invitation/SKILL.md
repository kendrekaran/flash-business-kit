---
name: wedding-invitation
description: Customize an elegant mobile wedding invitation with schedule, countdown, calendar download and RSVP message preparation.
license: MIT
---

Create a mobile-first wedding invitation with a clear, honest RSVP flow.

## Starting point
The supplied `assets/` is a heavily redesigned adaptation of elix-stack/wedding-invitation-1 (MIT). Preserve `LICENSE-UPSTREAM` and `UPSTREAM.md` when copying it. Read UPSTREAM.md for changes and provenance. Do not reuse upstream people's photos, music, bank details, analytics or form endpoints.

## Customize
1. Load `frontend-design` or read `references/design.md`. Use the user's reference or choose a coherent invitation style.
2. Edit `config.js`: names, ISO event datetime with timezone, venue, story and RSVP destination. Confirm real event facts before a public invitation; fictional examples must remain labelled.
3. Keep countdown clamped at zero after the event. Format display time in the event timezone, not the visitor's computer timezone. Generate a valid .ics file from the same event data.
4. Use owned/licensed imagery or the bundled original SVG garden illustration. Do not auto-play audio.
5. Default RSVP prepares a local message and can copy/download it. With an explicitly configured email or WhatsApp recipient, open that destination for the guest to send. Never claim that local input was delivered or saved centrally.
6. Preserve guest query personalization via textContent, not HTML interpolation. Avoid sensitive details in share links.
7. Check countdown, expired event, timezone, calendar fields, RSVP validation, reduced-motion behavior and 390px layout.

Return editable invitation source, preview and launch checklist. If the user wants centrally collected RSVPs, implement and test a real backend separately rather than labelling browser storage a guest database.
