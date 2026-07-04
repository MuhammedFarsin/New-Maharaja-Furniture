import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fallbackProductImage } from "@/lib/furniture-data";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
};

export type ProductImage = {
  id: string;
  url: string;
  storage_path: string | null;
  position: number;
};

export type Product = {
  id: string;
  product_code: string | null;
  name: string;
  slug: string;
  description: string | null;

  category_id: string | null;
  category?: Category | null;

  collection_id: string | null;
  collection?: Collection | null;

  material: string | null;
  dimensions: string | null;
  price: number | null;
  stock_status: string;
  featured: boolean;
  created_at: string;

  images: ProductImage[];
};

function withImages(p: any): Product {
  const imgs = (p.product_images ?? []) as ProductImage[];

  return {
    ...p,

    category: p.categories ?? null,
    collection: p.collections ?? null,

    images: imgs.length
      ? imgs.sort((a, b) => a.position - b.position)
      : [
          {
            id: "fallback",
            url: fallbackProductImage,
            storage_path: null,
            position: 0,
          },
        ],
  };
}

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],

  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase.from("categories").select("*").order("name");

    if (error) throw error;

    return data ?? [];
  },
});

export const collectionsQuery = queryOptions({
  queryKey: ["collections"],

  queryFn: async (): Promise<Collection[]> => {
    const { data, error } = await supabase.from("collections").select("*").order("name");

    if (error) throw error;

    return data ?? [];
  },
});

export const productsQuery = queryOptions({
  queryKey: ["products"],

  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories(*),
        collections(*),
        product_images(*)
      `,
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return (data ?? []).map(withImages);
  },
});

export const productBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],

    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          categories(*),
          collections(*),
          product_images(*)
        `,
        )
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;

      return data ? withImages(data) : null;
    },
  });

export function useCategories() {
  return useQuery(categoriesQuery);
}

export function useCollections() {
  return useQuery(collectionsQuery);
}

export function useProducts() {
  return useQuery(productsQuery);
}

export function useProductBySlug(slug: string) {
  return useQuery(productBySlugQuery(slug));
}
