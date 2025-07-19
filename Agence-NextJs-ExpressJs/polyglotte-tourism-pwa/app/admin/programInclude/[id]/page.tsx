"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Pencil } from "lucide-react";

type ProgramInclude = {
  _id: string;
  description: string;
};

export default function ProgramIncludePage() {
  const { id: programId } = useParams();
  const router = useRouter();

  const [includes, setIncludes] = useState<ProgramInclude[]>([]);
  const [newInclude, setNewInclude] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Charger les includes
  const fetchIncludes = async () => {
    try {
      const res = await fetch(`http://localhost:3500/api/programInclude/${programId}`);
      const data = await res.json();
      setIncludes(data);
    } catch (err) {
      console.error("Erreur récupération includes :", err);
    }
  };

  useEffect(() => {
    fetchIncludes();
  }, [programId]);

  // Ajouter un include
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInclude.trim()) return;

    try {
      const res = await fetch(`http://localhost:3500/api/programInclude/${programId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newInclude }),
      });

      if (!res.ok) throw new Error("Erreur ajout");
      setNewInclude("");
      fetchIncludes();
    } catch (err) {
      console.error(err);
    }
  };

  // Supprimer
  const handleDelete = async (includeId: string) => {
    if (!confirm("Supprimer cet élément ?")) return;
    try {
      const res = await fetch(`http://localhost:3500/api/programInclude/item/${includeId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur suppression");
      fetchIncludes();
    } catch (err) {
      console.error(err);
    }
  };

  // Modifier
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const res = await fetch(`http://localhost:3500/api/programInclude/item/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: editText }),
      });

      if (!res.ok) throw new Error("Erreur modification");
      setEditingId(null);
      fetchIncludes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Ce qui est inclus dans le programme</h2>
            <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    
      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <Label htmlFor="new-include">Ajouter un point</Label>
        <div className="flex gap-2">
          <Input
            id="new-include"
            value={newInclude}
            onChange={(e) => setNewInclude(e.target.value)}
            placeholder="ex : Hébergement inclus"
          />
          <Button type="submit">Ajouter</Button>
        </div>
      </form>

      <div className="space-y-4">
        {includes.map((item) => (
          <Card key={item._id}>
            <CardContent className="p-4 flex justify-between items-start gap-4">
              {editingId === item._id ? (
                <form onSubmit={handleUpdate} className="flex-1 space-y-2">
                  <Label>Modifier</Label>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button type="submit">Valider</Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>Annuler</Button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="flex-1">{item.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(item._id);
                        setEditText(item.description);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

    
    </div>
  );
}
