import {
  sample,
  STAGES,
  HEADERS,
  validateRows,
  parseCSV,
  filterRows,
  metrics,
  exportCSV,
} from "./data.mjs";
import { money, download } from "./helpers.js";
const $ = (s) => document.querySelector(s),
  key = "flash-folio-workspace-v1";
let data = structuredClone(sample),
  source = "Sample data",
  editing = null;
const status = (t) => ($("#status").textContent = t);
try {
  const saved = localStorage.getItem(key);
  if (saved) {
    data = validateRows(JSON.parse(saved));
    source = "Saved on this device";
    $("#storage-state").textContent = "Loaded an explicitly saved workspace";
  }
} catch {
  status("Saved data was unavailable or invalid. Sample data loaded.");
}
function options() {
  const old = $("#month").value;
  $("#month").replaceChildren(
    new Option("All months", ""),
    ...[...new Set(data.map((r) => r.date.slice(0, 7)))]
      .sort()
      .map(
        (m) =>
          new Option(
            new Date(m + "-01T12:00:00Z").toLocaleDateString("en", {
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            }),
            m,
          ),
      ),
  );
  if ([...$("#month").options].some((o) => o.value === old))
    $("#month").value = old;
}
function filtered() {
  return filterRows(data, {
    query: $("#search").value,
    month: $("#month").value,
    stage: $("#stage").value,
  });
}
function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function render() {
  const rows = filtered(),
    m = metrics(rows);
  $("#total").textContent = money(m.total);
  $("#open").textContent = money(m.open);
  $("#won").textContent = money(m.won);
  $("#win").textContent = m.winRate === null ? "—" : m.winRate.toFixed(1) + "%";
  $("#source").textContent = `${source} · ${data.length} deals`;
  $("#count").textContent = `${rows.length} of ${data.length} deals shown`;
  $("#rows").replaceChildren();
  for (const r of rows) {
    const tr = el("tr");
    const client = el("td");
    client.append(el("strong", r.client), el("small", r.id));
    const stage = el("select");
    stage.setAttribute("aria-label", `Stage for ${r.client}`);
    stage.append(...STAGES.map((s) => new Option(s, s)));
    stage.value = r.stage;
    stage.onchange = () => {
      r.stage = stage.value;
      status("Stage updated in memory. Save locally or export to keep it.");
      render();
    };
    const sc = el("td");
    sc.append(stage);
    const ec = el("td");
    const edit = el("button", "↗");
    edit.setAttribute("aria-label", `Edit ${r.client}`);
    edit.onclick = () => openForm(r);
    ec.append(edit);
    tr.append(
      client,
      el("td", r.service),
      el("td", money(r.amount)),
      sc,
      el("td", r.date),
      ec,
    );
    $("#rows").append(tr);
  }
  if (!rows.length) {
    const td = el("td", "No matching deals. Clear filters or import a CSV.");
    td.colSpan = 6;
    const tr = el("tr");
    tr.append(td);
    $("#rows").append(tr);
  }
  const grouped = {};
  for (const r of rows) {
    const month = r.date.slice(0, 7);
    grouped[month] = (grouped[month] || 0) + Math.round(r.amount * 100);
  }
  const months = Object.keys(grouped).sort();
  const max = Math.max(1, ...Object.values(grouped));
  $("#axis-top").textContent = money(max / 100);
  $("#axis-mid").textContent = money(max / 200);
  $("#chart").replaceChildren();
  $("#chart").setAttribute(
    "aria-label",
    months.length
      ? months.map((m) => `${m}: ${money(grouped[m] / 100)}`).join("; ")
      : "No data",
  );
  for (const month of months) {
    const col = el("div", undefined, "bar-col");
    const value = el("span", money(grouped[month] / 100), "bar-value");
    const bar = el("div", undefined, "bar");
    bar.style.height = (grouped[month] / max) * 83 + "%";
    bar.title = `${month}: ${money(grouped[month] / 100)}`;
    const label = el("span", month.slice(2), "bar-label");
    col.append(value, bar, label);
    $("#chart").append(col);
  }
  $("#stage-bars").replaceChildren();
  for (const s of STAGES) {
    const count = rows.filter((r) => r.stage === s).length;
    const block = el("div", undefined, "stage-line");
    const row = el("div", undefined, "row between");
    row.append(
      el("span", s),
      el("strong", `${count} deal${count === 1 ? "" : "s"}`),
    );
    const track = el("div", undefined, "stage-track");
    const fill = el("i");
    fill.style.width = (rows.length ? (count / rows.length) * 100 : 0) + "%";
    track.append(fill);
    block.append(row, track);
    $("#stage-bars").append(block);
  }
}
["month", "stage", "search"].forEach((id) =>
  $("#" + id).addEventListener("input", render),
);
$("#clear").onclick = () => {
  $("#month").value = "";
  $("#stage").value = "";
  $("#search").value = "";
  render();
};
$("#csv").onchange = async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    if (f.size > 2 * 1024 * 1024) throw new Error("Maximum CSV size is 2 MB.");
    const rows = parseCSV(await f.text());
    data = rows;
    source = "Imported CSV";
    $("#search").value = "";
    $("#stage").value = "";
    $("#month").value = "";
    options();
    render();
    status(`Imported ${rows.length} valid rows. Kept in memory only.`);
  } catch (err) {
    status(`Import rejected: ${err.message} Existing data is unchanged.`);
  } finally {
    e.target.value = "";
  }
};
$("#export").onclick = () => {
  download("folio-deals.csv", exportCSV(filtered()), "text/csv;charset=utf-8");
  status("Exported the currently filtered deals.");
};
$("#save").onclick = () => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    $("#storage-state").textContent = "Workspace saved on this device";
    status("Saved to this browser. It is not synced to other devices.");
  } catch {
    status("Local save unavailable. Export a CSV instead.");
  }
};
$("#forget").onclick = () => {
  try {
    localStorage.removeItem(key);
    $("#storage-state").textContent = "No saved workspace";
    status("Local save deleted. Current in-memory data remains until reload.");
  } catch {
    status("Could not access local storage.");
  }
};
$("#reset").onclick = () => {
  data = structuredClone(sample);
  source = "Sample data";
  $("#search").value = "";
  $("#stage").value = "";
  $("#month").value = "";
  options();
  render();
  status("Sample loaded in memory. Existing local save was not overwritten.");
};
function openForm(row) {
  editing = row?.id ?? null;
  const form = $("#deal-form");
  form.reset();
  $("#form-error").textContent = "";
  $("#dialog-title").textContent = row
    ? "Fine-tune the details."
    : "A new possibility.";
  for (const key of HEADERS)
    form.elements[key].value =
      row?.[key] ??
      (key === "stage"
        ? "Lead"
        : key === "date"
          ? new Date().toISOString().slice(0, 10)
          : "");
  form.elements.id.readOnly = !!row;
  $("#deal-dialog").showModal();
}
$("#add").onclick = () => openForm();
$("#cancel").onclick = () => $("#deal-dialog").close();
$("#deal-form").onsubmit = (e) => {
  e.preventDefault();
  try {
    const row = Object.fromEntries(new FormData(e.target));
    const candidate = editing
      ? data.map((r) => (r.id === editing ? row : r))
      : [...data, row];
    data = validateRows(candidate);
    options();
    render();
    $("#deal-dialog").close();
    status("Deal saved in this session. Use local save or export to keep it.");
  } catch (err) {
    $("#form-error").textContent = err.message;
  }
};
options();
render();
