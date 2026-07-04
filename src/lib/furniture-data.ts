export const images = {
  exterior: "/images/maharaja-exterior.webp",
  interior: "/images/maharaja-interior.webp",
};

export const fallbackProductImage = images.interior;

export function formatPrice(value: number | null | undefined) {
  if (value == null) return "Enquire for price";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
