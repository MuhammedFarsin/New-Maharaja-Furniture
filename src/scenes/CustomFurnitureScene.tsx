import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";

/* ===================================================================
   IMAGE CONFIG — this is the only part you need to touch to add
   your real photos.

   - Add/remove objects freely, the rotation logic just loops
     over whatever's in this array.
   - `src` must point to a real, existing file. If the path is wrong
     the box will just render broken/blank — there's no fallback UI.
   - Keep all images the same aspect ratio (this layout is a fixed
     h-[650px] container) — run mismatched photos through `sharp`
     first (resize + crop to e.g. 900x650) or the zoom/crossfade
     will visibly jump between images of different framing.
   - Order in this array = order they play in, top to bottom.
=================================================================== */
interface CustomFurnitureImage {
  src: string; // path to the processed image
  label: string; // furniture name shown on the image
}

const CUSTOM_FURNITURE_IMAGES: CustomFurnitureImage[] = [
  { src: "/images/wardrobe-scene.webp", label: "Custom Wardrobe" },
  { src: "/images/cot-scene.webp", label: "Custom Cot" },
  { src: "/images/sofa-scene.webp", label: "Custom Sofa" },
  { src: "/images/dining-scene.webp", label: "Custom Dining Table" },
  { src: "/images/tv-unit-scene.webp", label: "Custom TV Unit" },
  { src: "/images/pooja-scene.webp", label: "Custom Pooja Unit" },
];

// How long each image stays on screen before crossfading to the next, in ms.
const SLIDE_DURATION_MS = 4500;

function CustomFurnitureScene() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % CUSTOM_FURNITURE_IMAGES.length);
    }, SLIDE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const activeImage = CUSTOM_FURNITURE_IMAGES[activeIndex];

  return (
    <section className="bg-[#faf8f5] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Image — rotating showcase */}
          <div className="relative">
            <div className="relative h-[650px] w-full overflow-hidden rounded-[32px] shadow-xl bg-neutral-200">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage.src}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/*
                    IMAGE RENDER — this is where CUSTOM_FURNITURE_IMAGES
                    actually gets drawn. If you see a blank/broken box here,
                    it means `activeImage.src` is a 404 — check the path.
                  */}
                  <img
                    src={activeImage.src}
                    alt={activeImage.label}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                </motion.div>
              </AnimatePresence>

              {/* CUSTOM MADE badge, top-left */}
              <div className="absolute left-6 top-6 z-10">
                <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-red-700 shadow-sm">
                  Custom Made
                </span>
              </div>

              {/* furniture name, bottom-left, changes with active image */}
              <div className="absolute bottom-6 left-6 z-10">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeImage.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="text-xl font-semibold text-white"
                  >
                    {activeImage.label}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 rounded-3xl bg-white p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-700">
                Since 1998
              </p>
              <h3 className="mt-2 text-2xl font-bold text-neutral-900">Custom Made</h3>
              <p className="mt-2 text-sm text-neutral-500">Crafted exactly to your needs.</p>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
              Custom Furniture
            </p>

            <h2 className="mt-5 text-5xl font-bold leading-tight text-neutral-900">
              Furniture Designed
              <br />
              Just For Your Home
            </h2>

            <p className="mt-8 text-lg leading-8 text-neutral-600">
              Every home is different. We manufacture premium teak furniture according to your
              preferred size, design, finish, storage requirements and wood selection.
            </p>

            {/* Features */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {[
                "Custom Sizes",
                "100% Teak Wood",
                "Premium Finish",
                "Storage Options",
                "Modern & Traditional Designs",
                "Home Delivery",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="h-6 w-6 text-red-700" />
                  <span className="font-medium text-neutral-800">{item}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-12 flex flex-wrap gap-4">
              <Button asChild className="h-14 rounded-full px-8 bg-green-600 hover:bg-green-800">
                <a href="https://wa.me/919207509746" target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Get Free Consultation
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="mt-28">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
              Our Process
            </p>

            <h3 className="mt-4 text-4xl font-bold text-neutral-900">How It Works</h3>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "Share Your Idea",
                desc: "Tell us your requirements, dimensions and preferred design.",
              },
              {
                number: "02",
                title: "Choose Material",
                desc: "Select teak wood, finish, colour and storage options.",
              },
              {
                number: "03",
                title: "Manufacturing",
                desc: "Our craftsmen build your furniture with precision.",
              },
              {
                number: "04",
                title: "Delivery",
                desc: "We deliver and install your furniture safely at your home.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-5xl font-bold text-red-100">{step.number}</span>

                <h4 className="mt-6 text-xl font-bold text-neutral-900">{step.title}</h4>

                <p className="mt-4 leading-7 text-neutral-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomFurnitureScene;
