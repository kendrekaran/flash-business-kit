import { copy } from "./helpers.js";
import { config } from "./config.js";
const $ = (s) => document.querySelector(s);
let selected = "";
document.querySelectorAll("[data-filter]").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll("[data-filter]")
        .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      document
        .querySelectorAll("[data-category]")
        .forEach(
          (a) =>
            (a.hidden =
              b.dataset.filter !== "all" &&
              a.dataset.category !== b.dataset.filter),
        );
    }),
);
function draft() {
  const text = `Hello ${config.name},
I'm reaching out from ${$("#brand-name").value.trim() || "[your brand]"}.
We are interested in: ${selected}.
Could you share pricing, timing and usage-rights options?`;
  $("#draft").textContent = text;
  if (config.recipientEmail) {
    $("#email").hidden = false;
    $("#email").href =
      `mailto:${encodeURIComponent(config.recipientEmail)}?subject=Partnership%20enquiry&body=${encodeURIComponent(text)}`;
  }
}
document.querySelectorAll("[data-package]").forEach(
  (b) =>
    (b.onclick = () => {
      selected = b.dataset.package;
      $("#enquiry").hidden = false;
      $("#status").textContent = "Draft only. Nothing has been sent.";
      draft();
      $("#enquiry").scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
      $("#brand-name").focus({ preventScroll: true });
    }),
);
$("#brand-name").oninput = draft;
$("#copy").onclick = () => copy($("#draft").textContent, $("#status"));
$("#close").onclick = () => ($("#enquiry").hidden = true);
$("#print").onclick = () => window.print();
