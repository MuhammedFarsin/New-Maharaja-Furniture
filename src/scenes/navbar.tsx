import { ReactNode, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generalWhatsAppLink } from "@/lib/config";
import { motion } from "framer-motion";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const menu = [
    { name: "Home", to: "/" },
    { name: "Products", to: "/products" },
    { name: "About Us", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <header className="fixed top-3 left-0 z-50 w-full px-4">
      {/* Main Floating Navbar */}
      <div
        className="
          mx-auto
          flex
          h-16
          w-full
          max-w-7xl
          items-center
          justify-between
          rounded-full
          border
          border-white/50
          bg-white/80
          px-4
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]
          backdrop-blur-xl
          md:h-20
          md:px-6
        "
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <img
            src="/images/maharaja-logo.webp"
            alt="Maharaja Furniture"
            className="h-9 w-auto md:h-12"
          />

          <div>
            <h1 className="text-sm font-bold text-red-700 md:text-xl">NEW MAHARAJA</h1>

            <p className="text-[9px] tracking-[0.25em] text-red-700 md:text-xs">FURNITURE</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          <nav
            className="
              flex
              h-12
              items-center
              rounded-full
              border
              border-red-400/20
              bg-red-700/80
              p-1.5
              shadow-[0_8px_32px_rgba(127,29,29,0.35)]
              backdrop-blur-2xl
            "
          >
            {menu.map((item) => {
              const active = pathname === item.to;

              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className="
                  relative
                  rounded-full
                  px-6
                  py-2
                  text-sm
                  font-medium
                  transition-colors
                "
                >
                  {active && (
                    <motion.div
                      layoutId="navbar-pill"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                      className="
            absolute
            inset-0
            rounded-full
            bg-white
            shadow-lg
          "
                    />
                  )}

                  <span className={`relative z-10 ${active ? "text-red-700" : "text-white"}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* WhatsApp Button */}
          <a href={generalWhatsAppLink()} target="_blank" rel="noopener noreferrer">
            <Button
              className="
      h-12
      rounded-full
      border
      border-white/20
      bg-white/10
      px-6
      text-red-700
      shadow-[0_8px_32px_rgba(0,0,0,0.25)]
      backdrop-blur-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:scale-105
      hover:border-red-200
      hover:bg-white
      hover:shadow-[0_12px_40px_rgba(220,38,38,0.25)]
    "
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-white/20
            bg-red-700/80
            text-white
            backdrop-blur-xl
            lg:hidden
          "
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="
            mx-auto
            mt-3
            max-w-[95%]
            rounded-3xl
            border
            border-white/20
            bg-white/10
            p-5
            shadow-[0_8px_32px_rgba(0,0,0,0.35)]
            backdrop-blur-2xl
            lg:hidden
          "
        >
          <div className="flex flex-col gap-3">
            {menu.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`
      flex
      items-center
      justify-center
      rounded-2xl
      px-5
      py-3
      font-medium
      transition-all
      duration-300

      ${
        pathname === item.to
          ? "bg-red-700 text-white shadow-md"
          : "text-neutral-800 hover:bg-neutral-100"
      }
    `}
              >
                {item.name}
              </Link>
            ))}

            <a href={generalWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <Button
                className="
      mt-2
      h-12
      w-full
      rounded-full
      bg-green-500
      text-white
      hover:bg-green-600
    "
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Enquiry
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
