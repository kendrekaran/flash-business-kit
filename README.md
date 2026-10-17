# Flash Business Kit

**Five small-business demos. Seven reusable skills. One repository to paste into OpenCode.**

[Open the live demo gallery](https://flash-business-kit.vercel.app/) · [Video walkthrough notes](docs/VIDEO.md) · [Customization guide](docs/CUSTOMIZE.md)

| # | Idea | Working demo | Skill |
|---|---|---|---|
| 1 | Website makeover with SaaSpo inspiration | [Northline Auto](https://flash-business-kit.vercel.app/01-website/) | [business-website](.agents/skills/business-website/SKILL.md) |
| 2 | Instant photography quote | [Still & Story](https://flash-business-kit.vercel.app/02-quote/) | [quote-calculator](.agents/skills/quote-calculator/SKILL.md) |
| 3 | Creator sponsorship media kit | [Maya Rowan](https://flash-business-kit.vercel.app/03-media-kit/) | [creator-media-kit](.agents/skills/creator-media-kit/SKILL.md) |
| 4 | CSV dashboard / local CRM | [Folio](https://flash-business-kit.vercel.app/04-dashboard/) | [dashboard-crm](.agents/skills/dashboard-crm/SKILL.md) |
| 5 | Interactive wedding invitation | [Elena & Theo](https://flash-business-kit.vercel.app/05-wedding/) | [wedding-invitation](.agents/skills/wedding-invitation/SKILL.md) |

Includes the Apache-2.0 `frontend-design` skill and the MIT `kpi-dashboard-design` skill from wshobson/agents. The dashboard skill explicitly uses both. Each original skill also has a small standalone fallback design reference.

## Use it in OpenCode

A repository URL is a starting instruction, not automatic skill installation. Give OpenCode this complete prompt:

```text
Use https://github.com/kendrekaran/flash-business-kit.
Clone it into a new folder, read README.md, and load the business-website
skill at .agents/skills/business-website/SKILL.md. Follow its references.
Create a separate customized project for [BUSINESS NAME], a [BUSINESS TYPE]
in [CITY]. Use [SAASPO PAGE URL OR ATTACHED SCREENSHOT] as UI inspiration.
Adapt layout, typography and spacing with original branding and content.
Use fictional, labelled content where information is missing. Build and
verify the site locally; give me the preview and editable source.
```

Replace the skill and brief for the other ideas:

```text
Use https://github.com/kendrekaran/flash-business-kit and its quote-calculator
skill. Create demo project 2 for my photography studio using the included
starter. Show live itemized pricing, package selection and quote export.
Use clearly marked sample rates until I supply my real rate card.
```

```text
Use https://github.com/kendrekaran/flash-business-kit and its creator-media-kit
skill. Build my sponsor page from the attached reference and supplied bio.
Use fictional names for the demo, and label sample metrics. Include selected
work, package selection and a printable kit. Load frontend-design too.
```

```text
Use https://github.com/kendrekaran/flash-business-kit and its dashboard-crm
skill. Load the bundled kpi-dashboard-design and frontend-design skills.
Turn my CSV into a polished dashboard with correct metrics, filters and
underlying rows. I also want a simple local CRM for editing deal stages.
Explain storage, formulas and missing data. Don't invent trend numbers.
```

```text
Use https://github.com/kendrekaran/flash-business-kit and its wedding-invitation
skill. Customize the included MIT-attributed starter for [NAMES], [DATE WITH
TIMEZONE], [VENUE]. Keep its calendar download and RSVP message preview.
Use the supplied photos or original illustration and preserve attribution.
```

## Run every demo

Requires Node.js 22+ and Git. No npm dependencies, API keys, accounts or build framework.

```sh
git clone https://github.com/kendrekaran/flash-business-kit.git
cd flash-business-kit
npm test
npm run build
npm start
```

Open http://127.0.0.1:4173 . The build only copies static assets; no external services are called by the demos on load. Opening a configured contact link or the venue search leaves the local page.

OpenCode discovers `.agents/skills/<name>/SKILL.md` when run from the repository. [Official skill discovery docs](https://opencode.ai/docs/skills/).

## Install in another project

```sh
node scripts/install.mjs /path/to/your-project
```

This copies all seven skills **with their starter assets and licenses** into the target's `.agents/skills`. It refuses to overwrite existing skills. Restart OpenCode to refresh discovery. No global configuration changes.

To copy only one working starter into a new folder:

```sh
node scripts/scaffold.mjs quote-calculator ../my-quote-project
# Serve that folder with any static HTTP server; for example:
python3 -m http.server 8000 --directory ../my-quote-project
```

## What “working” means

- Website: package selection and validated, copyable enquiry drafts.
- Quote: deterministic itemized pricing, presets, add-ons, text export and print-to-PDF.
- Media kit: work filters, package enquiry drafts and print layout.
- Dashboard: validated CSV import, coherent metrics and filters, add/edit deals, stage updates, safe CSV export, opt-in local persistence and deletion.
- Wedding: timezone-explicit countdown, guest-name personalization (`?guest=Sam`), schedule, venue search, valid calendar export and RSVP message preparation.

**Forms do not pretend to send.** Contact fields are empty by default; configure an approved email/WhatsApp destination to open a message draft. The dashboard is a browser-local demo, not a shared authenticated CRM. Names, metrics, prices, dates and stories are fictional.

The models are tools for building; these apps do not require model calls at runtime. Free model availability can change. Model access, hosting, domains, assets and your time are separate costs. This toolkit does not promise earnings.

## Wedding open-source research

Evaluated [elix-stack/wedding-invitation-1](https://github.com/elix-stack/wedding-invitation-1) and [dewanakl/undangan](https://github.com/dewanakl/undangan), both MIT-licensed. The bundled invitation adapts the first project's flow, with substantially rewritten visual design and scripts. [Exact provenance and changes](.agents/skills/wedding-invitation/assets/UPSTREAM.md). Original photos, music, bank details and form endpoints are excluded.

## Hosting this copy

The live gallery is hosted on Vercel under Karan’s account. GitHub Pages deployment succeeded, but this account’s inherited custom domain redirects to an unrelated portfolio and returns 404 for the project path. The included Pages workflow is manual for users whose Pages routing is configured. `vercel.json` supports deploying this repository directly with `dist/` as output.

## License

Original toolkit code and skills: MIT. Bundled upstream skills and wedding-derived portions retain their original licenses. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). SaaSpo is an inspiration resource; this project is not affiliated with it.
