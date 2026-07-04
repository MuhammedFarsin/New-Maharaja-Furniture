import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

import { useProducts } from "@/lib/products-db";

function NewArrivalsScene() {
  // Fetch all products from database
  const { data: allProducts = [], isLoading } = useProducts();

  // Show latest 10 products
  const products = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map((product) => ({
        id: product.id,
        slug: product.slug,
        title: product.name,
        image: product.images?.[0]?.url ?? "/images/placeholder.jpg",
        category: product.category?.name ?? "Furniture",
      }));
  }, [allProducts]);

  const [active, setActive] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  // Responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto play
  useEffect(() => {
    if (!products.length) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [products.length]);

  // Prevent active index becoming invalid
  useEffect(() => {
    if (active >= products.length && products.length > 0) {
      setActive(0);
    }
  }, [products, active]);

  if (isLoading) {
    return (
      <section id="new-arrivals" className="overflow-hidden bg-[#FBFBFA] py-24 md:py-36">
        {/* Header */}
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-amber-800/80">
            Latest Collection
          </p>

          <h2 className="font-serif text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
            Our <span className="italic font-normal">Latest Furniture</span>
          </h2>

          <div className="mx-auto mt-6 h-[1px] w-16 bg-amber-800/30" />

          <p className="mx-auto mt-6 max-w-xl text-sm text-neutral-500">
            Loading our newest furniture...
          </p>
        </div>

        {/* Skeleton Cards */}
        <div className="mx-auto mt-16 flex max-w-7xl justify-center gap-8 px-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="w-[260px] overflow-hidden rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm sm:w-[300px] md:w-[380px] lg:w-[420px]"
            >
              <div className="flex h-[280px] items-center justify-center rounded-xl bg-[#f5f5f7] sm:h-[320px] md:h-[400px] lg:h-[460px]">
                <div className="text-center">
                  {/* Replace with your logo image if available */}
                  <img
                    src="/images/maharaja-logo.webp"
                    alt="Maharaja Furniture"
                    className="mx-auto h-40 w-auto animate-pulse"
                  />

                  <p className="mt-6 text-lg font-bold tracking-[0.2em] text-neutral-700">
                    NEW MAHARAJA
                  </p>

                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Furniture</p>
                </div>
              </div>

              <div className="px-2 pb-3 pt-5">
                <div className="mb-3 h-3 w-20 animate-pulse rounded bg-neutral-200" />
                <div className="h-5 w-40 animate-pulse rounded bg-neutral-300" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) {
    return <section className="py-32 text-center">No products found.</section>;
  }
  return (
    <section
      id="new-arrivals"
      className="overflow-hidden bg-[#FBFBFA] py-24 md:py-36 selection:bg-amber-100"
    >
      {/* Header */}
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-amber-800/80"
        >
          Latest Collection
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl md:text-6xl"
        >
          Our <span className="italic font-normal text-neutral-800">Latest Furniture</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 h-[1px] w-16 bg-amber-800/30"
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl font-light text-sm leading-relaxed text-neutral-500 md:text-base"
        >
          Explore the newest furniture added to our showroom.
        </motion.p>
      </div>

      {/* Carousel */}
      <div className="relative mt-16 flex h-[460px] md:h-[620px] items-center justify-center overflow-hidden perspective-[1200px]">
        {products.map((product, index) => {
          let offset = index - active;

          if (offset > products.length / 2) offset -= products.length;
          if (offset < -products.length / 2) offset += products.length;

          const step = isMobile ? 140 : 400;

          const x = offset * step;

          const scale = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.85 : 0.7;

          const opacity =
            offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.65 : Math.abs(offset) === 2 ? 0.25 : 0;

          const rotateY = offset === 0 ? 0 : offset > 0 ? -30 : 30;

          const zIndex = 20 - Math.abs(offset);

          return (
            <motion.div
              key={product.id}
              animate={{
                x,
                scale,
                opacity,
                rotateY,
              }}
              transition={{
                duration: 0.85,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{
                zIndex,
                transformStyle: "preserve-3d",
              }}
              className="absolute"
            >
              <Link
                to="/products/$productId"
                params={{
                  productId: product.slug,
                }}
                onClick={() => setActive(index)}
              >
                <div className="group relative w-[260px] overflow-hidden rounded-2xl border border-neutral-100 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] sm:w-[300px] md:w-[380px] lg:w-[420px]">
                  {/* Product Image */}

                  <div className="relative h-[280px] overflow-hidden rounded-xl bg-[#f5f5f7] sm:h-[320px] md:h-[400px] lg:h-[460px]">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                  </div>

                  {/* Product Info */}

                  <div className="px-2 pb-3 pt-5 text-left">
                    <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.2em] text-amber-800/70">
                      {product.category}
                    </span>

                    <h3 className="font-serif text-lg font-medium tracking-tight text-neutral-800 md:text-xl">
                      {product.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className="relative flex h-6 w-6 items-center justify-center focus:outline-none"
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === active && (
              <motion.span
                layoutId="activeDot"
                className="absolute inset-0 rounded-full border border-amber-800/40"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}

            <span
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                index === active ? "scale-125 bg-amber-800" : "bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default NewArrivalsScene;
