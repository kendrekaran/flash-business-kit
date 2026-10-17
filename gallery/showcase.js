const slides = [...document.querySelectorAll(".slide")];
const chapters = [...document.querySelectorAll("[data-slide]")];
let current = 0,
  toastTimer;
function show(index, announce = true) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.hidden = i !== current;
    slide.classList.toggle("active", i === current);
  });
  chapters.forEach((button, i) => {
    if (i === current) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  document.querySelector("#counter").textContent =
    String(current + 1).padStart(2, "0") + " / 05";
  history.replaceState(null, "", "#" + slides[current].id);
  if (announce)
    document.querySelector("#slide-status").textContent =
      slides[current].getAttribute("aria-label");
}
function fromHash() {
  const index = slides.findIndex((s) => "#" + s.id === location.hash);
  show(index < 0 ? 0 : index, false);
}
fromHash();
window.addEventListener("hashchange", fromHash);
document.querySelector("#previous").onclick = () => show(current - 1);
document.querySelector("#next").onclick = () => show(current + 1);
chapters.forEach(
  (button) => (button.onclick = () => show(Number(button.dataset.slide))),
);
function toast(text) {
  clearTimeout(toastTimer);
  const el = document.querySelector("#toast");
  el.textContent = text;
  el.hidden = false;
  toastTimer = setTimeout(() => (el.hidden = true), 3500);
}
async function fullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    toast(
      "Fullscreen is unavailable in this browser. The slideshow still works.",
    );
  }
}
document.querySelector("#present").onclick = fullscreen;
document.addEventListener("fullscreenchange", () => {
  const full = Boolean(document.fullscreenElement);
  const b = document.querySelector("#present");
  b.setAttribute(
    "aria-label",
    full ? "Exit fullscreen presentation" : "Enter fullscreen presentation",
  );
  b.querySelector("span").textContent = full ? "Exit" : "Present";
});
document.addEventListener("keydown", (event) => {
  if (
    document.querySelector("dialog[open]") ||
    event.target.closest("input,textarea,select,[contenteditable]") ||
    event.altKey ||
    event.metaKey ||
    event.ctrlKey
  )
    return;
  if (event.key === "ArrowRight") {
    event.preventDefault();
    show(current + 1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    show(current - 1);
  }
  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    fullscreen();
  }
  if (event.key === "Home") {
    event.preventDefault();
    show(0);
  }
  if (event.key === "End") {
    event.preventDefault();
    show(slides.length - 1);
  }
});
let start = null;
document.querySelector("#deck").addEventListener(
  "touchstart",
  (e) => {
    if (e.target.closest("a,button")) return;
    start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  },
  { passive: true },
);
document.querySelector("#deck").addEventListener(
  "touchend",
  (e) => {
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x,
      dy = e.changedTouches[0].clientY - start.y;
    start = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5)
      show(current + (dx < 0 ? 1 : -1));
  },
  { passive: true },
);
const prompts = {
  "business-website":
    "Build a distinctive website for [business name and type]. Use SaaSpo to choose and inspect a real design reference, then create an original design. Include suitable imagery and working enquiry controls.",
  "quote-calculator":
    "Build an interactive quote calculator for [business]. Use my packages and prices: [details]. Include live totals and a downloadable estimate.",
  "creator-media-kit":
    "Build a creator profile for [creator name and niche]. Use the compact Orbit profile layout with a collectible avatar card, audience insights, a selectable rate card and a downloadable partnership brief. Use my verified metrics and actual offers: [details].",
  "dashboard-crm":
    "Build a sales dashboard for [business] using my CSV. Apply frontend-design and kpi-dashboard-design. Include filters, accurate metrics, editable deals and CSV export.",
  "wedding-invitation":
    "Create a photographic wedding invitation for [names, date, location]. Include the schedule, countdown, calendar download and RSVP draft. My approved recipient contact is [email or WhatsApp].",
};
async function copyPrompt(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Build prompt copied. Paste it into OpenCode.");
    return true;
  } catch {
    return false;
  }
}
for (const button of document.querySelectorAll("[data-skill]"))
  button.onclick = async () => {
    const text = `Use https://github.com/kendrekaran/flash-business-kit and its ${button.dataset.skill} skill.\n\n${prompts[button.dataset.skill]}\n\nInspect the skill instructions and starter assets first, then customize and test the result.`;
    document.querySelector("#prompt-text").value = text;
    if (!(await copyPrompt(text)))
      document.querySelector("#prompt-dialog").showModal();
  };
document.querySelector("#copy-again").onclick = async () => {
  if (!(await copyPrompt(document.querySelector("#prompt-text").value))) {
    document.querySelector("#prompt-text").focus();
    document.querySelector("#prompt-text").select();
    toast("Select and copy the prompt using your keyboard.");
  }
};
