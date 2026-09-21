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
  MessageCircle
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

  const navItems: { id: string; label: string; badge?: string | null }[] = [
    { id: 'home', label: 'Home' },
    { id: 'cabs', label: 'Cabs' },
    { id: 'tours', label: 'Tours' },
    { id: 'destinations', label: 'Destinations' }
  ];

  return (
    <>
      {/* Top Banner: Respectful Trust & 24/7 Helpline & WhatsApp */}
      <header className="bg-[#58111A] text-[#F8F3EA] text-xs py-2 px-4 border-b border-[#7D1B2A]/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-xs">
            <span className="inline-flex items-center text-[#D4AF37] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
              Tirupati & Tirumala Travel Service
            </span>
            <span className="hidden md:inline text-[#E6DFD1]/50">•</span>
            <span className="hidden md:inline text-[#E6DFD1]/90">
              FASTag & Ghat Road Compliant • Dedicated Pilgrim Care
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 text-xs">
            <a 
              href="tel:+919959312174" 
              className="text-[#E6DFD1] hover:text-[#D4AF37] transition flex items-center font-bold font-mono text-[11px] sm:text-xs"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
              +91 99593 12174
            </a>
            <span className="text-[#D4AF37]/50">|</span>
            <a 
              href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20want%20to%20book%20a%20cab%20in%20Tirupati%20%2F%20Tirumala." 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-white bg-[#25D366] hover:bg-[#1EBE5D] px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs transition"
            >
              <MessageCircle className="w-3 h-3 mr-1 fill-white text-transparent" />
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8]/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              onClick={() => { setActiveTab('home'); }} 
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6B1724] to-[#450A12] flex items-center justify-center text-[#D4AF37] shadow-sm border border-[#D4AF37]/30 group-hover:scale-105 transition">
                <Compass className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold tracking-wider text-[#3B0A11] flex items-center gap-1.5">
                  HARI TRAVELS
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C59B27]"></span>
                </span>
                <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8C6D28]">
                  Tirupati • Tirumala
                </span>
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
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                WhatsApp Us
              </a>

              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6B1724] to-[#7D1B2A] text-white shadow-sm hover:shadow-md hover:from-[#58111A] hover:to-[#6B1724] transition flex items-center border border-[#D4AF37]/30"
              >
                <Car className="w-4 h-4 mr-2 text-[#D4AF37]" />
                Book Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden space-x-2">
              <a
                href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20would%20like%20to%20book%20a%20cab%20in%20Tirupati%20%2F%20Tirumala."
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 text-xs font-bold bg-[#25D366] text-white rounded-lg flex items-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onOpenBooking}
                className="px-3 py-1.5 text-xs font-semibold bg-[#6B1724] text-white rounded-lg"
              >
                Book
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#4A453E] hover:bg-[#6B1724]/10"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8DFC8] px-4 pt-2 pb-6 space-y-1 shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-[#6B1724] text-white'
                    : 'text-[#4A453E] hover:bg-black/5'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-[#3B0A11]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 border-t border-[#E8DFC8]/70 mt-2 flex flex-col gap-2">
              <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D28]">Helpline & WhatsApp</div>
                  <div className="text-sm font-bold font-mono text-[#3B0A11]">+91 99593 12174</div>
                </div>
                <div className="flex gap-2">
                  <a
                    href="tel:+919959312174"
                    className="p-2 bg-[#6B1724] text-white rounded-lg"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20would%20like%20to%20inquire%20about%20a%20cab%20in%20Tirupati."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#25D366] text-white rounded-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => {
                  onOpenBooking();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl text-center font-semibold bg-[#6B1724] text-white shadow-xs"
              >
                Book a Cab Now
              </button>
            </div>
          </div>
        )}
      </nav>

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
