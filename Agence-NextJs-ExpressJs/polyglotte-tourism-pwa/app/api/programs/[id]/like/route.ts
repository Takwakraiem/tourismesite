import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const existingLike = await prisma.programLike.findUnique({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId: params.id,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.programLike.delete({
        where: {
          userId_programId: {
            userId: session.user.id,
            programId: params.id,
          },
        },
      })
      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.programLike.create({
        data: {
          userId: session.user.id,
          programId: params.id,
        },
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Like toggle error:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du like" }, { status: 500 })
  }
}
