import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  Share2,
  Star,
  TreePine,
  Ruler,
  PackageCheck,
  ChevronRight as RightIcon,
} from "lucide-react";
import { useState } from "react";

import { BUSINESS } from "@/lib/config";
import { formatPrice } from "@/lib/furniture-data";
import { useProductBySlug, useProducts } from "@/lib/products-db";

import { ProductCardV2 } from "@/components/product-card-v2";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetails,
});

function ProductDetails() {
  const { productId } = Route.useParams();

  const { data: product, isLoading } = useProductBySlug(productId);
  const { data: products = [] } = useProducts();

  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return <div className="flex min-h-screen items-center justify-center">Product not found</div>;
  }

  const images = product.images ?? [];
  const selectedImage = images[activeImage] ?? images[0];

  const similarProducts = products
    .filter((p) => p.category?.id === product.category?.id && p.id !== product.id)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link
            to="/products"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100"
          >
            <ArrowLeft size={20} />
          </Link>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: product.name,
                    url: window.location.href,
                  })
                  .catch(() => {});
              }
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100"
          >
            <Share2 size={20} />
          </button>
        </div>
      </header>
      {/* Product Gallery */}

      <section className="mx-auto mt-4 max-w-4xl px-4">
        <div className="overflow-hidden rounded-[28px] bg-[#f7f7f7]">
          <div className="relative">
            {selectedImage && (
              <img
                src={selectedImage.url}
                alt={product.name}
                className="
                  h-[360px]
                  w-full
                  object-contain
                  sm:h-[500px]
                "
              />
            )}

            {/* Image Counter */}

            {images.length > 1 && (
              <div
                className="
                  absolute
                  bottom-5
                  right-5
                  rounded-full
                  bg-white/95
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-neutral-700
                  shadow-md
                "
              >
                {activeImage + 1} / {images.length}
              </div>
            )}

            {/* Previous */}

            {images.length > 1 && (
              <button
                onClick={() =>
                  setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                }
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/95
                  shadow-lg
                "
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next */}

            {images.length > 1 && (
              <button
                onClick={() =>
                  setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/95
                  shadow-lg
                "
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        </div>

        {/* Thumbnails */}

        {images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(index)}
                className={`
                  shrink-0
                  overflow-hidden
                  rounded-2xl
                  border-2
                  transition-all
                  ${activeImage === index ? "border-red-600" : "border-neutral-200"}
                `}
              >
                <img
                  src={img.url}
                  alt={product.name}
                  className="
                    h-20
                    w-20
                    object-cover
                  "
                />
              </button>
            ))}
          </div>
        )}
      </section>
      {/* Product Information */}

      <section className="mx-auto mt-6 max-w-4xl px-4">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          {/* Category */}

          {product.category && (
            <span className="inline-flex rounded-full bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
              {product.category.name}
            </span>
          )}

          {/* Product Name */}

          <h1 className="mt-4 text-3xl font-bold leading-tight text-neutral-900">{product.name}</h1>

          {/* Rating */}

          <div className="mt-3 flex items-center gap-2">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>

            <span className="text-sm text-neutral-500">(24 Reviews)</span>
          </div>

          {/* Price */}

          <div className="mt-4 flex items-center gap-3">
            <h2 className="text-4xl font-bold text-red-600">{formatPrice(product.price)}</h2>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              In Stock
            </span>
          </div>

          {/* Information Chips */}

          <div className="mt-6 flex flex-wrap gap-3">
            {product.material && (
              <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2">
                <TreePine size={16} />
                <span className="text-sm font-medium">{product.material}</span>
              </div>
            )}

            {product.dimensions && (
              <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2">
                <Ruler size={16} />
                <span className="text-sm font-medium">{product.dimensions}</span>
              </div>
            )}

            <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2">
              <PackageCheck size={16} />
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}

      <section className="mx-auto mt-5 max-w-4xl px-4">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <span className="font-semibold">Category</span>

            <div className="flex items-center gap-2">
              <span className="text-neutral-500">{product.category?.name ?? "-"}</span>

              <RightIcon size={18} />
            </div>
          </div>

          <div className="flex items-center justify-between border-b px-6 py-5">
            <span className="font-semibold">Material</span>

            <div className="flex items-center gap-2">
              <span className="text-neutral-500">{product.material ?? "-"}</span>

              <RightIcon size={18} />
            </div>
          </div>

          <div className="flex items-center justify-between border-b px-6 py-5">
            <span className="font-semibold">Dimensions</span>

            <div className="flex items-center gap-2">
              <span className="text-neutral-500">{product.dimensions ?? "-"}</span>

              <RightIcon size={18} />
            </div>
          </div>

          <div className="px-6 py-6">
            <h3 className="mb-3 text-lg font-bold">Description</h3>

            <p className="leading-8 text-neutral-600">
              {product.description ||
                `Crafted using premium quality wood with excellent durability and elegant finishing. Built to provide long-lasting comfort while enhancing the beauty of your home.`}
            </p>
          </div>
        </div>
      </section>
      {/* Similar Products */}

      {similarProducts.length > 0 && (
        <section className="mx-auto mt-8 max-w-4xl px-4">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Similar Products</h2>

            <Link to="/products" className="text-sm font-semibold text-red-600">
              View All
            </Link>
          </div>

          <div
            className="
              flex
              gap-4
              overflow-x-auto
              pb-2
              snap-x
              snap-mandatory
              scrollbar-hide
            "
          >
            {similarProducts.map((item) => (
              <div
                key={item.id}
                className="
                  w-[170px]
                  shrink-0
                  snap-start
                "
              >
                <ProductCardV2 product={item} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Action Bar */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-neutral-200
          bg-white/95
          backdrop-blur-xl
        "
      >
        <div className="mx-auto flex max-w-4xl gap-3 p-4">
          {/* WhatsApp */}

          <a
            href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
              `Hello ${BUSINESS.name},

I'm interested in this product.

━━━━━━━━━━━━━━━━━━━━

🆔 Product Code : ${product.product_code ?? "-"}

🪑 Product Name : ${product.name}

🏷️ Category : ${product.category?.name ?? "-"}

💰 Price : ${formatPrice(product.price)}

━━━━━━━━━━━━━━━━━━━━

Please let me know whether this product is available.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              h-14
              flex-1
              items-center
              justify-center
              gap-2
              rounded-2xl
              border-2
              border-green-600
              bg-white
              font-semibold
              text-green-600
              transition-all
              hover:bg-green-50
            "
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>

          {/* Call */}

          <a
            href={`tel:${BUSINESS.phone}`}
            className="
              flex
              h-14
              flex-1
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-red-600
              font-semibold
              text-white
              transition-all
              hover:bg-red-700
            "
          >
            <Phone size={20} />
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
