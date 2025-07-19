import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const program = await prisma.program.findUnique({
      where: { id: params.id },
      include: {
        country: true,
        images: {
          orderBy: { order: "asc" },
        },
        itinerary: {
          orderBy: { day: "asc" },
        },
        includes: true,
        guides: {
          include: {
            guide: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            reviews: true,
          },
        },
      },
    })

    if (!program) {
      return NextResponse.json({ error: "Programme non trouvé" }, { status: 404 })
    }

    // Increment views
    await prisma.program.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json(program)
  } catch (error) {
    console.error("Program fetch error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération du programme" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    const program = await prisma.program.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        location: data.location,
        duration: data.duration,
        price: data.price,
        maxParticipants: data.maxParticipants,
        status: data.status,
      },
      include: {
        country: true,
        images: true,
        itinerary: true,
        includes: true,
      },
    })

    return NextResponse.json(program)
  } catch (error) {
    console.error("Program update error:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du programme" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.program.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Programme supprimé avec succès" })
  } catch (error) {
    console.error("Program deletion error:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du programme" }, { status: 500 })
  }
}
