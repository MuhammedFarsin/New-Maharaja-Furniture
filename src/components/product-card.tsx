import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/furniture-data";
import type { Product } from "@/lib/products-db";
import { BUSINESS } from "@/lib/config";

export function ProductCard({ product }: { product: Product }) {
  const img = product.images[0]?.url;
  return (
    <article className="group overflow-hidden rounded-3xl bg-white border border-neutral-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
      <Link to="/products/$productId" params={{ productId: product.slug }} className="block">
        <div className="aspect-square overflow-hidden rounded-t-3xl bg-[#f5f5f7]">
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="
            h-full
            w-full
            object-cover
            object-center
            scale-125
            "
          />
        </div>
      </Link>
      <div className="p-6 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-primary">
          {product.category?.name ?? "Furniture"}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{product.name}</h3>
        {/* <p className="mt-1 text-sm text-muted-foreground">{product.material ?? ""}</p> */}
        <p className="mt-3 font-display text-lg font-bold text-primary">
          {formatPrice(product.price)}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/products/$productId" params={{ productId: product.slug }}>
              View Details
            </Link>
          </Button>
          <Button variant="whatsapp" size="icon" asChild>
            <a
              href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
                `Hello ${BUSINESS.name},

I'm interested in this product.

━━━━━━━━━━━━━━━━━━━━

🆔 Product Code : ${product.product_code ?? "-"}

🪑 Product Name : ${product.name}

🏷️ Category : ${product.category?.name ?? "Furniture"}

💰 Price : ${formatPrice(product.price)}

🔗 Product Link :
${BUSINESS.siteUrl}/products/${product.slug}

━━━━━━━━━━━━━━━━━━━━

Please let me know whether this product is currently available.

Thank you.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enquire about ${product.name}`}
            >
              <MessageCircle />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
