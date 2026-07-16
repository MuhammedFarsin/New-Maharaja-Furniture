import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/scenes/Home";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "Premium Teak Wood Furniture in Coimbatore | New Maharaja Furniture",
      "Visit New Maharaja Furniture in Coimbatore for premium teak wood furniture, sofa sets, cots, wardrobes, dining tables, TV units, mattresses and custom furniture at affordable prices.",
      "/"
    ),

  component: HomePage,
});