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

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

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
          <h1 className="font-display text-3xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your furniture catalogue</p>
        </div>
        <Button asChild><Link to="/admin/products/new"><Plus className="h-4 w-4" /> Add Product</Link></Button>
      </div>

      <div className="rounded-xl bg-background p-4 shadow-sm">
        <div className="flex items-center gap-2 rounded-md border border-input px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name..." className="border-0 shadow-none focus-visible:ring-0" />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="py-3 pr-4">Product</th><th className="py-3 pr-4">Category</th><th className="py-3 pr-4">Price</th><th className="py-3 pr-4">Stock</th><th className="py-3 pr-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Loading…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No products found.</td></tr>}
              {filtered.map((p) => (
                <tr key={p.id} className="align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]?.url} alt="" className="h-12 w-12 rounded-md object-cover" />
                      <div>
                        <p className="font-semibold">{p.name} {p.featured && <Star className="inline h-3.5 w-3.5 fill-primary text-primary" />}</p>
                        <p className="text-xs text-muted-foreground">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.category?.name ?? "—"}</td>
                  <td className="py-3 pr-4">{formatPrice(p.price)}</td>
                  <td className="py-3 pr-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${p.stock_status === "in_stock" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{p.stock_status === "in_stock" ? "In stock" : "Out of stock"}</span></td>
                  <td className="py-3 pr-0 text-right">
                    <div className="inline-flex gap-2">
                      <Button asChild variant="outline" size="sm"><Link to="/admin/products/$id/edit" params={{ id: p.id }}><Pencil className="h-3.5 w-3.5" /></Link></Button>
                      <Button variant="outline" size="sm" onClick={() => { if (confirm(`Delete "${p.name}"?`)) del.mutate(p.id); }} disabled={del.isPending}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
