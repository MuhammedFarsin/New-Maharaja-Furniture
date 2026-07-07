import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { formatPrice } from "@/lib/furniture-data";
import type { Product } from "@/lib/products-db";

export function ProductCardV2({ product }: { product: Product }) {
  const image =
    product.images?.[0]?.url || "/images/placeholder-product.webp";

  return (
    <Link
      to="/products/$productId"
      params={{ productId: product.slug }}
      className="group block"
    >
      <article
        className="
          overflow-hidden
          rounded-2xl
          border
          border-neutral-200
          bg-white
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        {/* Image */}
        <div className="relative aspect-[5/6] overflow-hidden bg-neutral-100">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

          {product.category && (
            <span
              className="
                absolute
                left-3
                top-3
                rounded-full
                bg-white/90
                px-3
                py-1
                text-[11px]
                font-medium
                text-neutral-700
                backdrop-blur
              "
            >
              {product.category.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
      <h3
  className="truncate text-[15px] font-semibold"
  title={product.name}
>
  {product.name}
</h3>

          <p className="mt-1 text-xs text-neutral-500">
            {product.material || product.dimensions || "Premium Furniture"}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(product.price)}
            </span>

            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-red-600
                transition-all
                group-hover:bg-red-600
                group-hover:text-white
              "
            >
              <ArrowRight size={18} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}