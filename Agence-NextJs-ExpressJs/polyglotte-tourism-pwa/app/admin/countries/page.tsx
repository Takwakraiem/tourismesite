"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users, MapPin, Plus, Trash2, Pencil } from "lucide-react";

type Country = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  programs?: any[];
  guides?: any[];
};

export default function CountryPage() {
  const [token, setToken] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: null as File | null,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/login";
    } else {
      setToken(storedToken);
    }

    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await fetch("http://localhost:3500/api/getall");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la récupération");
      setCountries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmitCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("slug", formData.slug);
    form.append("description", formData.description);
    if (formData.image) form.append("image", formData.image);

    try {
      const url = editingCountryId
        ? `http://localhost:3500/api/updateCountry/${editingCountryId}`
        : "http://localhost:3500/api/add";

      const method = editingCountryId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      setResponse(editingCountryId ? `✅ Modifié : ${data.name}` : `✅ Ajouté : ${data.name}`);
      setShowForm(false);
      setEditingCountryId(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: null,
      });
      fetchCountries();
    } catch (err: any) {
      setResponse(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (country: Country) => {
    setEditingCountryId(country._id);
    setFormData({
      name: country.name,
      slug: country.slug,
      description: country.description || "",
      image: null,
    });
    setShowForm(true);
    setResponse("");
  };

  const handleConfirmDelete = (id: string, name: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le pays "${name}" ?`)) {
      handleDeleteCountry(id);
    }
  };

  const handleDeleteCountry = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3500/api/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Échec de la suppression.");
      }
      fetchCountries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Gestion des pays</h2>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingCountryId(null);
              setFormData({
                name: "",
                slug: "",
                description: "",
                image: null,
              });
              setResponse("");
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? "Annuler" : "Nouveau pays"}
          </Button>
        </div>

        {showForm && (
          <Card className="max-w-xl mt-6 mx-auto">
            <form onSubmit={handleSubmitCountry} className="space-y-4 p-6">
              <div>
                <Label>Nom</Label>
                <Input
                  name="name"
                  placeholder="Nom du pays"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  name="slug"
                  placeholder="ex: france"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  name="description"
                  placeholder="Brève description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Image {editingCountryId && "(laisser vide pour ne pas changer)"}</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Envoi..." : editingCountryId ? "Modifier" : "Ajouter"}
              </Button>
              {response && (
                <p className="text-sm mt-2 text-center text-gray-700">{response}</p>
              )}
            </form>
          </Card>
        )}

        {!showForm && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {countries.map((country) => (
              <Card
                key={country._id}
                className="group hover:shadow-lg transition-transform transform hover:scale-105 bg-white/80 backdrop-blur rounded-xl overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={
                      country.image
                        ? `http://localhost:3500/api/uploads/${country.image}`
                        : "/placeholder.svg"
                    }
                    alt={country.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                 
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(country)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleConfirmDelete(country._id, country.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">
                    {country.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{country.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{country.programs?.length ?? 0} programmes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{country.guides?.length ?? 0} guides</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
