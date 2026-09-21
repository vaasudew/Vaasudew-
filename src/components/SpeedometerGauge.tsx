import React from 'react';
import { Gauge, ShieldCheck, AlertTriangle } from 'lucide-react';

interface SpeedometerGaugeProps {
  currentSpeedKmh: number;
  speedLimitKmh?: number;
  isGhatRoad?: boolean;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  currentSpeedKmh,
  speedLimitKmh = 40,
  isGhatRoad = true
}) => {
  // Speed percentage up to max 100 km/h
  const displaySpeed = Math.max(0, Math.min(120, Math.round(currentSpeedKmh)));
  const percentage = Math.min(1, displaySpeed / 100);
  
  // Needle rotation: -90deg (0 km/h) to +90deg (100 km/h)
  const needleDeg = -90 + percentage * 180;
  
  const isOverSpeed = displaySpeed > speedLimitKmh;

  return (
    <div className="bg-[#1C0508]/90 text-white p-3.5 rounded-2xl border border-[#D4AF37]/30 shadow-lg flex items-center space-x-4">
      {/* Mini Gauge Dial */}
      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
        {/* Arc Track */}
        <svg viewBox="0 0 100 60" className="w-16 h-12 overflow-visible">
          {/* Background Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Safe Green Range */}
          <path
            d="M 10 50 A 40 40 0 0 1 65 18"
            fill="none"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Warning / Ghat Limit */}
          <path
            d="M 65 18 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#EF4444"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Pointer needle */}
          <g transform={`rotate(${needleDeg} 50 50)`} className="transition-transform duration-300 ease-out">
            <line x1="50" y1="50" x2="50" y2="14" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="50" r="5" fill="#D4AF37" />
          </g>
        </svg>

        <span className="absolute bottom-0 text-[9px] font-mono text-stone-400">km/h</span>
      </div>

      {/* Speedometer Reading & Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline space-x-1.5">
          <span className={`text-2xl font-black font-mono tracking-tight leading-none ${
            isOverSpeed ? 'text-red-400' : 'text-[#D4AF37]'
          }`}>
            {displaySpeed}
          </span>
          <span className="text-xs font-semibold text-stone-300">km/h</span>
          <span className="text-[10px] text-stone-400 ml-auto font-mono">Limit: {speedLimitKmh}</span>
        </div>

        <div className="mt-1 flex items-center space-x-1 text-[10px]">
          {isOverSpeed ? (
            <span className="text-red-400 font-bold flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Above Ghat Speed Limit
            </span>
          ) : (
            <span className="text-emerald-400 font-medium flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
              {isGhatRoad ? 'TTD Safe Ghat Speed' : 'Cruise Speed Safe'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
