import { MapPin, Phone, Clock, MessageCircle, Facebook, Instagram } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            {/* Replace with your logo */}
            <img
              src="/images/maharaja-logo.webp"
              alt="Maharaja Furniture"
              className="h-16 w-auto"
            />

            <p className="mt-6 leading-7 text-white/70">
              Premium teak furniture crafted with timeless designs, exceptional quality and trusted
              craftsmanship for generations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>

            <ul className="mt-6 space-y-4 text-white/70">
              <li>
                <a href="/" className="transition hover:text-white">
                  Home
                </a>
              </li>

              <li>
                <a href="/products" className="transition hover:text-white">
                  Collections
                </a>
              </li>

              <li>
                <a href="/about" className="transition hover:text-white">
                  About Us
                </a>
              </li>

              <li>
                <a href="/contact" className="transition hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-lg font-semibold">Collections</h3>

            <ul className="mt-6 space-y-4 text-white/70">
              <li>Bedroom Furniture</li>
              <li>Living Room</li>
              <li>Dining Collection</li>
              <li>TV Units</li>
              <li>Pooja Units</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>

            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 text-red-500" />

                <p className="text-white/70">
                  Maharaja Furniture
                  <br />
                  Kunnathur,
                  <br />
                  Tamil Nadu, India
                </p>
              </div>

              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-red-500" />

                <p className="text-white/70">+91 93630 29847</p>
              </div>

              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-red-500" />

                <p className="text-white/70">
                  Open Daily
                  <br />
                  9:00 AM – 8:30 PM
                </p>
              </div>
            </div>

            {/* Social */}
            <div className="mt-8 flex gap-4">
              <a
                href="#"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  transition
                  hover:bg-red-700
                "
              >
                <Facebook className="h-5 w-5" />
              </a>

              <a
                href="#"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  transition
                  hover:bg-red-700
                "
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href="#"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  transition
                  hover:bg-red-700
                "
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 border-t border-white/10 pt-8 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Maharaja Furniture. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
