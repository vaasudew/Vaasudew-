export interface RouteWaypoint {
  lat: number;
  lng: number;
  name: string;
  elevationMeters?: number;
  speedLimitKmh?: number;
  landmarkType?: 'start' | 'checkpost' | 'hairpin' | 'viewpoint' | 'temple' | 'toll';
}

export interface CityRoutePreset {
  id: string;
  name: string;
  state: string;
  distanceKm: number;
  estimatedMins: number;
  description: string;
  pickupDefault: { name: string; lat: number; lng: number; address: string };
  dropDefault: { name: string; lat: number; lng: number; address: string };
  waypoints: RouteWaypoint[];
}

/**
 * 1. TIRUPATI TO TIRUMALA SACRED GHAT CORRIDOR (Primary Route)
 * With authentic TTD checkpoints, hairpins, and elevation points.
 */
export const TIRUPATI_TIRUMALA_PRESET: CityRoutePreset = {
  id: 'tirupati-tirumala',
  name: 'Tirupati to Tirumala Hills',
  state: 'Andhra Pradesh',
  distanceKm: 22.4,
  estimatedMins: 38,
  description: 'First & Second Ghat Road with sacred hairpin curves, TTD toll checkpoints & speed limits.',
  pickupDefault: {
    name: 'Tirupati Railway Station (Platform 1)',
    lat: 13.6288,
    lng: 79.4192,
    address: 'Railway Station Road, Tirupati, AP 517501'
  },
  dropDefault: {
    name: 'Sri Venkateswara Swamy Temple, Tirumala (CRO Gate)',
    lat: 13.6833,
    lng: 79.3472,
    address: 'Central Reception Office (CRO), Tirumala Hills, AP 517504'
  },
  waypoints: [
    { lat: 13.6288, lng: 79.4192, name: 'Tirupati Railway Station', speedLimitKmh: 40, landmarkType: 'start' },
    { lat: 13.6360, lng: 79.4140, name: 'Bhavani Nagar Flyover', speedLimitKmh: 45, landmarkType: 'start' },
    { lat: 13.6450, lng: 79.4040, name: 'Kapila Theertham Junction', speedLimitKmh: 40, landmarkType: 'checkpost' },
    { lat: 13.6558, lng: 79.3888, name: 'Alipiri Toll Plaza & Security Check', speedLimitKmh: 20, landmarkType: 'toll' },
    { lat: 13.6590, lng: 79.3780, name: 'Alipiri Footpath Gate & Garuda Statue', speedLimitKmh: 35, landmarkType: 'checkpost' },
    { lat: 13.6635, lng: 79.3710, name: 'Ghat Road 1st Curve & Deer Sanctuary', speedLimitKmh: 30, landmarkType: 'hairpin' },
    { lat: 13.6670, lng: 79.3640, name: 'Gali Gopuram Mountain Viewpoint', speedLimitKmh: 30, landmarkType: 'viewpoint' },
    { lat: 13.6705, lng: 79.3580, name: 'Mokkalla Mitta Hairpin Bend #7', speedLimitKmh: 25, landmarkType: 'hairpin' },
    { lat: 13.6745, lng: 79.3525, name: 'Avachari Kona Forest Viaduct', speedLimitKmh: 35, landmarkType: 'hairpin' },
    { lat: 13.6790, lng: 79.3485, name: 'Tirumala Ring Road Security Check', speedLimitKmh: 25, landmarkType: 'checkpost' },
    { lat: 13.6833, lng: 79.3472, name: 'Sri Venkateswara Temple Area (CRO)', speedLimitKmh: 20, landmarkType: 'temple' }
  ]
};

/**
 * 2. CHENNAI TO TIRUPATI EXPRESSWAY
 */
