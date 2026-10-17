export const STAGES = ["Lead", "Proposal", "Won", "Lost"];
export const HEADERS = ["id", "client", "service", "amount", "stage", "date"];
export const sample = [
  ["D01", "Olive Studio", "Brand identity", 42000, "Won", "2026-05-09"],
  ["D02", "Fieldwork Co.", "Website", 65000, "Won", "2026-06-11"],
  ["D03", "Cedar House", "Social campaign", 28000, "Lost", "2026-06-18"],
  ["D04", "Nook & Co.", "Website", 78000, "Won", "2026-07-12"],
  ["D05", "Sundial Coffee", "Brand identity", 48000, "Won", "2026-07-20"],
  ["D06", "Paperboat", "Content series", 36000, "Won", "2026-08-03"],
  ["D07", "Forma Objects", "E-commerce", 120000, "Proposal", "2026-08-19"],
  ["D08", "Sunday Market", "Website", 85000, "Won", "2026-09-07"],
  ["D09", "Meadow Journal", "Content series", 52000, "Proposal", "2026-09-22"],
  ["D10", "Kinfolk Supply", "Brand identity", 64000, "Lead", "2026-10-04"],
  ["D11", "Terra Botanics", "E-commerce", 145000, "Proposal", "2026-10-09"],
  ["D12", "Atelier Nine", "Website", 92000, "Lead", "2026-10-15"],
].map(([id, client, service, amount, stage, date]) => ({
  id,
  client,
  service,
  amount,
  stage,
  date,
}));
export function validateRows(rows) {
  if (!rows.length) throw new Error("The file has no data rows.");
  if (rows.length > 5000) throw new Error("Maximum 5,000 rows.");
  const ids = new Set();
  return rows.map((r, i) => {
    const row = {};
    for (const k of HEADERS) {
      row[k] = String(r[k] ?? "").trim();
      if (!row[k]) throw new Error(`Row ${i + 2}: ${k} is required.`);
    }
    if (ids.has(row.id))
      throw new Error(`Row ${i + 2}: duplicate id ${row.id}.`);
    ids.add(row.id);
    if (!/^\d+(?:\.\d{1,2})?$/.test(row.amount) || Number(row.amount) > 1e9)
      throw new Error(
        `Row ${i + 2}: amount must be a nonnegative number with at most 2 decimals.`,
      );
    row.amount = Number(row.amount);
    if (!STAGES.includes(row.stage))
      throw new Error(`Row ${i + 2}: unknown stage.`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(row.date) ||
      !Number.isFinite(Date.parse(row.date)) ||
      new Date(row.date).toISOString().slice(0, 10) !== row.date
    )
      throw new Error(`Row ${i + 2}: invalid date.`);
    return row;
  });
}
export function parseCSV(text) {
  text = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [],
    field = "",
    quoted = false,
    closed = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else field += c;
      continue;
    }
    if (closed && c !== "," && c !== "\r" && c !== "\n")
      throw new Error("Unexpected text after closing quote.");
    if (c === '"') {
      if (field.length) throw new Error("Quote inside an unquoted field.");
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
      closed = false;
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
      field = "";
      closed = false;
    } else field += c;
  }
  if (quoted) throw new Error("Unclosed quoted field.");
  row.push(field);
  if (row.some((v) => v !== "")) rows.push(row);
  const header = rows.shift()?.map((x) => x.trim());
  if (
    !header ||
    header.length !== HEADERS.length ||
    header.some((v, i) => v !== HEADERS[i])
  )
    throw new Error("Expected header: " + HEADERS.join(","));
  return validateRows(
    rows.map((values, i) => {
      if (values.length !== HEADERS.length)
        throw new Error(`Row ${i + 2}: expected 6 columns.`);
      return Object.fromEntries(HEADERS.map((k, j) => [k, values[j]]));
    }),
  );
}
export function filterRows(rows, { query = "", month = "", stage = "" } = {}) {
  const q = query.toLocaleLowerCase();
  return rows.filter(
    (r) =>
      (!month || r.date.startsWith(month)) &&
      (!stage || r.stage === stage) &&
      `${r.client} ${r.service} ${r.id}`.toLocaleLowerCase().includes(q),
  );
}
export function metrics(rows) {
  let total = 0,
    open = 0,
    won = 0,
    wins = 0,
    closed = 0;
  for (const r of rows) {
    total += Math.round(r.amount * 100);
    if (["Lead", "Proposal"].includes(r.stage))
      open += Math.round(r.amount * 100);
    if (r.stage === "Won") {
      won += Math.round(r.amount * 100);
      wins++;
    }
    if (["Won", "Lost"].includes(r.stage)) closed++;
  }
  return {
    total: total / 100,
    open: open / 100,
    won: won / 100,
    winRate: closed ? (wins / closed) * 100 : null,
    count: rows.length,
  };
}
export function exportCSV(rows) {
  const esc = (v) => {
    let s = String(v);
    if (/^[\s]*[=+@-]/.test(s)) s = "'" + s;
    return '"' + s.replaceAll('"', '""') + '"';
  };
  return [
    HEADERS.join(","),
    ...rows.map((r) => HEADERS.map((k) => esc(r[k])).join(",")),
  ].join("\r\n");
}
