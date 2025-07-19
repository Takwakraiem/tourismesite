"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Pencil } from "lucide-react";

type ProgramImage = {
  _id: string;
  url: string;
  alt:string;
  order:number
};

export default function ProgramImagePage() {
  const { id } = useParams();
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<ProgramImage[]>([]);
  const [uploadForm, setUploadForm] = useState({ alt: "", order: 0 });
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ alt: "", order: 0 });

  const fetchImages = async () => {
    try {
      const res = await fetch(`http://localhost:3500/api/programImage/${id}`);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Erreur lors du chargement des images :", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return setMessage("Veuillez sélectionner une image.");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("alt", uploadForm.alt);
    formData.append("order", String(uploadForm.order));

    try {
      const res = await fetch(`http://localhost:3500/api/programImage/${id}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l’upload");
      setImage(null);
      setUploadForm({ alt: "", order: 0 });
      setMessage("✅ Image ajoutée !");
      fetchImages();
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Supprimer cette image ?")) return;
    try {
      const res = await fetch(
        `http://localhost:3500/api/programImage/image/${imageId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Erreur suppression");
      fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImageId) return;

    try {
      const res = await fetch(
        `http://localhost:3500/api/programImage/image/${editingImageId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) throw new Error("Erreur mise à jour");
      setEditingImageId(null);
      fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="text-center flex justify-between  mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Gérer les images du programme
        </h2>

        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
      <Card className="mt-6 mb-5">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <Label>Nouvelle image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setImage(e.target.files[0]);
                }}
              />
            </div>
          
          
            <Button type="submit">Ajouter</Button>
            {message && <p className="text-sm mt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>

      {/* Liste des images */}
      <div className="space-y-4">
        {images.map((img) => (
          <Card key={img._id}>
            <CardContent className="p-4 flex items-start gap-4">
              <img
                src={`http://localhost:3500/api/uploads/${img.url}`}
                alt={img.alt || "Image"}
                className="w-32 h-24 object-cover rounded"
              />
              {editingImageId === img._id ? (
                <form onSubmit={handleEditSubmit} className="flex-1 space-y-2">
                  <Label>Alt</Label>
                  <Input
                    value={editForm.alt}
                    onChange={(e) =>
                      setEditForm({ ...editForm, alt: e.target.value })
                    }
                  />
                  <Label>Ordre</Label>
                  <Input
                    type="number"
                    value={editForm.order}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        order: Number(e.target.value),
                      })
                    }
                  />
                  <div className="flex gap-2 mt-2">
                    <Button type="submit">Valider</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingImageId(null);
                        setEditForm({ alt: "", order: 0 });
                        setMessage("");
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex-1">
                  <p>
                    <strong>Alt :</strong> {img.alt || "image"}
                  </p>
                  {/* <p>
                    <strong>Ordre :</strong> {img.order ?? 0}
                  </p> */}
                  <div className="flex gap-2 mt-2">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMessage("");
                        setEditingImageId(img._id);
                        setEditForm({
                          alt: img.alt || "",
                          order: img.order || 0,
                        });
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button> */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(img._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