export const CHENNAI_TIRUPATI_PRESET: CityRoutePreset = {
  id: 'chennai-tirupati',
  name: 'Chennai Central to Tirupati',
  state: 'Tamil Nadu → Andhra Pradesh',
  distanceKm: 134,
  estimatedMins: 160,
  description: 'NH716 Highway via Poonamallee, Thiruvallur, Tiruttani & Renigunta corridor.',
  pickupDefault: {
    name: 'Chennai Central Railway Station',
    lat: 13.0827,
    lng: 80.2707,
    address: 'EVR Periyar Salai, Park Town, Chennai, TN 600003'
  },
  dropDefault: {
    name: 'Alipiri Toll Gate, Tirupati',
    lat: 13.6558,
    lng: 79.3888,
    address: 'Alipiri Bypass Road, Tirupati, AP 517507'
  },
  waypoints: [
    { lat: 13.0827, lng: 80.2707, name: 'Chennai Central', speedLimitKmh: 50, landmarkType: 'start' },
    { lat: 13.0500, lng: 80.1900, name: 'Koyambedu CMBT Bypass', speedLimitKmh: 60, landmarkType: 'checkpost' },
    { lat: 13.1432, lng: 79.9079, name: 'Thiruvallur Toll Plaza', speedLimitKmh: 80, landmarkType: 'toll' },
    { lat: 13.1770, lng: 79.6200, name: 'Tiruttani Murugan Temple Junction', speedLimitKmh: 65, landmarkType: 'temple' },
    { lat: 13.5200, lng: 79.5200, name: 'Puttur Sugar Factory Curve', speedLimitKmh: 70, landmarkType: 'checkpost' },
    { lat: 13.6300, lng: 79.4800, name: 'Renigunta Airport Junction', speedLimitKmh: 60, landmarkType: 'checkpost' },
    { lat: 13.6558, lng: 79.3888, name: 'Alipiri Gateway, Tirupati', speedLimitKmh: 40, landmarkType: 'toll' }
  ]
};

/**
 * 3. BENGALURU TO TIRUPATI HIGHWAY
 */
export const BENGALURU_TIRUPATI_PRESET: CityRoutePreset = {
  id: 'bengaluru-tirupati',
  name: 'Bengaluru to Tirupati',
  state: 'Karnataka → Andhra Pradesh',
  distanceKm: 248,
  estimatedMins: 260,
  description: 'Old Madras Road via Hoskote, Kolar, Mulbagal & Chittoor Ghat bypass.',
  pickupDefault: {
    name: 'Krantivira Sangolli Rayanna (Bengaluru Majestic)',
    lat: 12.9781,
    lng: 77.5696,
    address: 'Majestic, Bengaluru, Karnataka 560023'
  },
  dropDefault: {
    name: 'Tirupati Railway Station',
    lat: 13.6288,
    lng: 79.4192,
    address: 'Tirupati City Center, AP'
  },
  waypoints: [
    { lat: 12.9781, lng: 77.5696, name: 'Bengaluru Majestic', speedLimitKmh: 45, landmarkType: 'start' },
    { lat: 13.0030, lng: 77.6850, name: 'KR Puram Hanging Bridge', speedLimitKmh: 60, landmarkType: 'checkpost' },
    { lat: 13.1360, lng: 78.1340, name: 'Kolar Gold Fields Toll', speedLimitKmh: 85, landmarkType: 'toll' },
    { lat: 13.1650, lng: 78.3950, name: 'Mulbagal Cafe Stop', speedLimitKmh: 75, landmarkType: 'checkpost' },
    { lat: 13.2170, lng: 79.1000, name: 'Chittoor Bypass Corridor', speedLimitKmh: 70, landmarkType: 'checkpost' },
    { lat: 13.4800, lng: 79.2800, name: 'Chandragiri Historical Valley', speedLimitKmh: 65, landmarkType: 'viewpoint' },
    { lat: 13.6288, lng: 79.4192, name: 'Tirupati Railway Station', speedLimitKmh: 40, landmarkType: 'temple' }
  ]
};

/**
 * 4. HYDERABAD TO RENIGUNTA / TIRUPATI
 */
export const HYDERABAD_TIRUPATI_PRESET: CityRoutePreset = {
  id: 'hyderabad-tirupati',
  name: 'Hyderabad (RGIA) to Tirupati',
  state: 'Telangana → Andhra Pradesh',
  distanceKm: 555,
  estimatedMins: 480,
  description: 'National Highway 44 & 40 via Kurnool, Nandyal, Kadapa & Renigunta.',
  pickupDefault: {
    name: 'Rajiv Gandhi International Airport (RGIA)',
    lat: 17.2403,
    lng: 78.4294,
    address: 'Shamshabad, Hyderabad, Telangana 500409'
  },
  dropDefault: {
    name: 'Tirupati International Airport (TIR / Renigunta)',
    lat: 13.6324,
    lng: 79.5432,
    address: 'Renigunta Airport Road, Tirupati, AP 517520'
  },
  waypoints: [
    { lat: 17.2403, lng: 78.4294, name: 'RGIA Shamshabad', speedLimitKmh: 80, landmarkType: 'start' },
    { lat: 15.8281, lng: 78.0373, name: 'Kurnool Tungabhadra Toll', speedLimitKmh: 90, landmarkType: 'toll' },
    { lat: 14.4673, lng: 78.8242, name: 'Kadapa District Bypass', speedLimitKmh: 80, landmarkType: 'checkpost' },
    { lat: 13.9500, lng: 79.3200, name: 'Rajampet Forest Corridor', speedLimitKmh: 70, landmarkType: 'viewpoint' },
    { lat: 13.6324, lng: 79.5432, name: 'Tirupati Airport (TIR)', speedLimitKmh: 50, landmarkType: 'temple' }
  ]
};

