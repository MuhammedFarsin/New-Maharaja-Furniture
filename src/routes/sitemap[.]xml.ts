import { createFileRoute } from "@tanstack/react-router";
import { BUSINESS } from "@/lib/config";
import type {} from "@tanstack/react-start";
const BASE_URL = BUSINESS.siteUrl;
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = ["/", "/products", "/about", "/contact"];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${BASE_URL}${path}</loc></url>`).join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
