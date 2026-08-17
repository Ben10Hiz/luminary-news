export const site = {
  name: "The Luminary Network",
  short: "News",
  newsroom: "News",
  tagline: "Our stories, in our words.",
  description:
    "News, features and research from The Luminary Network — reported and published by the people building it.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_ENV === "production"
      ? "https://news.theluminary.network"
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  parentUrl: "https://theluminary.network",
  locale: "en_US",
};

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "America/Indianapolis",
});

const SHORT_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "America/Indianapolis",
});

export function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return DATE_FMT.format(new Date(d));
}

export function formatShortDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return SHORT_FMT.format(new Date(d));
}

export function isoDate(d: Date | string | null | undefined) {
  if (!d) return undefined;
  return new Date(d).toISOString();
}
