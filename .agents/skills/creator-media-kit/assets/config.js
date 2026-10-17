export const config = {
  name: "Alex Mercer",
  recipientEmail: "",
  currency: "USD",
  offers: [
    { id: "repost", label: "Repost", price: 45 },
    { id: "quote", label: "Sponsored quote", price: 100, selected: true },
    { id: "post", label: "Sponsored post", price: 200, selected: true },
    { id: "banner", label: "Profile banner", price: 30, duration: "2 weeks" },
    { id: "link", label: "Link in bio", price: 25, duration: "2 weeks" },
    { id: "video", label: "Product walkthrough", price: 350 },
  ],
};
