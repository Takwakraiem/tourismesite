"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  Users,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProgramImage {
  _id: string;
  url: string;
  alt?: string;
  order?: number;
}

interface LIKE {
  _id: string;
  userId: string;
  programId?: string;
}

interface Review {
  _id: string;
  comment: string;
  rating: number;
  userId: string;
  programId?: string;
}

interface Comment {
  _id: string;
  content: string;
  userId: { _id: string; name: string };
  programId?: string;
  user?: { name: string }; // pour afficher le nom
  createdAt: string;
}

interface ProgramCardProps {
  program: {
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
  };
  viewMode?: "grid" | "list";
}

export function ProgramCard({ program }: ProgramCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(program.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce commentaire ?"
    );
    if (!confirmDelete) return;
    try {
      await fetch(`http://localhost:3500/api/comments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const handleUpdate = async () => {
    if (!editContent.trim() || !editingId) return;

    try {
      const res = await fetch(
        `http://localhost:3500/api/comments/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editContent }),
        }
      );

      const updated = await res.json();
      setComments((prev) =>
        prev.map((c) =>
          c._id === editingId ? { ...c, content: updated.content } : c
        )
      );
      setEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
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
  const programId = program._id;

  const checkUserLike = async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `http://localhost:3500/api/like/check/${userId}/${programId}`
      );
      const data = await res.json();
      setIsLiked(data.liked);
    } catch (error) {
      console.error("Erreur vérification like:", error);
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

  const fetchLikes = async () => {
    try {
      const res = await fetch(`http://localhost:3500/api/like/${programId}`);
      const data = await res.json();
      setLikesCount(data.length);
    } catch (error) {
      console.error("Erreur récupération likes:", error);
    }
  };
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `http://localhost:3500/api/program/${programId}/comments`
      );
      const data = await res.json();
      console.log(data);

      setComments(data);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires :", err);
    }
  };
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) {
      setShowLoginRequiredModal(true);
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3500/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          programId,
          userId,
          content: commentText,
        }),
      });

      if (!res.ok) throw new Error("Erreur ajout commentaire");
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      console.log(newComment);
      fetchComments();
      setCommentText("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’ajout du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchLikes(), checkUserLike(), fetchComments()]);
      setLoading(false);
    };

    fetchAll();
  }, [programId, userId]);

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <Image
            src={
              program.images?.length
                ? `http://localhost:3500/api/uploads/${program.images[0].url}`
                : "/placeholder.svg"
            }
            alt={program.images?.[0]?.alt || program.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
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
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">
              {program.title}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{program.rating}</span>
              <span className="text-sm text-gray-500">
                ({program.reviews.length || 0})
              </span>
            </div>
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{program.location}</span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {program.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{program.duration} h</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{program.maxParticipants} Max</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">
              {program.price} TND
            </div>
            <div className="text-sm text-gray-500">par personne</div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!token || !userId) {
                setShowLoginRequiredModal(true);
              } else {
                setShowCommentsModal(true);
              }
            }}
            className="flex-1 bg-transparent"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Commentaires
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => router.push(`/program/${program._id}`)}
          >
            Voir détails
          </Button>
        </CardFooter>

        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{likesCount} j’aime</span>
            <span className="cursor-pointer ">
              {comments.length} commentaires
            </span>
          </div>
        </div>
      </Card>

      <Dialog open={showCommentsModal} onOpenChange={setShowCommentsModal}>
        <DialogContent className="max-w-3xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commentaires</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {comments.length === 0 && (
              <p className="text-gray-500 text-sm text-center">
                Aucun commentaire pour le moment.
              </p>
            )}
            <form onSubmit={handleCommentSubmit} className="mt-6 border-t pt-4">
              <Label>Ajouter un commentaire</Label>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Écrivez un commentaire..."
                rows={3}
                className="mb-3"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi..." : "Publier"}
              </Button>
            </form>
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="border p-3 rounded bg-gray-50 text-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full text-lg font-bold">
                    {comment.userId?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-bold">
                      {comment.userId?.name || "Utilisateur"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {comment.createdAt &&
                        new Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(comment.createdAt))}
                    </p>
                  </div>
                </div>

                {/* Affichage ou édition du commentaire */}
                {editingId === comment._id ? (
                  <div>
                    <Textarea
                      className="mb-2"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdate}>
                        Enregistrer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setEditContent("");
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>{comment.content}</p>
                )}

                {/* Actions pour l’auteur */}
                {comment.userId?._id === userId &&
                  editingId !== comment._id && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditContent(comment.content);
                        }}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(comment._id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showLoginRequiredModal}
        onOpenChange={setShowLoginRequiredModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connexion requise</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Vous devez être connecté pour ajouter un commentaire.
          </p>
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLoginRequiredModal(false)}
            >
              Annuler
            </Button>
            <Button onClick={() => router.push("/login")}>Se connecter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
