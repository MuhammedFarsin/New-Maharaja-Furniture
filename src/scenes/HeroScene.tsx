import { Link } from "@tanstack/react-router";
import { ChevronDown, MessageCircle, ShieldCheck, Sofa, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generalWhatsAppLink } from "@/lib/config";
import { motion } from "framer-motion";

function HeroScene() {
  return (
    <>
      {/* --- HERO SECTION --- */}
      {/* min-h-[100dvh] ensures perfect mobile full-screen height fitting browser address bars dynamically */}
      <section id="home" className="relative min-h-[100dvh] w-full overflow-hidden bg-neutral-950">
        {/* Background Asset Wrapper */}
        <div className="absolute inset-0 h-full w-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            src="/videos/maharaja-process-hero.mp4" // Path to your newly generated video file
          />
        </div>

        {/* Ambient Dark Overlay: Ensures crisp text readability against the changing video frames */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/75" />

        {/* Hero Copywriting Content */}
        <div className="relative z-20 flex min-h-[100dvh] items-center pt-20 pb-16">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="max-w-3xl text-white">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.4em] text-white/80"
              >
                Premium Teak Furniture
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight"
              >
                Furniture Crafted <br /> For Generations
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-5 max-w-2xl text-sm sm:text-lg md:text-xl leading-6 sm:leading-8 text-white/85 text-balance"
              >
                Discover handcrafted teak furniture designed to bring elegance, comfort, and
                lifelong durability to every home.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Link to="/products" className="w-full sm:w-auto">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Explore Collection
                  </Button>
                </Link>
                <a
                  href={generalWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="whatsapp" size="lg" className="w-full sm:w-auto">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp Enquiry
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scrolling bounce visual cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </section>
    </>
  );
}

export default HeroScene;
