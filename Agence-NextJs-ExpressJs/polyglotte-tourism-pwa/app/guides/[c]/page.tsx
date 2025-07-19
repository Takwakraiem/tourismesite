"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GuideCard } from "@/components/guide-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Star, Languages, ArrowLeft } from "lucide-react";
import { getAllGuidesbyCountryId } from "@/lib/services/guideService";

export default function GuidesPage() {
  const params = useParams();
  const country = params.c as string;
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterSpeciality, setFilterSpeciality] = useState("all");

  const [allGuides, setAllGuides] = useState<any[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const guidesPerPage = 8;

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      const data = await getAllGuidesbyCountryId(country);
      setAllGuides(data);
      setFilteredGuides(data);
      setLoading(false);
    };

    if (params && typeof params.c === "string") {
      fetchGuides();
    }
  }, []);

  const applyFilters = (baseList: any[]) => {
    let updated = [...baseList];

    // Filtrer par spécialité
    if (filterSpeciality !== "all") {
      updated = updated.filter((guide) =>
        guide.speciality?.toLowerCase().includes(filterSpeciality.toLowerCase())
      );
    }

    // Recherche
    if (searchTerm.trim() !== "") {
      updated = updated.filter(
        (guide) =>
          guide.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guide.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guide.country?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Trier
    switch (sortBy) {
      case "rating":
        updated.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        updated.sort(
          (a, b) =>
            Number.parseInt(b.experience || "0") -
            Number.parseInt(a.experience || "0")
        );
        break;
    }

    return updated;
  };

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const updated = applyFilters(allGuides);
    setFilteredGuides(updated);
  }, [searchTerm, sortBy, filterSpeciality, allGuides]);

  // Pagination logic
  const indexOfLastGuide = currentPage * guidesPerPage;
  const indexOfFirstGuide = indexOfLastGuide - guidesPerPage;
  const currentGuides = filteredGuides.slice(
    indexOfFirstGuide,
    indexOfLastGuide
  );
  const totalPages = Math.ceil(filteredGuides.length / guidesPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header c="" />

      {/* ... HERO SECTION ... */}

      <section
        className="relative bg-cover bg-center bg-no-repeat text-white py-32"
        style={{
          backgroundImage:
            "url('https://www.leforem.be/content/dam/leforemhe/fr/images/images-info-m%C3%A9tiers/Fotolia_6929613.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            Nos Guides Experts
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow-md">
            Découvrez nos guides touristiques passionnés et expérimentés
          </p>

          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-300" />
              <span>Note moyenne 4.8/5</span>
            </div>
            <div className="flex items-center">
              <Languages className="w-5 h-5 mr-2 text-teal-300" />
              <span>Multilingues</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher un guide par nom, spécialité,Ville..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Note</SelectItem>
                    <SelectItem value="experience">Expérience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {/* Résultat */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <span className="text-gray-600">
              {filteredGuides.length} guide
              {filteredGuides.length > 1 ? "s" : ""} trouvé
              {filteredGuides.length > 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Chargement des guides...
            </div>
          ) : (
            <>
              {filteredGuides.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                  Aucun guide trouvé.
                </p>
              )}
              {/* Guide Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentGuides.map((guide) => (
                  <GuideCard key={guide._id} guide={guide} showPrice={true} />
                ))}
              </div>
            </>
          )}
          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
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
