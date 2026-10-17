---
name: quote-calculator
description: Build a branded instant quote calculator from a business rate card. Use for photography, catering, cleaning or rental estimate tools.
license: MIT
---

Create a calculator that explains its price, with a narrow, testable scope.

1. Read `references/design.md` or load `frontend-design`. Start with the supplied `assets/` photography demo if useful.
2. Capture the currency, base charge, quantities, add-ons, exclusions, taxes and discounts. Mark unapproved rates as examples. Do not infer taxes or claim an estimate is a binding quote.
3. Keep all pricing in `pricing.mjs` / `config.js`. Keep calculations separate from the DOM. Validate quantities, finite numbers and boundaries. Reconcile the displayed line items with the total.
4. Build an immediate preview, selectable packages, editable quantities, itemized summary and downloadable quote. An optional email/WhatsApp link prepares a message; it does not send or book anything.
5. Test minimum/maximum quantities, all add-ons, invalid inputs, reset, export, and mobile layout. Include arithmetic tests that use independent expected amounts.
6. Use static HTML/CSS/JS unless the brief requires a backend. Do not add login, payment processing or live availability to an estimate-only request.

Deliver editable source, the rate card, run instructions, and explicit configuration needed for a real client.
