import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/lib/products-db";
import { formatPrice } from "@/lib/furniture-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/products/")({
  component: ProductsList,
});

function ProductsList() {
  const { data: products = [], isLoading } = useProducts();
  const [query, setQuery] = useState("");
  const qc = useQueryClient();

  const filtered = products.filter((p) => {
    const search = query.toLowerCase().trim();

    return (
      p.name.toLowerCase().includes(search) || (p.product_code ?? "").toLowerCase().includes(search)
    );
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your furniture catalogue</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-xl bg-background p-4 shadow-sm">
        <div className="flex items-center gap-2 rounded-md border border-input px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name or product code..."
            className="border-0 shadow-none focus-visible:ring-0"
          />
        </div>

        {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No products found.</p>
        )}

        {/* Mobile / tablet: card layout */}
        {!isLoading && filtered.length > 0 && (
          <div className="mt-4 space-y-3 md:hidden">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-lg border border-border p-3">
                <div className="flex gap-3">
                  <img
                    src={p.images[0]?.url}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {p.name}{" "}
                      {p.featured && (
                        <Star className="inline h-3.5 w-3.5 fill-primary text-primary" />
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{p.slug}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{p.category?.name ?? "—"}</span>
                      <span className="font-medium">{formatPrice(p.price)}</span>
                    </div>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        p.stock_status === "in_stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.stock_status === "in_stock" ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/admin/products/$id/edit" params={{ id: p.id }}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"?`)) del.mutate(p.id);
                    }}
                    disabled={del.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop: table layout */}
        {!isLoading && filtered.length > 0 && (
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4">Product</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Stock</th>
                  <th className="py-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="align-middle">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]?.url}
                          alt=""
                          className="h-12 w-12 rounded-md object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {p.product_code}{" "}
                            {p.featured && (
                              <Star className="inline h-3.5 w-3.5 fill-primary text-primary" />
                            )}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{p.category?.name ?? "—"}</td>
                    <td className="py-3 pr-4">{formatPrice(p.price)}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          p.stock_status === "in_stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.stock_status === "in_stock" ? "In stock" : "Out of stock"}
                      </span>
                    </td>
                    <td className="py-3 pr-0 text-right">
                      <div className="inline-flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to="/admin/products/$id/edit" params={{ id: p.id }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Delete "${p.name}"?`)) del.mutate(p.id);
                          }}
                          disabled={del.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
