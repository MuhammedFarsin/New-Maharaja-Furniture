import { createFileRoute } from "@tanstack/react-router";
import { Eye, Gem, Target, type LucideIcon } from "lucide-react";
import { images } from "@/lib/furniture-data";
import { Navbar } from "@/scenes/navbar";
import Footer from "@/scenes/Footer";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    seo(
      "About New Maharaja Furniture",
      "Learn about New Maharaja Furniture, a trusted furniture store in Coimbatore offering premium teak wood furniture, custom furniture and quality craftsmanship.",
      "/about",
    ),
  component: About,
});

type Pillar = { icon: LucideIcon; title: string; desc: string };

const pillars: Pillar[] = [
  {
    icon: Target,
    title: "Mission",
    desc: "To make durable, well-crafted wooden furniture accessible to every home.",
  },
  {
    icon: Eye,
    title: "Vision",
    desc: "To be the region's most trusted destination for teak and custom furniture.",
  },
  {
    icon: Gem,
    title: "Quality commitment",
    desc: "To stand behind honest materials, strong construction and attentive service.",
  },
];

function About() {
  return (
    <>
      <Navbar />

      {/* Story */}
      <section className="bg-[#faf8f5] px-4 pt-28 pb-16 sm:px-6 md:pt-40 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-[32px]">
            <img
              src={images.exterior}
              alt="Exterior of Maharaja Furniture"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="section-kicker">Our story</p>
            <h1 className="section-title mt-4">
              {/* TODO: replace with a real founding detail, e.g. "Three decades of teak craftsmanship in Palakkad." */}
              A showroom where quality can be seen and felt.
            </h1>
            <p className="mt-6 leading-8 text-muted-foreground">
              {/* TODO: add real founding year / founder name / what started the business */}
              Our collection brings together teak beds, sofas, tables, wardrobes and custom
              furniture for everyday living. We value solid materials, careful joinery and finishes
              that let the character of wood shine.
            </p>
            <p className="mt-4 leading-8 text-muted-foreground">
              From first conversation to final selection, customer satisfaction remains at the heart
              of how we work.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-secondary px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="rounded-3xl bg-background p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mt-6 font-display text-3xl">{title}</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="section-kicker">Showroom gallery</p>
          <h2 className="section-title mt-4">Come explore in person</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-[1.3fr_.7fr]">
            <div className="aspect-4/3 w-full overflow-hidden rounded-[32px] md:aspect-auto md:h-full">
              <img
                src={images.interior}
                alt="Interior furniture collection"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid gap-4">
              <div className="aspect-4/3 w-full overflow-hidden rounded-[24px] md:aspect-auto md:h-full md:min-h-60">
                <img
                  src={images.exterior}
                  alt="Showroom entrance"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-4/3 w-full overflow-hidden rounded-[24px] md:aspect-auto md:h-full md:min-h-60">
                <img
                  src={images.interior}
                  alt="Wooden furniture display"
                  className="h-full w-full object-cover object-right"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
