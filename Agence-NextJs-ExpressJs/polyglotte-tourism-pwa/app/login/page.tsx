"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { MapPin, Star, Users } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3500/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la connexion.");
      }

      // Sauvegarder token + mail
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.mail);

      // Rediriger selon le rôle
      if (data.role === "ADMIN") {
        window.location.href="/admin";
      } else {
       window.location.href="/countries";
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
 <div className="flex justify-start p-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="text-gray-700 hover:text-black"
          >
            ← Retour
          </Button>
        </div>
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Polyglotte Tourism
          </CardTitle>
          <CardDescription className="text-gray-600">
            Découvrez le Maghreb avec nos experts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
   
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm font-semibold">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
            >
              Se connecter
            </Button>

            <div className="text-center mt-2">
              <Link href="/register" passHref>
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Créer un compte
                </Button>
              </Link>
            </div>
          </form>
          <div className="flex items-center justify-center space-x-4 pt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>1000+ voyageurs</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
