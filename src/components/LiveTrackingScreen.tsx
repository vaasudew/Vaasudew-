import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  Phone, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  X, 
  RotateCcw, 
  Play, 
  Pause,
  ArrowRight,
  AlertOctagon,
  Radio,
  Compass,
  Car,
  KeyRound,
  Copy,
  ExternalLink,
  Sliders,
  Check,
  MessageCircle
} from 'lucide-react';
import { RideBooking, ChatMessage, LocationPoint } from '../types/travel';
import { InteractiveMap } from './InteractiveMap';
import { SpeedometerGauge } from './SpeedometerGauge';
import { SosModal } from './SosModal';
import { 
  TIRUPATI_TIRUMALA_PRESET, 
  CITY_ROUTE_PRESETS, 
  CityRoutePreset, 
  INITIAL_WANDERING_CABS, 
  WanderingCab, 
  tickWanderCabs,
  RouteWaypoint
} from '../utils/simulationRoutes';
import { calculateBearing } from '../utils/vehicleIcons';

interface LiveTrackingScreenProps {
  booking: RideBooking;
  onUpdateBooking: (updated: RideBooking) => void;
  onBackToHome: () => void;
}

export const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({
  booking,
  onUpdateBooking,
  onBackToHome
}) => {
  // Active City Preset (default: Tirupati to Tirumala)
  const [selectedCityPreset, setSelectedCityPreset] = useState<CityRoutePreset>(TIRUPATI_TIRUMALA_PRESET);
  
  // Active Vehicle Model Switcher (Toyota Etios, Maruti Suzuki Ertiga, Toyota Innova, Tempo Traveller)
  const [activeVehicleModel, setActiveVehicleModel] = useState<string>(
    booking.vehicle?.name?.includes('Innova') ? 'Toyota Innova' :
    booking.vehicle?.name?.includes('Ertiga') || booking.vehicle?.name?.includes('SUV') ? 'Maruti Suzuki Ertiga' :
    booking.vehicle?.name?.includes('Tempo') ? 'Tempo Traveller' : 'Toyota Etios'
  );

  // Simulation & GPS state
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<1 | 2 | 5>(1);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number>(0);
  const [subStepProgress, setSubStepProgress] = useState<number>(0); // 0 to 1 between waypoints
  
  // Real-time dynamic telemetries
  const [distanceRemainingKm, setDistanceRemainingKm] = useState<number>(booking.distanceKm || 22.4);
  const [etaSecondsRemaining, setEtaSecondsRemaining] = useState<number>(Math.round((booking.durationMinutes || 38) * 60));
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState<number>(34);
  const [driverHeading, setDriverHeading] = useState<number>(45);

  // 4-digit Ride OTP
  const [rideOtp, setRideOtp] = useState<string>(booking.otp || '4892');
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Real Browser GPS tracking
  const [browserGpsActive, setBrowserGpsActive] = useState<boolean>(false);
  const [browserGpsPosition, setBrowserGpsPosition] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [browserGpsError, setBrowserGpsError] = useState<string | null>(null);

  // Wandering nearby cabs simulation
  const [wanderingCabs, setWanderingCabs] = useState<WanderingCab[]>(INITIAL_WANDERING_CABS);

  // Modals & Drawers
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Driver GPS coordinates along the active preset waypoints
  const waypoints = selectedCityPreset.waypoints;
  const [driverCoord, setDriverCoord] = useState<{ lat: number; lng: number }>({
    lat: waypoints[0]?.lat || booking.pickup.lat,
    lng: waypoints[0]?.lng || booking.pickup.lng
  });

  // Animation and booking reference synchronization to prevent setState-in-render issues
  const currentWaypointIndexRef = useRef(0);
  const subStepProgressRef = useRef(0);
  const isSimulatingRef = useRef(isSimulating);
  isSimulatingRef.current = isSimulating;
  const bookingRef = useRef(booking);
  bookingRef.current = booking;
  const onUpdateBookingRef = useRef(onUpdateBooking);
  onUpdateBookingRef.current = onUpdateBooking;
  const waypointsRef = useRef(waypoints);
  waypointsRef.current = waypoints;
  const simulationSpeedRef = useRef(simulationSpeed);
  simulationSpeedRef.current = simulationSpeed;
  const selectedCityPresetRef = useRef(selectedCityPreset);
  selectedCityPresetRef.current = selectedCityPreset;
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'system',
      text: `Ride confirmed! Chauffeur ${booking.driver?.name || 'Ravi Kumar'} assigned with ${activeVehicleModel}. TTD FASTag verified.`,
      time: '10:28 AM'
    },
    {
      id: 'm2',
      sender: 'driver',
      text: `Namaskaram sir! I am arriving near ${booking.pickup.name.split(',')[0]} in a clean AC ${activeVehicleModel}. Your ride OTP is ${rideOtp}.`,
      time: '10:29 AM'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Sync latest refs
  useEffect(() => {
    isSimulatingRef.current = isSimulating;
    bookingRef.current = booking;
    onUpdateBookingRef.current = onUpdateBooking;
    waypointsRef.current = waypoints;
    simulationSpeedRef.current = simulationSpeed;
    selectedCityPresetRef.current = selectedCityPreset;
  }, [isSimulating, booking, onUpdateBooking, waypoints, simulationSpeed, selectedCityPreset]);

  // Handle Real Device Browser Geolocation Toggle
  const toggleBrowserGps = () => {
    if (browserGpsActive) {
      setBrowserGpsActive(false);
      setBrowserGpsPosition(null);
      return;
    }

    if (!navigator.geolocation) {
      setBrowserGpsError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBrowserGpsActive(true);
        setBrowserGpsError(null);
        setBrowserGpsPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      (err) => {
        setBrowserGpsError('GPS permission not granted or location unavailable. Continuing in interactive simulated GPS mode.');
        setBrowserGpsActive(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Watch position if browser GPS is active
  useEffect(() => {
    let watchId: number | null = null;
    if (browserGpsActive && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setBrowserGpsPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
        },
        (err) => {
          console.warn('watchPosition error:', err);
        },
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [browserGpsActive]);

  // Wandering nearby cabs background loop (every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setWanderingCabs((prev) => tickWanderCabs(prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Main Vehicle GPS Simulation Engine along Road Waypoints
  useEffect(() => {
    if (!isSimulating) return;

    // Tick speed inversely proportional to simulation multiplier
    const tickIntervalMs = Math.round(1000 / simulationSpeed);

    const timer = setInterval(() => {
      if (!isSimulatingRef.current) return;

      const currentWaypoints = waypointsRef.current;
      const speedMultiplier = simulationSpeedRef.current;
      let progress = subStepProgressRef.current + 0.08 * speedMultiplier;
      let wpIdx = currentWaypointIndexRef.current;

      if (progress >= 1) {
        progress = 0;
        wpIdx += 1;

        if (wpIdx >= currentWaypoints.length - 1) {
          wpIdx = currentWaypoints.length - 1;
          currentWaypointIndexRef.current = wpIdx;
          subStepProgressRef.current = 0;
          setCurrentWaypointIndex(wpIdx);
          setSubStepProgress(0);
          setDistanceRemainingKm(0);
          setEtaSecondsRemaining(0);
          setCurrentSpeedKmh(0);
          setIsSimulating(false);
          return;
        }

        currentWaypointIndexRef.current = wpIdx;
        setCurrentWaypointIndex(wpIdx);
      }

      subStepProgressRef.current = progress;
      setSubStepProgress(progress);

      // Interpolate position between current waypoint and next waypoint
      const wpA = currentWaypoints[wpIdx] || currentWaypoints[0];
      const wpB = currentWaypoints[Math.min(currentWaypoints.length - 1, wpIdx + 1)] || wpA;

      const currentLat = wpA.lat + (wpB.lat - wpA.lat) * progress;
      const currentLng = wpA.lng + (wpB.lng - wpA.lng) * progress;

      setDriverCoord({ lat: currentLat, lng: currentLng });

      // Calculate dynamic bearing/heading
      const heading = calculateBearing(wpA.lat, wpA.lng, wpB.lat, wpB.lng);
      setDriverHeading(heading);

      // Calculate realistic speed fluctuations
      const baseSpeed = wpA.speedLimitKmh || 35;
      const speedNoise = Math.sin(Date.now() / 800) * 4;
      setCurrentSpeedKmh(Math.max(18, Math.min(baseSpeed + speedNoise, 65)));

      // Update Remaining Distance and ETA Countdown
      const preset = selectedCityPresetRef.current;
      const remainingWaypointsCount = currentWaypoints.length - 1 - wpIdx - progress;
      const approxDistRemaining = Math.max(0, +(remainingWaypointsCount * (preset.distanceKm / currentWaypoints.length)).toFixed(1));
      setDistanceRemainingKm(approxDistRemaining);

      setEtaSecondsRemaining((prevSec) => Math.max(0, prevSec - Math.round(1.5 * speedMultiplier)));
    }, tickIntervalMs);

    return () => clearInterval(timer);
  }, [isSimulating, simulationSpeed]);

  // Simulated Phone Call Timer
  useEffect(() => {
    let callTimer: NodeJS.Timeout;
    if (isCalling) {
      callTimer = setInterval(() => {
        setCallDuration((c) => c + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(callTimer);
  }, [isCalling]);

  // Handle City Preset Switch
  const handleCityChange = (preset: CityRoutePreset) => {
    setSelectedCityPreset(preset);
    currentWaypointIndexRef.current = 0;
    subStepProgressRef.current = 0;
    setCurrentWaypointIndex(0);
    setSubStepProgress(0);
    setDistanceRemainingKm(preset.distanceKm);
    setEtaSecondsRemaining(preset.estimatedMins * 60);
    setDriverCoord({ lat: preset.waypoints[0].lat, lng: preset.waypoints[0].lng });
    setIsSimulating(true);

    onUpdateBookingRef.current({
      ...bookingRef.current,
      pickup: {
        name: preset.pickupDefault.name,
        address: preset.pickupDefault.address,
        lat: preset.pickupDefault.lat,
        lng: preset.pickupDefault.lng,
        category: 'station'
      },
      destination: {
        name: preset.dropDefault.name,
        address: preset.dropDefault.address,
        lat: preset.dropDefault.lat,
        lng: preset.dropDefault.lng,
        category: 'temple'
      },
      distanceKm: preset.distanceKm,
      durationMinutes: preset.estimatedMins
    });
  };

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(rideOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleShareTrip = () => {
    const shareText = `🚕 Tracking my Hari Travels ${activeVehicleModel} to ${booking.destination.name}. Chauffeur: ${booking.driver?.name} (${booking.driver?.vehicleNumber}). 4-Digit Ride OTP: ${rideOtp}. Live GPS link: ${window.location.origin}`;
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'customer',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    setTimeout(() => {
      const driverReplies = [
        `Got it sir! I am driving the ${activeVehicleModel} (${booking.driver?.vehicleNumber || 'AP 03 TX 4821'}). AC is set to comfortable cooling.`,
        "Yes sir, TTD Ghat Road FASTag clearance is completed. Following safe speed limits.",
        "Understood sir! I will assist you and your family with luggage at the pickup spot.",
        "Sure sir! If elderly pilgrims are aboard, I take special care at hairpin bends."
      ];
      const reply = driverReplies[Math.floor(Math.random() * driverReplies.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'driver',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const resetSimulation = () => {
    setCurrentWaypointIndex(0);
    setSubStepProgress(0);
    setDistanceRemainingKm(selectedCityPreset.distanceKm);
    setEtaSecondsRemaining(selectedCityPreset.estimatedMins * 60);
    setDriverCoord({
      lat: selectedCityPreset.waypoints[0].lat,
      lng: selectedCityPreset.waypoints[0].lng
    });
    setIsSimulating(true);
  };

  const currentWp = waypoints[currentWaypointIndex] || waypoints[0];
  const etaMinutes = Math.floor(etaSecondsRemaining / 60);
  const etaSeconds = etaSecondsRemaining % 60;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Top Breadcrumb & Live Controls Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-[#8C6D28] hover:text-[#6B1724] flex items-center mb-1 transition"
          >
            ← Back to Hari Travels Home
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#3B0A11] flex items-center gap-2">
              <span>Track Your Cab Live</span>
              <span className="text-[#8C6D28] font-serif">- Govindha</span>
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#6B1724] text-white flex items-center shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping mr-1.5"></span>
              ACTIVE SATELLITE FEED
            </span>
          </div>
          <p className="text-xs text-[#8C6D28] font-serif font-bold italic mt-0.5">
            Safe &amp; Blessed Tirumala Journeys • శ్రీవారి దివ్య రక్షణ
          </p>
        </div>

        {/* Engine Controls: City Switcher, Speed Controls, Real Device GPS */}
        <div className="flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-[#E8DFC8] shadow-sm text-xs">
          {/* City Preset Selector */}
          <div className="flex items-center space-x-1.5 pr-2 border-r border-[#E8DFC8]">
            <Compass className="w-3.5 h-3.5 text-[#8C6D28]" />
            <select
              value={selectedCityPreset.id}
              onChange={(e) => {
                const found = CITY_ROUTE_PRESETS.find(p => p.id === e.target.value);
                if (found) handleCityChange(found);
              }}
              className="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer text-xs"
            >
              {CITY_ROUTE_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Browser Real GPS Toggle */}
          <button
            onClick={toggleBrowserGps}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
              browserGpsActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
            title="Toggle device's physical GPS location"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{browserGpsActive ? 'Device GPS (Active)' : 'Use Browser GPS'}</span>
          </button>

          {/* Simulation Speed Buttons (1x, 2x, 5x) */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl">
            {([1, 2, 5] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-xs ${
                  simulationSpeed === spd
                    ? 'bg-[#6B1724] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`p-1.5 rounded-xl font-semibold transition ${
              isSimulating ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
            }`}
            title={isSimulating ? 'Pause Movement' : 'Resume Movement'}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Reset Route */}
          <button
            onClick={resetSimulation}
            className="p-1.5 rounded-xl text-stone-600 hover:bg-stone-100 transition"
            title="Reset route simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {browserGpsError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{browserGpsError}</span>
          </div>
          <button onClick={() => setBrowserGpsError(null)} className="text-amber-800 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Telemetry Ribbon + Live Leaflet Map */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Real-time Status Card & Milestone Banner */}
          <div className="bg-gradient-to-r from-[#58111A] via-[#400B13] to-[#25050A] text-white rounded-3xl p-5 md:p-6 shadow-xl border border-[#D4AF37]/30 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-[#D4AF37]/10 pointer-events-none blur-xl"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-[#D4AF37]">
                    Trip #{booking.bookingCode}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-[11px] text-emerald-300 font-medium flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> FASTag Pre-Cleared
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold font-display mt-1">
                  {distanceRemainingKm > 0.2 ? `En Route to ${booking.destination.name.split(',')[0]}` : 'Approaching Destination Gate'}
                </h2>

                <p className="text-xs text-[#E6DFD1]/80 mt-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-[#D4AF37] shrink-0" />
                  <span>Current Milestone: <strong>{currentWp?.name || 'Ghat Road Corridor'}</strong></span>
                </p>
              </div>

              {/* Countdown & Remaining Distance */}
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-inner">
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-black text-[#D4AF37] font-mono leading-none">
                    {distanceRemainingKm > 0 ? `${distanceRemainingKm} km` : '0 m'}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#E6DFD1]/80 tracking-wider mt-1">
                    To Go
                  </div>
                </div>
                <div className="w-px h-9 bg-white/20 mx-1"></div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-white font-mono leading-none">
                    {distanceRemainingKm > 0 ? `${etaMinutes}:${etaSeconds < 10 ? '0' : ''}${etaSeconds}` : 'Arrived'}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#E6DFD1]/80 tracking-wider mt-1">
                    Live ETA
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Model Quick Switcher inside banner */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-1.5 text-[11px] text-stone-300">
                <span>Selected Vehicle:</span>
                <span className="font-bold text-[#D4AF37]">{activeVehicleModel}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl">
                {(['Toyota Etios', 'Maruti Suzuki Ertiga', 'Toyota Innova', 'Tempo Traveller'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveVehicleModel(m)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                      activeVehicleModel === m
                        ? 'bg-[#D4AF37] text-stone-950 font-bold shadow-xs'
                        : 'text-stone-200 hover:bg-white/10'
                    }`}
                  >
                    {m.split(' ')[0] === 'Tempo' ? 'Tempo' : m.split(' ').slice(-1)[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Leaflet Map Component */}
          <div className="bg-white rounded-3xl p-2 border border-[#E8DFC8] shadow-sm">
            <InteractiveMap
              pickup={booking.pickup}
              destination={booking.destination}
              driver={booking.driver}
              driverPosition={driverCoord}
              driverHeading={driverHeading}
              vehicleModel={activeVehicleModel}
              routeWaypoints={waypoints}
              wanderingCabs={wanderingCabs}
              liveGpsPosition={browserGpsPosition}
              isDraggable={true}
              onPickupChange={(p) => {
                setTimeout(() => {
                  onUpdateBookingRef.current({ ...bookingRef.current, pickup: p });
                }, 0);
              }}
              onDestinationChange={(d) => {
                setTimeout(() => {
                  onUpdateBookingRef.current({ ...bookingRef.current, destination: d });
                }, 0);
              }}
              className="h-[440px] md:h-[500px] w-full rounded-2xl"
            />
          </div>

          {/* Speedometer Gauge & Live Telemetry Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Speedometer Gauge */}
            <SpeedometerGauge
              currentSpeedKmh={currentSpeedKmh}
              speedLimitKmh={currentWp?.speedLimitKmh || 40}
              isGhatRoad={selectedCityPreset.id === 'tirupati-tirumala'}
            />

            {/* Live 24/7 Road & Driver Support */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C6D28] tracking-wider">Live Chauffeur Support</span>
                <h4 className="text-xs font-bold text-stone-900 mt-0.5">Need Route Assistance or Luggage Help?</h4>
                <p className="text-[11px] text-stone-500">Contact Hari Travels dispatch desk 24/7 or message your hill driver directly.</p>
              </div>
              <div className="grid grid-cols-2 sm:flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <a
                  href="tel:+919959312174"
                  className="px-3.5 py-2.5 rounded-xl bg-[#6B1724] hover:bg-[#58111A] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Call Dispatch</span>
                </a>
                <a
                  href="https://wa.me/919959312174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Driver Profile, 4-digit OTP, Chat, SOS, Details */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Driver Profile & 4-Digit OTP Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8DFC8] shadow-sm relative">
            {/* Top Chauffeur Info */}
            <div className="flex items-center space-x-4 pb-4 border-b border-[#E8DFC8]/60">
              <img
                src={booking.driver?.photo}
                alt={booking.driver?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900 truncate">
                    {booking.driver?.name || 'Ravi Kumar'}
                  </h3>
                  <span className="flex items-center text-xs font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                    ★ {booking.driver?.rating || 4.9}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  {booking.driver?.experienceYears || 9} yrs Ghat Chauffeur • {booking.driver?.totalTrips || 1840} Trips
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {booking.driver?.languages.map((lang) => (
                    <span key={lang} className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle & Plate details */}
            <div className="py-3 flex items-center justify-between text-xs border-b border-[#E8DFC8]/60">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Vehicle</span>
                <p className="font-bold text-stone-800">{activeVehicleModel}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Registration Plate</span>
                <p className="font-mono font-extrabold text-[#6B1724] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DFC8]">
                  {booking.driver?.vehicleNumber || 'AP 03 TX 4821'}
                </p>
              </div>
            </div>

            {/* Prominent 4-Digit Ride OTP Box */}
            <div className="my-3.5 p-3.5 bg-gradient-to-r from-amber-50 to-[#FAF7F2] border border-[#D4AF37]/50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#6B1724] text-[#D4AF37] flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    Start Ride OTP
                  </span>
                  <div className="text-2xl font-black font-mono tracking-widest text-[#6B1724] leading-none mt-0.5">
                    {rideOtp}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyOtp}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E8DFC8] hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center space-x-1 transition shadow-2xs"
                title="Copy OTP to clipboard"
              >
                {copiedOtp ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOtp ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Direct Driver Contact, WhatsApp & In-App Chat Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setIsCalling(true)}
                className="py-2.5 px-2 rounded-xl bg-[#6B1724] hover:bg-[#52111b] text-white font-semibold text-xs flex items-center justify-center shadow-xs transition"
              >
                <Phone className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                Call
              </button>
              <a
                href={`https://wa.me/919959312174?text=${encodeURIComponent(`Hello Hari Travels Chauffeur ${booking.driver?.name || 'Sir'}, this is regarding ride #${booking.bookingCode} (OTP: ${rideOtp}). Pickup: ${booking.pickup.name}, Drop: ${booking.destination.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs flex items-center justify-center shadow-xs transition"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1 fill-white text-transparent" />
                WhatsApp
              </a>
              <button
                onClick={() => setIsChatOpen(true)}
                className="py-2.5 px-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-100 text-stone-800 border border-[#E8DFC8] font-semibold text-xs flex items-center justify-center transition"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1 text-[#6B1724]" />
                Chat ({chatMessages.length})
              </button>
            </div>

            {/* Share Live Trip Link & WhatsApp Share */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
              <button
                onClick={handleShareTrip}
                className="w-full py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-dashed border-[#E8DFC8] flex items-center justify-center transition"
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5 text-[#6B1724]" />
                {copiedShare ? 'Tracking Link Copied!' : 'Copy Tracking Link'}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`🚕 Tracking my Hari Travels ${activeVehicleModel} ride to ${booking.destination.name}. Chauffeur: ${booking.driver?.name || 'Driver'} (${booking.driver?.vehicleNumber || 'AP 03 TX 4821'}). Start Ride OTP: ${rideOtp}. Tracking URL: ${window.location.origin}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 flex items-center justify-center transition"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Share via WhatsApp
              </a>
            </div>
          </div>

          {/* SOS Emergency Button */}
          <button
            onClick={() => setIsSosOpen(true)}
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center justify-center space-x-2 transition active:scale-98"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>SOS Pilgrim Emergency Alert (Police 112 / TTD 108)</span>
          </button>

          {/* Route Milestones & Inclusions Card */}
          <div className="bg-[#FAF7F2] rounded-3xl p-5 border border-[#E8DFC8] shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D28] mb-3 flex items-center justify-between">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-[#6B1724]" />
                Trip Route & Ghat Status
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                Waypoint {currentWaypointIndex + 1} of {waypoints.length}
              </span>
            </h4>

            <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DFC8]">
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#6B1724] border-2 border-white"></span>
                <span className="text-[10px] uppercase font-bold text-stone-400">Pickup</span>
                <p className="text-xs font-bold text-stone-900">{booking.pickup.name}</p>
                <p className="text-[11px] text-stone-500">{booking.pickup.address}</p>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#D4AF37] border-2 border-white"></span>
                <span className="text-[10px] uppercase font-bold text-stone-400">Destination</span>
                <p className="text-xs font-bold text-stone-900">{booking.destination.name}</p>
                <p className="text-[11px] text-stone-500">{booking.destination.address}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E8DFC8] space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>TTD FASTag & Ghat Toll:</span>
                <span className="font-semibold text-emerald-700">Pre-Cleared & Paid</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Mountain Chauffeur:</span>
                <span className="font-semibold text-emerald-700">Included</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Billing Model:</span>
                <span className="font-semibold text-stone-800">Direct Driver Rate (Pay on Drop)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#E8DFC8]">
                <span className="text-stone-500">24/7 Helpline:</span>
                <a href="tel:+919959312174" className="font-bold text-[#6B1724] hover:underline font-mono">
                  +91 99593 12174
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Emergency Alert Modal */}
      {isSosOpen && (
        <SosModal
          currentCoord={driverCoord}
          currentLocationName={currentWp?.name}
          driverName={booking.driver?.name}
          vehiclePlate={booking.driver?.vehicleNumber}
          onClose={() => setIsSosOpen(false)}
        />
      )}

      {/* Driver Calling Simulation Modal */}
      {isCalling && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#3B0A11] to-[#1C0508] text-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-[#D4AF37]/30">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#D4AF37] overflow-hidden shadow-lg animate-pulse">
              <img src={booking.driver?.photo} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-display text-xl font-bold">{booking.driver?.name}</h3>
            <p className="text-xs text-[#D4AF37] font-medium mt-1">
              {activeVehicleModel} • {booking.driver?.vehicleNumber}
            </p>
            <p className="text-sm font-mono text-stone-300 mt-4">
              {callDuration === 0 ? 'Connecting via secure line...' : `00:${callDuration < 10 ? '0' : ''}${callDuration}`}
            </p>

            <div className="mt-8 flex justify-center space-x-6">
              <button
                onClick={() => setIsCalling(false)}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg transition active:scale-95"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <p className="text-[11px] text-stone-400 mt-4">
              Direct line: {booking.driver?.phone || '+91 99593 12174'}
            </p>
          </div>
        </div>
      )}

      {/* Driver In-App Chat Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="bg-[#FAF7F2] w-full max-w-md h-full flex flex-col shadow-2xl border-l border-[#E8DFC8] animate-in slide-in-from-right duration-200">
            <div className="p-4 bg-[#6B1724] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={booking.driver?.photo} alt="" className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]" />
                <div>
                  <h4 className="font-bold text-sm leading-tight">{booking.driver?.name}</h4>
                  <span className="text-[11px] text-emerald-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1"></span>
                    Online • In Transit ({activeVehicleModel})
                  </span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-1 rounded-lg text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Pilgrimage Prompt Chips */}
            <div className="px-4 py-2 bg-white border-b border-[#E8DFC8] flex gap-2 overflow-x-auto text-[11px]">
              <button 
                onClick={() => handleSendMessage(`My start ride OTP is ${rideOtp}.`)}
                className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full whitespace-nowrap font-bold"
              >
                Share OTP: {rideOtp}
              </button>
              <button 
                onClick={() => handleSendMessage("We are waiting near Platform 1 main gate.")}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full whitespace-nowrap"
              >
                Waiting at Platform 1
              </button>
              <button 
                onClick={() => handleSendMessage("We have 3 bags and elderly passengers with us.")}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full whitespace-nowrap"
              >
                Luggage & Elders
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'customer' 
                      ? 'items-end' 
                      : msg.sender === 'system' 
                      ? 'items-center' 
                      : 'items-start'
                  }`}
                >
                  {msg.sender === 'system' ? (
                    <div className="bg-amber-100/70 text-amber-900 border border-amber-200 text-[11px] px-3 py-1.5 rounded-lg max-w-[90%] text-center">
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-xs ${
                        msg.sender === 'customer'
                          ? 'bg-[#6B1724] text-white rounded-tr-none'
                          : 'bg-white text-stone-800 border border-[#E8DFC8] rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[9px] mt-1 block ${
                        msg.sender === 'customer' ? 'text-white/70' : 'text-stone-400'
                      }`}>
                        {msg.time}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input area */}
            <div className="p-3 bg-white border-t border-[#E8DFC8] flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Message ${booking.driver?.name?.split(' ')[0] || 'Chauffeur'}...`}
                className="flex-1 px-3.5 py-2 bg-[#FAF7F2] rounded-xl text-xs border border-[#E8DFC8] focus:outline-none focus:border-[#6B1724]"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2.5 rounded-xl bg-[#6B1724] text-white hover:bg-[#58111A] transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
