import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useCollections, type Collection } from "@/lib/products-db";
import { slugify } from "@/lib/furniture-data";

export const Route = createFileRoute("/admin/collections")({
  component: CollectionsPage,
});

function CollectionsPage() {
  const { data: collections = [], isLoading } = useCollections();

  const qc = useQueryClient();

  const [editing, setEditing] = useState<Collection | null>(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const invalidate = () =>
    qc.invalidateQueries({
      queryKey: ["collections"],
    });

  const create = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("collections").insert({
        name: name.trim(),
        slug: slugify(name),
      });

      if (error) throw error;
    },

    onSuccess: () => {
      setNewName("");
      invalidate();
    },

    onError: (e: any) => setError(e.message),
  });

  const update = useMutation({
    mutationFn: async (collection: Collection) => {
      const { error } = await supabase
        .from("collections")
        .update({
          name: collection.name.trim(),
          slug: slugify(collection.name),
        })
        .eq("id", collection.id);

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
      const { error } = await supabase.from("collections").delete().eq("id", id);

      if (error) throw error;
    },

    onSuccess: invalidate,

    onError: (e: any) => setError(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Collections</h1>

        <p className="text-sm text-muted-foreground">Organise products into showroom collections</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          setError(null);

          if (newName.trim()) {
            create.mutate(newName);
          }
        }}
        className="flex items-end gap-3 rounded-xl bg-background p-4 shadow-sm"
      >
        <div className="flex-1">
          <Label htmlFor="newcollection">New collection name</Label>

          <Input
            id="newcollection"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Bedroom"
          />
        </div>

        <Button type="submit" disabled={create.isPending || !newName.trim()}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </form>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="rounded-xl bg-background p-4 shadow-sm">
        {isLoading && <p className="py-6 text-center text-muted-foreground">Loading...</p>}

        <ul className="divide-y divide-border">
          {collections.map((collection) => (
            <li key={collection.id} className="flex items-center gap-3 py-3">
              {editing?.id === collection.id ? (
                <>
                  <Input
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        name: e.target.value,
                      })
                    }
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
                    <p className="font-semibold">{collection.name}</p>

                    <p className="text-xs text-muted-foreground">{collection.slug}</p>
                  </div>

                  <Button size="sm" variant="outline" onClick={() => setEditing(collection)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={del.isPending}
                    onClick={() => {
                      if (confirm(`Delete "${collection.name}"?`)) {
                        del.mutate(collection.id);
                      }
                    }}
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