export const CITY_ROUTE_PRESETS: CityRoutePreset[] = [
  TIRUPATI_TIRUMALA_PRESET,
  CHENNAI_TIRUPATI_PRESET,
  BENGALURU_TIRUPATI_PRESET,
  HYDERABAD_TIRUPATI_PRESET
];

/**
 * Nearby Wandering Fleets around Tirupati / Tirumala for live simulation
 */
export interface WanderingCab {
  id: string;
  driverName: string;
  phone: string;
  vehicleModel: 'Toyota Etios' | 'Maruti Suzuki Ertiga' | 'Toyota Innova' | 'Tempo Traveller';
  vehiclePlate: string;
  rating: number;
  photo: string;
  lat: number;
  lng: number;
  heading: number;
  status: 'idle' | 'booked';
  targetWaypointIndex: number;
}

export const INITIAL_WANDERING_CABS: WanderingCab[] = [
  {
    id: 'CAB-ETIOS-01',
    driverName: 'Ravi Kumar',
    phone: '+91 99593 12174',
    vehicleModel: 'Toyota Etios',
    vehiclePlate: 'AP 03 TX 4821',
    rating: 4.9,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    lat: 13.6335,
    lng: 79.4180,
    heading: 45,
    status: 'idle',
    targetWaypointIndex: 1
  },
  {
    id: 'CAB-ERTIGA-02',
    driverName: 'K. Venkatesh',
    phone: '+91 98852 44321',
    vehicleModel: 'Maruti Suzuki Ertiga',
    vehiclePlate: 'AP 03 TX 3154',
    rating: 4.85,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    lat: 13.6420,
    lng: 79.4080,
    heading: 120,
    status: 'idle',
    targetWaypointIndex: 2
  },
  {
    id: 'CAB-INNOVA-03',
    driverName: 'M. Sridhar Naidu',
    phone: '+91 94401 88412',
    vehicleModel: 'Toyota Innova',
    vehiclePlate: 'AP 03 TX 9901',
    rating: 4.95,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    lat: 13.6510,
    lng: 79.3950,
    heading: 310,
    status: 'idle',
    targetWaypointIndex: 3
  },
  {
    id: 'CAB-TEMPO-04',
    driverName: 'P. Anand Reddy',
    phone: '+91 97034 55192',
    vehicleModel: 'Tempo Traveller',
    vehiclePlate: 'AP 03 TX 7788',
    rating: 4.92,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
    lat: 13.6590,
    lng: 79.3780,
    heading: 280,
    status: 'idle',
    targetWaypointIndex: 4
  }
];

/**
 * Live Wander Algorithm:
 * Moves idle cabs slightly along their bearing with realistic small offsets (GPS wander)
 */
export function tickWanderCabs(cabs: WanderingCab[]): WanderingCab[] {
  return cabs.map((cab) => {
    // Slight randomized jitter (approx 15-25 meters)
    const angleRad = (cab.heading * Math.PI) / 180;
    const speedDelta = 0.00015; // ~16 meters in degrees
    const jitterLat = (Math.random() - 0.5) * 0.00005;
    const jitterLng = (Math.random() - 0.5) * 0.00005;

    const nextLat = cab.lat + Math.cos(angleRad) * speedDelta + jitterLat;
    const nextLng = cab.lng + Math.sin(angleRad) * speedDelta + jitterLng;

    // Slight steering angle adjustment (-8 to +8 degrees)
    const nextHeading = (cab.heading + (Math.random() - 0.5) * 16 + 360) % 360;

    return {
      ...cab,
      lat: nextLat,
      lng: nextLng,
      heading: nextHeading
    };
  });
}
