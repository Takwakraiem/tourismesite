"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import Link from "next/link";
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
export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [country, setcountry] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  useEffect(() => {
    fetchCountries();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword || !name || !country) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3500/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, country }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de l'inscription.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
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
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Créer un compte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ligne 1 : Nom + Pays */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="country">Pays</Label>
                <select
                
                  id="country"
                  value={country}
                  onChange={(e) => setcountry(e.target.value)}
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

            {/* Ligne 2 : Email + Password */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Ligne 3 : Confirmation du mot de passe */}
            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm font-semibold">{error}</div>
            )}

            {success && (
              <div className="text-green-600 text-sm font-semibold">
                ✅ Compte créé avec succès ! Redirection en cours...
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
            >
              S'inscrire
            </Button>

            <div className="text-center mt-2">
              <Link href="/login" passHref>
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Créer un compte
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
