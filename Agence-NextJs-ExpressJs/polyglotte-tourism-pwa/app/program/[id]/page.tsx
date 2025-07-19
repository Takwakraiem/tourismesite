"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Star,
  MapPin,
  Clock,
  Users,
  Phone,
  Mail,
  ArrowLeft,
  Trash,
} from "lucide-react";
import Image from "next/image";

const guides = [
  {
    id: "1",
    name: "Ahmed Ben Ali",
    rating: 4.9,
    image: "/placeholder.svg?height=60&width=60",
    speciality: "Cultural Guide",
  },
  {
    id: "2",
    name: "Fatima Zahra",
    rating: 4.8,
    image: "/placeholder.svg?height=60&width=60",
    speciality: "Historical Guide",
  },
];
type ProgramImage = {
  _id: string;
  url: string;
  alt?: string;
  order?: number;
};
type ProgramInclude = {
  _id: string;
  description: string;
};
interface Comment {
  _id: string;
  content: string;
  userId: { _id: string; name: string };
  programId: string;
  createdAt: string;
}

interface ItineraryDay {
  _id?: string;
  day: number;
  title: string;
  description: string;
  programId: string;
}
interface Review {
  _id: string;
  rating: number;
  comment: string;
  userId: { _id: string; name: string };
  programId: string;
  createdAt: string;
  updatedAt: string;
}

