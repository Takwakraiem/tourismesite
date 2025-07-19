"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"pending" | "success" | "error">("pending")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("❌ Lien de vérification invalide ou manquant.")
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:3500/api/verify-email?token=${token}`)
        const data = await res.json()
        
        if (!res.ok) {
          throw new Error(data.message || "Échec de la vérification.")
          console.log("Erreur de vérification :", data.message);
        }
    console.log("Erreur de vérification :", data.message);
        setStatus("success")
        setMessage("🎉 Email vérifié avec succès ! Vous allez être redirigé...")
        setTimeout(() => router.push("/login"), 3000)
      } catch (err: any) {
        setStatus("error")
        setMessage(err.message || "Une erreur s'est produite.")
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6">
        {status === "pending" && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
            <h1 className="text-xl font-bold text-gray-700">Vérification en cours...</h1>
            <p className="text-gray-500">Nous validons votre adresse email, un instant...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
            <h1 className="text-2xl font-bold text-green-700">Email vérifié !</h1>
            <p className="text-gray-600">{message}</p>
               <Link href="/login" passHref>
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                >
                Se connecter maintenant
                </Button>
              </Link>
          
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-red-700">Échec de vérification</h1>
            <p className="text-gray-600">{message}</p>
               <Link href="/register" passHref>
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                >
                   Créer un nouveau compte
                </Button>
              </Link>
          
          </>
        )}
      </div>
    </div>
  )
}
