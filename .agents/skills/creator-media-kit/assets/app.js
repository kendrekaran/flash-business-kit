import { config } from "./config.js";
import { copy } from "./helpers.js";
import { calculatePartnership, createBrief } from "./partnership.mjs";
const $ = (s) => document.querySelector(s);
const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: config.currency,
    maximumFractionDigits: 0,
  }).format(n);
for (const offer of config.offers) {
  const label = document.createElement("label");
  label.className = "offer";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.value = offer.id;
  input.checked = Boolean(offer.selected);
  const text = document.createElement("span");
  text.textContent = offer.label;
  const price = document.createElement("span");
  price.className = "price";
  price.textContent =
    money(offer.price) + (offer.duration ? " · " + offer.duration : "");
  label.append(input, text, price);
  $("#offers").append(label);
}
function selection() {
  return calculatePartnership(
    config.offers,
    [...document.querySelectorAll("#offers input:checked")].map((i) => i.value),
  );
}
function update() {
  const s = selection();
  $("#total").textContent = money(s.total);
  $("#configure").disabled = !s.selected.length;
  $("#brief-summary").textContent =
    s.selected.map((o) => o.label).join(" + ") + " · " + money(s.total);
  $("#brief-result").hidden = true;
  $("#status").textContent = "";
}
$("#offers").onchange = update;
update();
$("#configure").onclick = () => {
  $("#brief-dialog").showModal();
  $("#brand-name").focus();
};
$("#close").onclick = () => $("#brief-dialog").close();
$("#brief-form").oninput = () => {
  $("#brief-result").hidden = true;
  $("#status").textContent = "";
};
$("#brief-form").onsubmit = (e) => {
  e.preventDefault();
  const fields = Object.fromEntries(new FormData(e.currentTarget));
  const text = createBrief(config, selection(), fields);
  $("#draft").textContent = text;
  $("#brief-result").hidden = false;
  $("#status").textContent = "Brief created locally. Nothing has been sent.";
  if (config.recipientEmail) {
    $("#email").hidden = false;
    $("#email").href =
      `mailto:${encodeURIComponent(config.recipientEmail)}?subject=Partnership%20proposal&body=${encodeURIComponent(text)}`;
  }
  $("#brief-result").scrollIntoView({
    block: "nearest",
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
};
$("#copy").onclick = () => copy($("#draft").textContent, $("#status"));
$("#download").onclick = () => {
  const url = URL.createObjectURL(
    new Blob([$("#draft").textContent], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "partnership-brief.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $("#status").textContent = "Brief downloaded. Nothing has been sent.";
};
$("#print").onclick = () => window.print();