interface LIKE {
  _id: string;
  userId: string;
  programId?: string;
}
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
  reviews: Review[];
  likes: LIKE[];
  images?: ProgramImage[];
  comments?: Comment[];
  description: string;
  category: string;
  maxParticipants: number;
}
export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;
  const [programs, setPrograms] = useState<Program | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const { id } = useParams();
  const [editRating, setEditRating] = useState(0);
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [images, setImages] = useState<ProgramImage[]>([]);
  const [includes, setIncludes] = useState<ProgramInclude[]>([]);
  const [editComment, setEditComment] = useState("");
  const fetchImages = async () => {
    try {
      const res = await fetch(`http://localhost:3500/api/programImage/${id}`);
      const data = await res.json();
      console.log("Fetched images:", data);

      setImages(data);
    } catch (err) {
      console.error("Erreur lors du chargement des images :", err);
    }
  };
  const fetchReviews = async () => {
    const res = await fetch(
      `http://localhost:3500/api/program/${programId}/review`
    );
    const data = await res.json();
    console.log(data);

    setReviews(data);
  };
  const fetchLikes = async () => {
    try {
      const res = await fetch(`http://localhost:3500/api/like/${programId}`);
      const data = await res.json();
      setLikesCount(data.length);
    } catch (error) {
      console.error("Erreur récupération likes:", error);
    }
  };
  const handleLikeToggle = async () => {
    if (!userId) return alert("Vous devez être connecté.");
    try {
      const res = await fetch("http://localhost:3500/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, programId }),
      });

      const data = await res.json();
      setIsLiked(data.liked);
      setLikesCount((prev) => prev + (data.liked ? 1 : -1));
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  };

  const checkUserLike = async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `http://localhost:3500/api/like/check/${userId}/${programId}`
      );
      const data = await res.json();
      console.log(data);

      setIsLiked(data.liked);
    } catch (error) {
      console.error("Erreur vérification like:", error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3500/api/review/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) fetchReviews();
  };

  const handleUpdateReview = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3500/api/review/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating: editRating, comment: editComment }),
    });

    if (res.ok) {
      setEditingId(null);
      fetchReviews();
    }
  };

  const handleCreateReview = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3500/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating: newRating,
        comment: newComment,
        userId,
        programId,
      }),
    });

    if (res.ok) {
      setNewComment("");
      setNewRating(0);
      fetchProgram();
      fetchReviews();
    }
  };

  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || payload.id || null;
    } catch (err) {
      return null;
    }
  };

  const userId = getUserIdFromToken();

  const fetchProgram = async () => {
    try {
      const res = await fetch(`http://localhost:3500/api/program/${id}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Erreur lors de la récupération du programme."
        );
      }

      const data = await res.json();
      setPrograms(data);
      console.log("Programme récupéré :", data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Erreur lors de la récupération :", err.message);
      } else {
        console.error("Erreur inconnue :", err);
      }
    }
  };

  const fetchIncludes = async () => {
    try {
      const res = await fetch(`http://localhost:3500/api/programInclude/${id}`);
      const data = await res.json();
      setIncludes(data);
    } catch (err) {
      console.error("Erreur récupération includes :", err);
    }
  };
  const fetchData = async () => {
    try {
      const res = await fetch(
        "http://localhost:3500/api/itinerary/program/" + id,
        {
          method: "GET",
        }
      );
      const allDays: ItineraryDay[] = await res.json();

      setItineraryDays(allDays);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };
  useEffect(() => {
    fetchImages();
    fetchProgram();
    fetchIncludes();
    fetchData();
    fetchLikes();
    checkUserLike();
    fetchReviews();
  }, [id, userId]);

  if (!programs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">Chargement...</p>
      </div>
    );
  }

  const handleContactAdmin = () => {
    // Open messaging with admin
    router.push("/messages/admin");
  };
  const selectedImage = images[selectedImageIndex];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header c="" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <span className="text-gray-500">Programs / {programs.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <Card>
              <CardContent className="p-0">
                {/* Image principale */}
                <div className="relative">
                  <Image
                    src={
                      selectedImage?.url
                        ? `http://localhost:3500/api/uploads/${selectedImage.url}`
                        : "/placeholder.svg"
                    }
                    alt={selectedImage?.alt || "Program image"}
                    width={600}
                    height={400}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />

                  <div className="absolute top-4 right-4 flex space-x-2">
                    {/* <Button variant="secondary" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button> */}

                    {userId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Like"
                        className={`absolute top-3 right-3 ${
                          isLiked ? "text-red-500" : "text-white"
                        } hover:text-red-500`}
                        onClick={handleLikeToggle}
                      >
                        <Heart
                          className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                        />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Miniatures */}
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((img, index) => (
                      <button
                        key={img._id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index
                            ? "border-blue-500"
                            : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={
                            img.url
                              ? `http://localhost:3500/api/uploads/${img.url}`
                              : "/placeholder.svg"
                          }
                          alt={img.alt || `Image ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {programs.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>
                        {programs.location}, {programs.slug}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{programs.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Max {programs.maxParticipants} people</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>
                          {programs.rating} ({programs.reviews?.length || 0}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {programs.price} TND
                    </div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {programs.description}
                  </p>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Included in the price
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {includes.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {item.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Detailed program
                  </h3>
                  <div className="space-y-3">
                    {itineraryDays.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-16 text-sm font-medium text-blue-600 mr-4">
                          {item.title}
                        </div>
                        <div className="text-gray-700">{item.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Traveler Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                      {programs.rating}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(programs.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500">
                      ({programs.reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <Textarea
                    placeholder="Laissez un avis..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`w-5 h-5 cursor-pointer ${
                          n <= newRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setNewRating(n)}
                      />
                    ))}
                  </div>
                  <Button onClick={handleCreateReview} disabled={!userId}>
                    Publier
                  </Button>
                  {!userId && (
                    <p className="text-sm text-red-500 mt-2">
                      Vous devez être connecté pour publier une review.
                    </p>
                  )}

                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border p-4 rounded bg-white"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {/* Avatar avec la première lettre du nom */}
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full">
                          {review.userId.name &&
                            review.userId.name[0].toUpperCase()}
                        </div>

                        <div>
                          {/* Nom de l'utilisateur */}
                          <p className="font-bold">{review.userId.name}</p>
                        </div>
                      </div>

                      {editingId === review._id ? (
                        <>
                          <Textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            className="mb-2"
                          />
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                className={`w-5 h-5 cursor-pointer ${
                                  n <= editRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={() => setEditRating(n)}
                              />
                            ))}
                          </div>
                          <Button size="sm" onClick={handleUpdateReview}>
                            Enregistrer
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm">{review.comment}</p>
                          {review.userId._id === userId && (
                            <div className="flex gap-2 mt-2">
                              {/* <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingId(review._id);
                                  setEditComment(review.comment);
                                  setEditRating(review.rating);
                                }}
                              >
                                Modifier
                              </Button> */}
                              {/* <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteReview(review._id)}
                              >
                                <Trash className="w-4 h-4" />
                              </Button> */}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            {/* <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Choose your guide
                </h3>
                <div className="space-y-3">
                  {guides.map((guide) => (
                    <div
                      key={guide.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedGuide === guide.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedGuide(guide.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={guide.image || "/placeholder.svg"}
                          />
                          <AvatarFallback>{guide.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{guide.name}</div>
                          <div className="text-sm text-gray-600">
                            {guide.speciality}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{guide.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Need help?</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    +216 70 123 456
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    contact@polyglotte.com
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
