import React from 'react';
import { 
  ShieldCheck, 
  Navigation, 
  PhoneCall, 
  HeartHandshake, 
  Clock, 
  Sparkles, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

export const FeaturesTrust: React.FC = () => {
  const pillars = [
    {
      icon: Navigation,
      title: 'Real-Time GPS Tracking',
      description: 'Follow your assigned cab from dispatch to arrival. View live distance in kilometers, driver coordinates, and accurate mountain ETAs.'
    },
    {
      icon: ShieldCheck,
      title: 'Certified Ghat Road Chauffeurs',
      description: 'All Hari Travels drivers possess minimum 5+ years navigating the 1st and 2nd Ghat roads, respecting TTD safety speed governors and 28-min descent rules.'
    },
    {
      icon: PhoneCall,
      title: 'Direct Confirmation & Quotes',
      description: 'Custom quotes confirmed directly with dispatch on +91 99593 12174. TTD FASTag hill tolls and driver allowance handled without surprise charges.'
    },
    {
      icon: HeartHandshake,
      title: 'Pilgrim & Elder-Friendly',
      description: 'Thoughtful assistance for elderly devotees, help with tonsure/pradakshina timings, luggage handling, and wheelchair-accessible vehicle options.'
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8C6D28]">
            The Hari Travels Standard
          </span>
          <h2 className="font-display text-3xl font-bold text-[#3B0A11] mt-1.5">
            Designed for Peace of Mind
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            A pilgrimage should be contemplative and serene. We take care of the transit so your heart can focus on the divine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E8DFC8] flex flex-col justify-between hover:border-[#6B1724]/40 transition"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DFC8] text-[#6B1724] flex items-center justify-center mb-4 shadow-xs">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-stone-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8DFC8]/60 flex items-center text-[11px] font-bold text-[#8C6D28]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Guaranteed Standard
              </div>
            </div>
          ))}
        </div>

        {/* Ghat road advisory banner */}
        <div className="mt-12 bg-gradient-to-r from-[#6B1724] to-[#450A12] text-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37]">
                Safety & Compliance
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold mt-1">
                Navigating Tirumala 1st & 2nd Ghat Roads Safely
              </h3>
              <p className="text-xs text-[#E6DFD1]/85 mt-2 leading-relaxed max-w-2xl">
                The 22 km ascent up the Seshachalam hills features 40+ hairpin bends and strict TTD checkposts. Every vehicle in our fleet is fitted with certified speed governors, commercial mountain insurance, and compliant FASTag clearance.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">Tirumala Ghat Regulations</span>
                <span className="text-sm font-bold text-white block mt-1">28 Mins Min. Ascent</span>
                <span className="text-[10px] text-stone-300 block mt-0.5">TTD Security Toll Checkpoint</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
