import { motion } from "framer-motion";
// Swapped to a clean default import style for CountUp to prevent module-object conflicts
import CountUp from "react-countup";
import { TreePine, Hammer, BadgeDollarSign, Award } from "lucide-react";

function WhyUsScene() {
  const features = [
    {
      icon: (props: any) => <TreePine {...props} />,
      title: "Premium Teak Wood",
      description:
        "Crafted using Grade-A authentic teak wood sustainably harvested and designed to endure for generations.",
    },
    {
      icon: (props: any) => <Hammer {...props} />,
      title: "Bespoke Customization",
      description:
        "Tailored architectural furniture precisely adjusted to match your room layouts, styling profiles, and individual needs.",
    },
    {
      icon: (props: any) => <BadgeDollarSign {...props} />,
      title: "Direct From Workshop",
      description:
        "Enjoy true luxury pricing. Masterfully crafted in our specialized facilities without retail markups or middleman costs.",
    },
    {
      icon: (props: any) => <Award {...props} />,
      title: "Heritage Craftsmanship",
      description:
        "Backing every joint and finish with decades of accumulated expertise in premium furniture fabrication.",
    },
  ];

  const stats = [
    { number: 10, suffix: "+", title: "Years of Experience" },
    { number: 900, suffix: "+", title: "Happy Customers" },
    { number: 1000, suffix: "+", title: "Furniture Designs" },
    { number: 100, suffix: "%", title: "Sustainably Sourced Teak" },
  ];

  return (
    <section id="why-us" className="bg-[#FBFBFA] py-24 md:py-36 selection:bg-amber-100">
      {/* Premium Editorial Header */}
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-amber-800/80"
        >
          The Maharaja Distinction
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl md:text-5xl"
        >
          Crafted With Absolute Quality, <br />
          <span className="italic font-normal text-neutral-800">Designed For Generations</span>
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
          className="mx-auto mt-6 max-w-2xl font-light text-sm leading-relaxed text-neutral-500 md:text-base"
        >
          We unify historic artisanal woodworking workflows with state-of-the-art structural designs
          to craft bespoke furniture arrangements that bring timeless stateliness and enduring
          comfort into your household.
        </motion.p>
      </div>

      {/* Feature Grid Section */}
      <div className="mx-auto mt-20 max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => {
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl bg-white p-8 border border-neutral-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.07)]"
              >
                {/* Minimal Luxury Icon Frame */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-50 text-neutral-700 border border-neutral-100 transition-all duration-500 group-hover:bg-amber-900 group-hover:text-white group-hover:border-amber-900 group-hover:shadow-lg group-hover:shadow-amber-900/20">
                  {item.icon({ className: "h-6 w-6 stroke-[1.5]" })}
                </div>

                {/* Card Context */}
                <h3 className="mt-6 font-serif text-xl font-medium text-neutral-800 tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm font-light leading-relaxed text-neutral-500">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Premium Dynamic Data Grid Block */}
      <div className="mx-auto mt-28 max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 px-8 py-14 shadow-xl border border-neutral-800">
          {/* Decorative geometric accent background */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-800/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-amber-900/10 blur-3xl pointer-events-none" />

          <div className="relative grid gap-10 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 md:divide-x divide-neutral-800 text-center md:text-left">
            {stats.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="pt-6 sm:pt-0 md:pl-8 first:pl-0 first:pt-0"
              >
                <div className="font-serif text-4xl font-light text-white md:text-5xl tracking-tight flex items-baseline justify-center md:justify-start">
                  {/* Safely guarding CountUp evaluation */}
                  {(CountUp && typeof CountUp === "function") || (CountUp as any).render ? (
                    <CountUp
                      end={item.number}
                      duration={3}
                      enableScrollSpy
                      scrollSpyOnce
                      separator=","
                    />
                  ) : (
                    <span>{item.number}</span>
                  )}
                  <span className="text-amber-500 ml-0.5 font-sans font-normal text-3xl md:text-4xl">
                    {item.suffix}
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium tracking-widest uppercase text-neutral-400">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyUsScene;
