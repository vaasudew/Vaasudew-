import React, { useState } from 'react';
import { 
  Car, 
  Power, 
  Navigation, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Award, 
  ArrowRight,
  TrendingUp,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  LocateFixed
} from 'lucide-react';
import { RideBooking, DriverInfo } from '../types/travel';
import { DEMO_DRIVERS, INITIAL_DEMO_BOOKING } from '../data/travelData';
import { createGoogleMapsNavigateLink, createGoogleMapsGpsLink } from '../utils/whatsapp';

interface DriverAppProps {
  currentBooking: RideBooking | null;
  onUpdateBookingStatus: (status: RideBooking['status']) => void;
}

export const DriverApp: React.FC<DriverAppProps> = ({
  currentBooking,
  onUpdateBookingStatus
}) => {
  const [driver, setDriver] = useState<DriverInfo>(DEMO_DRIVERS[0]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [driverTripStatus, setDriverTripStatus] = useState<'idle' | 'incoming' | 'accepted' | 'navigating' | 'arrived' | 'trip_started' | 'completed'>('navigating');
  const [earningsToday, setEarningsToday] = useState<number>(3420);
  const [tripsCompletedToday, setTripsCompletedToday] = useState<number>(4);

  const activeRide = currentBooking || INITIAL_DEMO_BOOKING;

  const handleAcceptTrip = () => {
    setDriverTripStatus('accepted');
    onUpdateBookingStatus('driver_assigned');
  };

  const handleNavigateToCustomer = () => {
    setDriverTripStatus('navigating');
    onUpdateBookingStatus('driver_coming');
  };

  const handleArrivedAtPickup = () => {
    setDriverTripStatus('arrived');
    onUpdateBookingStatus('driver_arrived');
  };

  const handleStartTrip = () => {
    setDriverTripStatus('trip_started');
    onUpdateBookingStatus('trip_started');
  };

  const handleCompleteTrip = () => {
    setDriverTripStatus('completed');
    onUpdateBookingStatus('completed');
    setEarningsToday((prev) => prev + activeRide.fareBreakdown.totalFare);
    setTripsCompletedToday((prev) => prev + 1);
  };

  const handleResetTrip = () => {
    setDriverTripStatus('incoming');
    onUpdateBookingStatus('searching');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Driver Header */}
      <div className="bg-[#3B0A11] text-white rounded-3xl p-6 shadow-md border border-[#D4AF37]/30 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={driver.photo}
              alt={driver.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37]"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display text-xl font-bold">{driver.name}</h2>
                <span className="text-[10px] font-bold bg-[#D4AF37] text-[#3B0A11] px-2 py-0.5 rounded">
                  ★ {driver.rating}
                </span>
              </div>
              <p className="text-xs text-[#E6DFD1]/80">
                {driver.vehicleModel} • <span className="font-mono text-[#D4AF37] font-bold">{driver.vehicleNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center transition ${
                isOnline
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              <Power className="w-3.5 h-3.5 mr-1.5" />
              {isOnline ? 'Online (Accepting Trips)' : 'Offline'}
            </button>
            <button
              onClick={handleResetTrip}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white"
              title="Simulate incoming trip"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Driver Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10 text-center">
          <div className="bg-black/20 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">Duty Hours Today</span>
            <div className="text-lg font-bold font-mono text-white mt-0.5">6.5 hrs</div>
          </div>
          <div className="bg-black/20 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-[#E6DFD1]/70 tracking-wider">Trips Completed</span>
            <div className="text-lg font-bold text-white mt-0.5">{tripsCompletedToday}</div>
          </div>
          <div className="bg-black/20 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-[#E6DFD1]/70 tracking-wider">TTD Fastag</span>
            <div className="text-xs font-bold text-emerald-400 mt-1">Active ✓</div>
          </div>
        </div>
      </div>

      {/* Driver Trip Workflow Panel */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
          <h3 className="font-display text-lg font-bold text-[#3B0A11] flex items-center">
            <Navigation className="w-4 h-4 mr-2 text-[#6B1724]" />
            Driver Active Trip Console
          </h3>
          <span className="text-xs font-mono font-bold text-stone-500">
            Status: <span className="uppercase text-[#6B1724]">{driverTripStatus.replace('_', ' ')}</span>
          </span>
        </div>

        {/* INCOMING TRIP ALERT STATE */}
        {driverTripStatus === 'incoming' && (
          <div className="my-6 p-6 bg-amber-50/80 rounded-2xl border-2 border-amber-300 text-center animate-pulse">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
              ⚡ New Trip Request Nearby
            </span>
            <h4 className="font-display text-2xl font-bold text-[#3B0A11] mt-3">
              Pickup at {activeRide.pickup.name}
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              Destination: {activeRide.destination.name} • Billing: Direct Customer Rate
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleAcceptTrip}
                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
              >
                ACCEPT TRIP
              </button>
              <button
                onClick={() => setDriverTripStatus('idle')}
                className="px-5 py-3 rounded-xl bg-stone-200 text-stone-700 font-semibold text-xs"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE WORKFLOW STATES */}
        {(driverTripStatus === 'accepted' || driverTripStatus === 'navigating' || driverTripStatus === 'arrived' || driverTripStatus === 'trip_started') && (
          <div className="py-6 space-y-6">
            {/* Customer Details Box */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFC8] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">Customer</span>
                <h4 className="font-bold text-stone-900 text-sm">{activeRide.customerName}</h4>
                <p className="text-xs text-stone-500">{activeRide.passengers} Passengers • Notes: {activeRide.specialNotes || 'None'}</p>
              </div>
              <a
                href={`tel:${activeRide.customerPhone}`}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 mr-1" />
                Call Customer
              </a>
            </div>

            {/* Route Overview */}
            <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DFC8]">
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#6B1724]"></span>
                <span className="text-[10px] uppercase font-bold text-stone-400">Pickup</span>
                <p className="text-xs font-bold text-stone-900">{activeRide.pickup.name}</p>
                <p className="text-[11px] text-stone-500">{activeRide.pickup.address}</p>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#D4AF37]"></span>
                <span className="text-[10px] uppercase font-bold text-stone-400">Destination</span>
                <p className="text-xs font-bold text-stone-900">{activeRide.destination.name}</p>
                <p className="text-[11px] text-stone-500">{activeRide.destination.address}</p>
              </div>
            </div>

            {/* Driver Live Location Navigation Card to Reach Customer */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border-2 border-emerald-500 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <LocateFixed className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-emerald-950">Customer Live Location Navigation</span>
                      <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                        Active GPS
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Customer shared their real-time live location. Use Google Maps turn-by-turn driving directions to reach out directly to customer's pickup point.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-emerald-900 font-mono truncate max-w-xs">
                  📍 {activeRide.pickup.name}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={createGoogleMapsNavigateLink(activeRide.pickup.lat || 13.6288, activeRide.pickup.lng || 79.4192)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Drive to Customer Pickup</span>
                    <ExternalLink className="w-3 h-3 text-emerald-200" />
                  </a>
                  <a
                    href={`https://wa.me/${activeRide.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${activeRide.customerName}, this is your Hari Travels driver ${driver.name}. I am navigating directly to your live GPS pickup point now in vehicle ${driver.vehicleNumber}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition"
                    title="WhatsApp Customer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Driver Sequential Actions */}
            <div className="pt-4 border-t border-[#E8DFC8]">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 block">
                Update Trip Phase:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={handleNavigateToCustomer}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                    driverTripStatus === 'navigating'
                      ? 'bg-[#6B1724] text-white border-[#6B1724]'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  1. En Route to Pickup
                </button>
                <button
                  onClick={handleArrivedAtPickup}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                    driverTripStatus === 'arrived'
                      ? 'bg-[#6B1724] text-white border-[#6B1724]'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  2. Arrived at Pickup
                </button>
                <button
                  onClick={handleStartTrip}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                    driverTripStatus === 'trip_started'
                      ? 'bg-[#6B1724] text-white border-[#6B1724]'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  3. Start Hill Climb
                </button>
                <button
                  onClick={handleCompleteTrip}
                  className="py-3 px-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
                >
                  4. Complete Trip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COMPLETED STATE */}
        {driverTripStatus === 'completed' && (
          <div className="my-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-display text-xl font-bold text-emerald-950">
              Trip Completed Successfully!
            </h4>
            <p className="text-xs text-emerald-800 mt-1">
              Trip successfully logged to daily run sheet. Direct fare settled with customer.
            </p>
            <button
              onClick={() => setDriverTripStatus('incoming')}
              className="mt-4 px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
            >
              Ready for Next Pilgrim Trip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
