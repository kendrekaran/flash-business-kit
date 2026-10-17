import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, "gallery"), dist, { recursive: true });
for (const [slug, skill] of [
  ["01-website", "business-website"],
  ["02-quote", "quote-calculator"],
  ["03-media-kit", "creator-media-kit"],
  ["04-dashboard", "dashboard-crm"],
  ["05-wedding", "wedding-invitation"],
])
  await cp(
    path.join(root, ".agents/skills", skill, "assets"),
    path.join(dist, slug),
    { recursive: true },
  );
console.log("Built five static demos in dist/");
