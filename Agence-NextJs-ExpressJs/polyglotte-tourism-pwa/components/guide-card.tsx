"use client";

import { useState } from "react";
import { Heart, Star, MessageCircle, Languages, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GuideCardProps {
  guide: {
    email: string;
    specialty: string;
    bio: string;
    country: string;
    _id: string;
    name: string;
    rating: number;
    reviews: GuideReview[];
    likes: number;
    languages: string[];
    experience: string;
    image: string;
  };
}
interface GuideReview {
  _id: string;
  rating: number;
  comment: string;
  userId: { _id: string; name: string };
  guideId: string;
  createdAt: string;
  updatedAt: string;
}
export function GuideCard({ guide }: GuideCardProps) {
  const router = useRouter();
  console.log(guide);
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Image
          src={
            guide.image
              ? `http://localhost:3500/api/uploads/${guide.image}`
              : "/user1.png"
          }
          alt={guide.name}
          width={100}
          height={100}
          className="w-full h-48 object-cover"
        />
      </div>

      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg mb-1">{guide.name}</h3>
          <Badge variant="secondary" className="mb-2">
            {guide.specialty}
          </Badge>
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{guide.rating || 0}</span>
            <span className="text-sm text-gray-500">
              ({guide.reviews.length || 0} avis)
            </span>
          </div>
        </div>
        <p className="text-gray-600 text-sm text-center mb-3 line-clamp-2">
          {guide.bio}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-gray-600">
              {guide.experience} d'expérience
            </span>
          </div>
          <div className="flex items-center justify-center">
            <Languages className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-gray-600">{guide.languages.join(", ")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {/* <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <MessageCircle className="w-4 h-4 mr-1" />
          Contacter
        </Button> */}
        <Button
          size="sm"
          onClick={() => router.push(`/guide/${guide._id}`)}
          className="flex-1"
        >
          Voir profil
        </Button>
      </CardFooter>
    </Card>
  );
}
