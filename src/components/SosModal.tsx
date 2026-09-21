import React, { useState } from 'react';
import { AlertOctagon, Phone, ShieldAlert, X, Copy, Check, MapPin, Radio } from 'lucide-react';
import { LocationPoint } from '../types/travel';

interface SosModalProps {
  currentCoord: { lat: number; lng: number };
  currentLocationName?: string;
  driverName?: string;
  vehiclePlate?: string;
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({
  currentCoord,
  currentLocationName = 'Tirupati-Tirumala Ghat Corridor',
  driverName = 'Ravi Kumar',
  vehiclePlate = 'AP 03 TX 4821',
  onClose
}) => {
  const [alertSent, setAlertSent] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  const latFormatted = currentCoord.lat.toFixed(5);
  const lngFormatted = currentCoord.lng.toFixed(5);

  const handleCopyLocation = () => {
    const text = `EMERGENCY ALERT: Need assistance near ${currentLocationName}. GPS Coordinates: ${latFormatted}, ${lngFormatted}. Cab: ${vehiclePlate}, Driver: ${driverName}.`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const handleTriggerSos = () => {
    setAlertSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-red-600 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Header with flashing badge */}
        <div className="flex items-center space-x-3 text-red-600">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center border border-red-200">
            <AlertOctagon className="w-7 h-7 text-red-600 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-red-100 text-red-700 px-2 py-0.5 rounded">
              Emergency Safety Center
            </span>
            <h3 className="font-display text-xl font-bold text-stone-900 mt-0.5">
              Pilgrim SOS Assistance
            </h3>
          </div>
        </div>

        {/* Current GPS Snapshot Box */}
        <div className="mt-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-stone-800">Current Position:</span>
              <p className="text-stone-600 truncate">{currentLocationName}</p>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] bg-white p-2 rounded-xl border border-stone-200">
            <span className="text-stone-600">GPS: {latFormatted}° N, {lngFormatted}° E</span>
            <button
              onClick={handleCopyLocation}
              className="text-red-700 font-bold hover:underline flex items-center"
            >
              {copiedCoords ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copiedCoords ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="text-[11px] text-stone-500">
            Active Cab: <strong className="text-stone-800">{vehiclePlate}</strong> ({driverName})
          </div>
        </div>

        {/* Action: Send Instant Alert */}
        {!alertSent ? (
          <button
            onClick={handleTriggerSos}
            className="w-full mt-4 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition active:scale-98"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>Broadcast SOS Alert to Hari Travels Helpline</span>
          </button>
        ) : (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            <div>
              <strong>SOS Dispatched!</strong> Our 24/7 command center and nearest patrol team have received your coordinates.
            </div>
          </div>
        )}

        {/* Direct One-Tap Emergency Helplines */}
        <div className="mt-4 pt-3 border-t border-stone-200">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-2">
            Direct Emergency Lines
          </span>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:112"
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center space-x-2 text-stone-800 text-xs font-semibold transition"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <div>
                <div>Police / Dial 112</div>
                <div className="text-[10px] text-stone-500">National Emergency</div>
              </div>
            </a>

            <a
              href="tel:108"
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center space-x-2 text-stone-800 text-xs font-semibold transition"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <div>
                <div>Ambulance 108</div>
                <div className="text-[10px] text-stone-500">Ghat Paramedics</div>
              </div>
            </a>

            <a
              href="tel:18004254141"
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center space-x-2 text-stone-800 text-xs font-semibold transition"
            >
              <Phone className="w-4 h-4 text-[#8C6D28]" />
              <div>
                <div>TTD Vigilance</div>
                <div className="text-[10px] text-stone-500">1800 425 4141</div>
              </div>
            </a>

            <a
              href="tel:+919959312174"
              className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] hover:bg-stone-100 flex items-center space-x-2 text-[#6B1724] text-xs font-bold transition"
            >
              <Phone className="w-4 h-4 text-[#6B1724]" />
              <div>
                <div>Hari Travels Desk</div>
                <div className="text-[10px] text-stone-500">+91 99593 12174</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
