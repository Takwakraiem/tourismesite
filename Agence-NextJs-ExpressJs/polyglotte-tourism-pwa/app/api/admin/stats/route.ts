import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Get various statistics
    const [
      totalUsers,
      activeUsers,
      totalPrograms,
      publishedPrograms,
      totalBookings,
      pendingBookings,
      totalMessages,
      unreadMessages,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      prisma.program.count(),
      prisma.program.count({ where: { status: "PUBLISHED" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.message.count(),
      prisma.message.count({ where: { isRead: false } }),
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: "CONFIRMED" },
      }),
    ])

    // Get popular programs
    const popularPrograms = await prisma.program.findMany({
      take: 5,
      orderBy: { views: "desc" },
      include: {
        country: true,
        _count: {
          select: { bookings: true },
        },
      },
    })

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        program: {
          select: { title: true },
        },
      },
    })

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        growth: activeUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : "0",
      },
      programs: {
        total: totalPrograms,
        published: publishedPrograms,
        draft: totalPrograms - publishedPrograms,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: totalBookings - pendingBookings,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
      },
      revenue: {
        total: totalRevenue._sum.totalPrice || 0,
      },
      popularPrograms,
      recentBookings,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des statistiques" }, { status: 500 })
  }
}
