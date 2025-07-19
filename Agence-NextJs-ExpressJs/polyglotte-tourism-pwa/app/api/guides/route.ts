import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const where: any = {
      isActive: true,
    }

    if (country) {
      where.country = {
        slug: country,
      }
    }

    const guides = await prisma.guide.findMany({
      where,
      include: {
        country: true,
        _count: {
          select: {
            reviews: true,
            programs: true,
          },
        },
      },
      orderBy: [{ rating: "desc" }, { totalReviews: "desc" }],
      take: limit,
    })

    return NextResponse.json(guides)
  } catch (error) {
    console.error("Guides fetch error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des guides" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const guide = await prisma.guide.create({
      data: {
        name: data.name,
        email: data.email,
        specialty: data.specialty,
        bio: data.bio,
        avatar: data.avatar,
        experience: data.experience,
        languages: data.languages,
        countryId: data.countryId,
      },
      include: {
        country: true,
      },
    })

    return NextResponse.json(guide)
  } catch (error) {
    console.error("Guide creation error:", error)
    return NextResponse.json({ error: "Erreur lors de la création du guide" }, { status: 500 })
  }
}
