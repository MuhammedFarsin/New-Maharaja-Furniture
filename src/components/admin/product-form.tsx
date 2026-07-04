import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Upload, X, Star, Loader2 } from "lucide-react";

import imageCompression from "browser-image-compression";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { supabase } from "@/integrations/supabase/client";

import { useCategories, useCollections, type Product, type ProductImage } from "@/lib/products-db";

import { slugify } from "@/lib/furniture-data";

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 5;

export type ProductFormValues = {
  product_code: string;
  name: string;
  slug: string;
  description: string;

  category_id: string;
  collection_id: string;

  material: string;
  dimensions: string;
  price: string;

  stock_status: string;
  featured: boolean;
};

export function ProductForm({ existing }: { existing?: Product }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useCategories();
  const { data: collections = [] } = useCollections();

  const [values, setValues] = useState<ProductFormValues>({
    product_code: existing?.product_code ?? "",
    name: existing?.name ?? "",
    slug: existing?.slug ?? "",
    description: existing?.description ?? "",
    category_id: existing?.category_id ?? "",
    collection_id: existing?.collection_id ?? "",
    material: existing?.material ?? "",
    dimensions: existing?.dimensions ?? "",
    price: existing?.price?.toString() ?? "",
    stock_status: existing?.stock_status ?? "in_stock",
    featured: existing?.featured ?? false,
  });

  const [existingImages, setExistingImages] = useState<ProductImage[]>(
    (existing?.images ?? []).filter((img) => img.id !== "fallback"),
  );

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(!existing);

  // Loading state while compressing
  const [compressing, setCompressing] = useState(false);

  // Upload progress (0-100)
  const [compressionProgress, setCompressionProgress] = useState(0);
  useEffect(() => {
    async function generateProductCode() {
      if (!values.category_id || existing) return;

      const category = categories.find((c) => c.id === values.category_id);

      if (!category) return;

      const prefix =
        category.name
          .replace(/[^a-zA-Z]/g, "")
          .toUpperCase()
          .substring(0, 3) || "GEN";

      const { data, error } = await supabase
        .from("products")
        .select("product_code")
        .ilike("product_code", `MF-${prefix}-%`);

      if (error) return;

      const next = (data ?? []).length + 1;

      setValues((prev) => ({
        ...prev,
        product_code: `MF-${prefix}-${String(next).padStart(4, "0")}`,
      }));
    }

    generateProductCode();
  }, [values.category_id, categories]);
  useEffect(() => {
    if (autoSlug) {
      setValues((prev) => ({
        ...prev,
        slug: slugify(prev.name),
      }));
    }
  }, [values.name, autoSlug]);

  // Browser image compression options
  const compressionOptions = {
    maxSizeMB: 0.6,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: "image/webp",
    onProgress: (progress: number) => {
      setCompressionProgress(progress);
    },
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        product_code: values.product_code,

        name: values.name.trim(),
        slug: values.slug.trim() || slugify(values.name),
        description: values.description.trim() || null,

        category_id: values.category_id || null,
        collection_id: values.collection_id || null,

        material: values.material.trim() || null,
        dimensions: values.dimensions.trim() || null,

        price: values.price ? Number(values.price) : null,

        stock_status: values.stock_status,
        featured: values.featured,
      };

      let productId = existing?.id;

      if (productId) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();

        if (error) throw error;
        productId = data.id;
      }

      const currentIds = new Set(existingImages.map((i) => i.id));
      const removedImages = (existing?.images ?? []).filter(
        (img) => img.id !== "fallback" && !currentIds.has(img.id),
      );

      if (removedImages.length > 0) {
        const storagePaths = removedImages
          .map((img) => img.storage_path)
          .filter(Boolean) as string[];

        if (storagePaths.length) {
          await supabase.storage.from("product-images").remove(storagePaths);
        }

        await supabase
          .from("product_images")
          .delete()
          .in(
            "id",
            removedImages.map((img) => img.id),
          );
      }

      let position = existingImages.length;

      for (const file of newFiles) {
        const fileName = `${crypto.randomUUID()}.webp`;
        const storagePath = `${productId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(storagePath, file, {
            contentType: "image/webp",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: signedData, error: signedError } = await supabase.storage
          .from("product-images")
          .createSignedUrl(storagePath, SIGNED_URL_TTL);

        if (signedError) throw signedError;

        const { error: dbError } = await supabase.from("product_images").insert({
          product_id: productId,
          url: signedData.signedUrl,
          storage_path: storagePath,
          position,
        });

        if (dbError) throw dbError;
        position++;
      }

      return productId;
    },
    onSuccess: () => {
      toast.success(existing ? "Product updated successfully!" : "Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      router.navigate({ to: "/admin/products" });
    },
    onError: (err: Error) => {
      console.error(err);
      setError(err.message);
      toast.error(err.message || "Something went wrong.");
    },
  });

  async function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (existingImages.length + newFiles.length + files.length > 10) {
      toast.error("Maximum 10 images are allowed.");
      e.target.value = "";
      return;
    }

    setCompressing(true);
    setCompressionProgress(0);

    try {
      const finalFiles: File[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image.`);
          continue;
        }

        if (file.size > 20 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 20MB.`);
          continue;
        }

        const compressed = await imageCompression(file, compressionOptions);
        const webpFile = new File([compressed], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
          type: "image/webp",
          lastModified: Date.now(),
        });

        finalFiles.push(webpFile);
      }

      setNewFiles((prev) => [...prev, ...finalFiles]);

      if (finalFiles.length > 0) {
        toast.success(
          `${finalFiles.length} image${finalFiles.length > 1 ? "s" : ""} ready for upload.`,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process images.");
    } finally {
      setCompressing(false);
      setCompressionProgress(0);
      e.target.value = "";
    }
  }

  // Extracted select menu styles to ensure consistent design across columns
  const selectClassName =
    "mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        save.mutate();
      }}
      className="space-y-6 max-w-full overflow-x-hidden"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN (Takes up 2/3 space on large viewports) */}
        <div className="space-y-6 lg:col-span-2 rounded-2xl bg-background p-4 sm:p-6 shadow-sm border border-border">
          <div className="space-y-2">
            <Label htmlFor="product_code">Product Code</Label>

            <Input
              id="product_code"
              value={values.product_code}
              readOnly
              className="bg-muted font-mono"
              placeholder="Automatically generated"
            />

            <p className="text-xs text-muted-foreground">
              Product code is generated automatically.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              required
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              required
              value={values.slug}
              onChange={(e) => {
                setAutoSlug(false);
                setValues({ ...values, slug: slugify(e.target.value) });
              }}
            />
            <p className="mt-2 text-xs text-muted-foreground truncate">
              URL: <span className="font-medium">/products/{values.slug || "..."}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={6}
              value={values.description}
              onChange={(e) => setValues({ ...values, description: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={values.material}
                onChange={(e) => setValues({ ...values, material: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                placeholder="72 × 36 × 18 in"
                value={values.dimensions}
                onChange={(e) => setValues({ ...values, dimensions: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Takes up 1/3 space on large viewports) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Product Settings */}
          <div className="space-y-4 rounded-2xl bg-background p-4 sm:p-6 shadow-sm border border-border">
            <div className="space-y-1">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={values.category_id}
                onChange={(e) => setValues({ ...values, category_id: e.target.value })}
                className={selectClassName}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="collection">Collection</Label>
              <select
                id="collection"
                value={values.collection_id}
                onChange={(e) => setValues({ ...values, collection_id: e.target.value })}
                className={selectClassName}
              >
                <option value="">Select Collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={values.price}
                onChange={(e) => setValues({ ...values, price: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="stock">Stock Status</Label>
              <select
                id="stock"
                value={values.stock_status}
                onChange={(e) => setValues({ ...values, stock_status: e.target.value })}
                className={selectClassName}
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer hover:bg-muted/40 transition-colors">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(e) => setValues({ ...values, featured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium select-none">Featured Product</span>
            </label>
          </div>

          {/* Product Images Area */}
          <div className="space-y-5 rounded-2xl bg-background p-4 sm:p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm sm:text-base font-semibold">Product Images</Label>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {existingImages.length + newFiles.length} / 10 Images
              </span>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Existing Images
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="group relative overflow-hidden rounded-xl border bg-muted aspect-square"
                    >
                      <img
                        src={img.url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setExistingImages((prev) => prev.filter((i) => i.id !== img.id))
                        }
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white md:opacity-0 transition group-hover:opacity-100 shadow-sm"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {newFiles.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  New Images
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {newFiles.map((file, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl border bg-muted aspect-square"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/65 px-1.5 py-0.5 text-[9px] text-white truncate text-center">
                        {(file.size / 1024).toFixed(0)} KB
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewFiles((prev) => prev.filter((_, i) => i !== index))}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white md:opacity-0 transition group-hover:opacity-100 shadow-sm"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-muted/30 p-4 sm:p-6 transition hover:border-primary hover:bg-muted text-center">
              {compressing ? (
                <div className="w-full space-y-3 px-2">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-semibold">Compressing Images...</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{ width: `${compressionProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {compressionProgress.toFixed(0)}%
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold">Upload Images</h3>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      Drag & Drop or click to browse files.
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal border-t pt-2 w-full">
                    JPG • PNG • WEBP <br />
                    Auto-compressed down to optimized sizes
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={compressing}
                className="hidden"
                onChange={onFilesChange}
              />
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 animate-in fade-in-50">
          {error}
        </div>
      )}

      {/* Footer Action Bar */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.history.back()}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={save.isPending || compressing}
          className="w-full sm:min-w-[170px]"
        >
          {compressing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Compressing...
            </>
          ) : save.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : existing ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}
