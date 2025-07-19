"use client"

import { Globe, Mail, Phone, Instagram, Youtube, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
             
              <div>
                <h3 className="text-xl font-bold">Polyglotte Tourism</h3>
                <p className="text-sm text-gray-400">Votre agence de voyage</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Découvrez le Maghreb avec nos guides experts et nos programmes sur mesure. Une expérience authentique vous
              attend.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">contact@polyglotte-tourism.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">+216 70 123 456</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Programmes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Guides
                </a>
              </li>
             
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Polyglotte Tourism. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
