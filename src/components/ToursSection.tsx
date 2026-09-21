import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Check, 
  X, 
  ShieldCheck, 
  Calendar, 
  Users, 
  Car, 
  Sparkles, 
  ChevronRight,
  Info,
  Phone,
  MessageCircle
} from 'lucide-react';
import { TourPackage } from '../types/travel';
import { TOUR_PACKAGES } from '../data/travelData';

interface ToursSectionProps {
  onSelectTourToBook: (tour: TourPackage) => void;
}

export const ToursSection: React.FC<ToursSectionProps> = ({ onSelectTourToBook }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'temple' | 'nature' | 'heritage'>('all');
  const [activeTourModal, setActiveTourModal] = useState<TourPackage | null>(null);

  const filteredPackages = selectedCategory === 'all'
    ? TOUR_PACKAGES
    : TOUR_PACKAGES.filter(p => p.category === selectedCategory);

  return (
    <section className="py-12 md:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8C6D28]">
            Curated Pilgrimage & Sightseeing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B0A11] mt-1.5">
            Temple Trails & Local Tours
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2.5">
            Thoughtfully planned private cab itineraries based on official TTD routes, giving you flexible darshan wait-time and stress-free mountain journeys.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { id: 'all', label: 'All Experiences' },
              { id: 'temple', label: '🛕 Temple Circuits' },
              { id: 'nature', label: '🌄 Tirumala Waterfalls & Nature' },
              { id: 'heritage', label: '🏰 Historic Palaces & Forts' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#6B1724] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-[#E8DFC8] hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPackages.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-md transition flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {tour.badge && (
                  <span className="absolute top-4 left-4 bg-[#6B1724] text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    {tour.badge}
                  </span>
                )}

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center space-x-2 text-xs text-[#E6DFD1] mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{tour.duration}</span>
                    <span>•</span>
                    <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{tour.vehicle}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white line-clamp-1">
                    {tour.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {tour.tagline}
                  </p>

                  {/* Included highlights */}
                  <div className="mt-4 pt-4 border-t border-[#E8DFC8]/60 space-y-1.5 text-xs text-stone-700">
                    {tour.destinations.slice(0, 3).map((dest, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="truncate">{dest}</span>
                      </div>
                    ))}
                    {tour.destinations.length > 3 && (
                      <span className="text-[11px] text-[#8C6D28] font-semibold block pl-5">
                        +{tour.destinations.length - 3} more destinations
                      </span>
                    )}
                  </div>
                </div>

                {/* Booking & Action */}
                <div className="mt-6 pt-4 border-t border-[#E8DFC8]/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Private Cab
                    </span>
                    <div className="text-sm font-bold text-[#6B1724] mt-1">
                      Direct Driver Quote
                    </div>
                    <span className="text-[10px] text-stone-500">Tolls, Fuel & Permits Incl.</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTourModal(tour)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onSelectTourToBook(tour)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#6B1724] text-white hover:bg-[#58111A] transition flex items-center"
                    >
                      Reserve Tour
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TTD Official Notice Ribbon */}
        <div className="mt-12 bg-white rounded-2xl p-5 border border-[#E8DFC8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-6 h-6 text-[#8C6D28] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#3B0A11]">
                Official TTD Darshan & Temple Information Advisory
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Hari Travels is an independent premium cab and tourism operator. All Tirumala Darshan tokens, Arjitha Sevas, and pilgrim cottages are officially released only on the official Tirumala Tirupati Devasthanams (TTD) portal.
              </p>
            </div>
          </div>
          <a
            href="https://tirupatibalaji.ap.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E8DFC8]/50 text-[#6B1724] border border-[#E8DFC8] text-xs font-bold transition flex items-center"
          >
            Visit Official TTD Portal ↗
          </a>
        </div>
      </div>

      {/* Tour Detail Modal */}
      {activeTourModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DFC8] my-8">
            <div className="relative h-64">
              <img
                src={activeTourModal.image}
                alt={activeTourModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <button
                onClick={() => setActiveTourModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center text-sm"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  {activeTourModal.duration} • {activeTourModal.vehicle}
                </span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">
                  {activeTourModal.title}
                </h3>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6 text-xs">
              <p className="text-stone-700 text-sm leading-relaxed">
                {activeTourModal.tagline}
              </p>

              {/* Itinerary Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D28] mb-3">
                  Trip Itinerary & Timing
                </h4>
                <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DFC8]">
                  {activeTourModal.itinerary.map((step, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#6B1724] border-2 border-white"></span>
                      <span className="text-[10px] font-bold text-[#6B1724]">{step.time}</span>
                      <h5 className="font-bold text-stone-900">{step.activity}</h5>
                      <p className="text-stone-500 mt-0.5">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included vs Excluded */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8DFC8]">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <h5 className="font-bold text-emerald-900 mb-2 flex items-center">
                    <Check className="w-4 h-4 mr-1 text-emerald-600" /> Included Services
                  </h5>
                  <ul className="space-y-1.5 text-stone-700">
                    {activeTourModal.included.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-emerald-600 mr-1.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h5 className="font-bold text-stone-800 mb-2 flex items-center">
                    <X className="w-4 h-4 mr-1 text-rose-500" /> Excluded Services
                  </h5>
                  <ul className="space-y-1.5 text-stone-600">
                    {activeTourModal.excluded.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-rose-400 mr-1.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">{activeTourModal.ttdNotice}</p>
              </div>

              {/* Footer CTA */}
              <div className="pt-4 border-t border-[#E8DFC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Transparent Booking
                  </span>
                  <div className="text-base font-bold text-[#6B1724] mt-1">
                    Direct Driver Rate
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">24/7 Helpline: +91 99593 12174</span>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`https://wa.me/919959312174?text=${encodeURIComponent(`Hello Hari Travels, I am inquiring about the "${activeTourModal.title}" (${activeTourModal.duration}, ${activeTourModal.vehicle}) tour package. Please share details and confirm available cabs.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xs transition flex items-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-1.5 fill-white text-transparent" />
                    WhatsApp (+91 99593 12174)
                  </a>

                  <button
                    onClick={() => {
                      const tour = activeTourModal;
                      setActiveTourModal(null);
                      onSelectTourToBook(tour);
                    }}
                    className="px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#6B1724] to-[#7D1B2A] text-white shadow-md hover:shadow-lg transition flex items-center"
                  >
                    Reserve Now <ChevronRight className="w-4 h-4 ml-1" />
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
