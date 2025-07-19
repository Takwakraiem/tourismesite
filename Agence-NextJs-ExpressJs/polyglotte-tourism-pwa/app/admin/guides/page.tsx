"use client";

import { useEffect, useState } from "react";
import {
  getAllGuides,
  createGuide,
  deleteGuide,
  updateGuide,
  toggleGuideStatus,
} from "@/lib/services/guideService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
type Country = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  gradient?: string;
  image?: string;
  programs?: any[];
  guides?: any[];
};
export default function GuidePage() {
  const [guides, setGuides] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(guides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGuides = guides.slice(startIndex, endIndex);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    bio: "",
    languages: "",
    experience: 0,
    country: ""
  });

  const fetchGuides = async () => {
    const data = await getAllGuides();
    setGuides(data);
  };

  useEffect(() => {
    fetchGuides();
    fetchCountries();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("specialty", formData.specialty);
      form.append("bio", formData.bio);
      form.append("experience", String(formData.experience));
      form.append("country", formData.country);
      form.append("languages", formData.languages); // tu peux parser côté backend
      if (selectedFile) form.append("image", selectedFile);

      if (isEditing && selectedId) {
        await updateGuide(selectedId, form,true);
      } else {
        console.log(form);
        
        await createGuide(form,true);
      }

      fetchGuides();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (guide: any) => {
    setFormData({
      name: guide.name,
      email: guide.email,
      specialty: guide.specialty,
      bio: guide.bio || "",
      languages: guide.languages?.join(", ") || "",
      experience: guide.experience,
      country: guide.country
    });
    setSelectedId(guide._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce guide ?")) {
      await deleteGuide(id);
      fetchGuides();
    }
  };

  const handleToggleStatus = async (id: string) => {
    await toggleGuideStatus(id);
    fetchGuides();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      specialty: "",
      bio: "",
      languages: "",
      experience: 0,
      country: ""
    });
     setSelectedFile(null); 
    setShowForm(false);
    setIsEditing(false);
    setSelectedId(null);
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [countries, setCountries] = useState<Country[]>([]);
  const fetchCountries = async () => {
    try {
      const res = await fetch("http://localhost:3500/api/getall");
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Erreur lors de la récupération");
      setCountries(data);
      console.log("Countries fetched:", data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Gestion des guides
          </h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setShowForm((prev) => !prev);
              setFormData({
                name: "",
                email: "",
                specialty: "",
                bio: "",
                languages: "",
                experience: 0,
                country: ""
               
              });
              setError("");
              setLoading(false);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? "Annuler" : "Nouveau guide"}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {isEditing ? "Modifier le guide" : "Ajouter un guide"}
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Modifiez les informations du guide"
                  : "Remplissez les informations du guide"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom Complet</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specialty">Spécialité</Label>
                    <Input
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Expérience</Label>
                    <Input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="languages">
                      Langues (séparées par virgule)
                    </Label>
                    <Input
                      name="languages"
                      value={formData.languages}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Image du guide</Label>
                    <Input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                    />
                  </div>

                  <div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pays
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Sélectionner un pays --</option>
                        {countries.map((country) => (
                          <option key={country._id} value={country._id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isEditing ? "Mettre à jour" : "Ajouter"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        {!showForm && (
          <>
            {paginatedGuides.length === 0 ? (
              <div className="text-center text-gray-500 mt-10 text-lg">
                Aucun guide disponible pour le moment.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedGuides.map((guide: any) => (
                  <Card key={guide._id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{guide.name}</CardTitle>
                          <CardDescription>
                            {guide.specialty},{guide.country?.name || "Inconnu"}
                          </CardDescription>
                        </div>
                        <Avatar>
                          <AvatarImage
                            src={`http://localhost:3500/api/uploads/${guide.image}`}
                            alt={guide.name || "Inconnu"}
                          />

                          <AvatarFallback>
                            {guide.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>
                        <strong>Email :</strong> {guide.email}
                      </p>
                      <p>
                        <strong>Langues :</strong> {guide.languages?.join(", ")}
                      </p>
                      <p>
                        <strong>Exp :</strong> {guide.experience} ans
                      </p>
                      <p>
                        <strong>Status :</strong>{" "}
                        {guide.isActive ? (
                          <span className="text-green-600 font-semibold">
                            Actif
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            Inactif
                          </span>
                        )}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(guide)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(guide._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(guide._id)}
                        >
                          {guide.isActive ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-700">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
