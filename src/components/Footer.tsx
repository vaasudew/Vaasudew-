import React from 'react';
import { 
  Compass, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Car, 
  Navigation,
  ExternalLink 
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#24211D] text-[#E6DFD1] pt-14 pb-24 lg:pb-12 border-t border-[#3B0A11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-stone-700/60">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B1724] to-[#450A12] flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display text-xl font-bold tracking-wider text-white flex items-center gap-1.5 leading-none">
                  HARI TRAVELS
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#D4AF37] block mt-1">
                  Tirupati • Tirumala
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Premium Tirupati and Tirumala travel platform combining instant cab booking, live GPS tracking, and temple-focused tours. Providing safe, respectful, and punctual journeys for pilgrims and families.
            </p>

            <div className="space-y-2.5 text-xs text-stone-300 pt-2">
              <div className="flex items-center space-x-2.5">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <a href="tel:+919959312174" className="hover:text-white transition flex items-center gap-1.5">
                  <span>24/7 Helpline:</span>
                  <span className="font-mono font-bold text-white">+91 99593 12174</span>
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <a 
                  href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20want%20to%20inquire%20about%20a%20cab%20and%20temple%20package%20in%20Tirupati." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] text-[#25D366] font-semibold transition"
                >
                  WhatsApp: +91 99593 12174
                </a>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="leading-snug">Station Road, Near RTC Central Bus Stand, Tirupati, AP 517501</span>
              </div>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider font-display">
              Services
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => setActiveTab('cabs')} className="hover:text-[#D4AF37] transition">
                  Tirupati Cab Booking
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tours')} className="hover:text-[#D4AF37] transition">
                  Tirumala Darshan Packages
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('destinations')} className="hover:text-[#D4AF37] transition">
                  Temple Tourism Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Key Routes Col */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider font-display">
              Popular Routes
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>Tirupati Rly Station → Tirumala Hill (22 km)</li>
              <li>Renigunta Airport (TIR) → Tirumala (38 km)</li>
              <li>Tirupati → Srikalahasti Temple (36 km)</li>
              <li>Tirupati → Kanipakam Varasiddhi (72 km)</li>
              <li>Tirupati → Chandragiri Fort (14 km)</li>
              <li>Tirumala Sacred Theertham Circuit</li>
            </ul>
          </div>

          {/* Official TTD Reference & Compliance Box */}
          <div className="lg:col-span-3 bg-stone-800/80 p-4 rounded-2xl border border-stone-700 text-xs space-y-2.5">
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-bold text-[11px] uppercase tracking-wider">
                Official TTD Link
              </span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Official Tirumala Darshan tokens, Sevas, and pilgrim cottages must be booked exclusively via the official Tirumala Tirupati Devasthanams (TTD) portal.
            </p>
            <a
              href="https://tirupatibalaji.ap.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#D4AF37] hover:underline font-semibold text-[11px] pt-1"
            >
              tirupatibalaji.ap.gov.in <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 text-[11px] text-stone-500 leading-relaxed flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="max-w-4xl">
            <strong>Disclaimer:</strong> Hari Travels is an independent, private travel and cab operator based in Tirupati, Andhra Pradesh. Hari Travels is not affiliated with, authorized by, or endorsed by Tirumala Tirupati Devasthanams (TTD) or the Government of Andhra Pradesh. All temple names and destination details are provided solely for navigational and tourist guidance.
          </p>
          <div className="shrink-0 text-stone-400">
            © {new Date().getFullYear()} Hari Travels. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
