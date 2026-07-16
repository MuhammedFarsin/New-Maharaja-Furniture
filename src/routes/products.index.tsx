import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { ProductCardV2 } from "@/components/product-card-v2";
import { useCategories, useProducts } from "@/lib/products-db";
import { Navbar } from "@/scenes/navbar";
import Footer from "@/scenes/Footer";

const searchSchema = z.object({
  category: z.string().optional(),
  collection: z.string().optional(),
});

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  component: ProductsPage,
});

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white animate-pulse">
      <div className="aspect-[4/5] bg-neutral-100" />

      <div className="p-4">
        <div className="h-3 w-20 rounded bg-neutral-200" />

        <div className="mt-3 h-5 w-32 rounded bg-neutral-200" />

        <div className="mt-2 h-3 w-24 rounded bg-neutral-200" />

        <div className="mt-5 flex items-center justify-between">
          <div className="h-6 w-20 rounded bg-neutral-200" />

          <div className="h-9 w-9 rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

function ProductsPage() {
  const search = Route.useSearch();

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState(search.category ?? "all");

  const selectedCollection = search.collection ?? null;

  const gridRef = useRef<HTMLDivElement>(null);

  const allCategories = useMemo(
    () => [
      {
        id: "all",
        name: "All",
        slug: "all",
      },
      ...categories,
    ],
    [categories],
  );

  const shown = useMemo(() => {
    return products.filter((p) => {
      const collectionMatch = !selectedCollection || p.collection?.slug === selectedCollection;

      const categoryMatch = categorySlug === "all" || p.category?.slug === categorySlug;

      const searchMatch = p.name.toLowerCase().includes(query.toLowerCase());

      return collectionMatch && categoryMatch && searchMatch;
    });
  }, [products, query, categorySlug, selectedCollection]);

  return (
    <>
      <Helmet>
        <title>Furniture Products | New Maharaja Furniture</title>

        <meta
          name="description"
          content="Browse premium teak wood furniture including sofa sets, cots, wardrobes, dining tables, TV units, mattresses, chairs and custom furniture in Coimbatore."
        />

        <meta
          name="keywords"
          content="teak furniture, wooden furniture, sofa sets, cots, wardrobes, dining tables, TV units, mattresses, Coimbatore furniture"
        />

        <meta property="og:title" content="Furniture Products | Maharaja Furniture" />

        <meta
          property="og:description"
          content="Browse premium teak wood furniture including sofa sets, cots, wardrobes, dining tables, TV units and more."
        />

        <meta property="og:url" content="https://new-maharaja-furniture.vercel.app/products" />

        <meta property="og:type" content="website" />

        <link rel="canonical" href="https://new-maharaja-furniture.vercel.app/products" />
      </Helmet>
      <Navbar />

      <div className="min-h-screen bg-[#fafafa] pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-4">
          {/* Search */}

          <div className="mx-auto mb-6 max-w-md">
            <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
              <Search className="h-5 w-5 text-neutral-400" />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search furniture..."
                className="w-full bg-transparent outline-none"
              />
            </label>
          </div>

          {/* Categories */}

          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-3 pb-2 w-max">
              {allCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCategorySlug(category.slug)}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    categorySlug === category.slug
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}

          <main ref={gridRef}>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : shown.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {shown.map((product) => (
                  <ProductCardV2 key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24">
                <h2 className="text-2xl font-semibold text-neutral-800">No products found</h2>

                <p className="mt-3 text-center text-neutral-500">
                  Try another search or choose a different category.
                </p>

                <button
                  onClick={() => {
                    setQuery("");
                    setCategorySlug("all");
                  }}
                  className="
                  mt-6
                  rounded-full
                  bg-red-600
                  px-6
                  py-3
                  font-medium
                  text-white
                  transition
                  hover:bg-red-700
                "
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductsPage;
