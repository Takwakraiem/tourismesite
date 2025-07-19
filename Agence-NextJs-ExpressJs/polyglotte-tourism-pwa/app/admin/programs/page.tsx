"use client";

import { useEffect, useState } from "react";
import {
  getAllPrograms,
  deleteProgram,
  createProgram,
} from "@/lib/services/programService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Edit2,
  Image,
  ImageDown,
  ImageDownIcon,
  List,
  Plus,
  Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Country = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  programs?: any[];
  guides?: any[];
};
export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    location: "",
    duration: "",
    price: 0,
    maxParticipants: 12,
    country: "",
  });
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // tu peux ajuster
  const ProgramStatusEnum = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
 
  // Calculer les programmes affichés sur la page courante
  const indexOfLastProgram = currentPage * itemsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - itemsPerPage;
  const currentPrograms = programs.slice(
    indexOfFirstProgram,
    indexOfLastProgram
  );

  const totalPages = Math.ceil(programs.length / itemsPerPage);

  const fetchData = async () => {
    try {
      const data = await getAllPrograms();
      setPrograms(data);
      console.log(data);
    } catch (err: any) {
      setError(err.message);
    }
  };
  async function updateProgramStatus(id: string, newStatus: string) {
    const res = await fetch(`http://localhost:3500/api/program/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Échec de la mise à jour du statut");
    }
    return await res.json();
  }

  const handleChangeStatus = async (program: any) => {
    try {
      // Trouver l'index du statut courant
      const currentIndex = ProgramStatusEnum.indexOf(program.status);
      // Trouver le statut suivant (avec boucle)
      const nextIndex = (currentIndex + 1) % ProgramStatusEnum.length;
      const nextStatus = ProgramStatusEnum[nextIndex];

      await updateProgramStatus(program._id, nextStatus);
      await fetchData(); // rafraîchir la liste
    } catch (error: any) {
      setError(error.message);
    }
  };

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
  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer ce programme ?")) {
      try {
        await deleteProgram(id);
        fetchData();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "maxParticipants" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && editingId) {
        await updateProgram(editingId, formData);
      } else {
        await createProgram(formData);
      }

      fetchData();

      setFormData({
        title: "",
        slug: "",
        description: "",
        shortDescription: "",
        location: "",
        duration: "",
        price: 0,
        maxParticipants: 12,
        country: "",
      });

      setShowForm(false);
      setEditMode(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCountries();
  }, []);
  async function updateProgram(id: string, data: any) {
    const res = await fetch(`http://localhost:3500/api/program/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Échec de la mise à jour");
    }

    return await res.json();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Gestion des Programmes
          </h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setShowForm(!showForm);
                    setEditMode(false);
      setEditingId(null);
              setFormData({
                title: "",
                slug: "",
                description: "",
                shortDescription: "",
                location: "",
                duration: "",
                price: 0,
                maxParticipants: 12,
                country: "",
              });
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? "Annuler" : "Nouveau Programme"}
          </Button>
        </div>

        {showForm ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded shadow"
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="title"
                placeholder="Titre"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <Input
                name="slug"
                placeholder="Slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
              <Input
                name="location"
                placeholder="Lieu"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <Input
                name="duration"
                placeholder="Durée"
                value={formData.duration}
                onChange={handleInputChange}
                required
              />
              <Input
                type="number"
                name="price"
                placeholder="Prix"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <Input
                type="number"
                name="maxParticipants"
                placeholder="Participants max"
                value={formData.maxParticipants}
                onChange={handleInputChange}
              />
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

            <Textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <Textarea
              name="shortDescription"
              placeholder="Description courte"
              value={formData.shortDescription}
              onChange={handleInputChange}
            />

            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {editMode ? "Mettre à jour" : "Créer"}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        ) : (
          <Card className="mt-6 bg-white shadow  overflow-hidden ">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Pays</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Inclue</TableHead>
                      <TableHead>Itinéraire</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPrograms.map((program: any) => (
                      <TableRow key={program._id}>
                        <TableCell>{program.title}</TableCell>
                        <TableCell>{program.location}</TableCell>
                        <TableCell>{program.duration}</TableCell>
                        <TableCell>{program.price} TND</TableCell>
                        <TableCell>
                          {program.country?.name || "Inconnu"}
                        </TableCell>
                        <TableCell>{program.status}</TableCell>

                        <TableCell>
                          <Link
                            href={`/admin/programImage/${program._id}`}
                            passHref
                          >
                            <Button variant="secondary" className="mr-2">
                              <Image className="w-4 h-4" />
                              Image
                            </Button>
                          </Link>
                        </TableCell>

                        <TableCell>
                          <Link
                            href={`/admin/programInclude/${program._id}`}
                            passHref
                          >
                            <Button variant="secondary" className="mr-2">
                              <ImageDown className="w-4 h-4" />
                              Inclue
                            </Button>
                          </Link>
                        </TableCell>

                        <TableCell>
                          <Link
                            href={`/admin/itinerary/${program._id}`}
                            passHref
                          >
                            <Button variant="secondary" className="mr-2">
                              <List className="w-4 h-4" />
                              Itinerary
                            </Button>
                          </Link>
                        </TableCell>

                        <TableCell className="flex flex-wrap gap-2">
                          <Button
                            className="mr-2"
                            variant="destructive"
                            onClick={() => handleDelete(program._id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="outline"
                            className="mr-2"
                            onClick={() => {
                              setEditMode(true);
                              setShowForm(true);
                              setEditingId(program._id);
                              setFormData({
                                title: program.title || "",
                                slug: program.slug || "",
                                description: program.description || "",
                                shortDescription:
                                  program.shortDescription || "",
                                location: program.location || "",
                                duration: program.duration || "",
                                price: program.price || 0,
                                maxParticipants: program.maxParticipants || 0,
                                country: program.country?._id || "",
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => handleChangeStatus(program)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-center items-center gap-2 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Précédent
                  </Button>
                  <span className="text-sm text-gray-600">
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
