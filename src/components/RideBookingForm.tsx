import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Send,
  ArrowRight,
  Info,
  Navigation,
  Crosshair,
  ExternalLink,
  MessageCircle,
  Check
} from 'lucide-react';
import { createRideBooking } from '../firebase';
import { useLiveLocation } from '../hooks/useLiveLocation';
import { POPULAR_LOCATIONS } from '../data/travelData';
import {
  getAdminBookingWhatsAppUrl,
  createGoogleMapsGpsLink,
  createGoogleMapsNavigateLink,
  resolveLocationGpsLink,
  resolveLocationNavigateLink,
  HARI_TRAVELS_PHONE_DISPLAY
} from '../utils/whatsapp';

interface RideBookingFormProps {
  onBookingSuccess?: (bookingId: string) => void;
  onOpenLiveTracking?: () => void;
}

const COMMON_PICKUPS = [
  'Tirupati Main Railway Station (TPTY)',
  'Renigunta Junction Station (RU)',
  'Tirupati International Airport (TIR)',
  'Alipiri Toll Gate & Checkpost',
  'Srinivasam Pilgrims Amenities Complex',
  'Vishnu Nivasam Complex',
  'Padmavathi Ammavari Temple, Tiruchanur'
];

const COMMON_DROPS = [
  'Tirumala Sri Venkateswara Temple (Main Gate)',
  'Tirumala CRO Accommodation Office',
  'Tirumala Rambagicha Guest House',
  'Sri Kalahasteeswara Temple (Srikalahasti)',
  'Kanipakam Sri Varasiddhi Vinayaka Temple',
  'Tirupati Main Railway Station',
  'Renigunta Airport'
];

