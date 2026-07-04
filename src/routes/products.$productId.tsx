import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Ruler, TreePine, Truck, ShieldCheck, Hammer } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/furniture-data";
import { BUSINESS, generalWhatsAppLink } from "@/lib/config";
import { useProductBySlug, useProducts } from "@/lib/products-db";

import { ProductCard } from "@/components/product-card";

import { Navbar } from "@/scenes/navbar";
import Footer from "@/scenes/Footer";

export const Route = createFileRoute("/products/$productId")({
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.productId} | Maharaja Furniture`,
      },
      {
        name: "description",
        content: "Premium teak furniture from Maharaja Furniture.",
      },
    ],
  }),
  component: ProductDetails,
});

function ProductDetails() {
  const { productId } = Route.useParams();

  const { data: p, isLoading } = useProductBySlug(productId);

  // Used later for Similar Products
  const { data: allProducts = [] } = useProducts();

  const [activeIdx, setActiveIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f5]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-red-700 border-t-transparent" />
          <p className="mt-5 text-gray-500">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f5]">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Product Not Found</h1>

          <p className="mt-4 text-gray-500">This product may have been removed.</p>
        </div>
      </div>
    );
  }

  const images = p.images ?? [];

  const active = images[activeIdx] ?? images[0];

  // Related Products
  const similarProducts = allProducts
    .filter((product) => product.id !== p.id && product.category?.id === p.category?.id)
    .slice(0, 4);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#faf8f5] pt-44 pb-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-700">
            {p.category?.name ?? "Furniture"}
          </p>

          <h1 className="mt-5 text-5xl font-bold text-gray-900 md:text-7xl">{p.name}</h1>

          <p className="mt-6 text-3xl font-bold text-red-700">{formatPrice(p.price)}</p>
        </div>
      </section>

      {/* Product Details */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.15fr_.85fr]">
          {/* Gallery */}
          <div>
            {/* Main Image */}
            <div className="overflow-hidden rounded-[36px] bg-[#f5f5f7] shadow-sm">
              {active && (
                <img
                  src={active.url}
                  alt={p.name}
                  className="
          h-full
          w-full
          object-contain
          transition-all
          duration-500
        "
                />
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-5 grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveIdx(i)}
                    className={`
            overflow-hidden
            rounded-2xl
            border-2
            transition-all
            ${i === activeIdx ? "border-red-700" : "border-transparent hover:border-neutral-300"}
          `}
                  >
                    <img
                      src={img.url}
                      alt={p.name}
                      className="
              aspect-square
              h-full
              w-full
              object-cover
            "
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[36px] bg-[#faf8f5] p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-700">
                {p.category?.name ?? "Furniture"}
              </p>

              <h2 className="mt-4 text-4xl font-bold text-neutral-900">{p.name}</h2>

              <p className="mt-4 text-3xl font-bold text-red-700">{formatPrice(p.price)}</p>

              {p.description && <p className="mt-6 leading-8 text-neutral-600">{p.description}</p>}

              {/* Specifications */}
              <div className="mt-10 space-y-4">
                {p.material && (
                  <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                    <TreePine className="mt-1 h-5 w-5 text-red-700" />

                    <div>
                      <h3 className="font-semibold">Material</h3>

                      <p className="mt-1 text-neutral-500">{p.material}</p>
                    </div>
                  </div>
                )}

                {p.dimensions && (
                  <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                    <Ruler className="mt-1 h-5 w-5 text-red-700" />

                    <div>
                      <h3 className="font-semibold">Dimensions</h3>

                      <p className="mt-1 text-neutral-500">{p.dimensions}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <Hammer className="mt-1 h-5 w-5 text-red-700" />

                  <div>
                    <h3 className="font-semibold">Customisation</h3>

                    <p className="mt-1 text-neutral-500">Available in custom sizes and finishes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <Truck className="mt-1 h-5 w-5 text-red-700" />

                  <div>
                    <h3 className="font-semibold">Delivery</h3>

                    <p className="mt-1 text-neutral-500">
                      Safe delivery available across Tamil Nadu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <ShieldCheck className="mt-1 h-5 w-5 text-red-700" />

                  <div>
                    <h3 className="font-semibold">Quality</h3>

                    <p className="mt-1 text-neutral-500">Crafted using premium quality wood.</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
                  `Hello ${BUSINESS.name},

I'm interested in this product.

━━━━━━━━━━━━━━━━━━━━

🆔 Product Code : ${p.product_code ?? "-"}

🪑 Product Name : ${p.name}

🏷️ Category : ${p.category?.name ?? "Furniture"}

💰 Price : ${formatPrice(p.price)}

🔗 Product Link :
${BUSINESS.siteUrl}/products/${p.slug}

━━━━━━━━━━━━━━━━━━━━

Please let me know whether this product is currently available.

Thank you.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="
          mt-10
          h-14
          w-full
          rounded-full
          bg-red-700
          hover:bg-red-800
        "
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Enquiry
                </Button>
              </a>

              <p className="mt-4 text-center text-sm text-neutral-500">
                Ask about availability, custom sizes and delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* About Product */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-700">
              About This Product
            </p>

            <h2 className="mt-4 text-4xl font-bold text-neutral-900">
              Crafted For Everyday Living
            </h2>

            <p className="mt-8 text-lg leading-9 text-neutral-600">
              {p.description ||
                `Our ${p.name} is carefully crafted using premium quality materials and
          designed to provide durability, elegance and long-lasting comfort.
          Every piece is manufactured with attention to detail and can also be
          customised according to your preferred dimensions, finish and storage
          requirements.`}
            </p>
          </div>
        </div>
      </section>

      {/* Custom Furniture CTA */}
      <section className="bg-[#faf8f5] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-red-700 to-red-800 p-12 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-white/80">Custom Furniture</p>

            <h2 className="mt-4 text-4xl font-bold">Need This Furniture In Another Size?</h2>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
              We manufacture furniture according to your preferred size, wood type, storage options,
              finish and design. If you cannot find the exact furniture you need, we'll build it
              specially for you.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="rounded-full bg-white/10 px-5 py-3">✓ Custom Sizes</div>

              <div className="rounded-full bg-white/10 px-5 py-3">✓ Premium Teak Wood</div>

              <div className="rounded-full bg-white/10 px-5 py-3">✓ Storage Options</div>

              <div className="rounded-full bg-white/10 px-5 py-3">✓ Premium Finish</div>
            </div>

            <a href={generalWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="mt-12 rounded-full bg-white px-8 py-6 text-red-700 hover:bg-neutral-100"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Request Custom Furniture
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-700">
                You May Also Like
              </p>

              <h2 className="mt-4 text-5xl font-bold text-neutral-900">Similar Products</h2>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Maharaja */}
      <section className="bg-[#faf8f5] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-700">
              Why Choose Maharaja Furniture
            </p>

            <h2 className="mt-4 text-5xl font-bold text-neutral-900">
              Built To Last For Generations
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Premium Wood",
                desc: "Carefully selected premium quality wood for lasting durability.",
              },
              {
                title: "Custom Manufacturing",
                desc: "Furniture built according to your preferred dimensions.",
              },
              {
                title: "Experienced Craftsmen",
                desc: "Skilled artisans with years of furniture making experience.",
              },
              {
                title: "Reliable Delivery",
                desc: "Safe delivery and installation for complete peace of mind.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-bold text-neutral-900">{item.title}</h3>

                <p className="mt-4 leading-7 text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
