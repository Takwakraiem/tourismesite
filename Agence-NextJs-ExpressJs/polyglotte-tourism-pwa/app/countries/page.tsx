"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Camera, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

export default function CountriesPage() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      fetchCountries(storedToken!);
 
  }, []);

  const fetchCountries = async (storedToken: string) => {
    try {
      const res = await fetch("http://localhost:3500/api/getall", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Erreur lors de la récupération");
      setCountries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Choisissez votre destination
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Sélectionnez le pays que vous souhaitez explorer avec nos guides
            experts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
            {loading ? (
              <p>Chargement...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              countries.map((country, index) => (
                <motion.div
                  key={country._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Link
                    href={`/home/${country._id}`}
                    onClick={() => {
                      localStorage.setItem("selectedCountryId", country._id);
                    }}
                  >
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
                        <div className={` ${country.gradient} `} />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">
                          {country.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {country.description}
                        </p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {country.programs?.length ?? 0} programmes
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{country.guides?.length ?? 0} guides</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
         
        </div>
      </div>
    </div>
  );
}
