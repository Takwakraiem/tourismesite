"use client"

import { useState } from "react"
import { Search, Filter, MapPin, Calendar, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [budget, setBudget] = useState([500])
  const [date, setDate] = useState<Date>()

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 -mt-8 relative z-10 mx-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search for a destination, activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-40 h-12">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tunis">Tunis</SelectItem>
              <SelectItem value="sousse">Sousse</SelectItem>
              <SelectItem value="djerba">Djerba</SelectItem>
              <SelectItem value="tozeur">Tozeur</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-12 px-4 bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="h-12 px-4 bg-transparent" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700">Search</Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              <Users className="w-4 h-4 inline mr-1" />
              Number of people
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 person</SelectItem>
                <SelectItem value="2">2 people</SelectItem>
                <SelectItem value="3-5">3-5 people</SelectItem>
                <SelectItem value="6+">6+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Budget (TND): {budget[0]}
            </Label>
            <Slider value={budget} onValueChange={setBudget} max={2000} min={100} step={50} className="mt-2" />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Activity type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="culture">Cultural</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="relax">Relaxation</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
