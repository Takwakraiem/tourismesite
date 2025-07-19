import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const messages = await prisma.message.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Messages fetch error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { content } = await request.json()

    const message = await prisma.message.create({
      data: {
        content,
        userId: session.user.id,
        sender: "USER",
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Notify admin of new message (implement with your notification system)
    // await notifyAdminNewMessage(message)

    return NextResponse.json(message)
  } catch (error) {
    console.error("Message creation error:", error)
    return NextResponse.json({ error: "Erreur lors de l'envoi du message" }, { status: 500 })
  }
}
