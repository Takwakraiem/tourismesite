"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Clock, Languages, Star, Trash, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";

interface Guide {
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

export default function GuideDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const guideId = id as string;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [guide, setGuide] = useState<Guide | null>(null);
  const [guidereviews, setReviews] = useState<GuideReview[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

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

  useEffect(() => {
    fetchGuide();
    fetchReviews();
  }, [guideId]);

  const fetchGuide = async () => {
    const res = await fetch(`http://localhost:3500/api/guides/${guideId}`);
    const data = await res.json();
    setGuide(data);
  };

  const fetchReviews = async () => {
    const res = await fetch(
      `http://localhost:3500/api/guideReview/guide/${guideId}`
    );
    const data = await res.json();
    setReviews(data);
  };

  const handleCreateReview = async () => {
    const res = await fetch("http://localhost:3500/api/guideReview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating: newRating,
        comment: newComment,
        userId,
        guideId,
      }),
    });

    if (res.ok) {
      setNewRating(0);
      setNewComment("");
      fetchReviews();
      fetchGuide();
    }
  };

  const handleDeleteReview = async (id: string) => {
    const res = await fetch(`http://localhost:3500/api/guideReview/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) fetchReviews();
  };

  const handleUpdateReview = async () => {
    const res = await fetch(
      `http://localhost:3500/api/guideReview/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: editRating, comment: editComment }),
      }
    );

    if (res.ok) {
      setEditingId(null);
      fetchReviews();
    }
  };

  if (!guide) return <div className="p-6">Chargement du guide...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header c="" />

      <div className="max-w-3xl mx-auto">
        {/* Bouton Retour */}
        <div className="flex items-center mb-6 mt-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <span className="text-gray-500">Guides / {guide.name}</span>
        </div>

        {/* Infos du guide */}
        <Card className="mb-6 hover:shadow-xl transition">
          <Image
            src={
              guide.image
                ? `http://localhost:3500/api/uploads/${guide.image}`
                : "/user1.png"
            }
            alt={guide.name}
            width={800}
            height={200}
            className="w-full h-56 object-cover"
          />
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">{guide.name}</h2>
            <p className="mb-2">{guide.specialty}</p>

            <div className="flex items-center justify-center gap-2 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{guide.rating} / 5</span>
              <span className="text-gray-500">
                ({guide.reviews.length || 0} avis)
              </span>
            </div>

            <p className="text-gray-600 text-sm">{guide.bio}</p>

            <div className="flex justify-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {guide.experience} d'expérience
              </div>
              <div className="flex items-center gap-1">
                <Languages className="w-4 h-4" /> {guide.languages.join(", ")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Avis */}
        <Card className="mb-5">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Laisser un avis</h3>
            <Textarea
              placeholder="Votre commentaire..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3"
            />
            <div className="flex gap-1 mb-3">
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

            <div className="mt-6 space-y-4">
              {guidereviews.map((review) => (
                <div key={review._id} className="p-4 border rounded bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {review.userId.name[0].toUpperCase()}
                    </div>
                    <p className="font-medium">{review.userId.name}</p>
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
                      <p className="text-sm text-gray-700">{review.comment}</p>
                      {review.userId._id === userId && (
                        <div className="flex gap-2 mt-2">
                          {/* <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(review._id);
                              setEditComment(review.comment);
                              setEditRating(review.rating);
                            }}
                          >
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
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
      <Footer />
    </div>
  );
}
