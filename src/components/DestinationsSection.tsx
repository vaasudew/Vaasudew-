import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Info, 
  Car, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { Destination } from '../types/travel';
import { DESTINATIONS } from '../data/travelData';

interface DestinationsSectionProps {
  onBookCabToDestination: (dest: Destination) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  onBookCabToDestination
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'tirumala' | 'tirupati' | 'surrounding'>('all');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? DESTINATIONS
    : DESTINATIONS.filter(d => d.category === activeCategory);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8C6D28]">
              Pilgrimage & Heritage Guide
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B0A11] mt-1.5">
              Explore Tirupati & Beyond
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-2xl">
              Factual visitor information based on official TTD documentation, sacred theertham guidelines, and distance details from Tirupati.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Destinations' },
              { id: 'tirumala', label: '⛰️ Tirumala Hills' },
              { id: 'tirupati', label: '🛕 Tirupati Town' },
              { id: 'surrounding', label: '🚗 Surrounding Kshetras' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === tab.id
                    ? 'bg-[#6B1724] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-200/70 border border-[#E8DFC8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-xs hover:shadow-md transition flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                
                <span className="absolute top-3 left-3 bg-[#3B0A11]/85 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                  {dest.tag}
                </span>

                {dest.gallery && (
                  <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/20 flex items-center">
                    📸 {dest.gallery.length} Real Photos
                  </span>
                )}

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[11px] text-[#E6DFD1]/80 block font-serif">
                    {dest.teluguName}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white leading-tight">
                    {dest.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 text-xs text-stone-500 mb-3 pb-3 border-b border-[#E8DFC8]">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#6B1724]" />
                      {dest.distanceFromTirupati}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-[#8C6D28]" />
                      {dest.travelTime}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#E8DFC8]/60 text-[11px] text-stone-600 space-y-1">
                    <div>
                      <strong className="text-stone-800">Hours:</strong> {dest.visitingHours}
                    </div>
                    <div>
                      <strong className="text-stone-800">Attire:</strong> {dest.attire}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E8DFC8] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedDestination(dest);
                      setActiveModalImage(null);
                    }}
                    className="text-xs font-semibold text-[#8C6D28] hover:text-[#6B1724] transition flex items-center"
                  >
                    View Guide & Tips →
                  </button>
                  <button
                    onClick={() => onBookCabToDestination(dest)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#6B1724] hover:bg-[#58111A] text-white transition flex items-center shadow-xs"
                  >
                    <Car className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
                    Book Cab
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination Modal Detail */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DFC8] p-6 space-y-5">
            <div className="relative h-60 sm:h-64 rounded-2xl overflow-hidden bg-stone-900">
              <img 
                src={activeModalImage || selectedDestination.image} 
                alt={selectedDestination.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
              
              <button 
                onClick={() => {
                  setSelectedDestination(null);
                  setActiveModalImage(null);
                }}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs backdrop-blur-xs transition"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  {selectedDestination.tag}
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  {selectedDestination.name}
                </h3>
              </div>
            </div>

            {/* Real photo gallery thumbnails if available */}
            {selectedDestination.gallery && selectedDestination.gallery.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D28] flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 text-[#D4AF37]" /> Real Photographic Views ({selectedDestination.gallery.length})
                  </span>
                  <span className="text-[10px] text-stone-400">Click to switch photo</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {selectedDestination.gallery.map((imgUrl, idx) => {
                    const isSelected = (activeModalImage || selectedDestination.image) === imgUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveModalImage(imgUrl)}
                        className={`relative rounded-xl overflow-hidden h-16 border-2 transition group ${
                          isSelected ? 'border-[#6B1724] ring-2 ring-[#6B1724]/30' : 'border-[#E8DFC8] opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Silathoranam view ${idx + 1}`} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-[#8C6D28] uppercase text-[10px] tracking-wider mb-1">
                  Historical & Spiritual Significance
                </h4>
                <p className="text-stone-700 leading-relaxed">{selectedDestination.significance}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8DFC8]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Visiting Hours</span>
                  <p className="font-semibold text-stone-800">{selectedDestination.visitingHours}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Recommended Time</span>
                  <p className="font-semibold text-stone-800">{selectedDestination.recommendedDuration}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#8C6D28] uppercase text-[10px] tracking-wider mb-2">
                  Things to Know Before You Go
                </h4>
                <ul className="space-y-2">
                  {selectedDestination.thingsToKnow.map((item, idx) => (
                    <li key={idx} className="flex items-start text-stone-600">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedDestination.ttdOfficial && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Official TTD Shrine: For Darshan tokens, accommodation, or Laddu counters, please book via official TTD portal. Hari Travels provides private cab transit and hill parking.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-[#E8DFC8] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Close
                </button>
                <div className="flex items-center space-x-2">
                  <a
                    href={`https://wa.me/919959312174?text=${encodeURIComponent(`Hello Hari Travels, I would like to inquire about cab fare and timing for ${selectedDestination.name} (${selectedDestination.distanceFromTirupati} from Tirupati). Please share available vehicles and rates.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center shadow-xs transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5 fill-white text-transparent" />
                    WhatsApp Us
                  </a>
                  <button
                    onClick={() => {
                      const dest = selectedDestination;
                      setSelectedDestination(null);
                      onBookCabToDestination(dest);
                    }}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#6B1724] text-white hover:bg-[#58111A] flex items-center shadow-xs transition"
                  >
                    <Car className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
                    Book Cab
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
