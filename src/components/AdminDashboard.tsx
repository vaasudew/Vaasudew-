import React, { useState, useEffect } from 'react';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, subscribeToRides, updateRideStatus, deleteRide } from '../firebase';
import { RideBooking, RideStatus } from '../types/ride';
import {
  ShieldCheck,
  LogOut,
  Car,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  RefreshCw,
  Phone,
  MessageCircle,
  Trash2,
  Send,
  AlertTriangle,
  User,
  Filter,
  Check,
  TrendingUp,
  Navigation,
  ExternalLink,
  Share2,
  LocateFixed
} from 'lucide-react';
import { createGoogleMapsNavigateLink, resolveLocationNavigateLink } from '../utils/whatsapp';

interface AdminDashboardProps {
  currentUser: FirebaseUser | null;
  onLogout: () => void;
  onNavigateHome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onNavigateHome
}) => {
  const [rides, setRides] = useState<RideBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<'all' | RideStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Dispatch remarks state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  // Subscribe to real-time rides from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToRides(
      (newRides) => {
        setRides(newRides);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching rides from Firestore:', err);
        setError('Failed to load rides from Firestore database. Check permissions.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleUpdateStatus = async (rideId: string, newStatus: RideStatus) => {
    try {
      setActionLoadingId(rideId);
      await updateRideStatus(rideId, newStatus);
    } catch (err: unknown) {
      const e = err as Error;
      alert(`Error updating ride status: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteRide = async (rideId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this ride booking from Firestore?')) {
      try {
        setActionLoadingId(rideId);
        await deleteRide(rideId);
      } catch (err: unknown) {
        const e = err as Error;
        alert(`Error deleting ride: ${e.message}`);
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleSaveNotes = async (rideId: string) => {
    try {
      setActionLoadingId(rideId);
      const ride = rides.find((r) => r.id === rideId);
      await updateRideStatus(rideId, ride?.status || 'pending', notesInput);
      setEditingNotesId(null);
    } catch (err: unknown) {
      const e = err as Error;
      alert(`Error saving notes: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Status Metrics
  const totalCount = rides.length;
  const pendingCount = rides.filter((r) => r.status === 'pending').length;
  const approvedCount = rides.filter((r) => r.status === 'approved').length;
  const cancelledCount = rides.filter((r) => r.status === 'cancelled').length;
  const completedCount = rides.filter((r) => r.status === 'completed').length;

  // Filtered rides
  const filteredRides = rides.filter((ride) => {
    const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      ride.customerName.toLowerCase().includes(q) ||
      ride.customerPhone.toLowerCase().includes(q) ||
      ride.pickupLocation.toLowerCase().includes(q) ||
      ride.dropoffLocation.toLowerCase().includes(q) ||
      ride.date.includes(q) ||
      ride.id.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6B1724] to-[#450C14] flex items-center justify-center text-[#D4AF37] shadow-sm border border-[#D4AF37]/30 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#8C6D28] bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Firebase Firestore Connected
              </span>
              <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                {currentUser?.email}
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#3B0A11]">
              Ride Dispatch & Admin Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              Back to App
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition flex items-center space-x-1.5 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border text-left transition ${
            statusFilter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white text-stone-900 border-[#E8DFC8] hover:border-stone-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-stone-400">Total Rides</span>
            <TrendingUp className="w-4 h-4 opacity-70" />
          </div>
          <span className="text-2xl font-black block mt-1">{totalCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-2xl border text-left transition ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-white text-stone-900 border-[#E8DFC8] hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-600">Pending Review</span>
            <Clock3 className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black block mt-1 text-amber-600">{pendingCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-2xl border text-left transition ${
            statusFilter === 'approved'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-white text-stone-900 border-[#E8DFC8] hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black block mt-1 text-emerald-600">{approvedCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`p-4 rounded-2xl border text-left transition ${
            statusFilter === 'cancelled'
              ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
              : 'bg-white text-stone-900 border-[#E8DFC8] hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-600">Cancelled</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-black block mt-1 text-rose-600">{cancelledCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          className={`p-4 rounded-2xl border text-left transition col-span-2 sm:col-span-1 ${
            statusFilter === 'completed'
              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
              : 'bg-white text-stone-900 border-[#E8DFC8] hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-600">Completed</span>
            <Check className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-black block mt-1 text-blue-600">{completedCount}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E8DFC8] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search passenger, phone, pickup, or drop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#6B1724] focus:ring-1 focus:ring-[#6B1724]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-1 text-xs text-stone-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Showing: <strong>{filteredRides.length}</strong> of {totalCount}</span>
          </div>

          <button
            onClick={() => {
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="text-xs text-[#6B1724] hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Rides List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-[#E8DFC8] p-12 text-center">
          <RefreshCw className="w-8 h-8 text-[#6B1724] animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Connecting to Firestore database...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-300 rounded-3xl p-6 text-rose-900 text-center">
          <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
          <h4 className="font-bold text-sm">Database Connection Alert</h4>
          <p className="text-xs mt-1">{error}</p>
        </div>
      ) : filteredRides.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8DFC8] p-12 text-center">
          <Car className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h4 className="font-bold text-base text-stone-800">No Ride Bookings Found</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            {searchQuery || statusFilter !== 'all'
              ? 'Try changing or clearing your search filters above.'
              : 'No rides have been submitted yet. Go to the client Ride Booking form to submit test bookings!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRides.map((ride) => {
            const isLoadingThis = actionLoadingId === ride.id;
            const rideNavLink = (ride.pickupCoordinates && ride.pickupCoordinates.lat && ride.pickupCoordinates.lng)
              ? createGoogleMapsNavigateLink(ride.pickupCoordinates.lat, ride.pickupCoordinates.lng)
              : resolveLocationNavigateLink(ride.pickupLocation);
            const isLiveGps = ride.pickupLocation.toLowerCase().includes('live') || Boolean(ride.pickupCoordinates?.lat);

            return (
              <div
                key={ride.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DFC8] shadow-xs hover:shadow-md transition p-4 sm:p-6 overflow-hidden"
              >
                {/* Ride Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#6B1724] bg-[#6B1724]/6 px-2.5 py-1 rounded-md">
                      #{ride.id.slice(0, 8)}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Booked: {new Date(ride.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {ride.status === 'pending' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <Clock3 className="w-3.5 h-3.5 mr-1" />
                        Pending Approval
                      </span>
                    )}
                    {ride.status === 'approved' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Approved & Allocated
                      </span>
                    )}
                    {ride.status === 'cancelled' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Cancelled
                      </span>
                    )}
                    {ride.status === 'completed' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Ride Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
                  {/* Route & Schedule (Col 1-7) */}
                  <div className="md:col-span-7 space-y-3">
                    {/* Route Details */}
                    <div className="space-y-1.5 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFC8]">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs flex-1">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Pickup</span>
                          <span className="font-bold text-stone-900">{ride.pickupLocation}</span>
                          {ride.pickupGpsLink && (
                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                              <a
                                href={rideNavLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold transition shadow-2xs"
                                title="Start Google Maps Driving Navigation directly to customer pickup"
                              >
                                <Navigation className="w-3 h-3 text-emerald-200" />
                                <span>Drive to Customer Pickup</span>
                                <ExternalLink className="w-2.5 h-2.5 text-emerald-200" />
                              </a>
                              <a
                                href={ride.pickupGpsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold transition shadow-2xs"
                                title="Open Live GPS Pin in Google Maps"
                              >
                                <span>Live Pin</span>
                                <ExternalLink className="w-2.5 h-2.5 text-emerald-600" />
                              </a>
                              {isLiveGps && (
                                <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded font-black">
                                  <LocateFixed className="w-2.5 h-2.5 text-emerald-700" />
                                  GPS Pin
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-0.5 h-3 bg-stone-300 ml-2" />
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Drop-off</span>
                          <span className="font-bold text-stone-900">{ride.dropoffLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Date, Time & Vehicle */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#6B1724]" /> Date
                        </span>
                        <span className="font-bold text-stone-800 block mt-0.5">{ride.date}</span>
                      </div>
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#6B1724]" /> Time
                        </span>
                        <span className="font-bold text-stone-800 block mt-0.5">{ride.time}</span>
                      </div>
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                          <Car className="w-3 h-3 text-[#6B1724]" /> Cab
                        </span>
                        <span className="font-bold text-stone-800 block mt-0.5 truncate">
                          {ride.vehicleType || 'Sedan'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info & Dispatch Remarks (Col 8-12) */}
                  <div className="md:col-span-5 space-y-3">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                          <User className="w-3 h-3 text-[#6B1724]" /> Passenger
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {ride.passengers || 4} Pax
                        </span>
                      </div>
                      <div className="font-bold text-sm text-stone-900">
                        {ride.customerName}
                      </div>

                      {/* Phone & Direct Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-stone-200/80">
                        <span className="font-mono text-xs font-bold text-stone-700">
                          {ride.customerPhone}
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <a
                            href={`tel:${ride.customerPhone}`}
                            className="p-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:text-[#6B1724] hover:border-[#6B1724] transition shadow-2xs"
                            title="Call Passenger"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${ride.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${ride.customerName}, Hari Travels Dispatch here regarding your booking #${ride.id.slice(0, 6)} from ${ride.pickupLocation} to ${ride.dropoffLocation} on ${ride.date} at ${ride.time}. Status: ${ride.status.toUpperCase()}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition shadow-2xs"
                            title="WhatsApp Passenger"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {ride.notes && (
                        <div className="text-[11px] text-stone-600 bg-white p-2 rounded-md border border-stone-200">
                          <span className="font-semibold text-stone-400 block text-[9px] uppercase">Client Notes:</span>
                          {ride.notes}
                        </div>
                      )}
                    </div>

                    {/* Dispatch Notes / Driver Allocation */}
                    <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs">
                      {editingNotesId === ride.id ? (
                        <div className="space-y-1.5">
                          <textarea
                            rows={2}
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            placeholder="e.g. Driver: Venkat (AP03-1234), FASTag active"
                            className="w-full p-2 bg-white text-xs rounded-lg border border-amber-300"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2 py-1 text-[10px] text-stone-600 hover:bg-stone-100 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNotes(ride.id)}
                              disabled={isLoadingThis}
                              className="px-2.5 py-1 text-[10px] font-bold bg-[#6B1724] text-white rounded shadow-2xs"
                            >
                              Save Notes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-[#8C6D28] block">
                              Dispatch / Driver Allocation:
                            </span>
                            <span className="text-[11px] text-stone-800">
                              {ride.adminNotes || 'No driver allocated yet.'}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setEditingNotesId(ride.id);
                              setNotesInput(ride.adminNotes || '');
                            }}
                            className="text-[10px] text-[#6B1724] font-bold hover:underline shrink-0"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons Bar */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* APPROVE BUTTON */}
                    {ride.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(ride.id, 'approved')}
                        disabled={isLoadingThis}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center space-x-1 shadow-2xs disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Ride</span>
                      </button>
                    )}

                    {/* CANCEL BUTTON */}
                    {ride.status !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateStatus(ride.id, 'cancelled')}
                        disabled={isLoadingThis}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition flex items-center space-x-1 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Ride</span>
                      </button>
                    )}

                    {/* COMPLETE BUTTON */}
                    {ride.status === 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(ride.id, 'completed')}
                        disabled={isLoadingThis}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition flex items-center space-x-1 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* WhatsApp Driver Dispatch Template with Turn-by-Turn Driver Navigation Link */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `*🚖 HARI TRAVELS TRIP DISPATCH*\n` +
                        `Booking ID: #${ride.id.slice(0, 8).toUpperCase()}\n` +
                        `📍 Pickup Location: ${ride.pickupLocation}\n` +
                        `🧭 *1-TAP CHAUFFEUR DRIVING NAVIGATION:*\n${rideNavLink}\n` +
                        (ride.pickupGpsLink ? `🗺️ Live Coordinates Pin: ${ride.pickupGpsLink}\n` : '') +
                        `🏁 Drop-off: ${ride.dropoffLocation}\n` +
                        `📅 Date & Time: ${ride.date} at ${ride.time}\n` +
                        `👤 Passenger: ${ride.customerName} (${ride.customerPhone})\n` +
                        `🚗 Vehicle: ${ride.vehicleType || 'Sedan'}\n` +
                        `👥 Passengers: ${ride.passengers || 4}\n` +
                        `⚡ Status: ${ride.status.toUpperCase()}\n` +
                        (ride.notes ? `📝 Notes: ${ride.notes}\n` : '') +
                        `🚗 Chauffeur: Tap navigation link above to open Google Maps driving navigation directly to customer pickup point!\n` +
                        `💵 Payment: Collect from customer on drop`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition flex items-center space-x-1"
                      title="Share to Driver WhatsApp Group with Live Navigation Link"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Dispatch to Driver</span>
                    </a>

                    {/* Delete Ride Button */}
                    <button
                      onClick={() => handleDeleteRide(ride.id)}
                      disabled={isLoadingThis}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Ride Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
