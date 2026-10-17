import { cp, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const [skill, destination] = process.argv.slice(2);
const names = [
  "business-website",
  "quote-calculator",
  "creator-media-kit",
  "dashboard-crm",
  "wedding-invitation",
];
if (!names.includes(skill) || !destination) {
  console.error(
    "Usage: node scripts/scaffold.mjs <" +
      names.join("|") +
      "> <new-directory>",
  );
  process.exit(1);
}
const dest = path.resolve(destination);
let exists = false;
try {
  await access(dest);
  exists = true;
} catch {}
if (exists) {
  console.error(
    "Destination already exists. Choose a new directory; nothing was overwritten.",
  );
  process.exit(1);
}
await mkdir(path.dirname(dest), { recursive: true });
await cp(path.join(root, ".agents/skills", skill, "assets"), dest, {
  recursive: true,
  errorOnExist: true,
  force: false,
});
console.log("Created " + dest + " — serve it with a static HTTP server.");
