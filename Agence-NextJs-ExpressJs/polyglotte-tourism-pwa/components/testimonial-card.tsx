"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface TestimonialCardProps {
  testimonial: {
    id: string
    name: string
    country: string
    rating: number
    comment: string
    image: string
    program: string
  }
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Image
            src={testimonial.image || "/placeholder.svg"}
            alt={testimonial.name}
            width={60}
            height={60}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-gray-600">{testimonial.country}</p>
          </div>
        </div>

        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>

        <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>

        <Badge variant="outline">{testimonial.program}</Badge>
      </CardContent>
    </Card>
  )
}
