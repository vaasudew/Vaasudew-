import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CabBooking } from './components/CabBooking';
import { LiveTrackingScreen } from './components/LiveTrackingScreen';
import { ToursSection } from './components/ToursSection';
import { DestinationsSection } from './components/DestinationsSection';
import { FeaturesTrust } from './components/FeaturesTrust';
import { Footer } from './components/Footer';
import { 
  RideBooking, 
  LocationPoint, 
  VehicleType, 
  TourPackage, 
  Destination 
} from './types/travel';
import { 
  INITIAL_DEMO_BOOKING, 
  POPULAR_LOCATIONS, 
  DESTINATIONS 
} from './data/travelData';
import { Phone, MessageCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeBooking, setActiveBooking] = useState<RideBooking | null>(INITIAL_DEMO_BOOKING);
  
  // Preselected parameters for cab booking
  const [preselectedPickup, setPreselectedPickup] = useState<LocationPoint | undefined>(undefined);
  const [preselectedDestination, setPreselectedDestination] = useState<LocationPoint | undefined>(undefined);
  const [preselectedVehicle, setPreselectedVehicle] = useState<VehicleType | undefined>(undefined);

  // Quick book triggered from Hero
  const handleQuickBook = (pickup: LocationPoint, destination: LocationPoint, vehicle: VehicleType) => {
    setPreselectedPickup(pickup);
    setPreselectedDestination(destination);
    setPreselectedVehicle(vehicle);
    setActiveTab('cabs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Booking confirmed -> go to Live Tracking
  const handleBookingConfirmed = (booking: RideBooking) => {
    setActiveBooking(booking);
    setActiveTab('live-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tour selected to book -> preselect destination and open cab booking
  const handleSelectTourToBook = (tour: TourPackage) => {
    const destPoint = POPULAR_LOCATIONS.find(l => l.name.includes(tour.title.split(' ')[0])) || POPULAR_LOCATIONS[3];
    setPreselectedPickup(POPULAR_LOCATIONS[0]);
    setPreselectedDestination(destPoint);
    setActiveTab('cabs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Book cab to specific destination
  const handleBookCabToDestination = (dest: Destination) => {
    const matchedLocation = POPULAR_LOCATIONS.find(l => l.name.toLowerCase().includes(dest.name.toLowerCase().split(' ')[0])) || {
      name: dest.name,
      address: `${dest.name}, Tirupati / Tirumala Region`,
      lat: 13.6832,
      lng: 79.3473,
      category: 'temple' as const
    };

    setPreselectedPickup(POPULAR_LOCATIONS[0]);
    setPreselectedDestination(matchedLocation);
    setActiveTab('cabs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#24211D] font-sans antialiased selection:bg-[#6B1724] selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeBooking={activeBooking}
        onOpenBooking={() => {
          setActiveTab('cabs');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onQuickBook={handleQuickBook}
              onExploreTours={() => {
                setActiveTab('tours');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreDestinations={() => {
                setActiveTab('destinations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Featured Curated Tours snippet */}
            <ToursSection onSelectTourToBook={handleSelectTourToBook} />

            {/* Popular Destinations Guide preview */}
            <DestinationsSection onBookCabToDestination={handleBookCabToDestination} />

            {/* Trust & Safety Pillars */}
            <FeaturesTrust />
          </>
        )}

        {activeTab === 'cabs' && (
          <div className="py-6">
            <CabBooking
              onBookingConfirmed={handleBookingConfirmed}
              preselectedPickup={preselectedPickup}
              preselectedDestination={preselectedDestination}
              preselectedVehicle={preselectedVehicle}
            />
          </div>
        )}

        {activeTab === 'live-tracking' && activeBooking && (
          <LiveTrackingScreen
            booking={activeBooking}
            onUpdateBooking={(updated) => setActiveBooking(updated)}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'tours' && (
          <ToursSection onSelectTourToBook={handleSelectTourToBook} />
        )}

        {activeTab === 'destinations' && (
          <DestinationsSection onBookCabToDestination={handleBookCabToDestination} />
        )}
      </main>

      {/* Persistent Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Floating 24/7 WhatsApp & Direct Call Support Widget - Positioned cleanly above mobile bottom bar */}
      <div className="fixed bottom-16 sm:bottom-5 right-3 sm:right-5 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2">
        <a
          href="https://wa.me/919959312174?text=Hello%20Hari%20Travels%2C%20I%20would%20like%20to%20inquire%20about%20a%20cab%20%2F%20temple%20tour%20in%20Tirupati."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-xl transition transform hover:scale-105 border border-emerald-400/40 text-xs font-bold"
        >
          <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
          <span>WhatsApp Us</span>
        </a>
        <a
          href="tel:+919959312174"
          className="hidden sm:flex items-center space-x-2 bg-[#6B1724] hover:bg-[#52111b] text-[#D4AF37] px-4 py-2.5 rounded-full shadow-xl transition transform hover:scale-105 border border-[#D4AF37]/50 text-xs font-bold"
        >
          <Phone className="w-4 h-4 text-[#D4AF37]" />
          <span>+91 99593 12174</span>
        </a>
      </div>
    </div>
  );
}
