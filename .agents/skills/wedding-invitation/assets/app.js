import { config } from "./config.js";
import { remaining, calendar } from "./event.mjs";
import { copy, download } from "./helpers.js";
const $ = (s) => document.querySelector(s);
$("#name-one").textContent = config.names[0];
$("#name-two").textContent = config.names[1];
document
  .querySelectorAll(".names")
  .forEach((n) => (n.textContent = config.names.join(" & ")));
document.title = config.names.join(" & ") + " · A garden celebration";
$("#venue").textContent = config.venue;
$("#event-date").textContent = new Date(config.start).toLocaleDateString(
  "en-GB",
  { day: "numeric", month: "long", year: "numeric", timeZone: config.timeZone },
);
$("#event-location").textContent =
  `${config.venue} · ${config.location} · Times in ${config.timeZone}`;
$("#maps").href =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(config.venue + " " + config.location);
$("#schedule").replaceChildren(
  ...config.schedule.map(([time, title, desc]) => {
    const a = document.createElement("article"),
      t = document.createElement("time"),
      h = document.createElement("h3"),
      p = document.createElement("p");
    t.textContent = time;
    t.dateTime = time;
    h.textContent = title;
    p.textContent = desc;
    a.append(t, h, p);
    return a;
  }),
);
const guest = (
  new URLSearchParams(location.search).get("guest") ||
  new URLSearchParams(location.search).get("n") ||
  ""
).slice(0, 100);
if (guest) {
  $("#guest-greeting").textContent = "Especially for " + guest;
  $("#guest-name").value = guest;
}
function tick() {
  const r = remaining(config.start);
  for (const k of ["days", "hours", "minutes", "seconds"])
    $("#" + k).textContent = String(r[k]).padStart(2, "0");
  $("#count-status").textContent = r.ended
    ? "The celebration date has arrived."
    : "";
}
tick();
setInterval(tick, 1000);
$("#calendar").onclick = () => {
  try {
    download("wedding.ics", calendar(config), "text/calendar;charset=utf-8");
    $("#calendar-status").textContent =
      "Calendar file downloaded. Open it to add the event.";
  } catch (e) {
    $("#calendar-status").textContent = e.message;
  }
};
$("#attendance").onchange = () => {
  $("#guests").disabled = $("#attendance").value === "no";
};
let message = "";
$("#rsvp-form").onsubmit = (e) => {
  e.preventDefault();
  const d = new FormData(e.target);
  const accepted = d.get("attendance") === "yes";
  message = `Dear ${config.names.join(" & ")},
${d.get("guest")} ${accepted ? "joyfully accepts" : "regretfully declines"} your invitation.${accepted ? "\nGuests, including me: " + d.get("guests") : ""}
${d.get("note") || ""}`;
  $("#draft").textContent = message;
  $("#rsvp-result").hidden = false;
  $("#rsvp-status").textContent =
    "Your RSVP draft is ready. It has not been sent.";
  if (config.whatsapp && /^\d{8,15}$/.test(config.whatsapp)) {
    $("#send").hidden = false;
    $("#send").href =
      `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
  } else if (config.recipientEmail) {
    $("#send").hidden = false;
    $("#send").href =
      `mailto:${encodeURIComponent(config.recipientEmail)}?subject=Wedding%20RSVP&body=${encodeURIComponent(message)}`;
  }
};
$("#copy").onclick = () => copy(message, $("#rsvp-status"));
$("#download").onclick = () => {
  download("rsvp-message.txt", message);
  $("#rsvp-status").textContent =
    "Message downloaded. Send it to your hosts to complete your RSVP.";
};
