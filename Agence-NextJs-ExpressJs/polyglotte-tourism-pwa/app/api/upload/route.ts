import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier trouvé" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const path = join(process.cwd(), "public/uploads", filename)

    await writeFile(path, buffer)

    return NextResponse.json({
      message: "Fichier uploadé avec succès",
      url: `/uploads/${filename}`,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Erreur lors de l'upload du fichier" }, { status: 500 })
  }
}
