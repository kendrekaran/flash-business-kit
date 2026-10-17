import { calculate } from "./pricing.mjs";
import { money, download, copy } from "./helpers.js";
import { config } from "./config.js";
const $ = (s) => document.querySelector(s);
let quoteText = "";
const presets = {
  intimate: [4, 1, false, false],
  signature: [8, 2, true, false],
  complete: [12, 3, true, true],
};
function render() {
  const hours = Number($("#hours").value),
    photographers = Number($("#photographers").value),
    album = $("#album").checked,
    film = $("#film").checked;
  const q = calculate({ hours, photographers, album, film });
  $("#hours-value").textContent = `${hours} hours`;
  $("#line-items").replaceChildren(
    ...q.items.map(([label, value]) => {
      const row = document.createElement("div");
      row.className = "line";
      const text = document.createElement("span");
      text.textContent = label;
      const amount = document.createElement("strong");
      amount.textContent = money(value);
      row.append(text, amount);
      return row;
    }),
  );
  $("#total").textContent = money(q.total);
  quoteText = `${config.business} — photography estimate

${q.items.map(([l, v]) => `${l}: ${money(v)}`).join("\n")}

Estimated total: ${money(q.total)}
Travel and any applicable taxes excluded. Sample rates; not a booking.

Please confirm availability and final pricing.`;
  $("#draft").textContent = quoteText;
  document
    .querySelectorAll("[data-package]")
    .forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        JSON.stringify(presets[b.dataset.package]) ===
          JSON.stringify([hours, photographers, album, film])
          ? "true"
          : "false",
      ),
    );
  if (config.recipientEmail) {
    $("#email").hidden = false;
    $("#email").href =
      `mailto:${encodeURIComponent(config.recipientEmail)}?subject=Photography%20enquiry&body=${encodeURIComponent(quoteText)}`;
  }
}
document
  .querySelectorAll("input,select")
  .forEach((e) => e.addEventListener("input", render));
document.querySelectorAll("[data-package]").forEach((b) =>
  b.addEventListener("click", () => {
    const [h, p, a, f] = presets[b.dataset.package];
    $("#hours").value = h;
    $("#photographers").value = p;
    $("#album").checked = a;
    $("#film").checked = f;
    render();
  }),
);
$("#download").onclick = () => {
  download("photography-estimate.txt", quoteText);
  $("#status").textContent = "Estimate downloaded. No booking has been made.";
};
$("#print").onclick = () => window.print();
$("#copy").onclick = () => copy(quoteText, $("#status"));
render();
