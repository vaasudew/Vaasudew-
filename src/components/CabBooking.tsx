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
  Smartphone,
  Phone,
  PhoneCall,
  MessageCircle,
  KeyRound,
  Search,
  Compass,
  Crosshair,
  Loader2,
  XCircle,
  LocateFixed,
  Navigation,
  Copy,
  Check,
  Banknote,
  Send,
  ExternalLink
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
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'none' | 'driver_pay' | 'upi'>('none');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [driverPayNotification, setDriverPayNotification] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
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

  // Generate URL-encoded WhatsApp booking message with all selected route and schedule options
  const getWhatsAppBookingUrl = () => {
    const tripTypeLabels: Record<TripType, string> = {
      hillclimb: 'Tirumala Hill Climb (FASTag & Ghat Toll Included)',
      oneway: 'One Way Drop',
      roundtrip: 'Round Trip (Wait & Return)',
      sightseeing: 'Full Day Sightseeing (8 Hours / Temple Darshan)'
    };
    const tripName = tripTypeLabels[tripType] || 'Cab Booking';

    const lines = [
      `Hello Hari Travels, I would like to book a cab in Tirupati / Tirumala.`,
      ``,
      `🚖 Trip Type: ${tripName}`,
      `📍 Pickup Location: ${pickup.name}`,
      `🏁 Drop Destination: ${destination.name}`,
      `🛣️ Route Distance: ${distanceKm > 0 ? `${distanceKm} km (~${Math.round(distanceKm * 2.2)} mins)` : 'To be confirmed'}`,
      `📅 Date of Journey: ${travelDate} at ${travelTime}`,
      `👥 Passengers: ${passengers}`,
      customerName ? `👤 Pilgrim Name: ${customerName}` : '',
      customerPhone ? `📞 Mobile: ${customerPhone}` : '',
      specialNotes ? `📝 Special Note: ${specialNotes}` : '',
      ``,
      `Please confirm available cabs, best driver rates, and dispatch details!`
    ].filter(Boolean).join('\n');

    return `https://wa.me/919959312174?text=${encodeURIComponent(lines)}`;
  };

  // Automatically sends pickup and drop location to WhatsApp when Driver Pay is selected
  const handleSelectDriverPay = () => {
    setSelectedPaymentMode('driver_pay');

    const tripTypeLabels: Record<TripType, string> = {
      hillclimb: 'Tirumala Hill Climb (FASTag & Ghat Toll Included)',
      oneway: 'One Way Drop',
      roundtrip: 'Round Trip (Wait & Return)',
      sightseeing: 'Full Day Sightseeing (8 Hours / Temple Darshan)'
    };
    const tripName = tripTypeLabels[tripType] || 'Cab Booking';

    const lines = [
      `*🚖 NEW CAB BOOKING - PAY TO DRIVER*`,
      `Hello Hari Travels, I am selecting *Pay to Driver* for my cab booking.`,
      ``,
      `📍 *Pickup Location:* ${pickup.name}`,
      `🏁 *Drop Destination:* ${destination.name}`,
      `🛣️ *Distance:* ${distanceKm > 0 ? `${distanceKm} km (~${Math.round(distanceKm * 2.2)} mins)` : 'To be confirmed'}`,
      `📅 *Date & Time:* ${travelDate} at ${travelTime}`,
      `👥 *Passengers:* ${passengers}`,
      customerName ? `👤 *Passenger Name:* ${customerName}` : '',
      customerPhone ? `📞 *Phone Number:* ${customerPhone}` : '',
      specialNotes ? `📝 *Special Request:* ${specialNotes}` : '',
      ``,
      `💵 *Payment Mode:* Pay to Driver directly on pickup / drop (Zero Advance)`,
      `Please assign our chauffeur and confirm cab dispatch!`
    ].filter(Boolean).join('\n');

    const waUrl = `https://wa.me/919959312174?text=${encodeURIComponent(lines)}`;
    setDriverPayNotification(`Pickup (${pickup.name}) and Drop (${destination.name}) automatically sent to WhatsApp (+91 99593 12174)!`);
    
    // Automatically trigger WhatsApp opening without requiring extra permission
    window.open(waUrl, '_blank');
  };

  // UPI App redirection for Google Pay, PhonePe, and Paytm
  const handleOpenUpiApp = (appName: 'gpay' | 'phonepe' | 'paytm') => {
    const note = encodeURIComponent(`Hari Travels - ${pickup.name.split(',')[0]} to ${destination.name.split(',')[0]}`);
    const upiId = '9959312174@ybl';
    const payeeName = encodeURIComponent('Hari Travels Tirupati');

    let targetScheme = '';
    if (appName === 'gpay') {
      targetScheme = `gpay://upi/pay?pa=${upiId}&pn=${payeeName}&cu=INR&tn=${note}`;
    } else if (appName === 'phonepe') {
      targetScheme = `phonepe://pay?pa=${upiId}&pn=${payeeName}&cu=INR&tn=${note}`;
    } else if (appName === 'paytm') {
      targetScheme = `paytmmp://pay?pa=${upiId}&pn=${payeeName}&cu=INR&tn=${note}`;
    }

    // Try app scheme
    window.location.href = targetScheme;

    // Fallback to standard UPI link if specific app scheme isn't registered on desktop/device
    setTimeout(() => {
      const fallbackUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&cu=INR&tn=${note}`;
      window.location.href = fallbackUrl;
    }, 1200);
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText('9959312174@ybl');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
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
        {/* Portal Header */}
        <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#E8DFC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D28]">
              Reserve Private Transport
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#3B0A11]">
              Cab Booking & Live Route
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
              WhatsApp & 24/7 Phone Dispatch
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold">
              TTD FASTag & Hill Permits
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
              {/* Trip type selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Trip Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'hillclimb', label: 'Tirumala Hill Climb', badge: 'FASTag' },
                    { id: 'oneway', label: 'One Way Drop', badge: 'Direct' },
                    { id: 'roundtrip', label: 'Round Trip (Wait & Return)', badge: 'Wait & Return' },
                    { id: 'sightseeing', label: 'Full Day Sightseeing', badge: '8 Hours' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTripType(t.id as TripType)}
                      className={`p-2.5 sm:p-3 rounded-xl text-left border transition text-xs relative flex flex-col justify-between min-h-[72px] sm:min-h-[78px] ${
                        tripType === t.id
                          ? 'border-[#6B1724] bg-[#6B1724]/8 text-[#6B1724] font-bold shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                      }`}
                    >
                      <span className="leading-snug">{t.label}</span>
                      <span className="text-[9px] uppercase font-bold text-[#8C6D28] tracking-wider mt-1 block">
                        {t.badge}
                      </span>
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

              {/* SCHEDULE, PASSENGERS & PILGRIM DETAILS */}
              <div className="p-5 sm:p-6 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC8] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-[#6B1724]" />
                  Schedule & Pilgrim Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1 flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-[#6B1724]" />
                      Date of Journey
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#6B1724]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-[#6B1724]" />
                      Pickup Time
                    </label>
                    <select
                      value={travelTime}
                      onChange={(e) => setTravelTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#6B1724]"
                    >
                      {[
                        '03:30 AM (Suprabhatham Special)',
                        '04:30 AM (Ghat Gate Opening)',
                        '06:00 AM',
                        '07:30 AM',
                        '09:00 AM',
                        '10:30 AM',
                        '12:00 PM',
                        '02:00 PM',
                        '04:00 PM',
                        '06:00 PM',
                        '08:00 PM',
                        '10:00 PM'
                      ].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1 flex items-center">
                      <Users className="w-3 h-3 mr-1 text-[#6B1724]" />
                      No. of Passengers
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={passengers}
                      onChange={(e) => setPassengers(Math.max(1, Math.min(14, parseInt(e.target.value) || 1)))}
                      className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#6B1724]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Lead Passenger Name (Optional)
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      maxLength={50}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value.replace(/[^a-zA-Z\s.']/g, '').slice(0, 50))}
                      placeholder="Enter full name"
                      className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-[#6B1724]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Contact Mobile (For WhatsApp Dispatch)
                    </label>
                    <input
                      type="tel"
                      autoComplete="off"
                      maxLength={15}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9+ -]/g, '').slice(0, 15))}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-[#6B1724]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Special Requests / Luggage Notes
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    maxLength={200}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value.replace(/[<>{}[\]\\]/g, '').slice(0, 200))}
                    placeholder="e.g. Elder pilgrims needing gentle ghat driving, airport flight arrival, extra boot luggage..."
                    className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-[#6B1724]"
                  />
                </div>
              </div>

              {/* VEHICLE SELECTION OPTIONS (PROPERLY ALIGNED ON MOBILE AS 2 COLS, DESKTOP 4 COLS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center">
                    <Car className="w-3.5 h-3.5 mr-1 text-[#6B1724]" />
                    Select Preferred Cab
                  </label>
                  <span className="text-[10px] text-stone-500 font-medium">
                    TTD Ghat Road Permitted
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {VEHICLE_OPTIONS.map((v) => {
                    const isSelected = selectedVehicle.id === v.id;
                    const vFare = calculateFare(v, distanceKm, isGhatRoute, tripType);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVehicle(v)}
                        className={`p-2.5 sm:p-3 rounded-2xl text-left border transition flex flex-col justify-between min-h-[96px] sm:min-h-[105px] relative group cursor-pointer ${
                          isSelected
                            ? 'border-[#6B1724] bg-[#6B1724]/8 text-[#6B1724] ring-2 ring-[#6B1724]/30 shadow-xs'
                            : 'border-[#E8DFC8] bg-white hover:border-stone-400 text-stone-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-xs sm:text-sm truncate">
                              {v.name}
                            </span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#6B1724] shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-stone-500 block truncate">
                            {v.passengers} Seats • {v.models.split('/')[0]}
                          </span>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-baseline justify-between">
                          <span className="text-[9px] uppercase font-bold text-stone-400">Est. Fare</span>
                          <span className={`text-xs sm:text-sm font-black ${isSelected ? 'text-[#6B1724]' : 'text-stone-900'}`}>
                            ₹{vFare.totalFare}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ROUTE DISTANCE & ESTIMATE SUMMARY */}
              <div className="p-3.5 sm:p-4 bg-amber-50/90 rounded-2xl border border-amber-200/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-lg shrink-0 shadow-xs">
                    🛣️
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-amber-950 truncate">
                      {hasValidRoute ? (
                        <>Calculated Distance: <span className="text-[#6B1724] font-black">{distanceKm} km</span></>
                      ) : (
                        <span className="text-amber-800">Please choose pickup & drop</span>
                      )}
                    </h4>
                    <p className="text-[11px] text-amber-800/90 leading-tight">
                      {hasValidRoute
                        ? `Est. travel time: ~${Math.round(distanceKm * 2.2)} mins • FASTag & Ghat Toll Included`
                        : 'Choose your pickup and destination landmarks or use Live GPS location above'}
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200/60 shrink-0">
                  <span className="text-xs font-black text-[#6B1724]">
                    ₹{fareBreakdown.totalFare} total
                  </span>
                  <span className="inline-block px-2.5 py-1 bg-white rounded-lg border border-amber-300 text-[10px] font-black text-[#6B1724] uppercase tracking-wide shadow-2xs">
                    Zero Advance Required
                  </span>
                </div>
              </div>

              {/* BOOKING & PAYMENT OPTIONS HEADER */}
              <div className="pt-2 space-y-4">
                <div className="text-center px-1">
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-[#8C6D28]">
                    Live Booking & Payment Options
                  </span>
                  <h3 className="font-display text-base sm:text-xl font-bold text-[#3B0A11] mt-0.5">
                    Choose Your Preferred Booking Method
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 max-w-lg mx-auto mt-0.5 leading-relaxed">
                    Select any option below to instantly reserve your cab with Hari Travels. All rides include verified hill chauffeurs and TTD FASTag clearance.
                  </p>
                </div>

                {selectionError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{selectionError}</span>
                  </div>
                )}

                {/* Driver Pay Auto-Dispatch Notification */}
                {driverPayNotification && (
                  <div className="p-3.5 sm:p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-xs text-emerald-900 shadow-sm animate-fadeIn">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-emerald-950">
                            Pickup & Drop Sent to WhatsApp Dispatch!
                          </p>
                          <p className="text-emerald-800 mt-0.5 text-[11px] sm:text-xs">
                            {driverPayNotification}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-1 font-semibold">
                            ✓ Chauffeur assigned • Pay cash or UPI directly to driver upon arrival.
                          </p>
                        </div>
                      </div>
                      <a
                        href={getWhatsAppBookingUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] sm:text-[11px] font-bold transition flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Open Chat
                      </a>
                    </div>
                  </div>
                )}

                {/* THE 4 PROPERLY ALIGNED OPTIONS IN MOBILE VIEW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* OPTION 1: WhatsApp Booking */}
                  <a
                    href={getWhatsAppBookingUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-sm hover:shadow-md transition border border-emerald-400/40 flex flex-col justify-between min-h-[160px] sm:min-h-[170px] group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs shadow-inner shrink-0">
                          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-emerald-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                          Option 1 • Instant
                        </span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        Book via WhatsApp
                      </h4>
                      <p className="text-[11px] sm:text-xs text-emerald-100 mt-1 leading-relaxed">
                        Launches WhatsApp with pickup, drop destination, date, and passenger details pre-filled in chat.
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-emerald-500/40 flex items-center justify-between font-bold text-xs text-white">
                      <span>Launch WhatsApp Chat</span>
                      <ChevronRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition" />
                    </div>
                  </a>

                  {/* OPTION 2: Direct Call */}
                  <a
                    href="tel:+919959312174"
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#6B1724] to-[#450C14] hover:from-[#58111A] hover:to-[#380910] text-white shadow-sm hover:shadow-md transition border border-[#D4AF37]/50 flex flex-col justify-between min-h-[160px] sm:min-h-[170px] group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] backdrop-blur-xs shadow-inner border border-[#D4AF37]/30 shrink-0">
                          <Phone className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <span className="px-2.5 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                          Option 2 • 24/7 Desk
                        </span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        Call +91 99593 12174
                      </h4>
                      <p className="text-[11px] sm:text-xs text-stone-300 mt-1 leading-relaxed">
                        Direct call to our Tirupati transport dispatch desk for immediate allocation and ghat slot coordination.
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-[#D4AF37]/20 flex items-center justify-between font-bold text-xs text-[#D4AF37]">
                      <span>Call Helpline Now</span>
                      <ChevronRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition" />
                    </div>
                  </a>

                  {/* OPTION 3: Pay to Driver (Automatically sends pickup & drop to WhatsApp) */}
                  <button
                    type="button"
                    onClick={handleSelectDriverPay}
                    className={`p-4 sm:p-5 rounded-2xl text-left shadow-sm hover:shadow-md transition border flex flex-col justify-between min-h-[160px] sm:min-h-[170px] group cursor-pointer ${
                      selectedPaymentMode === 'driver_pay'
                        ? 'bg-amber-900/90 text-white border-amber-400 ring-2 ring-amber-400/50'
                        : 'bg-white text-stone-900 hover:bg-amber-50/40 border-[#E8DFC8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-inner shrink-0 ${
                          selectedPaymentMode === 'driver_pay' ? 'bg-amber-500/20 text-[#D4AF37]' : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          <Banknote className="w-5 h-5" />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedPaymentMode === 'driver_pay' ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30' : 'bg-amber-100 text-amber-900'
                        }`}>
                          Option 3 • Zero Advance
                        </span>
                      </div>
                      <h4 className={`font-bold text-sm sm:text-base ${selectedPaymentMode === 'driver_pay' ? 'text-white' : 'text-stone-900'}`}>
                        Pay to Driver (Cash on Drop)
                      </h4>
                      <p className={`text-[11px] sm:text-xs mt-1 leading-relaxed ${selectedPaymentMode === 'driver_pay' ? 'text-amber-100' : 'text-stone-500'}`}>
                        Sends pickup and drop destination straight to WhatsApp (+91 99593 12174). Pay directly to chauffeur upon arrival.
                      </p>
                    </div>

                    <div className={`mt-3.5 pt-2.5 border-t flex items-center justify-between font-bold text-xs ${
                      selectedPaymentMode === 'driver_pay' ? 'border-amber-400/30 text-amber-300' : 'border-stone-200 text-[#6B1724]'
                    }`}>
                      <span>Select & Send to WhatsApp</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </button>

                  {/* OPTION 4: Pay via UPI / Apps */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentMode('upi');
                    }}
                    className={`p-4 sm:p-5 rounded-2xl text-left shadow-sm hover:shadow-md transition border flex flex-col justify-between min-h-[160px] sm:min-h-[170px] group cursor-pointer ${
                      selectedPaymentMode === 'upi'
                        ? 'bg-gradient-to-br from-indigo-950 to-slate-900 text-white border-indigo-400 ring-2 ring-indigo-400/50'
                        : 'bg-white text-stone-900 hover:bg-indigo-50/30 border-[#E8DFC8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-inner shrink-0 ${
                          selectedPaymentMode === 'upi' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                        }`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedPaymentMode === 'upi' ? 'bg-indigo-400/20 text-indigo-200 border border-indigo-400/30' : 'bg-indigo-100 text-indigo-900'
                        }`}>
                          Option 4 • Instant UPI
                        </span>
                      </div>
                      <h4 className={`font-bold text-sm sm:text-base ${selectedPaymentMode === 'upi' ? 'text-white' : 'text-stone-900'}`}>
                        Pay via UPI
                      </h4>
                      <p className={`text-[11px] sm:text-xs mt-1 leading-relaxed ${selectedPaymentMode === 'upi' ? 'text-indigo-100' : 'text-stone-500'}`}>
                        Direct 1-tap redirect to Google Pay, PhonePe, or Paytm app.
                      </p>
                    </div>

                    <div className={`mt-3.5 pt-2.5 border-t flex items-center justify-between font-bold text-xs ${
                      selectedPaymentMode === 'upi' ? 'border-indigo-400/30 text-indigo-300' : 'border-stone-200 text-[#6B1724]'
                    }`}>
                      <span>Open GPay / PhonePe / Paytm</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </button>
                </div>

                {/* EXPANDED OPTION 4: UPI APPS REDIRECTION SECTION (PROPERLY ALIGNED ON MOBILE) */}
                {selectedPaymentMode === 'upi' && (
                  <div className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border-2 border-indigo-400 shadow-md animate-fadeIn mt-3.5">
                    <div className="text-center max-w-md mx-auto mb-4 sm:mb-6">
                      <span className="text-[10px] uppercase font-black tracking-widest text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">
                        Instant UPI Redirection
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-stone-900 font-display mt-2">
                        Select Your UPI App to Pay
                      </h4>
                      <p className="text-[11px] sm:text-xs text-stone-500 mt-1">
                        Tap any app below to automatically launch your installed payment app.
                      </p>
                    </div>

                    {/* 3 UPI APP REDIRECT BUTTONS ALIGNED IN 3-COL ON MOBILE */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3.5 mb-4 sm:mb-6">
                      {/* Google Pay Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenUpiApp('gpay')}
                        className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-50 hover:bg-blue-50 border-2 border-stone-200 hover:border-blue-500 transition flex flex-col items-center justify-center text-center group cursor-pointer shadow-xs min-h-[92px] sm:min-h-[110px]"
                      >
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white shadow-xs flex items-center justify-center p-1.5 sm:p-2 mb-1.5 group-hover:scale-105 transition shrink-0">
                          <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-8 sm:h-8">
                            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                          </svg>
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-stone-900 group-hover:text-blue-600 truncate max-w-full">
                          Google Pay
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-stone-500 hidden sm:block mt-0.5">
                          Tap to open GPay
                        </span>
                      </button>

                      {/* PhonePe Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenUpiApp('phonepe')}
                        className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-50 hover:bg-purple-50 border-2 border-stone-200 hover:border-purple-600 transition flex flex-col items-center justify-center text-center group cursor-pointer shadow-xs min-h-[92px] sm:min-h-[110px]"
                      >
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#5f259f] text-white shadow-xs flex items-center justify-center p-1.5 sm:p-2 mb-1.5 group-hover:scale-105 transition font-bold text-sm sm:text-lg font-serif shrink-0">
                          पे
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-stone-900 group-hover:text-purple-700 truncate max-w-full">
                          PhonePe
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-stone-500 hidden sm:block mt-0.5">
                          Tap to open PhonePe
                        </span>
                      </button>

                      {/* Paytm Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenUpiApp('paytm')}
                        className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-50 hover:bg-cyan-50 border-2 border-stone-200 hover:border-cyan-600 transition flex flex-col items-center justify-center text-center group cursor-pointer shadow-xs min-h-[92px] sm:min-h-[110px]"
                      >
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#002e6e] text-[#00b9f5] shadow-xs flex items-center justify-center p-1 sm:p-1.5 mb-1.5 group-hover:scale-105 transition font-black text-[10px] sm:text-xs tracking-tighter shrink-0">
                          Paytm
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-stone-900 group-hover:text-cyan-800 truncate max-w-full">
                          Paytm
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-stone-500 hidden sm:block mt-0.5">
                          Tap to open Paytm
                        </span>
                      </button>
                    </div>

                    {/* UPI ID & DIRECT CONFIRMATION BOX (PROPERLY ALIGNED ON MOBILE) */}
                    <div className="p-3.5 sm:p-5 bg-stone-50 rounded-xl sm:rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="space-y-1 text-left w-full sm:w-auto min-w-0">
                        <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                          Verified Merchant UPI ID
                        </span>
                        <div className="flex items-center justify-between sm:justify-start gap-2 mt-1 bg-white p-1 sm:p-1.5 rounded-xl border border-stone-200">
                          <span className="font-mono font-bold text-xs sm:text-base text-stone-900 select-all truncate pl-2">
                            9959312174@ybl
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyUpiId}
                            className="shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                          >
                            {copiedUpi ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy ID</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-stone-600 pt-0.5">
                          Account: <strong>Hari Travels Tirupati</strong> • Zero surcharge across all UPI apps.
                        </p>
                      </div>

                      <div className="shrink-0 w-full sm:w-auto">
                        <a
                          href={`https://wa.me/919959312174?text=${encodeURIComponent(`Hello Hari Travels, I am booking a cab from ${pickup.name} to ${destination.name} (${distanceKm} km on ${travelDate} at ${travelTime}) and have initiated UPI payment to 9959312174@ybl. Please confirm dispatch!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                        >
                          <MessageCircle className="w-4 h-4 fill-white text-emerald-600 shrink-0" />
                          <span>Confirm on WhatsApp</span>
                          <ExternalLink className="w-3 h-3 text-emerald-200 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
