import { copy } from "./helpers.js";
import { config } from "./config.js";
const $ = (s) => document.querySelector(s);
document.querySelectorAll(".choose").forEach(
  (b) =>
    (b.onclick = () => {
      $("#service").value = b.dataset.service;
      $("#enquiry").scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
      $("#service").focus({ preventScroll: true });
    }),
);
$("#enquiry-form").onsubmit = (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const draft = `Hello ${config.business},
I'm ${data.get("name")}. My vehicle is ${data.get("vehicle")}.
I'm interested in ${data.get("service")}. Please confirm scope, pricing and availability.`;
  $("#draft").textContent = draft;
  $("#enquiry-result").hidden = false;
  $("#status").textContent = "Draft ready. Nothing has been sent.";
  if (config.recipientEmail) {
    $("#email").hidden = false;
    $("#email").href =
      `mailto:${encodeURIComponent(config.recipientEmail)}?subject=Detailing%20enquiry&body=${encodeURIComponent(draft)}`;
  }
};
$("#copy").onclick = () => copy($("#draft").textContent, $("#status"));
