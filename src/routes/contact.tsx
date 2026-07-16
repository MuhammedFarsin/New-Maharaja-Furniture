import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BUSINESS, WHATSAPP_URL } from "@/lib/config";
import { Navbar } from "@/scenes/navbar";
import Footer from "@/scenes/Footer";
import { Helmet } from "react-helmet-async";
export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  return (
    <>
      <Navbar />
      <Helmet>
        <title>Contact Maharaja Furniture | Showroom & Enquiries</title>

        <meta
          name="description"
          content="Contact New Maharaja Furniture in Ganeshapuram, Kunnathur, Coimbatore for premium teak wood furniture enquiries, custom furniture, showroom timings and WhatsApp support."
        />

        <meta
          property="og:title"
          content="Contact New Maharaja Furniture | Showroom & Enquiries"
        />

        <meta
          property="og:description"
          content="Get in touch with New Maharaja Furniture for premium teak wood furniture, custom furniture and showroom enquiries."
        />

        <meta
          property="og:url"
          content="https://new-maharaja-furniture.vercel.app/contact"
        />

        <meta property="og:type" content="website" />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Contact New Maharaja Furniture | Showroom & Enquiries"
        />

        <meta
          name="twitter:description"
          content="Contact New Maharaja Furniture for premium teak wood furniture enquiries, showroom details and WhatsApp support."
        />

        <link
          rel="canonical"
          href="https://new-maharaja-furniture.vercel.app/contact"
        />
      </Helmet>
      {/* Hero */}
      <section className="bg-[#faf8f5] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-red-700 md:text-sm">
            Contact Us
          </p>

          <h1 className="text-4xl font-bold text-gray-900 md:text-7xl">
            Let's Find The Right
            <br />
            Furniture For Your Home
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
            Call, WhatsApp or send us a message. We'll help with availability, custom sizing,
            materials and showroom visits.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Send An Enquiry</h2>

            <form className="mt-10 grid gap-5" onSubmit={(e) => e.preventDefault()}>
              <label className="grid gap-2 text-sm font-semibold">
                Your Name
                <input
                  required
                  className="
                    h-14
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    px-5
                    outline-none
                    transition
                    focus:border-red-700
                    focus:ring-2
                    focus:ring-red-200
                  "
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                Phone Number
                <input
                  required
                  type="tel"
                  className="
                    h-14
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    px-5
                    outline-none
                    transition
                    focus:border-red-700
                    focus:ring-2
                    focus:ring-red-200
                  "
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                What Are You Looking For?
                <textarea
                  rows={5}
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    outline-none
                    transition
                    focus:border-red-700
                    focus:ring-2
                    focus:ring-red-200
                  "
                />
              </label>

              <Button size="lg" className="h-14 rounded-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Cards */}
          <aside className="rounded-[32px] bg-[#faf8f5] p-8 shadow-lg sm:p-12">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Visit Or Speak With Us</h2>

            <div className="mt-10 space-y-8">
              <div className="flex gap-4">
                <Phone className="mt-1 text-red-700" />

                <div>
                  <strong className="block">Phone</strong>

                  <p className="mt-1 text-gray-600">
                    <a href={`tel:${BUSINESS.phone}`} className="hover:text-red-700">
                      +91 {BUSINESS.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MessageCircle className="mt-1 text-red-700" />

                <div>
                  <strong className="block">WhatsApp</strong>

                  <p className="mt-1 text-gray-600">Chat instantly with us on WhatsApp.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="mt-1 text-red-700" />

                <div>
                  <strong className="block">Address</strong>

                  <p className="mt-1 text-gray-600">
                    {BUSINESS.name}
                    <br />
                    {BUSINESS.address}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="mt-1 text-red-700" />

                <div>
                  <strong className="block">Business Hours</strong>

                  <p className="mt-1 text-gray-600">
                    Daily
                    <br />
                    9:00 AM – 8:30 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
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
                <Button size="lg" className="rounded-full">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </Button>
              </a>

              <a href="tel:+919363029847">
                <Button variant="outline" size="lg" className="rounded-full">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
              </a>

              <a href={BUSINESS.googleMaps} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="rounded-full">
                  <MapPin className="mr-2 h-5 w-5" />
                  Open Maps
                </Button>
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Google Maps */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] shadow-lg">
          <iframe
            src="https://www.google.com/maps?q=Maharaja+Furniture+Kattur+Tamil+Nadu&output=embed"
            width="100%"
            height="500"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
            allowFullScreen
          />
        </div>

        <div className="mt-6 text-center">
          <a href={BUSINESS.googleMaps} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-full">
              <MapPin className="mr-2 h-5 w-5" />
              Open in Google Maps
            </Button>
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
}
