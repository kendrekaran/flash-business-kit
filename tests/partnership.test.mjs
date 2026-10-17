import test from "node:test";
import assert from "node:assert/strict";
import {
  calculatePartnership,
  createBrief,
} from "../.agents/skills/creator-media-kit/assets/partnership.mjs";
import { config } from "../.agents/skills/creator-media-kit/assets/config.js";
test("Sponsor selections produce an itemized quote with no duplicate charges", () => {
  assert.equal(
    calculatePartnership(config.offers, ["quote", "post"]).total,
    300,
  );
  assert.equal(
    calculatePartnership(config.offers, ["quote", "post", "video"]).total,
    650,
  );
  assert.equal(
    calculatePartnership(config.offers, ["quote", "quote", "missing"]).total,
    100,
  );
  assert.deepEqual(calculatePartnership(config.offers, []), {
    selected: [],
    total: 0,
  });
});
test("Partnership brief contains selected scope, contact and goal without silently granting rights", () => {
  const selection = calculatePartnership(config.offers, ["banner", "link"]);
  const brief = createBrief(config, selection, {
    brand: " Juniper ",
    email: "team@example.com",
    date: "2026-11-20",
    campaign: "Introduce a new workspace.",
  });
  assert.match(brief, /Brand: Juniper/);
  assert.match(brief, /Contact: team@example.com/);
  assert.match(brief, /Preferred launch: 2026-11-20/);
  assert.match(brief, /Profile banner \(2 weeks\): USD 30/);
  assert.match(brief, /Estimated total: USD 55/);
  assert.match(
    brief,
    /Usage rights, exclusivity, revisions and schedule to be agreed separately/,
  );
  assert.doesNotMatch(brief, /Sponsored post/);
});
