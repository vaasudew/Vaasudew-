import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  Car, 
  Navigation, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  Clock, 
  Phone,
  MessageCircle,
  LocateFixed,
  Loader2,
  Crosshair,
  XCircle,
  Search,
  ChevronRight
} from 'lucide-react';
import { LocationPoint, VehicleType } from '../types/travel';
import { POPULAR_LOCATIONS, VEHICLE_OPTIONS, NONE_LOCATION } from '../data/travelData';
import { useLiveLocation, isNoneLocation, isLiveLocation } from '../hooks/useLiveLocation';

interface HeroProps {
  onQuickBook: (pickup: LocationPoint, destination: LocationPoint, vehicle: VehicleType) => void;
  onExploreTours: () => void;
  onExploreDestinations: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onQuickBook,
  onExploreTours,
  onExploreDestinations
}) => {
  const [selectedPickup, setSelectedPickup] = useState<LocationPoint>(POPULAR_LOCATIONS[0]);
  const [selectedDestination, setSelectedDestination] = useState<LocationPoint>(POPULAR_LOCATIONS[3]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('sedan');

  // Search & Live Location states for Hero Instant Reservation Port
  const [pickupSearchQuery, setPickupSearchQuery] = useState<string>('');
  const [destinationSearchQuery, setDestinationSearchQuery] = useState<string>('');
  const [isPickupOpen, setIsPickupOpen] = useState<boolean>(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState<boolean>(false);

  const {
    liveLocation,
    isLoading: isLiveLocationLoading,
    error: liveLocationError,
    requestLiveLocation
  } = useLiveLocation();

  const pickupRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(e.target as Node)) {
        setIsPickupOpen(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(e.target as Node)) {
        setIsDestinationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUseLiveLocationForPickup = async () => {
    const loc = await requestLiveLocation();
    if (loc) {
      setSelectedPickup(loc);
      setPickupSearchQuery('');
      setIsPickupOpen(false);
    }
  };

  const handleUseLiveLocationForDestination = async () => {
    const loc = await requestLiveLocation();
    if (loc) {
      setSelectedDestination(loc);
      setDestinationSearchQuery('');
      setIsDestinationOpen(false);
    }
  };

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickBook(selectedPickup, selectedDestination, selectedVehicle);
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Background Tirumala Temple Image with Devotional Warm Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=85"
          alt="Tirumala Sri Venkateswara Temple"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.88] contrast-[1.05]"
        />
        {/* Multilayer gradient for crystal clear contrast and temple ambience */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/88 to-[#FAF7F2]/75 md:to-[#FAF7F2]/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-[#3B0A11]/30"></div>
        <div className="absolute inset-0 bg-radial from-transparent via-[#FAF7F2]/20 to-[#FAF7F2]/80"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Core Positioning, Temple Identity & Direct Contact */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#6B1724]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5EDDC] text-[11px] sm:text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                <span>Tirumala Hills & Tirupati Private Cabs</span>
              </div>
              <span className="inline-flex items-center text-[11px] sm:text-xs font-bold text-[#6B1724] bg-white/90 backdrop-blur-md px-3 py-1 sm:py-1.5 rounded-full border border-[#E8DFC8] shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#8C6D28]" />
                Hill Certified Chauffeurs
              </span>
            </div>

            {/* Sacred Telugu Govinda Chanting Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/70 text-[#6B1724] shadow-xs backdrop-blur-xs">
              <span className="text-xs sm:text-sm font-serif font-bold text-[#8C6D28]">ఓం నమో వేంకటేశాయ</span>
              <span className="text-amber-400">•</span>
              <span className="text-xs sm:text-sm font-bold text-[#6B1724] font-serif">
                ఏడుకొండలవాడ వేంకటరమణ గోవిందా గోవిందా!
              </span>
            </div>

            <h1 className="font-display tracking-tight text-[#24211D] leading-[1.15] sm:leading-[1.12]">
              <span className="block text-[#8C6D28] font-serif font-bold text-2xl sm:text-4xl lg:text-5xl tracking-wide mb-1 sm:mb-2">
                Govindha
              </span>
              <span className="block text-[#6B1724] font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Safe &amp; Blessed Tirumala Journeys
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-stone-700 max-w-xl leading-relaxed font-medium">
              A serene, respectful travel experience for pilgrims and families. Instant private cab reservations with real-time GPS tracking, 24/7 dedicated support, and verified Ghat road chauffeurs.
            </p>

            {/* Direct Contact & WhatsApp Quick Action Bar */}
            <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-[#D4AF37]/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-xl">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#8C6D28] block">
                  Direct Pilgrim Booking & WhatsApp Helpline
                </span>
                <span className="text-base font-bold font-mono text-[#3B0A11] flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-4 h-4 text-[#6B1724]" />
                  +91 99593 12174
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="tel:+919959312174"
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#6B1724] hover:bg-[#58111A] text-white text-xs font-bold transition flex items-center justify-center shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
                  Call Now
                </a>
                <a
                  href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20would%20like%20to%20book%20a%20cab%20in%20Tirupati%20%2F%20Tirumala."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition flex items-center justify-center shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5 fill-white text-transparent" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Value Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 text-xs">
              <div className="flex items-center space-x-2 text-stone-800 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-[#E8DFC8] shadow-xs">
                <Navigation className="w-4 h-4 text-[#6B1724] shrink-0" />
                <span className="font-semibold text-xs">Live GPS Tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-stone-800 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-[#E8DFC8] shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#8C6D28] shrink-0" />
                <span className="font-semibold text-xs">Ghat Certified Drivers</span>
              </div>
              <div className="flex items-center space-x-2 text-stone-800 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-[#E8DFC8] shadow-xs">
                <Sparkles className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span className="font-semibold text-xs">FASTag & Hill Permits</span>
              </div>
            </div>

            {/* Quick Action links */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={onExploreTours}
                className="px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold text-[#6B1724] bg-white/90 hover:bg-white border border-[#6B1724]/40 shadow-xs transition flex items-center gap-1.5"
              >
                <span>View Curated Temple Trails</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8C6D28] shrink-0" />
              </button>
              <button
                onClick={onExploreDestinations}
                className="px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold text-stone-700 bg-white/90 hover:bg-white border border-stone-300 shadow-xs transition flex items-center gap-1.5"
              >
                <span>Explore Tirumala Sacred Spots</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Booking Box */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E8DFC8] relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#8C6D28]">
                    Instant Reservation
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#3B0A11]">
                    Reserve Your Cab
                  </h3>
                </div>
                <div className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Drivers Available
                </div>
              </div>

              <form onSubmit={handleStartBooking} className="mt-5 space-y-4 text-xs">
                {/* Pickup Location with Search Bar and Live Location Option */}
                <div ref={pickupRef} className="relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#6B1724]" />
                      Pickup Location
                    </label>
                    <button
                      type="button"
                      onClick={handleUseLiveLocationForPickup}
                      disabled={isLiveLocationLoading}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 transition"
                      title="Use real GPS live location from your device"
                    >
                      {isLiveLocationLoading ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin text-emerald-700" />
                      ) : (
                        <Crosshair className="w-2.5 h-2.5 text-emerald-600" />
                      )}
                      <span>Live Location</span>
                    </button>
                  </div>

                  {/* Pickup Search Bar & Current Selection Input */}
                  <div className="relative">
                    <div className="flex items-center space-x-2 px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl focus-within:border-[#6B1724] transition">
                      <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <input
                        type="text"
                        value={isPickupOpen ? pickupSearchQuery : selectedPickup.name}
                        onFocus={() => {
                          setIsPickupOpen(true);
                          setPickupSearchQuery('');
                        }}
                        onChange={(e) => {
                          setPickupSearchQuery(e.target.value);
                          if (!isPickupOpen) setIsPickupOpen(true);
                        }}
                        placeholder="Search pickup, 'live location', or 'none'..."
                        className="bg-transparent text-xs w-full focus:outline-none font-medium text-stone-800 placeholder:text-stone-400"
                      />
                      {isPickupOpen && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsPickupOpen(false);
                            setPickupSearchQuery('');
                          }}
                          className="text-stone-400 hover:text-stone-600 text-[10px] font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Search & Suggestions Dropdown */}
                    {isPickupOpen && (
                      <div className="absolute top-full left-0 right-0 z-40 mt-1 bg-white rounded-2xl shadow-xl border border-[#E8DFC8] max-h-56 overflow-y-auto p-2">
                        {/* Live Location Option Button */}
                        <div
                          onClick={handleUseLiveLocationForPickup}
                          className="p-2 bg-emerald-50/70 hover:bg-emerald-100 rounded-xl cursor-pointer flex items-center justify-between text-xs border border-emerald-200 mb-1 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <LocateFixed className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <div className="font-bold text-emerald-950">📍 Live Location (Browser GPS)</div>
                              <div className="text-[10px] text-emerald-700">Acquire exact coordinates from your device</div>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md">
                            Use GPS
                          </span>
                        </div>

                        {/* None Option */}
                        <div
                          onClick={() => {
                            setSelectedPickup(NONE_LOCATION);
                            setIsPickupOpen(false);
                            setPickupSearchQuery('');
                          }}
                          className="p-2 bg-stone-50 hover:bg-stone-100 rounded-xl cursor-pointer flex items-center justify-between text-xs border border-stone-200 mb-1 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <XCircle className="w-4 h-4 text-stone-400 shrink-0" />
                            <div>
                              <div className="font-bold text-stone-700">— None (Clear / Not Selected) —</div>
                              <div className="text-[10px] text-stone-400">Clear selected pickup point</div>
                            </div>
                          </div>
                          <span className="text-[10px] bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-md">
                            Clear
                          </span>
                        </div>

                        {/* Filtered Popular Locations */}
                        <div className="text-[10px] uppercase font-bold text-stone-400 px-2 pt-1 pb-0.5">
                          Tirupati & Tirumala Landmarks
                        </div>
                        {POPULAR_LOCATIONS.filter(l => 
                          !pickupSearchQuery || 
                          l.name.toLowerCase().includes(pickupSearchQuery.toLowerCase()) || 
                          l.address.toLowerCase().includes(pickupSearchQuery.toLowerCase())
                        ).map((loc) => (
                          <div
                            key={loc.name}
                            onClick={() => {
                              setSelectedPickup(loc);
                              setIsPickupOpen(false);
                              setPickupSearchQuery('');
                            }}
                            className={`p-2 rounded-xl cursor-pointer text-xs flex items-center justify-between transition ${
                              selectedPickup.name === loc.name ? 'bg-[#6B1724]/10 text-[#6B1724] font-bold' : 'hover:bg-[#FAF7F2] text-stone-800'
                            }`}
                          >
                            <div>
                              <div>{loc.name}</div>
                              <div className="text-[10px] text-stone-500 font-normal">{loc.address}</div>
                            </div>
                            {selectedPickup.name === loc.name && (
                              <span className="text-xs text-[#6B1724]">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Context Note */}
                  <div className="flex items-center justify-between mt-1 text-[10px] px-1">
                    <span className={`truncate ${isNoneLocation(selectedPickup) ? 'text-amber-600 font-semibold' : isLiveLocation(selectedPickup) ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                      {isNoneLocation(selectedPickup) ? '⚠️ No pickup selected' : isLiveLocation(selectedPickup) ? '✓ Device GPS live' : selectedPickup.address}
                    </span>
                    {selectedPickup.category !== 'none' && (
                      <button
                        type="button"
                        onClick={() => setSelectedPickup(NONE_LOCATION)}
                        className="text-stone-400 hover:text-red-600 ml-1 shrink-0"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Destination Location with Search Bar and Live Location Option */}
                <div ref={destinationRef} className="relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                      Destination
                    </label>
                    <button
                      type="button"
                      onClick={handleUseLiveLocationForDestination}
                      disabled={isLiveLocationLoading}
                      className="text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 transition"
                      title="Set destination to live GPS coordinates"
                    >
                      {isLiveLocationLoading ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-700" />
                      ) : (
                        <Crosshair className="w-2.5 h-2.5 text-amber-600" />
                      )}
                      <span>Live Location</span>
                    </button>
                  </div>

                  {/* Destination Search Bar & Current Selection Input */}
                  <div className="relative">
                    <div className="flex items-center space-x-2 px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl focus-within:border-[#6B1724] transition">
                      <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <input
                        type="text"
                        value={isDestinationOpen ? destinationSearchQuery : selectedDestination.name}
                        onFocus={() => {
                          setIsDestinationOpen(true);
                          setDestinationSearchQuery('');
                        }}
                        onChange={(e) => {
                          setDestinationSearchQuery(e.target.value);
                          if (!isDestinationOpen) setIsDestinationOpen(true);
                        }}
                        placeholder="Search drop, 'live location', or 'none'..."
                        className="bg-transparent text-xs w-full focus:outline-none font-medium text-stone-800 placeholder:text-stone-400"
                      />
                      {isDestinationOpen && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsDestinationOpen(false);
                            setDestinationSearchQuery('');
                          }}
                          className="text-stone-400 hover:text-stone-600 text-[10px] font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Search & Suggestions Dropdown */}
                    {isDestinationOpen && (
                      <div className="absolute top-full left-0 right-0 z-40 mt-1 bg-white rounded-2xl shadow-xl border border-[#E8DFC8] max-h-56 overflow-y-auto p-2">
                        {/* Live Location Option Button */}
                        <div
                          onClick={handleUseLiveLocationForDestination}
                          className="p-2 bg-amber-50/80 hover:bg-amber-100 rounded-xl cursor-pointer flex items-center justify-between text-xs border border-amber-200 mb-1 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <LocateFixed className="w-4 h-4 text-amber-600 shrink-0" />
                            <div>
                              <div className="font-bold text-amber-950">📍 Live Location (Drop Point)</div>
                              <div className="text-[10px] text-amber-800">Set drop point to current device coordinates</div>
                            </div>
                          </div>
                          <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-md">
                            Use GPS
                          </span>
                        </div>

                        {/* None Option */}
                        <div
                          onClick={() => {
                            setSelectedDestination(NONE_LOCATION);
                            setIsDestinationOpen(false);
                            setDestinationSearchQuery('');
                          }}
                          className="p-2 bg-stone-50 hover:bg-stone-100 rounded-xl cursor-pointer flex items-center justify-between text-xs border border-stone-200 mb-1 transition"
                        >
                          <div className="flex items-center space-x-2">
                            <XCircle className="w-4 h-4 text-stone-400 shrink-0" />
                            <div>
                              <div className="font-bold text-stone-700">— None (Clear / Not Selected) —</div>
                              <div className="text-[10px] text-stone-400">Clear selected destination point</div>
                            </div>
                          </div>
                          <span className="text-[10px] bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-md">
                            Clear
                          </span>
                        </div>

                        {/* Filtered Popular Locations */}
                        <div className="text-[10px] uppercase font-bold text-stone-400 px-2 pt-1 pb-0.5">
                          Tirupati & Tirumala Sacred Spots
                        </div>
                        {POPULAR_LOCATIONS.filter(l => 
                          !destinationSearchQuery || 
                          l.name.toLowerCase().includes(destinationSearchQuery.toLowerCase()) || 
                          l.address.toLowerCase().includes(destinationSearchQuery.toLowerCase())
                        ).map((loc) => (
                          <div
                            key={loc.name}
                            onClick={() => {
                              setSelectedDestination(loc);
                              setIsDestinationOpen(false);
                              setDestinationSearchQuery('');
                            }}
                            className={`p-2 rounded-xl cursor-pointer text-xs flex items-center justify-between transition ${
                              selectedDestination.name === loc.name ? 'bg-[#D4AF37]/20 text-stone-900 font-bold' : 'hover:bg-[#FAF7F2] text-stone-800'
                            }`}
                          >
                            <div>
                              <div>{loc.name}</div>
                              <div className="text-[10px] text-stone-500 font-normal">{loc.address}</div>
                            </div>
                            {selectedDestination.name === loc.name && (
                              <span className="text-xs text-[#8C6D28]">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Context Note */}
                  <div className="flex items-center justify-between mt-1 text-[10px] px-1">
                    <span className={`truncate ${isNoneLocation(selectedDestination) ? 'text-amber-600 font-semibold' : isLiveLocation(selectedDestination) ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                      {isNoneLocation(selectedDestination) ? '⚠️ No drop point selected' : isLiveLocation(selectedDestination) ? '✓ Device GPS live' : selectedDestination.address}
                    </span>
                    {selectedDestination.category !== 'none' && (
                      <button
                        type="button"
                        onClick={() => setSelectedDestination(NONE_LOCATION)}
                        className="text-stone-400 hover:text-red-600 ml-1 shrink-0"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Vehicle Choice */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center">
                    <Car className="w-3.5 h-3.5 mr-1.5 text-[#6B1724]" />
                    Preferred Vehicle
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {VEHICLE_OPTIONS.slice(0, 3).map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVehicle(v.id)}
                        className={`p-2 sm:p-2.5 rounded-xl text-left border transition flex flex-col justify-between min-h-[58px] sm:min-h-[64px] ${
                          selectedVehicle === v.id
                            ? 'border-[#6B1724] bg-[#6B1724]/8 text-[#6B1724] font-bold shadow-xs ring-1 ring-[#6B1724]/30'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 w-full">
                          <span className="font-bold text-xs truncate">{v.name.split(' ')[0]}</span>
                          <Car className="w-3 h-3 text-[#8C6D28] shrink-0" />
                        </div>
                        <div className="text-[10px] text-stone-500 mt-1">
                          {v.passengers} Seats
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#6B1724] to-[#7D1B2A] text-white shadow-md hover:shadow-lg transition flex items-center justify-center border border-[#D4AF37]/30"
                >
                  <Car className="w-4 h-4 mr-2 text-[#D4AF37]" />
                  Select Vehicle & Reserve Cab
                </button>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Zero cancellation fee</span>
                  <span>•</span>
                  <a 
                    href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20would%20like%20to%20check%20cab%20availability%20and%20rates%20in%20Tirupati%20%2F%20Tirumala." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#6B1724] font-bold hover:underline"
                  >
                    Direct WhatsApp: +91 99593 12174
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
