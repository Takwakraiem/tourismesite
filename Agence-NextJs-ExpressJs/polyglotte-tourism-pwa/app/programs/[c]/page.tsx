"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProgramCard } from "@/components/program-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Filter, Grid, List, Search } from "lucide-react";
import { getAllPrograms, getAllProgramsbyId } from "@/lib/services/programService";
import { Input } from "@/components/ui/input";

interface Program {
  _id: string;
  title: string;
  slug: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  totalReviews: number;
  views: number;
  description: string;
  category: string;
  maxParticipants: number;
  reviews: any[];
  likes: any[];
  comments?: any[];
  images?: any[];
}

export default function ProgramsPage({ c }: { c: any }) {
  const router = useRouter();
  const params = useParams();
  const id = params.c as string
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [searchTerm, setSearchTerm] = useState("");
  const [countryId, setCountryId] = useState<string | null>(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const programsPerPage = 6;

  const fetchData = async () => {
    try {
      const data = await getAllProgramsbyId(id);
      setPrograms(data);
    } catch (err: any) {
      console.error(err.message || "Erreur lors du chargement des programmes.");
    }
  };

useEffect(() => {
  if (c && c.trim() !== "") {
    setCountryId(c);
  } else {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("selectedCountryId");
      if (storedId) setCountryId(storedId);
      else setCountryId(null);
    }
  }
}, [c]);

useEffect(() => {
  // Quand countryId change, on charge les programmes
  if (countryId) {
    fetchData();
  }
}, [countryId]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = programs.filter((p) =>
      p.title.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term) ||
      p.duration.toLowerCase().includes(term) ||
      p.price.toString().includes(term) ||
      p.rating.toString().includes(term) ||
      p.maxParticipants.toString().includes(term) ||
      p.description.toLowerCase().includes(term)
    );

    setFilteredPrograms(filtered);
    setCurrentPage(1); // reset to first page when filter changes
  }, [searchTerm, programs]);

  const handleSort = (value: string) => {
    setSortBy(value);
    const sorted = [...filteredPrograms];

    switch (value) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
  }

      // On applique ensuite les filtres après le tri
  const term = searchTerm.toLowerCase();
  const filtered = sorted.filter((p) =>
    p.title.toLowerCase().includes(term) ||
    p.location.toLowerCase().includes(term) ||
    p.duration.toLowerCase().includes(term) ||
    p.price.toString().includes(term) ||
    p.rating.toString().includes(term) ||
    p.maxParticipants.toString().includes(term) ||
    p.description.toLowerCase().includes(term)
  );

  setFilteredPrograms(filtered);
  setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLast = currentPage * programsPerPage;
  const indexOfFirst = indexOfLast - programsPerPage;
  const currentPrograms = filteredPrograms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header c="" />

      {/* Section Héros */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white py-32"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            Tous Nos Programmes
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
            Découvrez toutes nos expériences uniques et inoubliables à travers la région
          </p>
        </div>
      </section>

      {/* Barre de recherche */}
      <section className="relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher par titre, lieu, durée, prix..."
                  className="pl-10"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {/* Tri */}
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Note</SelectItem>
                    <SelectItem value="price-low">Prix : du + bas au + élevé</SelectItem>
                    <SelectItem value="price-high">Prix : du + élevé au + bas</SelectItem>
                  
                  </SelectContent>
                </Select>

                {/* Mode d'affichage */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Résultats */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <span className="text-gray-600">
              {filteredPrograms.length} programme
              {filteredPrograms.length > 1 ? "s" : ""} trouvé
            </span>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {currentPrograms.map((program) => (
              <ProgramCard
                key={program._id}
                program={program}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                Précédent
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}