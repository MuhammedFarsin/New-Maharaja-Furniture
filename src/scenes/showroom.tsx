import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { images } from "@/lib/furniture-data";
import { BUSINESS, generalWhatsAppLink } from "@/lib/config";

// export const Route = createFileRoute("/showroom")({
//   head: () => ({
//     meta: [
//       {
//         title: "Visit Our Furniture Showroom | Maharaja",
//       },
//       {
//         name: "description",
//         content:
//           "Visit Maharaja Furniture showroom to explore premium teak furniture, compare finishes and discuss custom designs.",
//       },
//     ],
//   }),
//   component: Showroom,
// });

function Showroom() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-24">
        {/* Exterior */}
        <article className="grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[32px]">
            <img
              src={images.exterior}
              alt="Exterior view of Maharaja Furniture showroom"
              className="
                  h-[350px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-105
                  md:h-[500px]
                "
            />
          </div>

          <div>
            <p className="section-kicker">Exterior View</p>

            <h2 className="section-title mt-4">
              Easy To Spot.
              <br />
              Worth Stepping Inside.
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Our open-front showroom showcases handcrafted teak furniture from the moment you
              arrive, giving you a glimpse of the elegance waiting inside.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <Clock className="mb-3 text-primary" />

                <h3 className="font-semibold">Opening Hours</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Daily
                  <br />
                  9:00 AM – 8:30 PM
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <MapPin className="mb-3 text-primary" />

                <h3 className="font-semibold">Location</h3>

                <p className="text-muted-foreground">
                  {BUSINESS.name}
                  <br />
                  {BUSINESS.address}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Visit Our Showroom */}
        <article className="grid items-center gap-12 lg:grid-cols-2">
          {/* Map */}
          <div className="lg:order-2">
            <div className="overflow-hidden rounded-[32px] shadow-lg">
              <iframe
                src="https://www.google.com/maps?q=Maharaja+Furniture&output=embed"
                className="h-[350px] w-full border-0 md:h-[500px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Maharaja Furniture Location"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="section-kicker">Visit Our Showroom</p>

            <h2 className="section-title mt-4">
              Find Maharaja Furniture
              <br />
              Easily With Google Maps
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Visit our showroom to explore premium teak wood furniture, modern home collections,
              custom furniture solutions and many more designs. Our team will help you choose the
              perfect furniture for your home.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <h4 className="font-semibold text-lg">📍 Location</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {BUSINESS.name}
                  <br />
                  {BUSINESS.address}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg">📞 Phone</h4>
                <p className="text-muted-foreground">+91 {BUSINESS.phone}</p>
              </div>

              <div>
                <h4 className="font-semibold text-lg">🕘 Business Hours</h4>
                <p className="text-muted-foreground">
                  Every Day
                  <br />
                  9:00 AM – 8:30 PM
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href={BUSINESS.googleMaps} target="_blank" rel="noopener noreferrer">
                <Button size="lg">
                  <Navigation className="mr-2 h-5 w-5" />
                  Get Directions
                </Button>
              </a>

              <a href={generalWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Enquiry
                </Button>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Showroom;
