import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";
import { supabase } from "@/integrations/supabase/client";
import { fallbackProductImage } from "@/lib/furniture-data";
import type { Product, ProductImage } from "@/lib/products-db";

export const Route = createFileRoute("/admin/products/$id/edit")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*), product_images(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const imgs = (data.product_images ?? []) as ProductImage[];
      return {
        ...data,
        category: data.categories ?? null,
        images: imgs.length ? imgs.sort((a, b) => a.position - b.position) : [{ id: "fallback", url: fallbackProductImage, storage_path: null, position: 0 }],
      } as Product;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-3"><Link to="/admin/products"><ArrowLeft className="h-4 w-4" /> Back to products</Link></Button>
        <h1 className="mt-2 font-display text-3xl font-bold">Edit Product</h1>
      </div>
      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {!isLoading && !data && <p className="text-muted-foreground">Product not found.</p>}
      {data && <ProductForm existing={data} />}
    </div>
  );
}