export const RideBookingForm: React.FC<RideBookingFormProps> = ({
  onBookingSuccess,
  onOpenLiveTracking
}) => {
  // Form fields: Pickup location, Drop-off location, Date, Time + Contact
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupGpsLink, setPickupGpsLink] = useState('');
  const [pickupCoordinates, setPickupCoordinates] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('06:00');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('Sedan (Dzire / Etios)');
  const [passengers, setPassengers] = useState(4);
  const [notes, setNotes] = useState('');

  // Live Location GPS hook
  const { requestLiveLocation, isLoading: isLocatingLiveGps } = useLiveLocation();
  const [isLocating, setIsLocating] = useState(false);
  const [locatingNotice, setLocatingNotice] = useState<string | null>(null);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);
  const [submittedGpsLink, setSubmittedGpsLink] = useState<string>('');
  const [submittedNavigateLink, setSubmittedNavigateLink] = useState<string>('');
  const [submittedWaUrl, setSubmittedWaUrl] = useState<string>('');

  // Detect and fetch exact device GPS location
  const handleDetectLiveGps = async () => {
    setIsLocating(true);
    setLocatingNotice(null);
    setErrorMessage(null);

    try {
      const point = await requestLiveLocation();
      if (point && point.lat && point.lng) {
        const accuracyText = point.accuracy ? ` (GPS ±${point.accuracy}m)` : '';
        const nameText = `📍 My Current Location${accuracyText}`;
        setPickupLocation(nameText);

        const link = createGoogleMapsGpsLink(point.lat, point.lng);
        setPickupGpsLink(link);
        setPickupCoordinates({
          lat: point.lat,
          lng: point.lng,
          accuracy: point.accuracy
        });
        setLocatingNotice(`✓ Live GPS pinpointed (±${point.accuracy || 15}m). Exact navigation link attached!`);
      } else {
        setLocatingNotice('Could not acquire device GPS. You can type your location or pick a landmark.');
      }
    } catch {
      setLocatingNotice('GPS request was declined or timed out. Please enter pickup manually.');
    } finally {
      setIsLocating(false);
    }
  };

  // Quick pickup selection with pre-filled GPS coordinate links
  const handleSelectQuickPickup = (locName: string) => {
    setPickupLocation(locName);
    setLocatingNotice(null);

    const cleanSearch = locName.toLowerCase().split('(')[0].trim();
    const matched = POPULAR_LOCATIONS.find((l) =>
      l.name.toLowerCase().includes(cleanSearch)
    );

    if (matched && matched.lat !== 0 && matched.lng !== 0) {
      const link = createGoogleMapsGpsLink(matched.lat, matched.lng);
      setPickupGpsLink(link);
      setPickupCoordinates({ lat: matched.lat, lng: matched.lng });
    } else {
      const searchLink = resolveLocationGpsLink(locName);
      setPickupGpsLink(searchLink);
      setPickupCoordinates(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!pickupLocation.trim()) {
      setErrorMessage('Please provide a Pickup location or detect your live GPS.');
      return;
    }
    if (!dropoffLocation.trim()) {
      setErrorMessage('Please provide a Drop-off location.');
      return;
    }
    if (!date) {
      setErrorMessage('Please select the travel Date.');
      return;
    }
    if (!time) {
      setErrorMessage('Please select the travel Time.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Please enter the passenger name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine final GPS pin link and turn-by-turn navigation link
      let finalGpsLink = pickupGpsLink;
      let finalNavigateLink = '';

      if (pickupCoordinates && pickupCoordinates.lat && pickupCoordinates.lng) {
        finalGpsLink = createGoogleMapsGpsLink(pickupCoordinates.lat, pickupCoordinates.lng);
        finalNavigateLink = createGoogleMapsNavigateLink(pickupCoordinates.lat, pickupCoordinates.lng);
      } else {
        const clean = pickupLocation.toLowerCase().split('(')[0].trim();
        const matched = POPULAR_LOCATIONS.find((l) => l.name.toLowerCase().includes(clean));
        if (matched && matched.lat && matched.lng) {
          finalGpsLink = createGoogleMapsGpsLink(matched.lat, matched.lng);
          finalNavigateLink = createGoogleMapsNavigateLink(matched.lat, matched.lng);
        } else {
          finalGpsLink = resolveLocationGpsLink(pickupLocation.trim());
          finalNavigateLink = resolveLocationNavigateLink(pickupLocation.trim());
        }
      }

      // Save directly to Firestore database collection 'rides'
      const bookingId = await createRideBooking({
        pickupLocation: pickupLocation.trim(),
        dropoffLocation: dropoffLocation.trim(),
        pickupGpsLink: finalGpsLink,
        pickupCoordinates: pickupCoordinates || undefined,
        date,
        time,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        vehicleType,
        passengers: Number(passengers),
        tripType: pickupLocation.toLowerCase().includes('tirumala') || dropoffLocation.toLowerCase().includes('tirumala')
          ? 'Tirumala Hill Climb'
          : 'Local / Outstation',
        paymentMode: 'driver_pay',
        notes: notes.trim(),
        status: 'pending'
      });

      // Prepare Admin WhatsApp URL with live location GPS link and chauffeur navigation link
      const waUrl = getAdminBookingWhatsAppUrl({
        bookingId,
        pickupLocation: pickupLocation.trim(),
        pickupGpsLink: finalGpsLink,
        pickupNavigateLink: finalNavigateLink,
        pickupCoordinates: pickupCoordinates || undefined,
        dropoffLocation: dropoffLocation.trim(),
        date,
        time,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        vehicleType,
        passengers: Number(passengers),
        notes: notes.trim()
      });

      setSubmittedGpsLink(finalGpsLink);
      setSubmittedNavigateLink(finalNavigateLink);
      setSubmittedWaUrl(waUrl);
      setSubmittedBookingId(bookingId);

      // Automatically launch WhatsApp with the pre-filled message to Admin
      try {
        window.open(waUrl, '_blank');
      } catch {
        // Handled gracefully via the prominent confirmation button
      }

      if (onBookingSuccess) onBookingSuccess(bookingId);
    } catch (err: unknown) {
      console.error('Error saving booking to Firestore:', err);
      const error = err as Error;
      setErrorMessage(
        error?.message || 'Failed to save booking to Firestore. Please verify your connection or try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedBookingId(null);
    setPickupLocation('');
    setPickupGpsLink('');
    setPickupCoordinates(null);
    setDropoffLocation('');
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
    setLocatingNotice(null);
    setSubmittedGpsLink('');
    setSubmittedNavigateLink('');
    setSubmittedWaUrl('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {submittedBookingId ? (
        /* Booking Confirmation Card with Live Location GPS Link & WhatsApp Admin Send */
        <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl p-6 sm:p-8 animate-fadeIn text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <span className="text-[11px] uppercase font-black tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Booking Saved to Database
            </span>
            <span className="text-[11px] uppercase font-black tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-blue-600" />
              Live GPS Attached
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
            Ride Booked & Sent to Admin WhatsApp!
          </h3>

          <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto mt-2">
            Your booking details along with the <strong>Live Pickup GPS Link</strong> have been prepared for Hari Travels Dispatch ({HARI_TRAVELS_PHONE_DISPLAY}).
          </p>

          {/* Reference Details Box */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8DFC8] p-5 my-6 text-left space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#E8DFC8]/70 pb-2.5">
              <span className="text-xs text-stone-500 font-medium">Booking Reference ID:</span>
              <span className="font-mono text-xs font-black text-[#6B1724] bg-white px-2.5 py-1 rounded-md border border-stone-200 shadow-2xs">
                #{submittedBookingId.slice(0, 8).toUpperCase()}
              </span>
            </div>

            {/* Prominent Pickup & Live GPS Link Box */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup Location & Live GPS
                </span>
                <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  Verified Pin
                </span>
              </div>
              <p className="font-bold text-stone-900 text-xs sm:text-sm">
                {pickupLocation}
              </p>
              {submittedNavigateLink && (
                <div className="pt-2 border-t border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-900 font-semibold">
                    <Navigation className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Driver Driving Navigation:</span>
                  </div>
                  <a
                    href={submittedNavigateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 rounded-lg transition shadow-2xs"
                  >
                    <span>Start Google Maps Driving Route</span>
                    <ExternalLink className="w-3 h-3 text-emerald-200 shrink-0" />
                  </a>
                </div>
              )}
              {submittedGpsLink && (
                <div className="pt-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                  <span className="text-stone-500 text-[11px] font-medium">Customer Live GPS Pin:</span>
                  <a
                    href={submittedGpsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 hover:bg-emerald-100 transition shadow-2xs"
                  >
                    <span>View Coordinates Pin</span>
                    <ExternalLink className="w-3 h-3 text-emerald-600 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Drop-off Location</span>
                <span className="font-bold text-stone-800">{dropoffLocation}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Date & Time</span>
                <span className="font-bold text-stone-800">{date} at {time}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Passenger Contact</span>
                <span className="font-bold text-stone-800">{customerName} ({customerPhone})</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Vehicle & Passengers</span>
                <span className="font-bold text-stone-800">{vehicleType} ({passengers} Pax)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8DFC8]/60 flex items-center justify-between text-xs">
              <span className="text-stone-600 font-medium">Payment & Advance:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Direct Driver Settlement (Zero Advance)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={submittedWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>Send to Admin WhatsApp with Live GPS Link</span>
            </a>

            {onOpenLiveTracking && (
              <button
                type="button"
                onClick={onOpenLiveTracking}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#6B1724] hover:bg-[#58111A] text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Car className="w-4 h-4" />
                <span>Track Live GPS Screen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition"
            >
              Book Another Ride
            </button>
          </div>
        </div>
      ) : (
        /* Ride Booking Form */
        <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#6B1724] to-[#450C14] text-white p-6 sm:p-7">
            <div className="flex items-center space-x-2 text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Tirupati & Tirumala Transport</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Ride Booking Form
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Provide your travel details below. All bookings are saved directly to our dispatch database with zero advance required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-start space-x-3 text-rose-900 text-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Submission Error</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* ROUTE SECTION: PICKUP & DROP-OFF */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C6D28] flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-[#6B1724]" />
                1. Route Locations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pickup Location with Live GPS Detection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Pickup Location <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLiveGps}
                      disabled={isLocating || isLocatingLiveGps}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 transition disabled:opacity-50 cursor-pointer shadow-2xs"
                      title="Fetch your current live device GPS coordinates"
                    >
                      {isLocating || isLocatingLiveGps ? (
                        <>
                          <Loader2 className="w-3 h-3 text-emerald-700 animate-spin" />
                          <span>Acquiring GPS...</span>
                        </>
                      ) : (
                        <>
                          <Crosshair className="w-3 h-3 text-emerald-700" />
                          <span>Use Live GPS</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Current Location / Railway Station / Hotel"
                      value={pickupLocation}
                      onChange={(e) => {
                        setPickupLocation(e.target.value);
                        setPickupGpsLink('');
                        setPickupCoordinates(null);
                        setLocatingNotice(null);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition"
                    />
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  </div>

                  {/* Active GPS Indicator Banner */}
                  {pickupGpsLink && (
                    <div className="mt-2 p-2.5 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-300 rounded-xl space-y-1 text-[11px] text-emerald-950">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Customer Live GPS Pin Attached</span>
                        </div>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                          Ready for Driver
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-emerald-800 leading-tight">
                        When you book, the assigned chauffeur will receive 1-tap Google Maps turn-by-turn driving directions to reach your exact pick up point!
                      </p>
                      <div className="pt-1 flex items-center justify-end gap-2">
                        {pickupCoordinates && (
                          <a
                            href={createGoogleMapsNavigateLink(pickupCoordinates.lat, pickupCoordinates.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-2 py-0.5 rounded-md inline-flex items-center gap-1 transition"
                          >
                            <Navigation className="w-2.5 h-2.5" />
                            <span>Test Driver Route</span>
                          </a>
                        )}
                        <a
                          href={pickupGpsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-emerald-800 hover:underline inline-flex items-center gap-0.5"
                        >
                          Preview Pin
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {locatingNotice && !pickupGpsLink && (
                    <p className="mt-1 text-[11px] text-amber-700 font-medium">{locatingNotice}</p>
                  )}

                  {/* Quick Pick Suggestions */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {COMMON_PICKUPS.slice(0, 3).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleSelectQuickPickup(p)}
                        className="text-[10px] bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-600 px-2 py-1 rounded-md transition cursor-pointer"
                      >
                        + {p.split('(')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drop-off Location */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Drop-off Location <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tirumala Temple / Hotel / Airport"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition"
                    />
                    <MapPin className="w-4 h-4 text-rose-600 absolute left-3 top-3" />
                  </div>
                  {/* Quick Drop Suggestions */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {COMMON_DROPS.slice(0, 3).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDropoffLocation(d)}
                        className="text-[10px] bg-stone-100 hover:bg-rose-50 hover:text-rose-800 text-stone-600 px-2 py-1 rounded-md transition"
                      >
                        + {d.split('(')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SCHEDULE SECTION: DATE & TIME */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C6D28] flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-[#6B1724]" />
                2. Date & Time
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Travel Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition"
                    />
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Pickup Time <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition"
                    />
                    <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* PASSENGER DETAILS */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C6D28] flex items-center">
                <User className="w-4 h-4 mr-1 text-[#6B1724]" />
                3. Passenger & Vehicle Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Passenger Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9959312174"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Select Vehicle
                  </label>
                  <div className="relative">
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition bg-white"
                    >
                      <option value="Sedan (Dzire / Etios)">Prime Sedan (4 Seats - Dzire / Etios)</option>
                      <option value="SUV (Ertiga)">Family SUV (6-7 Seats - Ertiga)</option>
                      <option value="Innova Crysta">Premium Innova Crysta (7 Seats)</option>
                      <option value="Tempo Traveller">Tempo Traveller (12-14 Seats)</option>
                    </select>
                    <Car className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Number of Passengers */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Total Passengers
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={passengers}
                    onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition"
                  />
                </div>
              </div>

              {/* Luggage / Darshan Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Special Notes / Darshan Slot Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. VIP break darshan at 9 AM, flight arrival SG-102, elderly pilgrim wheelchair support"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 text-xs font-medium text-stone-900 transition resize-none"
                />
              </div>
            </div>

            {/* Trust Banner with Live GPS & WhatsApp Dispatch Details */}
            <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200/90 flex items-start space-x-2.5 text-xs text-amber-900">
              <Info className="w-4 h-4 text-[#8C6D28] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-stone-900">
                  Instant Admin WhatsApp Dispatch & Zero Advance Required
                </span>
                <span className="text-[11px] text-stone-600">
                  When you submit, your reservation is saved to the database and sent directly to Admin WhatsApp ({HARI_TRAVELS_PHONE_DISPLAY}) with the exact live GPS link for navigation. Pay driver directly upon drop.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#6B1724] to-[#801B2B] hover:from-[#58111A] hover:to-[#6B1724] text-white shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Saving Booking & Opening WhatsApp...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>Book Cab & Send to Admin WhatsApp with Live GPS</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
