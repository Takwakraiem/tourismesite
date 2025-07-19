"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil, Save } from "lucide-react";

interface ItineraryDay {
  _id?: string;
  day: number;
  title: string;
  description: string;
  programId: string;
}

export default function ItineraryPage() {
  const { id } = useParams(); // id = programId
  const router = useRouter();

  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([]);
  const [newDay, setNewDay] = useState<Omit<ItineraryDay, "_id">>({
    day: 1,
    title: "",
    description: "",
    programId: id as string,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<ItineraryDay | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3500/api/itinerary/program/" + id, {
        method: "GET",
      });
      const allDays: ItineraryDay[] = await res.json();
     
      setItineraryDays(allDays);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // 🔼 Ajouter un jour
  const handleAdd = async () => {
    try {
      const res = await fetch("http://localhost:3500/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDay),
      });
      if (res.ok) {
        setNewDay({ day: 1, title: "", description: "", programId: id as string });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 📝 Enregistrer modification
  const handleSave = async () => {
    if (!editingData?._id) return;
    try {
      const res = await fetch(`http://localhost:3500/api/itinerary/${editingData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingData),
      });
      if (res.ok) {
        setEditingId(null);
        setEditingData(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Supprimer un jour
  const handleDelete = async (id: string) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      const res = await fetch(`http://localhost:3500/api/itinerary/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex justify-between mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Itinéraire du programme</h2>

          <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
      {/* Formulaire d'ajout */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           
            <div>
              <Label>Titre</Label>
              <Input
                value={newDay.title}
                onChange={(e) => setNewDay({ ...newDay, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newDay.description}
                onChange={(e) => setNewDay({ ...newDay, description: e.target.value })}
              />
            </div>
          </div>
          <div className="text-right mt-4">
            <Button onClick={handleAdd}>Ajouter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des jours */}
      {itineraryDays.length === 0 ? (
        <p className="text-center text-gray-500">Aucun jour trouvé.</p>
      ) : (
        itineraryDays.map((day) => (
          <Card key={day._id} className="mb-4 shadow-md">
            <CardContent className="p-4">
              {editingId === day._id ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               
                  <Input
                    value={editingData?.title || ""}
                    onChange={(e) => setEditingData({ ...editingData!, title: e.target.value })}
                  />
                  <Input
                    value={editingData?.description || ""}
                    onChange={(e) =>
                      setEditingData({ ...editingData!, description: e.target.value })
                    }
                  />
                  <div className="col-span-3 flex justify-end gap-2">
                    <Button variant="default" onClick={handleSave}>
                      <Save size={16} className="mr-2" />
                      Enregistrer
                    </Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">
                       {day.title} - {day.description}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditingId(day._id!);
                          setEditingData(day);
                        }}
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(day._id!)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
               
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}

   
    </div>
  );
}
