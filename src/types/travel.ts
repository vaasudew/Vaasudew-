export type VehicleType = 'mini' | 'sedan' | 'suv' | 'innova' | 'tempo';

export type TripType = 'oneway' | 'roundtrip' | 'hillclimb' | 'sightseeing';

export type RideStatus = 
  | 'searching' 
  | 'driver_assigned' 
  | 'driver_coming' 
  | 'driver_arrived' 
  | 'trip_started' 
  | 'completed' 
  | 'cancelled';

export interface LocationPoint {
  name: string;
  category: 'station' | 'airport' | 'temple' | 'nature' | 'heritage' | 'hub' | 'custom' | 'none' | 'live';
  lat: number;
  lng: number;
  address: string;
  popular?: boolean;
  notes?: string;
  accuracy?: number;
}

export interface VehicleOption {
  id: VehicleType;
  name: string;
  category: string;
  models: string;
  passengers: number;
  luggage: number;
  baseFare: number;
  perKmRate: number;
  ghatSurcharge: number;
  image: string;
  features: string[];
  popular?: boolean;
  recommendedFor?: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalTrips: number;
  experienceYears: number;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleColor: string;
  languages: string[];
  photo: string;
  currentLat: number;
  currentLng: number;
  status: 'available' | 'on_trip' | 'offline';
}

export interface RideBooking {
  id: string;
  bookingCode: string;
  otp?: string;
  customerName: string;
  customerPhone: string;
  pickup: LocationPoint;
  destination: LocationPoint;
  date: string;
  time: string;
  passengers: number;
  vehicle: VehicleOption;
  tripType: TripType;
  distanceKm: number;
  durationMinutes: number;
  fareBreakdown: {
    baseFare: number;
    distanceFare: number;
    ghatTollAndTax: number;
    driverAllowance: number;
    taxes: number;
    totalFare: number;
  };
  status: RideStatus;
  driver?: DriverInfo;
  createdAt: string;
  paymentMethod: 'upi' | 'card' | 'cash';
  paymentStatus: 'paid' | 'pending' | 'at_pickup';
  specialNotes?: string;
}

export interface TourPackage {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  category: 'temple' | 'nature' | 'heritage' | 'custom';
  startingPrice: number;
  vehicle: string;
  image: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  destinations: string[];
  included: string[];
  excluded: string[];
  itinerary: {
    time: string;
    activity: string;
    description: string;
  }[];
  ttdNotice: string;
}

export interface Destination {
  id: string;
  name: string;
  teluguName: string;
  category: 'tirumala' | 'tirupati' | 'surrounding';
  tag: string;
  distanceFromTirupati: string;
  travelTime: string;
  recommendedDuration: string;
  image: string;
  gallery?: string[];
  description: string;
  significance: string;
  visitingHours: string;
  attire: string;
  thingsToKnow: string[];
  ttdOfficial: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'driver' | 'customer' | 'system';
  text: string;
  time: string;
}
