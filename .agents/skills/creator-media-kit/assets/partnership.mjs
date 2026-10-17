export function calculatePartnership(offers, ids) {
  const selected = offers.filter((offer) => ids.includes(offer.id));
  return {
    selected,
    total:
      selected.reduce((sum, offer) => sum + Math.round(offer.price * 100), 0) /
      100,
  };
}
export function createBrief(config, selection, fields) {
  return `PARTNERSHIP PROPOSAL
Creator: ${config.name}
Brand: ${fields.brand.trim()}
Contact: ${fields.email || "To confirm"}
Preferred launch: ${fields.date || "Flexible"}

CAMPAIGN GOAL
${fields.campaign.trim()}

DELIVERABLES
${selection.selected.map((o) => `• ${o.label}${o.duration ? ` (${o.duration})` : ""}: ${config.currency} ${o.price}`).join("\n")}

Estimated total: ${config.currency} ${selection.total}
Sample rates. Subject to creator approval. Usage rights, exclusivity, revisions and schedule to be agreed separately.
This is a proposal, not a booking or payment confirmation.`;
}
