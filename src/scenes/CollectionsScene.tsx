import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { showroomCollections } from "@/lib/collections";

function CollectionsScene() {
  const collections = showroomCollections;

  return (
    <section id="collections" className="bg-white py-20 md:py-28">
      {/* Heading */}
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-red-700 md:text-sm">
          Our Collections
        </p>

        <h2 className="text-3xl font-bold text-gray-900 md:text-6xl">
          Explore Every Corner
          <br />
          Of Your Home
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base text-gray-600 md:text-lg">
          Discover beautifully crafted furniture collections designed for every room in your home.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="mx-auto mt-16 max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {collections.map((item, index) => (
            <Link
              key={item.slug}
              to="/products"
              search={{
                collection: item.slug,
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 60,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                }}
                viewport={{
                  once: true,
                }}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[32px]
                  cursor-pointer
                  ${item.large ? "h-[420px] md:col-span-2 md:h-[550px]" : "h-[280px] md:h-[360px]"}
                `}
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-all
                    duration-700
                    group-hover:scale-110
                    group-hover:brightness-110
                  "
                />

                {/* Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/30
                    to-transparent
                    transition-all
                    duration-500
                    group-hover:from-black/90
                  "
                />

                {/* Content */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    w-full
                    p-6
                    md:p-8
                    text-white
                  "
                >
                  {/* Designs Badge */}
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
                      px-4
                      py-2
                      text-xs
                      font-medium
                      backdrop-blur-xl
                    "
                  >
                    {item.designs}
                  </span>

                  {/* Title */}
                  <h3
                    className={`
                      mt-4
                      font-bold
                      ${item.large ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl"}
                    `}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm text-white/80 md:text-base">{item.description}</p>

                  {/* Explore */}
                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      gap-2
                      opacity-0
                      translate-y-4
                      transition-all
                      duration-500
                      group-hover:translate-y-0
                      group-hover:opacity-100
                    "
                  >
                    <span className="font-medium">Explore Collection</span>

                    <ArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CollectionsScene;
