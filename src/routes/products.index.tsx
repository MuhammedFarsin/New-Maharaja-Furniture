import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { z } from "zod";

import { ProductCard } from "@/components/product-card";
import { useCategories, useCollections, useProducts } from "@/lib/products-db";
import { Navbar } from "@/scenes/navbar";
import Footer from "@/scenes/Footer";

const searchSchema = z.object({
  category: z.string().optional(),
  collection: z.string().optional(),
});

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Teak Furniture Collection | Maharaja Furniture" },
      {
        name: "description",
        content:
          "Browse teak beds, sofas, dining tables, wardrobes, chairs and custom furniture from Maharaja Furniture.",
      },
    ],
  }),
  component: ProductsPage,
});

// ─── Minimalist Editorial Skeleton ───────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm">
      {/* Image */}
      <div className="flex h-[320px] items-center justify-center bg-[#f7f7f7] sm:h-[360px] lg:h-[400px]">
        <img
          src="/images/maharaja-logo.webp"
          alt="Loading"
          className="h-24 w-auto animate-pulse opacity-20 lg:h-32"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4 h-3 w-20 animate-pulse rounded-full bg-neutral-200" />

        <div className="mb-4 h-7 w-40 animate-pulse rounded bg-neutral-200" />

        <div className="mb-8 h-8 w-28 animate-pulse rounded bg-neutral-200" />

        <div className="flex items-center gap-3">
          <div className="h-11 flex-1 animate-pulse rounded-full bg-neutral-200" />

          <div className="h-11 w-11 animate-pulse rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────
function ProductsPage() {
  const search = Route.useSearch();

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState<string>(search.category ?? "all");
  const selectedCollection = search.collection ?? null;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  const allCategories = useMemo(
    () => [{ id: "all", name: "All", slug: "all" }, ...categories],
    [categories],
  );

  const shown = useMemo(
    () =>
      products.filter(
        (p) =>
          (!selectedCollection || p.collection?.slug === selectedCollection) &&
          (categorySlug === "all" || p.category?.slug === categorySlug) &&
          p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [products, query, categorySlug, selectedCollection],
  );

  const handleCategory = (slug: string) => {
    setCategorySlug(slug);
    setDrawerOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="showroom-font min-h-screen bg-white text-[#1d1d1f] antialiased">
        {/* ── Mobile Filter Drawer Backdrop ────────────────── */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* ── Mobile Filter Drawer ───────────────────────────── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-white px-8 py-12 border-r border-neutral-100 transition-transform duration-400 ease-out lg:hidden ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Collections
            </p>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {allCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategory(c.slug)}
                className={`w-full text-left py-3.5 px-4 rounded-xl text-[14px] transition-all ${
                  categorySlug === c.slug
                    ? "bg-[#1d1d1f] text-white font-medium"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {c.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main Layout Body Wrapper ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* ── Desktop Sidebar Filter Frame ── */}
            <aside className="hidden lg:block w-64 shrink-0 bg-white border border-neutral-100/80 rounded-3xl p-6 shadow-sm sticky top-28">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                <span className="text-[13px] font-bold uppercase tracking-wider text-[#1d1d1f]">
                  Filters
                </span>
                <SlidersHorizontal className="h-4 w-4 text-neutral-400 stroke-[1.5]" />
              </div>

              <div className="space-y-4">
                <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Category
                </p>
                <nav className="flex flex-col gap-1">
                  {allCategories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategorySlug(c.slug)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-[14px] transition-all duration-200 ${
                        categorySlug === c.slug
                          ? "bg-red-600 text-white font-medium shadow-sm"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-[12px] text-neutral-400 font-medium tracking-wide">
                <span>Total Items</span>
                <span className="bg-neutral-50 text-neutral-800 px-2.5 py-0.5 rounded-md font-bold border border-neutral-200/40">
                  {isLoading ? "—" : shown.length}
                </span>
              </div>
            </aside>

            {/* ── Grid Content Frame ── */}
            <main ref={gridRef} className="flex-1 w-full">
              <div className="flex items-center justify-between gap-4 mb-8 bg-white pb-4 border-b border-neutral-100/60">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-[13px] font-semibold tracking-wide text-black border border-neutral-200 rounded-full px-4 py-2 hover:bg-neutral-50"
                >
                  <SlidersHorizontal className="h-4 w-4 stroke-[1.5]" />
                  <span>Filters</span>
                </button>

                <div className="flex-1 lg:max-w-xs ml-auto">
                  <label className="flex items-center gap-2 bg-neutral-50 border border-neutral-200/60 focus-within:border-neutral-300 focus-within:bg-white rounded-full px-4 py-2 transition-all w-full">
                    <Search className="h-4 w-4 text-neutral-400 shrink-0 stroke-[1.5]" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-transparent text-[13px] text-black outline-none placeholder:text-neutral-400"
                      placeholder="Search items..."
                      aria-label="Search products"
                    />
                  </label>
                </div>
              </div>

              {/* ── Product Catalog Matrix ── */}
              {isLoading ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : shown.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {shown.map((p) => (
                    <div
                      key={p.id}
                      className="showroom-item w-full flex flex-col justify-start bg-white rounded-3xl"
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center max-w-sm mx-auto">
                  <p className="text-[20px] text-black font-light">
                    No items matched your exploration
                  </p>
                  <p className="mt-2 text-[13px] text-neutral-400 font-light">
                    Try adjusting your active filter collections.
                  </p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setCategorySlug("all");
                    }}
                    className="mt-6 inline-flex h-9 items-center px-5 rounded-full bg-[#1d1d1f] text-white text-[12px] font-medium tracking-wide hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
