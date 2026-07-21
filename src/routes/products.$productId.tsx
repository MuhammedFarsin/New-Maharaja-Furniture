import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  MessageCircle,
  Phone,
  Share2,
  Star,
  TreePine,
  Ruler,
  PackageCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BUSINESS } from "@/lib/config";
import { formatPrice } from "@/lib/furniture-data";
import { useProductBySlug, useProducts } from "@/lib/products-db";

import { ProductCardV2 } from "@/components/product-card-v2";
import { Navbar } from "@/scenes/navbar";
import Footer from "@/scenes/Footer";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetails,
});

function ProductDetails() {
  const { productId } = Route.useParams();
  const { data: product, isLoading } = useProductBySlug(productId);
  const { data: products = [] } = useProducts();

  const [activeImage, setActiveImage] = useState(0);
  const [descOpen, setDescOpen] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const thumbRefs = useRef([]);
  const galleryRef = useRef(null);
  const isUserScrolling = useRef(false);

  // Measure the rendered Navbar so we can reserve space for it when it's
  // fixed/sticky-positioned (common on mobile) without hardcoding a height.
  const navWrapRef = useRef(null);
  const [navOffset, setNavOffset] = useState(0);

  useEffect(() => {
    const measure = () => {
      const nav = navWrapRef.current?.firstElementChild;
      if (!nav) return;
      const position = window.getComputedStyle(nav).position;
      // Fallback value if position isn't explicitly fixed in computed styles but acts like it
      const height = nav.getBoundingClientRect().height;
      setNavOffset(height > 0 ? height : 80);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const images = product?.images ?? [];
  const selectedImage = images[activeImage] ?? images[0];

  // Keep the thumbnail row scrolled to the active thumbnail
  useEffect(() => {
    thumbRefs.current[activeImage]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeImage]);

  // Keep the mobile swipeable image strip in sync with activeImage,
  // whether it changed via thumbnail click, arrow click, or finger swipe.
  useEffect(() => {
    const el = galleryRef.current;
    if (!el || isUserScrolling.current) return;
    const target = activeImage * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 2) {
      el.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [activeImage]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f5]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-700 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] text-neutral-500">
        Product not found
      </div>
    );
  }

  // Only show products from the same category — hide the section entirely
  // if there are none, rather than falling back to unrelated products.
  const similarProducts = products
    .filter((p) => p.category?.id === product.category?.id && p.id !== product.id)
    .slice(0, 8);

  const whatsappUrl = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
    `Hello ${BUSINESS.name},

I'm interested in this product.

━━━━━━━━━━━━━━━━━━━━
🆔 Product Code : ${product.product_code ?? "-"}
🪑 Product Name : ${product.name}
🏷️ Category : ${product.category?.name ?? "-"}
💰 Price : ${formatPrice(product.price)}
━━━━━━━━━━━━━━━━━━━━

Please let me know whether this product is available.`,
  )}`;

  const specs = [
    { label: "Category", value: product.category?.name },
    { label: "Material", value: product.material },
    { label: "Size", value: product.dimensions },
    { label: "Finish", value: product.finish },
  ].filter((s) => s.value);

  const goPrev = () => setActiveImage((p) => (p === 0 ? images.length - 1 : p - 1));
  const goNext = () => setActiveImage((p) => (p === images.length - 1 ? 0 : p + 1));

  const onGalleryScroll = () => {
    const el = galleryRef.current;
    if (!el) return;
    isUserScrolling.current = true;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeImage) setActiveImage(idx);
    window.clearTimeout(onGalleryScroll._t);
    onGalleryScroll._t = window.setTimeout(() => {
      isUserScrolling.current = false;
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div ref={navWrapRef} className="relative z-50">
        <Navbar />
      </div>

      
        <main className="mx-auto max-w-6xl px-4 sm:px-6 md:py-6 mt-36">
          {/* Changed breakpoint from lg to md to prevent early vertical stacking */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
            {/* ---------------- GALLERY ---------------- */}
            <div className="md:col-span-7 md:sticky md:self-start" style={{ top: navOffset + 24 }}>
              <div className="relative overflow-hidden bg-[#f0ede7] rounded-[28px] border border-neutral-200/70 shadow-sm">
                {/* Floating back / wishlist / share */}
                <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between">
                  <Link
                    to="/products"
                    aria-label="Back to products"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-700 shadow-md ring-1 ring-black/5 transition hover:bg-neutral-100 active:scale-95"
                  >
                    <ArrowLeft size={19} />
                  </Link>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setIsWishlisted((v) => !v)}
                      aria-label="Save to wishlist"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition hover:bg-neutral-100 active:scale-95"
                    >
                      <Heart
                        size={18}
                        className={isWishlisted ? "fill-red-700 text-red-700" : "text-neutral-700"}
                      />
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator
                            .share({ title: product.name, url: window.location.href })
                            .catch(() => {});
                        }
                      }}
                      aria-label="Share product"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-700 shadow-md ring-1 ring-black/5 transition hover:bg-neutral-100 active:scale-95"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Mobile: swipeable strip */}
                <div
                  ref={galleryRef}
                  onScroll={onGalleryScroll}
                  className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide sm:hidden"
                >
                  {images.map((img) => (
                    <img
                      key={img.id}
                      src={img.url}
                      alt={product.name}
                      className="h-[78vw] max-h-[440px] w-full shrink-0 snap-center object-contain"
                    />
                  ))}
                </div>

                {selectedImage && (
                  <img
                    src={selectedImage.url}
                    alt={product.name}
                    className="hidden h-[460px] w-full object-contain sm:block md:h-[480px] lg:h-[540px]"
                  />
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur">
                    {activeImage + 1} / {images.length}
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 hidden -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:scale-105 sm:flex"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      onClick={goNext}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 hidden -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:scale-105 sm:flex"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      ref={(el) => (thumbRefs.current[index] = el)}
                      onClick={() => setActiveImage(index)}
                      className={`shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                        activeImage === index
                          ? "border-red-700"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={product.name}
                        className="h-16 w-16 object-cover sm:h-20 sm:w-20"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ---------------- INFO ---------------- */}
            <div className="flex flex-col gap-5 md:col-span-5">
              <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-neutral-100 sm:p-6">
                {product.category && (
                  <span className="inline-flex rounded-full bg-red-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-red-700">
                    {product.category.name}
                  </span>
                )}

                <h1 className="text-2xl font-bold leading-tight text-neutral-900 mt-3 lg:text-3xl">
                  {product.name}
                </h1>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex text-red-700">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-400">(24 Reviews)</span>
                </div>

                <h2 className="mt-3 text-2xl font-bold text-red-700 sm:text-3xl lg:text-4xl">
                  {formatPrice(product.price)}
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    <span className="text-xs font-medium text-green-700 sm:text-sm">In Stock</span>
                  </div>
                  {product.material && (
                    <Chip icon={<TreePine size={14} />} label={product.material} />
                  )}
                  {product.dimensions && (
                    <Chip icon={<Ruler size={14} />} label={product.dimensions} />
                  )}
                  {!product.dimensions && !product.material && (
                    <Chip icon={<PackageCheck size={14} />} label="Premium quality" />
                  )}
                </div>

                {/* Unified Icon-Only CTA Box Layout inside card */}
                <div className="mt-6 flex gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Message on WhatsApp"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-green-600 bg-white text-green-700 transition hover:bg-green-50 active:scale-95"
                  >
                    <MessageCircle size={22} />
                  </a>
                  <a
                    href={`tel:${BUSINESS.phone}`}
                    aria-label="Call Business"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-700 text-white transition hover:bg-red-800 active:scale-95"
                  >
                    <Phone size={20} />
                  </a>
                </div>
              </div>

              {/* Product Details */}
              {specs.length > 0 && (
                <div>
                  <h3 className="mb-2.5 text-base font-bold text-neutral-900 md:hidden">
                    Product Details
                  </h3>
                  <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-neutral-100">
                    {specs.map((s, i) => (
                      <div
                        key={s.label}
                        className={`flex items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 ${
                          i < specs.length - 1 ? "border-b border-neutral-100" : ""
                        }`}
                      >
                        <span className="text-sm font-semibold text-neutral-700">{s.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-red-700 md:text-neutral-500">
                            {s.value}
                          </span>
                          <ChevronRight size={16} className="text-neutral-300 md:hidden" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-neutral-100">
                <button
                  onClick={() => setDescOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-5 py-4 sm:px-6 md:cursor-default"
                >
                  <h3 className="text-base font-bold text-neutral-900">Description</h3>
                  <ChevronDown
                    size={18}
                    className={`text-neutral-400 transition-transform md:hidden ${descOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {descOpen && (
                  <p className="px-5 pb-5 text-sm leading-7 text-neutral-600 sm:px-6 sm:pb-6">
                    {product.description ||
                      "Crafted using premium quality wood with excellent durability and elegant finishing. Built to provide long-lasting comfort while enhancing the beauty of your home."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ---------------- SIMILAR PRODUCTS ---------------- */}
          {similarProducts.length > 0 && (
            <section className="mt-12 border-t border-neutral-200/70 pt-8">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-bold text-neutral-900 sm:text-2xl">
                  Similar Products
                </h2>
                <Link
                  to="/products"
                  search={{ category: product.category?.id }}
                  className="text-sm font-semibold text-red-700 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {similarProducts.map((item) => (
                  <div key={item.id} className="w-[150px] shrink-0 snap-start sm:w-[200px]">
                    <ProductCardV2 product={item} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
  );
}

function Chip({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5">
      <span className="text-neutral-600">{icon}</span>
      <span className="text-xs font-medium text-neutral-700 sm:text-sm">{label}</span>
    </div>
  );
}

export default ProductDetails;
