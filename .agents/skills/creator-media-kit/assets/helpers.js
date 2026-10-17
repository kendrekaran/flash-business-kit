export function download(name, text, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function copy(text, node) {
  try {
    await navigator.clipboard.writeText(text);
    node.textContent = "Copied. Nothing has been sent.";
  } catch {
    node.textContent =
      "Clipboard unavailable. Select the draft text and copy it manually.";
  }
}
export const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
