export const BUSINESS = {
  name: import.meta.env.VITE_BUSINESS_NAME,
  phone: import.meta.env.VITE_PHONE_NUMBER,
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER,
  email: import.meta.env.VITE_BUSINESS_EMAIL,
  address: import.meta.env.VITE_BUSINESS_ADDRESS,
  siteUrl: import.meta.env.VITE_SITE_URL,
  googleMaps: import.meta.env.VITE_GOOGLE_MAPS,
};

export const WHATSAPP_URL = `https://wa.me/${BUSINESS.whatsapp}`;

export function generalWhatsAppLink() {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(
    `Hello ${BUSINESS.name},

I would like to enquire about your furniture.

Please contact me.

Thank you.`,
  )}`;
}
