import { Link } from "@tanstack/react-router";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS, WHATSAPP_URL } from "@/lib/config";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background */}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-white">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 md:text-sm">
          Maharaja Furniture
        </p>

        <h2 className="text-4xl font-bold leading-tight md:text-7xl">
          Ready To Create
          <br />
          Your Dream Home?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 md:text-xl">
          Discover timeless furniture crafted with premium materials, elegant designs and trusted
          craftsmanship for generations.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/products">
            <Button
              size="lg"
              className="
                h-14
                rounded-full
                bg-white
                px-8
                text-red-700
                hover:bg-white/90
              "
            >
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <a
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(
              `Hello ${BUSINESS.name},

I would like to enquire about your furniture.

Please contact me.

Thank you.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="
      h-14
      rounded-full
      border
      border-white/30
      bg-white/10
      px-8
      text-white
      backdrop-blur-xl
      hover:bg-white
      hover:text-red-700
    "
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Enquiry
            </Button>
          </a>
        </div>

        {/* Bottom Trust Line */}
        <div className="mt-12 text-sm text-white/60">
          Premium Teak Wood • Custom Furniture • Factory Direct Pricing
        </div>
      </div>
    </section>
  );
}
