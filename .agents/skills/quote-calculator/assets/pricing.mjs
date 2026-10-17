export const RATES = {
  base: 4000,
  photographerHour: 1500,
  album: 6000,
  film: 12000,
};
export function calculate({
  hours,
  photographers,
  album = false,
  film = false,
}) {
  if (!Number.isInteger(hours) || hours < 2 || hours > 12)
    throw new Error("Hours must be a whole number from 2 to 12.");
  if (
    !Number.isInteger(photographers) ||
    photographers < 1 ||
    photographers > 3
  )
    throw new Error("Choose 1 to 3 photographers.");
  const items = [
    ["Planning & editing", RATES.base],
    [
      `${hours} hours × ${photographers} photographer${photographers > 1 ? "s" : ""}`,
      hours * photographers * RATES.photographerHour,
    ],
  ];
  if (album) items.push(["Fine-art album", RATES.album]);
  if (film) items.push(["Highlight film", RATES.film]);
  return { items, total: items.reduce((s, [, v]) => s + v, 0) };
}
