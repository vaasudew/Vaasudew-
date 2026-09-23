export type RideStatus = 'pending' | 'approved' | 'cancelled' | 'completed';

export interface RideBooking {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupGpsLink?: string;
  pickupCoordinates?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  vehicleType?: string;
  passengers?: number;
  tripType?: string;
  estimatedFare?: number;
  paymentMode?: string;
  status: RideStatus;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  role?: 'admin' | 'dispatcher' | 'superadmin';
}
