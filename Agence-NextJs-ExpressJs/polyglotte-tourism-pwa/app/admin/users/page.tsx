
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  MapPin,
  MessageSquare,
  Star,
  Plus,
  Edit,
  Trash2,

  XCircle,
  CheckCircle,
  
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
type User = {
  _id: string;
  name: string;
  email: string;
  country: Country;
  createdAt: string;
  is_verified: boolean;
  role: string;
};
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
export default function UsersPage() {
  const [token, setToken] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [success, setSuccess] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);
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
    } 
  };
 
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/login"; 
    } else {
      setToken(storedToken); 
      Findall(storedToken); 
      fetchCountries();
    }
  }, []);
  const Findall = async (storedToken: string) => {
    try {
      const res = await fetch("http://localhost:3500/api/findAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la création.");
      }
      const data = await res.json();
      console.log(data);

      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    role: "USER",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const url = editUser
      ? `http://localhost:3500/api/update/${editUser._id}`
      : "http://localhost:3500/api/registerbyadmin";

    const method = editUser ? "PUT" : "POST";
    const data = {
      name: newUser.name,
      email: newUser.email,
      country: newUser.country,
      role: newUser.role,
      ...(editUser ? {} : { password: newUser.password }),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Erreur.");
      }

      const updatedUser = await res.json();

      if (editUser) {
        setUsers((prev: any) =>
          prev.map((u: any) => (u._id === updatedUser._id ? updatedUser : u))
        );
        setEditUser(null);
        setShowForm(false);
      } else {
        setUsers((prev: any[]) => [...prev, updatedUser]);
        setNewUser({
          name: "",
          email: "",
          password: "",
          country: "",
          role: "USER",
        });
      }
      setError("");
      Findall(token!);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleEdit = (user: any) => {
    setEditUser(user);
    setNewUser(user);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3500/api/deleted/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Échec de la suppression.");
      }
      Findall(token!);
    } catch (err: any) {
      setError(err.message);
    }
  };
 

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
         <div className="flex items-center justify-between ">
              <h2 className="text-2xl font-bold text-gray-800">
                Gestion des utilisateurs
              </h2>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setShowForm((prev) => !prev);
                  setEditUser(null);
                  setSuccess(false);
                  setError("");
                  setNewUser({
                    name: "",
                    email: "",
                    password: "",
                    country: "",
                    role: "USER",
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? "Annuler" : "Nouvel utilisateur"}
              </Button>
            </div>
            {showForm && (
              <Card className="mt-4">
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Votre nom"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@exemple.com"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                          <Label htmlFor="country">Pays</Label>
                          <select
                    id="country"
                          value={newUser.country}
                          onChange={(e) =>
                            setNewUser({ ...newUser, country: e.target.value })
                          }
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
                      <div className="flex-1">
                        <Label htmlFor="role">Rôle</Label>
                        <select
                          id="role"
                          value={newUser.role}
                          onChange={(e) =>
                            setNewUser({ ...newUser, role: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="USER">Utilisateur</option>
                          <option value="ADMIN">Administrateur</option>
                        </select>
                        
                      </div>

                      <div className="flex-1">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={newUser.password}
                          disabled={!!editUser} // on ne modifie pas le mot de passe en mode édition
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm font-semibold">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="text-green-600 text-sm font-semibold">
                        ✅{" "}
                        {editUser
                          ? "Mise à jour réussie !"
                          : "Utilisateur créé avec succès !"}
                      </div>
                    )}

                    <div className="flex justify-between items-center gap-4">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
                      >
                        {editUser ? "Mettre à jour" : "Créer l'utilisateur"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            {!showForm && (
              <div>
                <Card className="mt-6">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Utilisateur
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Pays
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Date d'inscription
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Vérifié
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Active
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentUsers.map((user: any) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-gray-500">
                                  {user.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="secondary">
                                  {user.country?.name || 'Inconnu'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                {format(
                                  new Date(user.createdAt),
                                  "dd MMMM yyyy",
                                  { locale: fr }
                                )}
                              </td>
                              <td className="flex items-center px-6 py-4 whitespace-nowrap">
                                {user.is_verified ? (
                                  <Badge
                                    variant="default"
                                    className="flex items-center gap-1 text-green-700 bg-green-100 border border-green-300"
                                  >
                                    <CheckCircle className="w-4 h-4" /> Vérifié
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="flex items-center gap-1 text-red-600 border-red-400"
                                  >
                                    <XCircle className="w-4 h-4" /> Non vérifié
                                  </Badge>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="secondary">
                                  {user.is_activated ? "Désactivé" : "Activé"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSuccess(false);
                                      setError("");
                                      handleEdit(user);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(user._id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
              </div>
            )}
      </div>
    </div>
  );
}
