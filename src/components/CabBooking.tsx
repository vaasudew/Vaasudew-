import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Shield, 
  CheckCircle2, 
  CreditCard, 
  Car, 
  ChevronRight, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  QrCode,
  Phone,
  MessageCircle,
  KeyRound,
  Search,
  Compass,
  Crosshair,
  Loader2,
  XCircle,
  LocateFixed
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  LocationPoint, 
  VehicleOption, 
  VehicleType, 
  TripType, 
  RideBooking,
  DriverInfo 
} from '../types/travel';
import { 
  POPULAR_LOCATIONS, 
  VEHICLE_OPTIONS, 
  DEMO_DRIVERS,
  NONE_LOCATION
} from '../data/travelData';
import { InteractiveMap } from './InteractiveMap';
import { RadarMatchingModal } from './RadarMatchingModal';
import { useLiveLocation, isNoneLocation, isLiveLocation } from '../hooks/useLiveLocation';

interface CabBookingProps {
  onBookingConfirmed: (booking: RideBooking) => void;
  preselectedPickup?: LocationPoint;
  preselectedDestination?: LocationPoint;
  preselectedVehicle?: VehicleType;
}

export const CabBooking: React.FC<CabBookingProps> = ({
  onBookingConfirmed,
  preselectedPickup,
  preselectedDestination,
  preselectedVehicle
}) => {
  // Booking Steps: 1: Route & Trip Type -> 2: Vehicle -> 3: Schedule & Contact -> 4: Review & Payment
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [pickup, setPickup] = useState<LocationPoint>(preselectedPickup || POPULAR_LOCATIONS[0]);
  const [destination, setDestination] = useState<LocationPoint>(preselectedDestination || POPULAR_LOCATIONS[3]);
  const [tripType, setTripType] = useState<TripType>('hillclimb');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(
    VEHICLE_OPTIONS.find(v => v.id === preselectedVehicle) || VEHICLE_OPTIONS[1]
  );
  const [travelDate, setTravelDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [travelTime, setTravelTime] = useState<string>('09:30 AM');
  const [passengers, setPassengers] = useState<number>(3);
  const [customerName, setCustomerName] = useState<string>('Venkata Raman');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98480 12345');
  const [specialNotes, setSpecialNotes] = useState<string>('Have luggage and elder passenger needing gentle ghat driving.');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSearchingRadar, setIsSearchingRadar] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<RideBooking | null>(null);
  const [showInteractiveMap, setShowInteractiveMap] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectionError, setSelectionError] = useState<string | null>(null);

  // Live Location Browser GPS Integration
  const {
    liveLocation,
    isLoading: isLiveLocationLoading,
    error: liveLocationError,
    permissionState,
    requestLiveLocation
  } = useLiveLocation();

  // Handlers for setting live GPS location
  const handleUseLiveLocationForPickup = async () => {
    setSelectionError(null);
    const loc = await requestLiveLocation();
    if (loc) {
      setPickup(loc);
    }
  };

  const handleUseLiveLocationForDestination = async () => {
    setSelectionError(null);
    const loc = await requestLiveLocation();
    if (loc) {
      setDestination(loc);
    }
  };

  // Approximate distance calculation based on coordinates
  const calculateDistance = (loc1: LocationPoint, loc2: LocationPoint) => {
    if (isNoneLocation(loc1) || isNoneLocation(loc2) || (loc1.lat === 0 && loc1.lng === 0) || (loc2.lat === 0 && loc2.lng === 0)) {
      return 0;
    }
    // Basic Great-circle approximation adjusted for road winding factor (1.4 for Ghat roads)
    const dLat = (loc2.lat - loc1.lat) * 111;
    const dLng = (loc2.lng - loc1.lng) * 111 * Math.cos((loc1.lat * Math.PI) / 180);
    const straightDist = Math.sqrt(dLat * dLat + dLng * dLng);
    const isHill = loc1.category === 'temple' || loc2.category === 'temple' || loc1.name.includes('Tirumala') || loc2.name.includes('Tirumala');
    const windingFactor = isHill ? 1.55 : 1.25;
    return Math.max(8, +(straightDist * windingFactor).toFixed(1));
  };

  const distanceKm = calculateDistance(pickup, destination);
  const isGhatRoute = pickup.name.includes('Tirumala') || destination.name.includes('Tirumala') || tripType === 'hillclimb';
  const hasValidRoute = !isNoneLocation(pickup) && !isNoneLocation(destination) && pickup.lat !== 0 && destination.lat !== 0;

  // Fare calculations
  const calculateFare = (vehicle: VehicleOption, dist: number, isGhat: boolean, type: TripType) => {
    const base = vehicle.baseFare;
    const distanceCost = Math.round(dist * vehicle.perKmRate);
    const ghatToll = isGhat ? vehicle.ghatSurcharge : 0;
    const driverAllowance = isGhat ? 150 : 100;
    const roundTripMultiplier = type === 'roundtrip' ? 1.8 : 1.0;
    const subtotal = Math.round((base + distanceCost + ghatToll + driverAllowance) * roundTripMultiplier);
    const taxes = Math.round(subtotal * 0.05); // 5% GST
    return {
      baseFare: base,
      distanceFare: distanceCost,
      ghatTollAndTax: ghatToll,
      driverAllowance: driverAllowance,
      taxes: taxes,
      totalFare: subtotal + taxes
    };
  };

  const fareBreakdown = calculateFare(selectedVehicle, distanceKm, isGhatRoute, tripType);

  const handleConfirmAndPay = () => {
    // Launch driver matching radar animation
    setIsSearchingRadar(true);
  };

  const handleDriverMatched = (matchedDriver: DriverInfo, otp: string) => {
    setIsSearchingRadar(false);
    const randomCode = 'HT' + Math.floor(10000 + Math.random() * 90000);
    const newBooking: RideBooking = {
      id: `HT-${Date.now().toString().slice(-5)}`,
      bookingCode: randomCode,
      otp: otp,
      customerName,
      customerPhone,
      pickup,
      destination,
      date: travelDate,
      time: travelTime,
      passengers,
      vehicle: selectedVehicle,
      tripType,
      distanceKm,
      durationMinutes: Math.round(distanceKm * 2.2),
      fareBreakdown,
      status: 'driver_coming',
      driver: matchedDriver,
      createdAt: new Date().toISOString(),
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'at_pickup' : 'paid',
      specialNotes
    };

    setConfirmedBooking(newBooking);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore if not supported
    }
  };

  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-[#E8DFC8] text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D28]">
          Hari Travels • Chauffeur Matched & Dispatched
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3B0A11] mt-1">
          Booking Confirmed!
        </h2>
        <div className="inline-block my-3 px-4 py-1.5 bg-[#FAF7F2] rounded-full border border-[#E8DFC8] text-sm font-mono font-bold text-[#6B1724]">
          Booking ID: #{confirmedBooking.bookingCode}
        </div>

        {/* Prominent 4-Digit OTP Display */}
        <div className="my-4 max-w-sm mx-auto p-4 bg-gradient-to-r from-amber-50 to-[#FAF7F2] border-2 border-[#D4AF37] rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-[#6B1724] text-[#D4AF37] flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Ride Start OTP
              </span>
              <div className="text-3xl font-black font-mono tracking-widest text-[#6B1724] leading-none mt-0.5">
                {confirmedBooking.otp || '4892'}
              </div>
            </div>
          </div>
          <span className="text-[10px] bg-white px-2.5 py-1 rounded-lg border border-[#E8DFC8] text-stone-600 font-semibold">
            Share with Driver
          </span>
        </div>

        {/* Driver Profile Snapshot */}
        <div className="my-4 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC8] flex items-center space-x-4 text-left">
          <img
            src={confirmedBooking.driver?.photo}
            alt={confirmedBooking.driver?.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-sm">{confirmedBooking.driver?.name}</h4>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                ★ {confirmedBooking.driver?.rating}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {confirmedBooking.vehicle.name} • <strong className="font-mono text-[#6B1724]">{confirmedBooking.driver?.vehicleNumber}</strong>
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              ✓ TTD Ghat Road FASTag Verified & Pre-Cleared
            </p>
          </div>
        </div>

        {/* Quick summary box */}
        <div className="my-4 p-4 bg-white rounded-2xl border border-[#E8DFC8] text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-stone-500">Pickup:</span>
            <span className="font-bold text-stone-900 text-right">{confirmedBooking.pickup.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Destination:</span>
            <span className="font-bold text-[#6B1724] text-right">{confirmedBooking.destination.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Scheduled:</span>
            <span className="font-bold text-stone-900">{confirmedBooking.date} at {confirmedBooking.time}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#E8DFC8] font-bold text-stone-900 text-sm">
            <span>Payment:</span>
            <span className="text-emerald-700">Direct Driver Rate (Pay on Drop)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onBookingConfirmed(confirmedBooking)}
            className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#6B1724] to-[#7D1B2A] text-white shadow-md hover:shadow-lg transition flex items-center justify-center border border-[#D4AF37]/40"
          >
            <Car className="w-4 h-4 mr-2 text-[#D4AF37]" />
            Launch Live GPS Ride Tracking
          </button>

          <a
            href={`https://wa.me/919959312174?text=${encodeURIComponent(`Hello Hari Travels, I booked cab #${confirmedBooking.bookingCode} (OTP: ${confirmedBooking.otp}) from ${confirmedBooking.pickup.name} to ${confirmedBooking.destination.name}. Chauffeur: ${confirmedBooking.driver?.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-sm transition flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 mr-1.5 fill-white text-transparent" />
            WhatsApp Dispatch
          </a>

          <button
            onClick={() => {
              setConfirmedBooking(null);
              setCurrentStep(1);
            }}
            className="px-4 py-3.5 rounded-xl font-semibold text-xs text-stone-600 hover:bg-stone-100 transition"
          >
            New Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-[#E8DFC8] overflow-hidden">
        {/* Step Indicator */}
        <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#E8DFC8] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D28]">
              Reserve Private Transport
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#3B0A11]">
              Cab Booking & Live Route
            </h2>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => step < currentStep && setCurrentStep(step)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  currentStep === step
                    ? 'bg-[#6B1724] text-white shadow-xs'
                    : currentStep > step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {currentStep > step ? '✓' : step}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* STEP 1: ROUTE & TRIP TYPE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Trip type selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Trip Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'hillclimb', label: 'Tirumala Hill Climb', badge: 'Fastag' },
                    { id: 'oneway', label: 'One Way Drop', badge: null },
                    { id: 'roundtrip', label: 'Round Trip (Wait & Return)', badge: 'Wait Time' },
                    { id: 'sightseeing', label: 'Full Day Sightseeing', badge: '8 Hrs' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTripType(t.id as TripType)}
                      className={`p-3 rounded-xl text-left border transition text-xs font-medium relative ${
                        tripType === t.id
                          ? 'border-[#6B1724] bg-[#6B1724]/6 text-[#6B1724] font-bold shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span>{t.label}</span>
                      {t.badge && (
                        <span className="block text-[9px] uppercase font-bold text-[#8C6D28] mt-0.5">
                          {t.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Geolocation Permission or Error Banner */}
              {liveLocationError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-2 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold">Live GPS Notice: </span>
                    {liveLocationError}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUseLiveLocationForPickup()}
                    className="text-[11px] underline font-bold text-amber-950 shrink-0 hover:text-black"
                  >
                    Retry GPS
                  </button>
                </div>
              )}

              {/* Quick Landmark Search Bar with None and Live GPS triggers */}
              <div className="relative">
                <div className="flex items-center space-x-2 bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#E8DFC8]">
                  <Search className="w-4 h-4 text-[#8C6D28] ml-1.5 shrink-0" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search temple, ghat toll, station, 'live', or 'none'..."
                    className="bg-transparent text-xs w-full focus:outline-none text-stone-800 placeholder:text-stone-400 font-medium"
                  />
                  {searchFilter && (
                    <button
                      type="button"
                      onClick={() => setSearchFilter('')}
                      className="text-stone-400 hover:text-stone-700 text-xs px-2"
                    >
                      ✕
                    </button>
                  )}
                  {/* Browser Live Location Quick Trigger Button */}
                  <button
                    type="button"
                    onClick={handleUseLiveLocationForPickup}
                    disabled={isLiveLocationLoading}
                    className="px-2.5 py-1 bg-white hover:bg-[#6B1724] hover:text-white text-stone-700 rounded-xl text-[11px] font-bold border border-[#E8DFC8] flex items-center space-x-1 transition shadow-2xs shrink-0"
                    title="Allow and acquire real GPS live location from your device"
                  >
                    {isLiveLocationLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6B1724]" />
                    ) : (
                      <Crosshair className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span className="hidden sm:inline">Use My Live GPS</span>
                  </button>
                </div>

                {searchFilter && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1.5 bg-white rounded-2xl shadow-xl border border-[#E8DFC8] max-h-56 overflow-y-auto p-2">
                    <div className="text-[10px] uppercase font-bold text-stone-400 px-2 py-1 flex items-center justify-between">
                      <span>Quick Select:</span>
                      <span className="text-[9px] text-[#8C6D28]">Live Location & None available</span>
                    </div>

                    {/* Virtual Special Items in Search: Live Location */}
                    {('live location current gps'.includes(searchFilter.toLowerCase())) && (
                      <div className="p-2 bg-red-50/50 hover:bg-red-50 rounded-xl text-xs flex items-center justify-between border border-red-100 mb-1">
                        <div className="flex items-center space-x-2">
                          <LocateFixed className="w-4 h-4 text-red-600 shrink-0" />
                          <div>
                            <div className="font-bold text-stone-900">📍 Live Location (Browser GPS)</div>
                            <div className="text-[10px] text-stone-500">Acquire exact live coordinates from your device</div>
                          </div>
                        </div>
                        <div className="flex space-x-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              handleUseLiveLocationForPickup();
                              setSearchFilter('');
                            }}
                            className="px-2 py-1 bg-[#6B1724] text-white rounded-lg text-[10px] font-bold"
                          >
                            Set Pickup
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleUseLiveLocationForDestination();
                              setSearchFilter('');
                            }}
                            className="px-2 py-1 bg-[#D4AF37] text-stone-900 rounded-lg text-[10px] font-bold"
                          >
                            Set Drop
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Virtual Special Items in Search: None (Clear) */}
                    {('none clear empty reset'.includes(searchFilter.toLowerCase())) && (
                      <div className="p-2 bg-stone-50 hover:bg-stone-100 rounded-xl text-xs flex items-center justify-between border border-stone-200 mb-1">
                        <div className="flex items-center space-x-2">
                          <XCircle className="w-4 h-4 text-stone-400 shrink-0" />
                          <div>
                            <div className="font-bold text-stone-700">None (Clear / Not Selected)</div>
                            <div className="text-[10px] text-stone-400">Clear selected location point</div>
                          </div>
                        </div>
                        <div className="flex space-x-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPickup(NONE_LOCATION);
                              setSearchFilter('');
                            }}
                            className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-[10px] font-bold"
                          >
                            Set Pickup None
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDestination(NONE_LOCATION);
                              setSearchFilter('');
                            }}
                            className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-[10px] font-bold"
                          >
                            Set Drop None
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Regular search filtered popular locations */}
                    {POPULAR_LOCATIONS.filter(l => 
                      l.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                      l.address.toLowerCase().includes(searchFilter.toLowerCase())
                    ).map((loc) => (
                      <div key={loc.name} className="flex items-center justify-between p-2 hover:bg-[#FAF7F2] rounded-xl text-xs">
                        <div>
                          <div className="font-bold text-stone-800">{loc.name}</div>
                          <div className="text-[10px] text-stone-500">{loc.address}</div>
                        </div>
                        <div className="flex space-x-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPickup(loc);
                              setSearchFilter('');
                            }}
                            className="px-2 py-1 bg-stone-100 hover:bg-[#6B1724] hover:text-white rounded-lg text-[10px] font-bold"
                          >
                            Set Pickup
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDestination(loc);
                              setSearchFilter('');
                            }}
                            className="px-2 py-1 bg-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-stone-900 rounded-lg text-[10px] font-bold"
                          >
                            Set Drop
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pickup & Destination selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup Selection */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8]/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#6B1724]" />
                      Pickup Location
                    </label>
                    <button
                      type="button"
                      onClick={handleUseLiveLocationForPickup}
                      disabled={isLiveLocationLoading}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 transition"
                      title="Grant browser location access and fetch current position"
                    >
                      {isLiveLocationLoading ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        <Crosshair className="w-2.5 h-2.5 text-emerald-600" />
                      )}
                      <span>Use Live GPS</span>
                    </button>
                  </div>

                  <select
                    value={pickup.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'NONE_OPTION') {
                        setPickup(NONE_LOCATION);
                      } else if (val === 'LIVE_LOCATION_OPTION') {
                        handleUseLiveLocationForPickup();
                      } else {
                        const found = POPULAR_LOCATIONS.find(l => l.name === val);
                        if (found) setPickup(found);
                      }
                    }}
                    className={`w-full px-4 py-3 bg-[#FAF7F2] border rounded-xl text-sm font-medium focus:outline-none focus:border-[#6B1724] ${
                      isNoneLocation(pickup) ? 'border-amber-300 text-stone-500 italic' : isLiveLocation(pickup) ? 'border-emerald-500 font-bold text-emerald-900' : 'border-[#E8DFC8]'
                    }`}
                  >
                    {/* Live GPS Option */}
                    <option value="LIVE_LOCATION_OPTION">
                      {liveLocation ? `📍 Live Location (${liveLocation.name})` : '📍 Live Location (Fetch Device GPS)'}
                    </option>

                    {/* None Option */}
                    <option value="NONE_OPTION">
                      — None (Clear Selection) —
                    </option>

                    {/* Pre-existing Custom point if applicable */}
                    {(pickup.category === 'custom' || pickup.category === 'live') && (
                      <option value={pickup.name}>
                        {pickup.name}
                      </option>
                    )}

                    {/* Popular Location list */}
                    <optgroup label="Tirupati & Tirumala Popular Landmarks">
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  <div className="flex items-center justify-between mt-1.5 text-[11px]">
                    <p className={`truncate ${isNoneLocation(pickup) ? 'text-amber-600 font-medium' : isLiveLocation(pickup) ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                      {isNoneLocation(pickup) ? '⚠️ No pickup selected. Please choose a location.' : isLiveLocation(pickup) ? '✓ Live device GPS active' : (pickup.notes || pickup.address)}
                    </p>
                    {pickup.category !== 'none' && (
                      <button
                        type="button"
                        onClick={() => setPickup(NONE_LOCATION)}
                        className="text-[10px] text-stone-400 hover:text-red-600 shrink-0 ml-2"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Quick pickup chips */}
                  <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-stone-400">Quick:</span>
                    <button
                      type="button"
                      onClick={handleUseLiveLocationForPickup}
                      className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center space-x-1 ${
                        isLiveLocation(pickup)
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <Crosshair className="w-2.5 h-2.5" />
                      <span>Live GPS</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickup(NONE_LOCATION)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border ${
                        isNoneLocation(pickup)
                          ? 'bg-stone-800 text-white border-stone-800'
                          : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      None
                    </button>
                    {POPULAR_LOCATIONS.slice(0, 2).map((loc) => (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => setPickup(loc)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border ${
                          pickup.name === loc.name
                            ? 'bg-[#6B1724] text-white border-[#6B1724]'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {loc.name.split('(')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination Selection */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8]/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                      Where Are You Going? (Drop)
                    </label>
                    <button
                      type="button"
                      onClick={handleUseLiveLocationForDestination}
                      disabled={isLiveLocationLoading}
                      className="text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 transition"
                      title="Set destination to your current GPS position"
                    >
                      {isLiveLocationLoading ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        <Crosshair className="w-2.5 h-2.5 text-amber-600" />
                      )}
                      <span>Use Live GPS</span>
                    </button>
                  </div>

                  <select
                    value={destination.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'NONE_OPTION') {
                        setDestination(NONE_LOCATION);
                      } else if (val === 'LIVE_LOCATION_OPTION') {
                        handleUseLiveLocationForDestination();
                      } else {
                        const found = POPULAR_LOCATIONS.find(l => l.name === val);
                        if (found) setDestination(found);
                      }
                    }}
                    className={`w-full px-4 py-3 bg-[#FAF7F2] border rounded-xl text-sm font-medium focus:outline-none focus:border-[#6B1724] ${
                      isNoneLocation(destination) ? 'border-amber-300 text-stone-500 italic' : isLiveLocation(destination) ? 'border-emerald-500 font-bold text-emerald-900' : 'border-[#E8DFC8]'
                    }`}
                  >
                    {/* Live GPS Option */}
                    <option value="LIVE_LOCATION_OPTION">
                      {liveLocation ? `📍 Live Location (${liveLocation.name})` : '📍 Live Location (Fetch Device GPS)'}
                    </option>

                    {/* None Option */}
                    <option value="NONE_OPTION">
                      — None (Clear Selection) —
                    </option>

                    {/* Custom or live existing point */}
                    {(destination.category === 'custom' || destination.category === 'live') && (
                      <option value={destination.name}>
                        {destination.name}
                      </option>
                    )}

                    {/* Popular Location list */}
                    <optgroup label="Tirupati & Tirumala Sacred Spots">
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  <div className="flex items-center justify-between mt-1.5 text-[11px]">
                    <p className={`truncate ${isNoneLocation(destination) ? 'text-amber-600 font-medium' : isLiveLocation(destination) ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                      {isNoneLocation(destination) ? '⚠️ No destination selected. Please choose a drop point.' : isLiveLocation(destination) ? '✓ Live device GPS active' : (destination.notes || destination.address)}
                    </p>
                    {destination.category !== 'none' && (
                      <button
                        type="button"
                        onClick={() => setDestination(NONE_LOCATION)}
                        className="text-[10px] text-stone-400 hover:text-red-600 shrink-0 ml-2"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Quick destination chips */}
                  <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-stone-400">Quick:</span>
                    <button
                      type="button"
                      onClick={handleUseLiveLocationForDestination}
                      className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center space-x-1 ${
                        isLiveLocation(destination)
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <Crosshair className="w-2.5 h-2.5" />
                      <span>Live GPS</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDestination(NONE_LOCATION)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border ${
                        isNoneLocation(destination)
                          ? 'bg-stone-800 text-white border-stone-800'
                          : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      None
                    </button>
                    {[POPULAR_LOCATIONS[3], POPULAR_LOCATIONS[5]].map((loc) => (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => setDestination(loc)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border ${
                          destination.name === loc.name
                            ? 'bg-[#6B1724] text-white border-[#6B1724]'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {loc.name.split('(')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Validation Alert if None is selected */}
              {selectionError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{selectionError}</span>
                </div>
              )}

              {/* Interactive Map Section in Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-[#8C6D28]" />
                    <span className="text-xs font-bold text-stone-800">
                      Live Route Map (Drag Pins or Click Map to Select)
                    </span>
                    {isLiveLocation(pickup) && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Live GPS Pickup
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInteractiveMap(!showInteractiveMap)}
                    className="text-xs font-bold text-[#6B1724] hover:underline"
                  >
                    {showInteractiveMap ? 'Hide Map' : 'Show Map'}
                  </button>
                </div>

                {showInteractiveMap && (
                  <div className="rounded-2xl overflow-hidden border border-[#E8DFC8] shadow-inner">
                    <InteractiveMap
                      pickup={pickup}
                      destination={destination}
                      vehicleModel={selectedVehicle.models}
                      liveGpsPosition={liveLocation ? { lat: liveLocation.lat, lng: liveLocation.lng, accuracy: liveLocation.accuracy } : null}
                      isDraggable={true}
                      onPickupChange={(p) => {
                        setSelectionError(null);
                        setPickup(p);
                      }}
                      onDestinationChange={(d) => {
                        setSelectionError(null);
                        setDestination(d);
                      }}
                      onLiveLocationAcquired={(livePoint) => {
                        setSelectionError(null);
                        // If pickup was not set or is none, conveniently set pickup to acquired live point
                        if (isNoneLocation(pickup)) {
                          setPickup(livePoint);
                        }
                      }}
                      className="h-64 sm:h-72 w-full"
                    />
                  </div>
                )}
              </div>

              {/* Route distance teaser */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFC8] flex items-center justify-center text-lg">
                    🗺️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">
                      {hasValidRoute ? (
                        <>Calculated Route Distance: <span className="text-[#6B1724]">{distanceKm} km</span></>
                      ) : (
                        <span className="text-amber-800">Location incomplete: Select both pickup and destination</span>
                      )}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {hasValidRoute
                        ? `Estimated travel time: ~${Math.round(distanceKm * 2.2)} mins ${isGhatRoute ? '(includes mandatory Ghat road speed regulation)' : ''}`
                        : 'Choose a valid landmark or live GPS position for both points to continue'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isNoneLocation(pickup) || pickup.lat === 0) {
                      setSelectionError('Please choose a valid pickup location or use Live GPS.');
                      return;
                    }
                    if (isNoneLocation(destination) || destination.lat === 0) {
                      setSelectionError('Please choose a valid destination or use Live GPS.');
                      return;
                    }
                    setSelectionError(null);
                    setCurrentStep(2);
                  }}
                  disabled={!hasValidRoute}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center ${
                    hasValidRoute
                      ? 'bg-[#6B1724] hover:bg-[#58111A] text-white cursor-pointer'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  Choose Vehicle <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE VEHICLE */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">
                  Select Suitable Cab for Your Journey
                </h3>
                <span className="text-xs text-stone-500">
                  Route: {pickup.name.split('(')[0]} → {destination.name.split('(')[0]} ({distanceKm} km)
                </span>
              </div>

              <div className="space-y-3">
                {VEHICLE_OPTIONS.map((veh) => {
                  const fare = calculateFare(veh, distanceKm, isGhatRoute, tripType);
                  const isSelected = selectedVehicle.id === veh.id;

                  return (
                    <div
                      key={veh.id}
                      onClick={() => setSelectedVehicle(veh)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#6B1724] bg-[#6B1724]/4 shadow-sm'
                          : 'border-[#E8DFC8]/60 hover:border-[#6B1724]/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={veh.image}
                          alt={veh.name}
                          className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl object-cover border border-[#E8DFC8]"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                              {veh.name}
                            </h4>
                            {veh.popular && (
                              <span className="text-[10px] font-bold bg-[#D4AF37] text-[#3B0A11] px-1.5 py-0.5 rounded">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 font-medium">{veh.models}</p>
                          <div className="flex items-center space-x-3 text-[11px] text-stone-600 mt-1">
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-1 text-stone-400" /> {veh.passengers} Seats
                            </span>
                            <span>•</span>
                            <span>Boot: {veh.luggage} Bags</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">Chilled AC</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Available Now
                          </span>
                          <div className="text-base sm:text-lg font-bold text-[#6B1724] mt-0.5">
                            Direct Driver Rate
                          </div>
                          <span className="text-[10px] text-stone-500">FASTag & Hill Permits Included</span>
                        </div>
                        <button
                          type="button"
                          className={`mt-2 px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                            isSelected
                              ? 'bg-[#6B1724] text-white shadow-xs'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {isSelected ? 'Selected ✓' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  ← Back to Route
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#6B1724] hover:bg-[#58111A] text-white shadow-xs transition flex items-center"
                >
                  Schedule & Contact <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DATE, TIME & PASSENGER DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">
                When Do You Need the Cab?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-[#6B1724]" />
                    Date of Journey
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#6B1724]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-[#6B1724]" />
                    Pickup Time
                  </label>
                  <select
                    value={travelTime}
                    onChange={(e) => setTravelTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#6B1724]"
                  >
                    {[
                      '04:00 AM (Early Ghat Opening)',
                      '05:00 AM',
                      '06:30 AM',
                      '08:00 AM',
                      '09:30 AM',
                      '11:00 AM',
                      '01:00 PM',
                      '03:30 PM',
                      '05:00 PM',
                      '07:00 PM',
                      '09:00 PM'
                    ].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-[#6B1724]" />
                    No. of Passengers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedVehicle.passengers}
                    value={passengers}
                    onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#6B1724]"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="pt-4 border-t border-[#E8DFC8] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Passenger Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Lead Passenger Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ananth Kumar"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#6B1724]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Mobile Number (For Driver WhatsApp & SMS)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98480 XXXXX"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-sm font-medium focus:outline-none focus:border-[#6B1724]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Special Requests / Flight or Train Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Arriving on Vande Bharat Express at 09:15 AM, need luggage help"
                    className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs focus:outline-none focus:border-[#6B1724]"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  ← Back to Vehicle
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#6B1724] hover:bg-[#58111A] text-white shadow-xs transition flex items-center"
                >
                  Review & Confirm <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & PAYMENT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">
                Confirm Booking & Payment Preference
              </h3>

              {/* Summary card */}
              <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#E8DFC8] space-y-3 text-xs">
                <div className="flex justify-between pb-3 border-b border-[#E8DFC8]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">Selected Vehicle</span>
                    <p className="text-sm font-bold text-stone-900">{selectedVehicle.name}</p>
                    <p className="text-stone-500">{selectedVehicle.models}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400">Date & Time</span>
                    <p className="text-sm font-bold text-[#6B1724]">{travelDate}</p>
                    <p className="text-stone-600">{travelTime}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Pickup:</span>
                    <span className="font-semibold">{pickup.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Drop:</span>
                    <span className="font-semibold">{destination.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Passenger Name & Contact:</span>
                    <span className="font-semibold">{customerName} ({customerPhone})</span>
                  </div>
                </div>

                {/* Detailed Inclusions list (No prices) */}
                <div className="mt-3 pt-3 border-t border-[#E8DFC8] space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Route Distance & ETA:</span>
                    <span className="font-semibold text-stone-800">{distanceKm} km (~{Math.round(distanceKm * 2.2)} mins)</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>TTD FASTag & Ghat Road Hill Tolls:</span>
                    <span className="font-semibold text-emerald-700">Pre-Cleared & Included</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Mountain Chauffeur Hill Allowance:</span>
                    <span className="font-semibold text-emerald-700">Included</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Payment Terms:</span>
                    <span className="font-semibold text-[#6B1724]">Direct Driver Rate • Pay on Pickup / UPI</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-[#3B0A11] pt-2 border-t border-[#E8DFC8]">
                    <span>Immediate Phone / WhatsApp Assistance:</span>
                    <a href="tel:+919959312174" className="font-mono text-[#6B1724] hover:underline flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1" />
                      +91 99593 12174
                    </a>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Select Payment Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'cash', label: 'Pay at Pickup / Drop', icon: Shield, desc: 'Pay driver directly in cash' },
                    { id: 'upi', label: 'UPI / QR Code', icon: QrCode, desc: 'GPay, PhonePe, Paytm on arrival' },
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Driver card terminal' }
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        paymentMethod === pm.id
                          ? 'border-[#6B1724] bg-[#6B1724]/5 shadow-xs'
                          : 'border-[#E8DFC8] hover:border-stone-400 bg-white'
                      }`}
                    >
                      <pm.icon className={`w-5 h-5 mb-1.5 ${paymentMethod === pm.id ? 'text-[#6B1724]' : 'text-stone-400'}`} />
                      <div className="font-bold text-xs text-stone-900">{pm.label}</div>
                      <div className="text-[10px] text-stone-500">{pm.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-base">💬</span>
                  <span className="text-[11px] font-medium">Need instant custom quotes or special package pricing?</span>
                </div>
                <a
                  href="https://wa.me/919959312174?text=Hello%20Hari%20Travels,%20I%20want%20to%20confirm%20cab%20rates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:underline inline-flex items-center text-[11px] shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Chat on WhatsApp (+91 99593 12174)
                </a>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  ← Back to Schedule
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmAndPay}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#6B1724] to-[#7D1B2A] text-white shadow-md hover:shadow-lg transition flex items-center border border-[#D4AF37]/30 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Assigning Chauffeur...</span>
                  ) : (
                    <>
                      Confirm & Reserve Cab
                      <Sparkles className="w-4 h-4 ml-2 text-[#D4AF37]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Radar Matching Animation Modal */}
      {isSearchingRadar && (
        <RadarMatchingModal
          pickupName={pickup.name}
          vehicle={selectedVehicle}
          onDriverMatched={handleDriverMatched}
          onCancel={() => setIsSearchingRadar(false)}
        />
      )}
    </div>
  );
};
