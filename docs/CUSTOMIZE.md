# Customization and handoff

Every starter lives in `.agents/skills/<skill>/assets/`. Copy it with `scripts/scaffold.mjs` before adapting it. Avoid editing the gallery build output: `dist/` is regenerated.

| Starter | First files to edit | Before real delivery |
|---|---|---|
| business-website | index.html, style.css, config.js, DESIGN.md | Confirm services, rates, rights to assets and enquiry recipient. Inspect the user's chosen SaaSpo reference and record its URL. |
| quote-calculator | pricing.mjs, config.js, index.html | Approve rate card, excluded charges and currency formatting. Test independent quote totals. |
| creator-media-kit | index.html, config.js, avatar.png, partnership.mjs, style.css | Replace the fictional identity, avatar, dated audience metrics and offers. Set prices, durations and recipientEmail in config.js. Audience data and profile labels live in index.html. No invented sponsor logos. |
| dashboard-crm | data.mjs, app.js, style.css, sample.csv | Map the actual CSV schema and currency. Verify metrics manually. Decide if local-only storage is sufficient. |
| wedding-invitation | config.js, index.html, garden-photo.png, style.css | Confirm timezone, schedule, venue and RSVP destination. Update decorative initials in the story section too. Generated venue photography is illustrative; substitute approved venue images for real invitations. Retain upstream notices. |

## SaaSpo method

1. Open https://saaspo.com/ and choose a page or section using its filters.
2. Copy the specific reference URL or attach a screenshot.
3. Ask the agent to identify the grid, type scale, spacing, palette, image treatment and CTA hierarchy.
4. Adapt these choices to the business with original content and assets. Don't ask for a logo/text clone.
5. Review the actual mobile and desktop preview before delivering.

## Dashboard vs CRM

The dashboard answers “what is happening?” using metrics over a dataset. The local CRM also lets you add/edit deals and change stages. They share the same rows and filters. Importing a CSV replaces the in-memory dataset after validation. Saving on the device is an explicit action; edits after saving require another save. “Delete local save” deletes only the saved copy. Export provides a portable backup. No server, accounts, team sync or database security is implied.

## Deployment

The optional manual Pages workflow publishes only `dist/` to GitHub Pages. The current live gallery is https://flash-business-kit.vercel.app/ . To deploy this repository on Vercel, use the included vercel.json; it builds and serves dist/. Enable Pages with GitHub Actions as source. All starters use relative paths, so they work under a repository subpath. Any other static hosting service can serve the built folder.

For client delivery, deploy only that client's starter, not the demo gallery. Remove or replace demo labels only after replacing every fictional claim and approving contact destinations. Inspect generated code, keyboard behavior, mobile overflow and errors. Free coding-model access does not replace this review.
