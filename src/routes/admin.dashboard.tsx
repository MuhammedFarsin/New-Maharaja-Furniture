import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Tags, Plus } from "lucide-react";
import { useCategories, useProducts } from "@/lib/products-db";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/furniture-data";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl bg-background p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="font-display text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { data: products = [], isLoading: lp } = useProducts();
  const { data: categories = [], isLoading: lc } = useCategories();
  const recent = products.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your showroom inventory</p>
        </div>
        <Button asChild><Link to="/admin/products/new"><Plus className="h-4 w-4" /> Add Product</Link></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total Products" value={lp ? "—" : products.length} icon={Package} />
        <Stat label="Total Categories" value={lc ? "—" : categories.length} icon={Tags} />
        <Stat label="Featured Products" value={lp ? "—" : products.filter((p) => p.featured).length} icon={Package} />
      </div>
      <div className="rounded-xl bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recently added</h2>
          <Link to="/admin/products" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {recent.length === 0 && <p className="py-6 text-sm text-muted-foreground">No products yet. Add your first product.</p>}
          {recent.map((p) => (
            <div key={p.id} className="flex items-center gap-4 py-3">
              <img src={p.images[0]?.url} alt="" className="h-12 w-12 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category?.name ?? "Uncategorised"} · {formatPrice(p.price)}</p>
              </div>
              <Button asChild variant="outline" size="sm"><Link to="/admin/products/$id/edit" params={{ id: p.id }}>Edit</Link></Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
