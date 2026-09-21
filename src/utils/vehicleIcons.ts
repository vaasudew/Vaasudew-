import L from 'leaflet';

/**
 * Calculates compass bearing (heading) in degrees between two coordinates (0 = North, 90 = East, etc.)
 */
export function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLng);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;
  return Math.round(bearing);
}

/**
 * Generates realistic SVG markup for specific vehicle models:
 * - Toyota Etios (Compact Sedan)
 * - Maruti Suzuki Ertiga (6-Seater MUV)
 * - Toyota Innova (Innova Crysta Luxury MPV/SUV)
 * - Tempo Traveller (12/17-Seater Pilgrimage Van)
 */
export function getVehicleSvgMarkup(vehicleModel: string, heading: number = 0): string {
  const normalized = (vehicleModel || '').toLowerCase();

  let bodySvg = '';
  let modelLabel = 'Toyota Etios';
  let lengthClass = 'w-12 h-12';

  if (normalized.includes('tempo') || normalized.includes('traveller') || normalized.includes('urbania')) {
    modelLabel = 'Tempo Traveller';
    // Minibus / Tempo Traveller: longer body, twin roof vents, luggage rack, amber clearance lights
    bodySvg = `
      <svg viewBox="0 0 60 110" class="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <ellipse cx="30" cy="55" rx="24" ry="48" fill="rgba(0,0,0,0.35)" filter="blur(2px)" />
        
        <!-- Main Chassis (White with Gold/Crimson pilgrimage accents) -->
        <rect x="10" y="8" width="40" height="92" rx="10" fill="#F8F6F0" stroke="#8C6D28" stroke-width="2" />
        
        <!-- Front Bumper & Headlights -->
        <path d="M12 18 Q30 8 48 18" stroke="#3B0A11" stroke-width="3" fill="none" />
        <rect x="12" y="10" width="7" height="6" rx="2" fill="#FDE047" stroke="#CA8A04" stroke-width="0.8" />
        <rect x="41" y="10" width="7" height="6" rx="2" fill="#FDE047" stroke="#CA8A04" stroke-width="0.8" />
        
        <!-- Windshield -->
        <path d="M15 22 L45 22 L42 34 L18 34 Z" fill="#1E293B" opacity="0.9" rx="2" />
        
        <!-- Roof Carrier / Luggage Area with TTD saffron straps -->
        <rect x="16" y="40" width="28" height="38" rx="4" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5" />
        <line x1="16" y1="52" x2="44" y2="52" stroke="#D4AF37" stroke-width="2" />
        <line x1="16" y1="64" x2="44" y2="64" stroke="#D4AF37" stroke-width="2" />
        
        <!-- Side Windows -->
        <rect x="12" y="38" width="3" height="40" rx="1.5" fill="#0F172A" />
        <rect x="45" y="38" width="3" height="40" rx="1.5" fill="#0F172A" />
        
        <!-- Rear Windshield & Tail Lights -->
        <rect x="16" y="88" width="28" height="5" rx="1.5" fill="#0F172A" />
        <rect x="11" y="93" width="5" height="4" rx="1" fill="#DC2626" />
        <rect x="44" y="93" width="5" height="4" rx="1" fill="#DC2626" />
        
        <!-- Model Badge -->
        <circle cx="30" cy="94" r="2.5" fill="#D4AF37" />
      </svg>
    `;
  } else if (normalized.includes('innova') || normalized.includes('crysta')) {
    modelLabel = 'Toyota Innova';
    // Premium SUV / Innova Crysta: wide aggressive stance, rear spoiler, chrome front grille
    bodySvg = `
      <svg viewBox="0 0 54 96" class="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <ellipse cx="27" cy="48" rx="22" ry="42" fill="rgba(0,0,0,0.3)" filter="blur(2px)" />
        
        <!-- Body: Luxury Silver/Pearl White with Maroon Tint -->
        <rect x="9" y="8" width="36" height="80" rx="9" fill="#FAFAFA" stroke="#6B1724" stroke-width="2" />
        
        <!-- Front Hood & Chrome Grille -->
        <path d="M12 18 Q27 10 42 18" stroke="#450A12" stroke-width="2.5" fill="none" />
        <rect x="20" y="10" width="14" height="4" rx="1" fill="#D4AF37" />
        <!-- Headlights -->
        <polygon points="11,12 17,11 16,17 11,16" fill="#FDE047" stroke="#CA8A04" stroke-width="0.8" />
        <polygon points="43,12 37,11 38,17 43,16" fill="#FDE047" stroke="#CA8A04" stroke-width="0.8" />
        
        <!-- Front Windshield -->
        <path d="M13 22 L41 22 L39 36 L15 36 Z" fill="#0F172A" opacity="0.88" />
        
        <!-- Sunroof / Roof Ribs -->
        <rect x="18" y="42" width="18" height="18" rx="2" fill="#1E293B" stroke="#64748B" stroke-width="1" />
        
        <!-- Rear Windshield -->
        <path d="M16 68 L38 68 L40 78 L14 78 Z" fill="#0F172A" opacity="0.88" />
        
        <!-- Tail Lights & Chrome Garnish -->
        <rect x="10" y="81" width="5" height="4" rx="1" fill="#DC2626" />
        <rect x="39" y="81" width="5" height="4" rx="1" fill="#DC2626" />
        <rect x="22" y="82" width="10" height="2" fill="#D4AF37" />
      </svg>
    `;
  } else if (normalized.includes('ertiga') || normalized.includes('carens') || normalized.includes('suv')) {
    modelLabel = 'Maruti Ertiga';
    // Compact 6-Seater MUV: Maruti Suzuki Ertiga styling
    bodySvg = `
      <svg viewBox="0 0 50 88" class="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <ellipse cx="25" cy="44" rx="20" ry="38" fill="rgba(0,0,0,0.3)" filter="blur(2px)" />
        
        <!-- Body: Crisp Metallic Stone / White -->
        <rect x="8" y="8" width="34" height="72" rx="8" fill="#F1F5F9" stroke="#3B0A11" stroke-width="1.8" />
        
        <!-- Front Grille & Projector Lights -->
        <path d="M11 16 Q25 9 39 16" stroke="#64748B" stroke-width="2" fill="none" />
        <rect x="10" y="10" width="6" height="5" rx="1.5" fill="#FEF08A" stroke="#EAB308" stroke-width="0.8" />
        <rect x="34" y="10" width="6" height="5" rx="1.5" fill="#FEF08A" stroke="#EAB308" stroke-width="0.8" />
        
        <!-- Front Windshield -->
        <path d="M12 20 L38 20 L36 34 L14 34 Z" fill="#0F172A" opacity="0.85" />
        
        <!-- Roof Rails -->
        <line x1="11" y1="36" x2="11" y2="60" stroke="#475569" stroke-width="2" stroke-linecap="round" />
        <line x1="39" y1="36" x2="39" y2="60" stroke="#475569" stroke-width="2" stroke-linecap="round" />
        
        <!-- Rear Glass -->
        <path d="M14 62 L36 62 L37 72 L13 72 Z" fill="#0F172A" opacity="0.85" />
        
        <!-- Tail Lights -->
        <rect x="9" y="73" width="5" height="3.5" rx="1" fill="#DC2626" />
        <rect x="36" y="73" width="5" height="3.5" rx="1" fill="#DC2626" />
      </svg>
    `;
  } else {
    modelLabel = 'Toyota Etios';
    // Toyota Etios Sedan: Distinctive sedan profile with pronounced trunk boot
    bodySvg = `
      <svg viewBox="0 0 48 82" class="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <ellipse cx="24" cy="41" rx="19" ry="36" fill="rgba(0,0,0,0.3)" filter="blur(2px)" />
        
        <!-- Body: Elegant Pure White / Cream Sedan -->
        <rect x="8" y="8" width="32" height="66" rx="7" fill="#FFFFFF" stroke="#6B1724" stroke-width="1.8" />
        
        <!-- Front Smile Grille (Etios signature) -->
        <path d="M11 16 Q24 10 37 16" stroke="#94A3B8" stroke-width="2" fill="none" />
        <polygon points="9,10 15,9 14,14 9,14" fill="#FDE047" stroke="#EAB308" stroke-width="0.8" />
        <polygon points="39,10 33,9 34,14 39,14" fill="#FDE047" stroke="#EAB308" stroke-width="0.8" />
        
        <!-- Front Windshield -->
        <path d="M11 19 L37 19 L35 32 L13 32 Z" fill="#0F172A" opacity="0.85" />
        
        <!-- Roof -->
        <rect x="13" y="32" width="22" height="18" rx="2" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="0.8" />
        
        <!-- Rear Windshield -->
        <path d="M13 50 L35 50 L37 60 L11 60 Z" fill="#0F172A" opacity="0.85" />
        
        <!-- Trunk / Boot Lid (Sedan characteristic) -->
        <rect x="11" y="62" width="26" height="8" rx="2" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1" />
        
        <!-- Tail Lights -->
        <rect x="9" y="67" width="4" height="4" rx="1" fill="#EF4444" />
        <rect x="35" y="67" width="4" height="4" rx="1" fill="#EF4444" />
        <!-- Toyota Badge -->
        <ellipse cx="24" cy="69" rx="2" ry="1.2" fill="#D4AF37" />
      </svg>
    `;
  }

  return `
    <div class="relative flex flex-col items-center justify-center cursor-pointer pointer-events-auto select-none" style="transform: translate(-50%, -50%);">
      <!-- Rotating Vehicle Body -->
      <div class="w-14 h-14 flex items-center justify-center transition-transform duration-300 ease-out" style="transform: rotate(${heading}deg);">
        ${bodySvg}
      </div>

      <!-- Floating Plate & Model Pill -->
      <div class="absolute -bottom-4 bg-stone-900/95 backdrop-blur-xs text-white border border-[#D4AF37] px-2 py-0.5 rounded-full shadow-md text-[9px] font-bold tracking-tight whitespace-nowrap flex items-center space-x-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-[#D4AF37] font-serif">${modelLabel}</span>
      </div>
    </div>
  `;
}

