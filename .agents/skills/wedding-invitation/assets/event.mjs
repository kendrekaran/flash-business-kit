export function remaining(target, now = Date.now()) {
  const ms = new Date(target).getTime() - now;
  if (!Number.isFinite(ms)) throw new Error("Invalid event time");
  const s = Math.floor(Math.max(0, ms) / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor(s / 3600) % 24,
    minutes: Math.floor(s / 60) % 60,
    seconds: s % 60,
    ended: ms <= 0,
  };
}
const escape = (s) =>
  String(s)
    .replaceAll("\\", "\\\\")
    .replaceAll("\r", "")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
const stamp = (s) =>
  new Date(s)
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(/\.\d{3}/, "");
function fold(line) {
  const out = [];
  let part = "",
    bytes = 0;
  for (const char of line) {
    const size = new TextEncoder().encode(char).length;
    if (bytes + size > 75) {
      out.push(part);
      part = " ";
      bytes = 1;
    }
    part += char;
    bytes += size;
  }
  out.push(part);
  return out.join("\r\n");
}
export function calendar(config, now = new Date()) {
  if (
    !Number.isFinite(Date.parse(config.start)) ||
    !Number.isFinite(Date.parse(config.end)) ||
    Date.parse(config.end) <= Date.parse(config.start)
  )
    throw new Error("Event end must follow a valid start.");
  const uid = `${stamp(config.start)}-${encodeURIComponent(config.names.join("-"))}@flash-business-kit.example`;
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Flash Business Kit//Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${stamp(now)}`,
      `DTSTART:${stamp(config.start)}`,
      `DTEND:${stamp(config.end)}`,
      `SUMMARY:${escape(config.names.join(" & ") + " — wedding")}`,
      `LOCATION:${escape(config.venue + ", " + config.location)}`,
      "DESCRIPTION:Invitation details. Please confirm venue and times with the hosts.",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n"
  );
}
