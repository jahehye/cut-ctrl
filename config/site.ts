export type DailyHours = {
  day: string;
  shortDay: string;
  schemaDay: string;
  open: string | null;
  close: string | null;
};

export const weeklyHours: readonly DailyHours[] = [
  { day: "Sunday", shortDay: "Sun", schemaDay: "Sunday", open: null, close: null },
  { day: "Monday", shortDay: "Mon", schemaDay: "Monday", open: "10:00", close: "20:00" },
  { day: "Tuesday", shortDay: "Tue", schemaDay: "Tuesday", open: "10:00", close: "20:00" },
  { day: "Wednesday", shortDay: "Wed", schemaDay: "Wednesday", open: "10:00", close: "20:00" },
  { day: "Thursday", shortDay: "Thu", schemaDay: "Thursday", open: "10:00", close: "20:00" },
  { day: "Friday", shortDay: "Fri", schemaDay: "Friday", open: "10:00", close: "20:00" },
  { day: "Saturday", shortDay: "Sat", schemaDay: "Saturday", open: "10:00", close: "20:00" },
] as const;

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "CUT/CTRL",
  description:
    "Independent London barbershop for precision cuts, textured crops, fades and beard work.",
  url: (configuredUrl || "https://cutctrl.studio").replace(/\/+$/, ""),
  locale: "en_GB",
  timezone: "Europe/London",
  address: {
    street: "65 Redchurch Street",
    locality: "London",
    region: "England",
    postalCode: "E2 7DJ",
    countryCode: "GB",
    countryName: "United Kingdom",
  },
  phone: {
    display: "020 7946 0184",
    href: "+442079460184",
  },
  email: "book@cutctrl.studio",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=65%20Redchurch%20Street%2C%20London%20E2%207DJ",
  socialPlaceholders: ["Instagram", "TikTok"],
  weeklyHours,
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export function formatStudioAddress() {
  const { street, locality, postalCode } = siteConfig.address;
  return `${street}, ${locality} ${postalCode}`;
}
