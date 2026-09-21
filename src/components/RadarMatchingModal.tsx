import React, { useState, useEffect } from 'react';
import { Radio, CheckCircle2, ShieldCheck, Car, Star } from 'lucide-react';
import { DriverInfo, VehicleOption } from '../types/travel';
import { DEMO_DRIVERS } from '../data/travelData';

interface RadarMatchingModalProps {
  vehicle: VehicleOption;
  pickupName: string;
  onDriverMatched: (matchedDriver: DriverInfo, otp: string) => void;
  onCancel: () => void;
}

export const RadarMatchingModal: React.FC<RadarMatchingModalProps> = ({
  vehicle,
  pickupName,
  onDriverMatched,
  onCancel
}) => {
  const [matchStage, setMatchStage] = useState<number>(0);
  const [detectedCabsCount, setDetectedCabsCount] = useState<number>(3);

  // Stage 0: Initial radar sweep (0-1.5s)
  // Stage 1: Detecting 8-12 nearby cabs (1.5-3.0s)
  // Stage 2: Locking in candidate (3.0-4.2s)
  // Stage 3: Driver accepted! (4.2s+)
  useEffect(() => {
    const t1 = setTimeout(() => {
      setMatchStage(1);
      setDetectedCabsCount(8);
    }, 1200);

    const t2 = setTimeout(() => {
      setMatchStage(2);
    }, 2400);

    const t3 = setTimeout(() => {
      setMatchStage(3);
      // Pick matching or default top chauffeur
      const matchedDriver = DEMO_DRIVERS[0];
      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
      
      setTimeout(() => {
        onDriverMatched(matchedDriver, randomOtp);
      }, 1400);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-gradient-to-b from-[#3B0A11] via-[#2A070C] to-[#160306] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl text-white relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Circular Radar Canvas Simulation */}
        <div className="relative w-56 h-56 mx-auto my-4 flex items-center justify-center">
          {/* Outer radar concentric circles */}
          <div className="absolute inset-0 rounded-full border border-[#D4AF37]/25"></div>
          <div className="absolute inset-6 rounded-full border border-[#D4AF37]/35"></div>
          <div className="absolute inset-14 rounded-full border border-[#D4AF37]/45"></div>
          <div className="absolute inset-22 rounded-full border border-[#D4AF37]/60"></div>

          {/* Crosshair grid lines */}
          <div className="absolute w-full h-px bg-[#D4AF37]/20"></div>
          <div className="absolute h-full w-px bg-[#D4AF37]/20"></div>

          {/* Rotating Radar Sweep Cone */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-spin" style={{ animationDuration: '3s' }}>
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#D4AF37]/40 to-transparent origin-bottom-right transform rotate-45"></div>
          </div>

          {/* Center User Pin */}
          <div className="relative z-10 w-8 h-8 rounded-full bg-[#6B1724] border-2 border-white shadow-lg flex items-center justify-center text-xs">
            📍
          </div>

          {/* Detected Blip 1: Toyota Etios */}
          <div className={`absolute top-10 left-12 transition-all duration-700 ${matchStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping"></span>
              <div className="w-5 h-5 rounded-full bg-emerald-500 border border-white text-[9px] font-bold flex items-center justify-center shadow">
                🚗
              </div>
              <span className="absolute -bottom-4 -left-6 bg-black/80 text-[8px] text-stone-200 px-1 rounded whitespace-nowrap">
                Etios • 0.8 km
              </span>
            </div>
          </div>

          {/* Detected Blip 2: Maruti Suzuki Ertiga */}
          <div className={`absolute bottom-12 right-10 transition-all duration-700 ${matchStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping"></span>
              <div className="w-5 h-5 rounded-full bg-emerald-500 border border-white text-[9px] font-bold flex items-center justify-center shadow">
                🚙
              </div>
              <span className="absolute -bottom-4 -left-6 bg-black/80 text-[8px] text-stone-200 px-1 rounded whitespace-nowrap">
                Ertiga • 1.2 km
              </span>
            </div>
          </div>

          {/* Detected Blip 3: Toyota Innova */}
          <div className={`absolute top-14 right-12 transition-all duration-700 ${matchStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-[#D4AF37]/50 animate-ping"></span>
              <div className="w-5 h-5 rounded-full bg-[#D4AF37] border border-white text-[9px] font-bold flex items-center justify-center shadow">
                ⭐
              </div>
              <span className="absolute -bottom-4 -left-6 bg-black/80 text-[8px] text-[#D4AF37] px-1 rounded whitespace-nowrap">
                Innova • 1.5 km
              </span>
            </div>
          </div>

          {/* Detected Blip 4: Tempo Traveller */}
          <div className={`absolute bottom-10 left-16 transition-all duration-700 ${matchStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-amber-600 border border-white text-[9px] font-bold flex items-center justify-center shadow">
                🚐
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Status Text */}
        <div className="mt-2 min-h-[70px]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
            Hari Travels Dispatch Engine
          </span>
          
          <h3 className="font-display text-xl font-bold text-white mt-1">
            {matchStage === 0 && 'Scanning Nearby Cabs...'}
            {matchStage === 1 && `Found ${detectedCabsCount} Cabs in Tirupati Corridor`}
            {matchStage === 2 && 'Connecting with Best Hill Chauffeur...'}
            {matchStage === 3 && 'Chauffeur Confirmed!'}
          </h3>

          <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
            {matchStage <= 1 && `Matching your request for ${vehicle.name} near ${pickupName.split(',')[0]}...`}
            {matchStage === 2 && 'Verifying TTD Ghat road FASTag & mountain safety clearance...'}
            {matchStage === 3 && 'Ravi Kumar has accepted. Generating secure 4-digit ride OTP...'}
          </p>
        </div>

        {/* Features footer */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center space-x-4 text-[11px] text-[#E6DFD1]/80">
          <span className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" /> Verified Chauffeur
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Car className="w-3.5 h-3.5 text-[#D4AF37] mr-1" /> {vehicle.name}
          </span>
        </div>

        <button
          onClick={onCancel}
          className="mt-5 text-xs text-stone-400 hover:text-white underline transition"
        >
          Cancel Request
        </button>
      </div>
    </div>
  );
};
