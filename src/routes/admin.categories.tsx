import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useCategories, type Category } from "@/lib/products-db";
import { slugify } from "@/lib/furniture-data";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Category | null>(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["categories"] });

  const create = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from("categories")
        .insert({ name: name.trim(), slug: slugify(name) });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewName("");
      invalidate();
    },
    onError: (e: any) => setError(e.message),
  });
  const update = useMutation({
    mutationFn: async (c: Category) => {
      const { error } = await supabase
        .from("categories")
        .update({ name: c.name.trim(), slug: slugify(c.name) })
        .eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: () => {
      setEditing(null);
      invalidate();
    },
    onError: (e: any) => setError(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: any) => setError(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Categories</h1>
        <p className="text-sm text-muted-foreground">Organise furniture into shoppable groups</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          if (newName.trim()) create.mutate(newName);
        }}
        className="flex items-end gap-3 rounded-xl bg-background p-4 shadow-sm"
      >
        <div className="flex-1">
          <Label htmlFor="newcat">New category name</Label>
          <Input
            id="newcat"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Outdoor Furniture"
          />
        </div>
        <Button type="submit" disabled={create.isPending || !newName.trim()}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </form>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="rounded-xl bg-background p-4 shadow-sm">
        {isLoading && <p className="py-6 text-center text-muted-foreground">Loading…</p>}
        <ul className="divide-y divide-border">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center gap-3 py-3">
              {editing?.id === c.id ? (
                <>
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => update.mutate(editing)}
                    disabled={update.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.slug}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setEditing(c)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm(`Delete "${c.name}"?`)) del.mutate(c.id);
                    }}
                    disabled={del.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