/**
 * Creates custom Leaflet DivIcon for specific car models
 */
export function createVehicleLeafletIcon(vehicleModel: string, heading: number = 0): L.DivIcon {
  return L.divIcon({
    className: 'custom-vehicle-leaflet-marker',
    html: getVehicleSvgMarkup(vehicleModel, heading),
    iconSize: [56, 56],
    iconAnchor: [28, 28]
  });
}

/**
 * Custom Pulsing User Marker for Pickup
 */
export function createPickupPulsingIcon(title: string = 'Pickup Point'): L.DivIcon {
  return L.divIcon({
    className: 'custom-pickup-pulsing-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer">
        <!-- Dual Pulsing Rings -->
        <div class="absolute w-12 h-12 rounded-full bg-[#6B1724]/20 animate-ping"></div>
        <div class="absolute w-8 h-8 rounded-full bg-[#6B1724]/30 animate-pulse"></div>
        
        <!-- Center Emblem -->
        <div class="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#6B1724] to-[#450A12] border-2 border-white shadow-xl flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" class="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="7" r="4"/>
            <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
          </svg>
        </div>

        <!-- Tag -->
        <div class="absolute -top-7 bg-[#6B1724] text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md whitespace-nowrap border border-[#D4AF37]/50">
          📍 ${title}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

/**
 * Custom Drop / Temple Marker with Sacred Glow
 */
export function createDropPulsingIcon(title: string = 'Destination'): L.DivIcon {
  return L.divIcon({
    className: 'custom-drop-pulsing-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer">
        <!-- Sacred Golden Glow -->
        <div class="absolute w-12 h-12 rounded-full bg-[#D4AF37]/25 animate-ping"></div>
        
        <div class="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] border-2 border-[#58111A] shadow-xl flex items-center justify-center text-[#3B0A11] font-bold text-base">
          🛕
        </div>

        <!-- Tag -->
        <div class="absolute -top-7 bg-[#3B0A11] text-[#D4AF37] px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md whitespace-nowrap border border-[#D4AF37]">
          ${title}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

/**
 * Live Browser Device GPS Pulsing Marker (blue dot with radar circle)
 */
export function createLiveGpsIcon(): L.DivIcon {
  return L.divIcon({
    className: 'custom-live-device-gps-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 rounded-full bg-blue-500/25 animate-ping"></div>
        <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
        <span class="absolute -bottom-4 bg-blue-900 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
          You (Live GPS)
        </span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}
