import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProduct,
});

function NewProduct() {
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link to="/admin/products">
            <ArrowLeft className="h-4 w-4" /> Back to products
          </Link>
        </Button>
        <h1 className="mt-2 font-display text-3xl font-bold">Add Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
