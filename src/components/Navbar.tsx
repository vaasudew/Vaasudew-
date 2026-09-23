import React, { useState } from 'react';
import { 
  Car, 
  Compass, 
  MapPin, 
  Calendar, 
  Phone, 
  Menu, 
  X, 
  ShieldCheck, 
  Navigation, 
  UserCheck, 
  LayoutDashboard,
  Radio,
  MessageCircle,
  Search
} from 'lucide-react';
import { RideBooking } from '../types/travel';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeBooking: RideBooking | null;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeBooking,
  onOpenBooking
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchItems = [
    { name: 'Tirumala Balaji Darshan', telugu: 'శ్రీవారి దర్శనం', category: 'temple', tab: 'destinations', hint: 'Sri Venkateswara Swamy Temple' },
    { name: 'Padmavathi Ammavari Temple', telugu: 'పద్మావతి అమ్మవారు', category: 'temple', tab: 'destinations', hint: 'Tiruchanur' },
    { name: 'Kanipakam Vinayaka Temple', telugu: 'కాణిపాకం వినాయకుడు', category: 'temple', tab: 'destinations', hint: 'Swayambhu Varasiddhi Vinayaka' },
    { name: 'Srikalahasti Temple', telugu: 'శ్రీకాళహస్తి', category: 'temple', tab: 'destinations', hint: 'Rahu Kethu Sarpa Dosha Nivarana' },
    { name: 'Sedan Cabs (Swift Dzire / Etios)', telugu: 'సెడాన్ క్యాబ్', category: 'cab', tab: 'cabs', hint: '₹12/km - AC sedan' },
    { name: 'SUV Cabs (Innova Crysta)', telugu: 'ఇన్నోవా క్రిస్టా', category: 'cab', tab: 'cabs', hint: '₹18/km - 6-7 Seater Luxury' },
    { name: 'Tirupati Local 1-Day Tour', telugu: 'తిరుపతి లోకల్ టూర్', category: 'tour', tab: 'tours', hint: '7 Famous Temples in 1 Day' },
    { name: 'Ghat Road Cab to Tirumala', telugu: 'ఘాట్ రోడ్ క్యాబ్', category: 'cab', tab: 'ride-booking', hint: 'Alipiri / Railway Station Pickup' }
  ];

  const filteredSearchItems = searchQuery.trim() === ''
    ? searchItems
    : searchItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.telugu.includes(searchQuery) ||
        item.hint.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const navItems: { id: string; label: string; badge?: string | null }[] = [
    { id: 'home', label: 'Home' },
    { id: 'ride-booking', label: 'Book Ride' },
    { id: 'cabs', label: 'Cabs' },
    { id: 'tours', label: 'Tours' },
    { id: 'destinations', label: 'Destinations' }
  ];

  return (
    <>
      {/* Top Banner: Respectful Trust & 24/7 Helpline & WhatsApp & Admin */}
      <header className="bg-[#58111A] text-[#F8F3EA] text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#7D1B2A]/40">
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-1.5 sm:space-x-3 text-[10px] sm:text-xs min-w-0">
            <span className="inline-flex items-center text-[#D4AF37] font-semibold truncate">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#D4AF37] shrink-0" />
              <span className="truncate">Tirupati & Tirumala Travel Service</span>
            </span>
            <span className="hidden md:inline text-[#E6DFD1]/50">•</span>
            <span className="hidden md:inline text-[#E6DFD1]/90">
              FASTag & Ghat Road Compliant • Dedicated Pilgrim Care
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 text-xs shrink-0">
            <a 
              href="tel:+919959312174" 
              className="text-[#E6DFD1] hover:text-[#D4AF37] transition flex items-center font-bold font-mono text-[10px] sm:text-xs"
            >
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-[#D4AF37]" />
              +91 99593 12174
            </a>
            <span className="text-[#D4AF37]/50 hidden sm:inline">|</span>
            <button
              onClick={() => setActiveTab('admin')}
              className={`hover:text-[#D4AF37] transition flex items-center font-semibold text-[10px] sm:text-xs cursor-pointer ${
                activeTab === 'admin' ? 'text-[#D4AF37] font-bold' : 'text-[#E6DFD1]'
              }`}
              title="Admin Login & Ride Dashboard"
            >
              <ShieldCheck className="w-3 h-3 mr-0.5 sm:mr-1 text-[#D4AF37]" />
              <span>Admin</span>
            </button>
            <span className="text-[#D4AF37]/50 hidden sm:inline">|</span>
            <a 
              href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20want%20to%20book%20a%20cab%20in%20Tirupati%20%2F%20Tirumala." 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center text-white bg-[#25D366] hover:bg-[#1EBE5D] px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs transition"
            >
              <MessageCircle className="w-3 h-3 mr-1 fill-white text-transparent" />
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8]/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo, Govinda Nama Shankhachakra Symbol & Search Magnifying Glass Icon */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0 min-w-0">
              <div 
                onClick={() => { setActiveTab('home'); }} 
                className="flex items-center space-x-1.5 sm:space-x-2.5 cursor-pointer group shrink-0"
              >
                {/* Govinda Nama Shankhachakra Symbol Emblem */}
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-[#6B1724] to-[#450A12] flex items-center justify-center text-[#D4AF37] shadow-sm border border-[#D4AF37]/40 group-hover:scale-105 transition shrink-0 p-0.5 sm:p-1"
                  title="శ్రీ వేంకటేశ్వర శంఖ చక్ర నామం (Govinda Nama Shankhachakra Symbol)"
                >
                  <svg 
                    viewBox="0 0 64 36" 
                    className="w-6 h-3.5 sm:w-8 sm:h-4.5 lg:w-8.5 lg:h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Govinda Nama Shankhachakra Symbol"
                  >
                    <defs>
                      <linearGradient id="govindaGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF4BD" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#AA7C11" />
                      </linearGradient>
                      <linearGradient id="kumkumRed" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FF5252" />
                        <stop offset="100%" stopColor="#B71C1C" />
                      </linearGradient>
                    </defs>

                    {/* Sacred Shankha (Divine Conch) on Left */}
                    <g transform="translate(1, 3)">
                      <path
                        d="M14 6 C13 2, 8 1, 5 4 C2 7, 2 13, 5 18 C7 21, 10 24, 11 27 C12 28, 13 28, 14 27 C15 25, 14 20, 15 17 C16 13, 17 9, 14 6 Z"
                        fill="url(#govindaGold)"
                      />
                      <path
                        d="M7 6 C9 4, 12 5, 13 8 C14 11, 12 15, 10 18 C8 20, 7 17, 7 14 Z"
                        fill="#FFF9E6"
                        opacity="0.9"
                      />
                      <circle cx="9" cy="8" r="1.4" fill="url(#govindaGold)" />
                    </g>

                    {/* Sacred Govinda Tirunamam (Urdhva Pundra) in Center */}
                    <g transform="translate(22, 2)">
                      {/* Left Wing (Sacred Lotus Feet of the Lord) */}
                      <path
                        d="M4 2 C4 10, 5 18, 9 24 C9.5 25, 10.5 25, 11 24 C10 18, 9 10, 9 2 C9 1, 4 1, 4 2 Z"
                        fill="#FFFFFF"
                      />
                      {/* Right Wing */}
                      <path
                        d="M16 2 C16 10, 15 18, 11 24 C10.5 25, 9.5 25, 9 24 C10 18, 11 10, 11 2 C11 1, 16 1, 16 2 Z"
                        fill="#FFFFFF"
                      />
                      {/* Base Padmapitham */}
                      <path
                        d="M7 23 C9 26, 11 26, 13 23 C11 25, 9 25, 7 23 Z"
                        fill="#FFFFFF"
                      />
                      {/* Central Vermilion Sri Churnam (Goddess Lakshmi Tilakam) */}
                      <path
                        d="M9.2 6 C9.2 14, 9.5 21, 10 25 C10.5 21, 10.8 14, 10.8 6 C10.8 5, 9.2 5, 9.2 6 Z"
                        fill="url(#kumkumRed)"
                      />
                      <circle cx="10" cy="4" r="1.3" fill="url(#kumkumRed)" />
                    </g>

                    {/* Sacred Sudarshana Chakra (Divine Discus) on Right */}
                    <g transform="translate(43, 3)">
                      <circle cx="10" cy="14" r="9" stroke="url(#govindaGold)" strokeWidth="1.8" fill="none" />
                      <circle cx="10" cy="14" r="4.5" fill="url(#govindaGold)" />
                      <circle cx="10" cy="14" r="2" fill="#3B0A11" />
                      {/* Radial rays / divine flames */}
                      <path d="M10 3 L10 5.5 M10 22.5 L10 25 M-1 14 L1.5 14 M18.5 14 L21 14" stroke="url(#govindaGold)" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M4 8 L5.8 9.8 M14.2 18.2 L16 20 M4 20 L5.8 18.2 M14.2 9.8 L16 8" stroke="url(#govindaGold)" strokeWidth="1.6" strokeLinecap="round" />
                    </g>
                  </svg>
                </div>

                {/* Search Magnifying Glass Icon next to Govinda Nama Shankhachakra Symbol */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchOpen(true);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-amber-50/70 hover:from-amber-100 hover:to-[#D4AF37]/20 text-[#6B1724] hover:text-[#3B0A11] border border-[#D4AF37]/60 shadow-2xs hover:shadow-xs transition flex items-center justify-center group/search shrink-0 cursor-pointer"
                  title="Search Tirupati temples, tours, and cabs"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C6D28] group-hover/search:text-[#6B1724] group-hover/search:scale-110 transition stroke-[2.25]" />
                </button>

                <div className="flex flex-col justify-center">
                  <span className="font-display text-base sm:text-xl lg:text-2xl font-bold tracking-wider text-[#3B0A11] flex items-center gap-1 sm:gap-1.5 leading-none whitespace-nowrap">
                    HARI TRAVELS
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C59B27] shrink-0"></span>
                  </span>
                  <span className="text-[8px] sm:text-[10px] lg:text-[11px] tracking-[0.16em] sm:tracking-[0.2em] uppercase font-semibold text-[#8C6D28] leading-tight mt-0.5 sm:mt-1 whitespace-nowrap">
                    Tirupati • Tirumala
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center relative ${
                      isActive 
                        ? 'text-[#6B1724] font-semibold bg-[#6B1724]/8' 
                        : 'text-[#4A453E] hover:text-[#6B1724] hover:bg-black/4'
                    }`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6B1724] text-white flex items-center animate-pulse">
                        <Radio className="w-2.5 h-2.5 mr-0.5" />
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <a
                href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20would%20like%20to%20book%20a%20cab%20in%20Tirupati%20%2F%20Tirumala."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition flex items-center"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                WhatsApp Us
              </a>

              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6B1724] to-[#7D1B2A] text-white shadow-sm hover:shadow-md hover:from-[#58111A] hover:to-[#6B1724] transition flex items-center border border-[#D4AF37]/30"
              >
                <Car className="w-4 h-4 mr-2 text-[#D4AF37] shrink-0" />
                Book Now
              </button>
            </div>

            {/* Mobile Menu Button & Quick Actions - Perfectly Aligned */}
            <div className="flex items-center lg:hidden space-x-1.5 sm:space-x-2 shrink-0">
              <a
                href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20would%20like%20to%20book%20a%20cab%20in%20Tirupati%20%2F%20Tirumala."
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-auto sm:px-2.5 sm:py-1.5 text-xs font-bold bg-[#25D366] text-white rounded-xl flex items-center justify-center shadow-xs"
                title="WhatsApp Us"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600 shrink-0" />
                <span className="hidden sm:inline ml-1 text-[11px]">WhatsApp</span>
              </a>
              <button
                onClick={onOpenBooking}
                className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs font-bold bg-[#6B1724] text-white rounded-xl shadow-xs flex items-center gap-1 shrink-0"
              >
                <Car className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Book</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-[#4A453E] hover:bg-[#6B1724]/10 transition flex items-center justify-center shrink-0 border border-stone-200 sm:border-transparent"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Icons and Options Properly Aligned */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8DFC8] px-4 pt-2 pb-6 space-y-1.5 shadow-lg">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition ${
                    isActive
                      ? 'bg-[#6B1724] text-white shadow-xs'
                      : 'text-[#4A453E] hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.id === 'home' && <Compass className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#8C6D28]'}`} />}
                    {item.id === 'ride-booking' && <Navigation className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#6B1724]'}`} />}
                    {item.id === 'cabs' && <Car className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#8C6D28]'}`} />}
                    {item.id === 'tours' && <Calendar className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#8C6D28]'}`} />}
                    {item.id === 'destinations' && <MapPin className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#6B1724]'}`} />}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-[#3B0A11]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-[#E8DFC8]/70 mt-2 flex flex-col gap-2">
              <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D28]">Helpline & WhatsApp</div>
                  <div className="text-sm font-bold font-mono text-[#3B0A11]">+91 99593 12174</div>
                </div>
                <div className="flex gap-2">
                  <a
                    href="tel:+919959312174"
                    className="p-2 bg-[#6B1724] text-white rounded-lg flex items-center justify-center"
                    title="Direct Call"
                  >
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                  </a>
                  <a
                    href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20would%20like%20to%20inquire%20about%20a%20cab%20in%20Tirupati."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#25D366] text-white rounded-lg flex items-center justify-center"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => {
                  onOpenBooking();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl text-center font-semibold bg-[#6B1724] text-white shadow-xs flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4 text-[#D4AF37]" />
                <span>Book a Cab Now</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-stone-700 bg-white border border-[#E8DFC8] hover:bg-stone-50 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#8C6D28]" />
                <span>Admin Login & Dispatch Portal</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Quick Search Modal Dialog */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 pt-16 sm:pt-24 animate-fadeIn"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="w-full max-w-xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#D4AF37]/40 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="p-4 bg-gradient-to-r from-[#6B1724] to-[#58111A] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2]/15 flex items-center justify-center text-[#D4AF37]">
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Search Hari Travels
                  </h3>
                  <p className="text-[10px] text-[#D4AF37]/90">
                    Tirupati & Tirumala Temples, Tour Packages & Cabs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg text-[#FAF7F2]/80 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-[#E8DFC8]">
              <div className="relative">
                <Search className="w-5 h-5 text-[#8C6D28] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Tirumala, Kanipakam, Sedan cab, Innova, Tours..."
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-[#E8DFC8] focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/10 text-sm font-medium text-stone-900 placeholder:text-stone-400 outline-hidden transition shadow-inner"
                />
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 self-center mr-1">
                  Popular:
                </span>
                {[
                  { label: 'Tirumala Balaji', q: 'Tirumala' },
                  { label: 'Kanipakam', q: 'Kanipakam' },
                  { label: 'Srikalahasti', q: 'Srikalahasti' },
                  { label: 'Sedan Cab', q: 'Sedan' },
                  { label: 'Innova Crysta', q: 'Innova' }
                ].map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => setSearchQuery(tag.q)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#6B1724] border border-[#D4AF37]/30 font-medium transition cursor-pointer"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filteredSearchItems.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500">
                  No matching destinations or cab services found for "{searchQuery}".
                </div>
              ) : (
                filteredSearchItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full p-3 rounded-xl hover:bg-stone-100/80 transition flex items-center justify-between text-left group/item cursor-pointer border border-transparent hover:border-[#E8DFC8]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover/item:bg-[#6B1724]/10 flex items-center justify-center text-[#6B1724] transition shrink-0">
                        {item.category === 'cab' ? (
                          <Car className="w-4 h-4" />
                        ) : item.category === 'tour' ? (
                          <Compass className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover/item:text-[#6B1724] transition flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <span className="text-[10px] font-normal text-stone-500 font-sans">
                            ({item.telugu})
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {item.hint}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#8C6D28] group-hover/item:underline shrink-0">
                      View →
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="p-3 bg-stone-100/60 border-t border-[#E8DFC8] flex items-center justify-between text-[11px] text-stone-500">
              <span>Hari Travels • Dedicated 24/7 Tirupati Pilgrimage Support</span>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  onOpenBooking();
                }}
                className="font-bold text-[#6B1724] hover:underline"
              >
                Book Custom Cab →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E8DFC8] py-2 px-3 flex justify-around items-center lg:hidden shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'home' ? 'text-[#6B1724] font-bold' : 'text-stone-500'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          Home
        </button>
        <button
          onClick={() => setActiveTab('cabs')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'cabs' ? 'text-[#6B1724] font-bold' : 'text-stone-500'
          }`}
        >
          <Car className="w-5 h-5 mb-0.5" />
          Cabs
        </button>
        <a
          href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20would%20like%20to%20book%20a%20cab%20in%20Tirupati%20%2F%20Tirumala."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-[10px] font-bold text-emerald-600"
        >
          <MessageCircle className="w-5 h-5 mb-0.5" />
          WhatsApp
        </a>
        <button
          onClick={() => setActiveTab('tours')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'tours' ? 'text-[#6B1724] font-bold' : 'text-stone-500'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          Tours
        </button>
        <button
          onClick={onOpenBooking}
          className="flex items-center justify-center px-3.5 py-1.5 rounded-full bg-[#6B1724] text-[#D4AF37] font-semibold text-xs shadow-sm"
        >
          Book
        </button>
      </div>
    </>
  );
};
