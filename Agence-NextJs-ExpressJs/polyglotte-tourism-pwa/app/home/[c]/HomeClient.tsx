"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { ProgramCard } from "@/components/program-card";
import { GuideCard } from "@/components/guide-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Award, ArrowLeft } from "lucide-react";
import { getAllProgramsbyId } from "@/lib/services/programService";
import { Card } from "@/components/ui/card";
import { getAllGuidesbyCountryId } from "@/lib/services/guideService";
import Link from "next/link";
const mockTestimonials = [
  {
    id: "1",
    name: "Marie Dubois",
    country: "France",
    rating: 5,
    comment:
      "Une expérience extraordinaire ! Le guide était passionné et très professionnel.",
    image: "/user2.avif?height=60&width=60",
    program: "Safari Sahara",
  },
  {
    id: "3",
    name: "Marie Dubois",
    country: "France",
    rating: 5,
    comment:
      "Une expérience extraordinaire ! Le guide était passionné et très professionnel.",
    image: "/user.avif?height=60&width=60",
    program: "Safari Sahara",
  },
  {
    id: "2",
    name: "Marco Rossi",
    country: "Italie",
    rating: 5,
    comment: "Magnifique découverte de la Tunisie. Je recommande vivement !",
    image: "/user2.avif?height=60&width=60",
    program: "Sidi Bou Said",
  },
];
interface CountryInfo {
  name: string;
  flag: string;
  hero: string;
  description: string;
}
export default function HomeClientPage({ c }: { c: any }) {
  const params = useParams();
  const router = useRouter();
  const [country, setCountry] = useState<{ name: string } | null>(null);
    const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");

  const [countryId, setCountryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState([]);
  const fetchGuides = async (countryParam: string) => {
    const data = await getAllGuidesbyCountryId(countryParam);
    setGuides(data);
  };
  useEffect(() => {
    let id = params.c;

    // Si params.c est vide ou indéfini, on essaie de le récupérer depuis localStorage
    if (!id || typeof id !== "string") {
      const storedId = localStorage.getItem("selectedCountryId");
      if (storedId) {
        id = storedId;
        // Rediriger proprement avec l’ID trouvé
        router.replace(`/home/${storedId}`);
      } else {
        setError("Aucun pays sélectionné.");
        return;
      }
    }
    getCountryById(id)
    setCountryId(id);
    setLoading(false);
    fetchGuides(id);
    fetchData(id);
    // Tu peux appeler ici fetchCountry ou fetchPrograms si besoin
  }, [params.c, router]);

  const fetchData = async (country: string) => {
    try {
      const data = await getAllProgramsbyId(country);
      setPrograms(data);
      console.log("Country ID:", country);
      console.log("Programs:", data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des programmes.");
    }
  };
 const getCountryInfo = (countryCode: string): CountryInfo => {
    const countryData: Record<string, CountryInfo> = {
      tunisia: {
        name: "Tunisia",
        flag: "🇹🇳",
        hero: "Discover the Pearl of the Mediterranean",
        description:
          "Between sea and desert, Tunisia offers you exceptional diversity",
      },
      morocco: {
        name: "Morocco",
        flag: "🇲🇦",
        hero: "Explore the Kingdom of a Thousand and One Nights",
        description:
          "From the Sahara to the Atlas Mountains, experience a unique adventure",
      },
      algeria: {
        name: "Algeria",
        flag: "🌍",
        hero: "Travel Across the Great Maghreb",
        description:
          "A region rich in history, culture, and breathtaking landscapes",
      },
    };

    const code = countryCode?.toLowerCase();
    return countryData[code] || countryData.tunisia;
  };
  const getAuthHeaders = (isJson = false) => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };
    if (isJson) headers["Content-Type"] = "application/json";
    return headers;
  };

  // Appel API pour récupérer le pays
  const getCountryById = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3500/api/get/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la récupération.");
      }
      const data = await res.json();
      setCountry(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (countryId) {
      getCountryById(countryId);
    }
  }, [countryId]);

  const countryInfo = country ? getCountryInfo(country.name) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header c={params.c as string} />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white py-32"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="text-6xl mb-6">{countryInfo?.flag}</div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            {countryInfo?.hero}
          </h1>
          <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto drop-shadow-md">
            {countryInfo?.description}
          </p>

          <div className="flex justify-center flex-wrap gap-8 text-sm md:text-base">
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 mr-2 text-yellow-300" />
              <span>500+ Programs</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Users className="w-5 h-5 mr-2 text-green-300" />
              <span>50+ Guides</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Award className="w-5 h-5 mr-2 text-pink-300" />
              <span>4.8/5 Stars</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative">
        <div className="max-w-7xl mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Popular Programs */}
      <section className="py-16">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
            <Button variant="ghost" onClick={() => router.push("/countries")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          
          </div>
          <div className="flex items-center justify-between mb-8">
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Popular Programs
              </h2>
              <p className="text-gray-600">
                Discover our most loved experiences
              </p>
            </div>
            <Link href={`/programs/${countryId}`} passHref>
              <Button
                variant="outline"
                className="flex items-center bg-transparent"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {loading ? (
    [1, 2, 3].map((i) => (
      <Card key={i} className="p-4 space-y-4 animate-pulse">
        <div className="h-40 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-300 rounded w-2/3" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </Card>
    ))
  ) : programs.length === 0 ? (
    <div className="col-span-3 text-center text-gray-500 py-10">
      Aucun programme trouvé.
    </div>
  ) : (
    programs.slice(0, 3).map((program: any) => (
      <ProgramCard key={program._id} program={program} />
    ))
  )}
</div>

        </div>
      </section>

      {/* Top Guides */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Top Guides
              </h2>
              <p className="text-gray-600">
                Passionate experts to guide your journey
              </p>
            </div>
            <Link href={`/guides/${countryId}`} passHref>
              <Button
                variant="outline"
                className="flex items-center bg-transparent"
              >
                View All Guides
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {loading ? (
    [1, 2, 3].map((i) => (
      <Card key={i} className="p-4 space-y-4 animate-pulse">
        <div className="h-40 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-300 rounded w-2/3" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </Card>
    ))
  ) : guides.length === 0 ? (
    <div className="col-span-4 text-center text-gray-500 py-10">
      Aucun guide trouvé.
    </div>
  ) : (
    guides.slice(0, 4).map((guide: any) => (
      <GuideCard key={guide._id} guide={guide} />
    ))
  )}
</div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover authentic experiences shared by our customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
