"use client";

import {  useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  MapPin,
  MessageSquare,
  Star,
  Eye,

} from "lucide-react";
import { motion } from "framer-motion";
const programs = [
  {
    id: 1,
    title: "Circuit des Oasis",
    country: "Tunisia",
    price: "450€",
    status: "published",
    views: 1234,
  },
  {
    id: 2,
    title: "Médina de Tunis",
    country: "Tunisia",
    price: "180€",
    status: "published",
    views: 890,
  },
  {
    id: 3,
    title: "Atlas Mountains",
    country: "Morocco",
    price: "680€",
    status: "draft",
    views: 0,
  },
];

const stats = [
  { title: "Utilisateurs actifs", value: "1,234", icon: Users, change: "+12%" },
  { title: "Programmes", value: "45", icon: MapPin, change: "+3%" },
  { title: "Messages", value: "89", icon: MessageSquare, change: "+25%" },
  { title: "Avis moyens", value: "4.8", icon: Star, change: "+0.2%" },
];

export default function AdminDashboard() {
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <stat.icon className="w-8 h-8 text-blue-600 mb-2" />
                          <Badge variant="secondary" className="text-green-600">
                            {stat.change}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6 mt-5">
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">
                        Nouveau utilisateur inscrit
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        Il y a 2h
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Programme publié</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        Il y a 4h
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Nouveau message reçu</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        Il y a 6h
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Programmes populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {programs.slice(0, 3).map((program) => (
                      <div
                        key={program.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-sm">{program.title}</p>
                          <p className="text-xs text-gray-500">
                            {program.country}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{program.views}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
      </div>
    </div>
  );
}
