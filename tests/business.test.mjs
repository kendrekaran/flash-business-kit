import test from "node:test";
import assert from "node:assert/strict";
import { calculate } from "../.agents/skills/quote-calculator/assets/pricing.mjs";
import {
  sample,
  parseCSV,
  filterRows,
  metrics,
  exportCSV,
  validateRows,
} from "../.agents/skills/dashboard-crm/assets/data.mjs";
import {
  calendar,
  remaining,
} from "../.agents/skills/wedding-invitation/assets/event.mjs";
import { config } from "../.agents/skills/wedding-invitation/assets/config.js";
import { readFile } from "node:fs/promises";
const header = "id,client,service,amount,stage,date\n";
test("Photography estimates reconcile with independent rate-card examples", () => {
  assert.equal(calculate({ hours: 4, photographers: 1 }).total, 10000);
  assert.equal(
    calculate({ hours: 4, photographers: 1, album: true }).total,
    16000,
  );
  assert.equal(
    calculate({ hours: 8, photographers: 2, album: true }).total,
    34000,
  );
  assert.equal(
    calculate({ hours: 12, photographers: 3, album: true, film: true }).total,
    76000,
  );
  assert.equal(calculate({ hours: 2, photographers: 1 }).total, 7000);
});
test("Quote rejects unsupported quantities, fractions and NaN", () => {
  for (const hours of [0, 13, 2.5, NaN])
    assert.throws(() => calculate({ hours, photographers: 1 }));
  for (const photographers of [0, 4, 1.5, NaN])
    assert.throws(() => calculate({ hours: 4, photographers }));
});
test("CSV supports BOM, CRLF, quoted commas, quoted line breaks and escaped quotes", () => {
  const rows = parseCSV(
    "\uFEFF" +
      header +
      'a,"Olive, \"\"Studio\"\"","Brand\nidentity",12.25,Won,2024-02-29\r\n',
  );
  assert.equal(rows[0].client, 'Olive, "Studio"');
  assert.equal(rows[0].service, "Brand\nidentity");
  assert.equal(rows[0].amount, 12.25);
});
test("CSV rejects malformed rows and invalid data instead of silently dropping it", () => {
  for (const body of [
    "a,A,B,-1,Won,2026-01-01",
    "a,A,B,NaN,Won,2026-01-01",
    "a,A,B,1.001,Won,2026-01-01",
    "a,A,B,1,Unknown,2026-01-01",
    "a,A,B,1,Won,2026-02-30",
    "a,A,B,1,Won,2026-13-01",
    "a,A,B,1,Won,2026-01-01,extra",
    'a,"Unclosed,B,1,Won,2026-01-01',
    'a,"A"bad,B,1,Won,2026-01-01',
  ])
    assert.throws(() => parseCSV(header + body), body);
  assert.throws(() =>
    parseCSV(header + "a,A,B,1,Won,2026-01-01\na,A,B,2,Won,2026-01-01"),
  );
  assert.throws(() => parseCSV(header));
  assert.throws(() => parseCSV("name,amount\nA,2"));
});
test("All metrics agree with an independently totaled four-deal fixture", () => {
  const rows = parseCSV(
    header +
      "a,A,Site,100,Won,2026-01-01\nb,B,Site,50,Lost,2026-01-02\nc,C,Site,200,Lead,2026-02-01\nd,D,Site,300,Proposal,2026-02-02",
  );
  assert.deepEqual(metrics(rows), {
    total: 650,
    open: 500,
    won: 100,
    winRate: 50,
    count: 4,
  });
  assert.deepEqual(
    metrics(filterRows(rows, { month: "2026-02", query: "site" })),
    { total: 500, open: 500, won: 0, winRate: null, count: 2 },
  );
  assert.equal(filterRows(rows, { stage: "Won" }).length, 1);
  assert.equal(filterRows(rows, { query: "missing" }).length, 0);
  assert.deepEqual(metrics([]), {
    total: 0,
    open: 0,
    won: 0,
    winRate: null,
    count: 0,
  });
});
test("Currency totals remain exact to cents", () => {
  const rows = parseCSV(
    header + "a,A,B,0.10,Won,2026-01-01\nb,B,B,0.20,Won,2026-01-01",
  );
  assert.equal(metrics(rows).total, 0.3);
});
test("Bundled CSV and in-app sample have the same data", async () => {
  const csv = await readFile(
    new URL(
      "../.agents/skills/dashboard-crm/assets/sample.csv",
      import.meta.url,
    ),
    "utf8",
  );
  assert.deepEqual(parseCSV(csv), sample);
  assert.equal(metrics(sample).total, 855000);
  assert.equal(metrics(sample).won, 354000);
});
test("CSV roundtrip keeps ordinary values and protects formula-like text", () => {
  assert.deepEqual(parseCSV(exportCSV(sample)), sample);
  const dangerous = [{ ...sample[0], client: '=HYPERLINK("bad")' }];
  assert.equal(parseCSV(exportCSV(dangerous))[0].client, '\'=HYPERLINK("bad")');
});
test("Row limits reject oversized imports", () => {
  assert.throws(() =>
    validateRows(
      Array.from({ length: 5001 }, (_, i) => ({ ...sample[0], id: String(i) })),
    ),
  );
});
test("Countdown respects timezone and clamps expired events to zero", () => {
  assert.deepEqual(
    remaining("2027-02-20T16:00:00+05:30", Date.parse("2027-02-19T10:30:00Z")),
    { days: 1, hours: 0, minutes: 0, seconds: 0, ended: false },
  );
  assert.deepEqual(remaining("2020-01-01T00:00:00Z", Date.now()), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: true,
  });
  assert.throws(() => remaining("bad"));
});
test("Calendar has correct UTC event times, stable UID, escaping and CRLF", () => {
  const out = calendar(
    { ...config, venue: "Garden, East; Gate\nTwo" },
    new Date("2026-10-18T00:00:00Z"),
  );
  assert.match(out, /DTSTART:20270220T103000Z/);
  assert.match(out, /DTEND:20270220T163000Z/);
  assert.match(out, /DTSTAMP:20261018T000000Z/);
  assert.ok(out.includes("Garden\\, East\\; Gate\\nTwo"));
  assert.ok(out.endsWith("END:VCALENDAR\r\n"));
  assert.equal(out.replaceAll("\r\n", "").includes("\n"), false);
  assert.throws(() => calendar({ ...config, end: config.start }));
});
test("Calendar folds long Unicode lines within 75 bytes", () => {
  const out = calendar({ ...config, venue: "é".repeat(150) });
  for (const line of out.split("\r\n"))
    assert.ok(Buffer.byteLength(line) <= 75);
  assert.ok(out.includes("\r\n "));
});
