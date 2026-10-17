import { cp, mkdir, access, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const [destination] = process.argv.slice(2);
if (!destination) {
  console.error("Usage: node scripts/install.mjs <project-directory>");
  process.exit(1);
}
const source = path.join(root, ".agents/skills");
const target = path.resolve(destination, ".agents/skills");
const names = await readdir(source);
for (const name of names) {
  try {
    await access(path.join(target, name));
    console.error(
      "Existing skill would be overwritten: " + name + ". No changes made.",
    );
    process.exit(1);
  } catch {}
}
await mkdir(target, { recursive: true });
for (const name of names)
  await cp(path.join(source, name), path.join(target, name), {
    recursive: true,
    force: false,
    errorOnExist: true,
  });
console.log(
  `Installed ${names.length} skills, including starter assets, into ${target}. Restart OpenCode to refresh discovery.`,
);
