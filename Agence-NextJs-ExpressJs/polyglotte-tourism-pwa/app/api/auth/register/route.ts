import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, country } = body

    // Validation simple
    if (!name || !email || !password || !country) {
      return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 })
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà." },
        { status: 400 }
      )
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: { 
        name,
        email,
        password: hashedPassword,
        country,
     
      },
      
    })

    // Exclure le mot de passe dans la réponse
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "Utilisateur créé avec succès.",
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json(
      { error: "Erreur interne lors de l'inscription." },
      { status: 500 }
    )
  }
}
