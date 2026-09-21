import React, { useState, useEffect } from 'react';
import { CheckCircle2, Star, Download, Share2, ArrowRight, ThumbsUp, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RideBooking } from '../types/travel';

interface TripCompletionModalProps {
  booking: RideBooking;
  onClose: () => void;
  onBookReturn: () => void;
}

export const TripCompletionModal: React.FC<TripCompletionModalProps> = ({
  booking,
  onClose,
  onBookReturn
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([
    'Smooth Mountain Driving',
    'Clean AC Cab'
  ]);
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 }
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const complimentOptions = [
    'Smooth Mountain Driving',
    'Polite & Respectful',
    'Punctual Arrival',
    'Clean AC Cab',
    'Temple Darshan Guide Tips',
    'Elderly Assistance'
  ];

  const toggleCompliment = (comp: string) => {
    if (selectedCompliments.includes(comp)) {
      setSelectedCompliments(selectedCompliments.filter(c => c !== comp));
    } else {
      setSelectedCompliments([...selectedCompliments, comp]);
    }
  };

  const handleCopyReceipt = () => {
    const text = `🚕 HARI TRAVELS TRIP RECEIPT\nBooking ID: #${booking.bookingCode}\nChauffeur: ${booking.driver?.name} (${booking.driver?.vehicleNumber})\nVehicle: ${booking.vehicle?.name} (${booking.vehicle?.models})\nFrom: ${booking.pickup.name}\nTo: ${booking.destination.name}\nStatus: Trip Completed & Verified\nHelpline: +91 99593 12174`;
    navigator.clipboard.writeText(text);
    alert('Receipt copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E8DFC8] shadow-2xl my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Success Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 border-2 border-emerald-500 shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#8C6D28]">
            Pilgrimage Completed With Blessings
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3B0A11] mt-0.5">
            You Have Arrived!
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Safely dropped at <strong className="text-stone-900">{booking.destination.name}</strong>
          </p>
        </div>

        {/* Digital Fare Receipt Card */}
        <div className="mt-5 p-4 bg-white rounded-2xl border border-[#E8DFC8] shadow-xs text-xs space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8DFC8]">
            <span className="font-mono font-bold text-[#6B1724]">
              Receipt #{booking.bookingCode}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Direct Settled
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-1">
            <div>
              <span className="text-stone-400">Pickup:</span>
              <p className="font-semibold text-stone-800 truncate">{booking.pickup.name}</p>
            </div>
            <div>
              <span className="text-stone-400">Chauffeur:</span>
              <p className="font-semibold text-stone-800 truncate">{booking.driver?.name}</p>
            </div>
            <div>
              <span className="text-stone-400">Vehicle:</span>
              <p className="font-semibold text-stone-800 truncate">{booking.vehicle.name} ({booking.driver?.vehicleNumber})</p>
            </div>
            <div>
              <span className="text-stone-400">TTD Ghat FASTag:</span>
              <p className="font-semibold text-emerald-700">Pre-Cleared & Paid</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8DFC8] flex justify-between items-center font-bold text-stone-900 text-sm">
            <span>Billing Model:</span>
            <span className="text-emerald-700 font-mono">Direct Driver Rate</span>
          </div>
        </div>

        {/* Rating & Review Section */}
        <div className="mt-5 bg-white p-4 rounded-2xl border border-[#E8DFC8] text-center">
          <span className="text-xs font-bold text-stone-800">
            How was your ride with {booking.driver?.name}?
          </span>

          {/* Interactive Star Rating */}
          <div className="flex justify-center space-x-2 my-2.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition transform hover:scale-125"
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? 'text-[#D4AF37] fill-[#D4AF37]'
                      : 'text-stone-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-[11px] text-stone-500 font-medium">
            {rating === 5 && 'Excellent & Divine Experience'}
            {rating === 4 && 'Very Good Ghat Ride'}
            {rating === 3 && 'Average Experience'}
            {rating < 3 && 'Needs Improvement'}
          </span>

          {/* Driver Compliments Chips */}
          <div className="mt-3 text-left">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Give a Compliment:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {complimentOptions.map((comp) => {
                const isSelected = selectedCompliments.includes(comp);
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleCompliment(comp)}
                    className={`text-[10px] px-2.5 py-1 rounded-full border transition ${
                      isSelected
                        ? 'bg-[#6B1724] text-white border-[#6B1724]'
                        : 'bg-[#FAF7F2] text-stone-700 border-[#E8DFC8] hover:bg-stone-100'
                    }`}
                  >
                    {comp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback textarea */}
          <div className="mt-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Leave an optional blessing or feedback for driver..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] focus:outline-none focus:border-[#6B1724]"
            />
          </div>

          {submitted && (
            <div className="mt-2 text-xs font-bold text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
              Thank you! Your review has been saved to chauffeur profile.
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-5 space-y-2.5">
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6B1724] to-[#7D1B2A] text-white font-bold text-xs shadow-md hover:shadow-lg transition"
            >
              Submit Rating & Compliments
            </button>
          ) : (
            <button
              onClick={handleCopyReceipt}
              className="w-full py-2.5 rounded-xl bg-white border border-[#E8DFC8] text-stone-800 hover:bg-stone-50 font-semibold text-xs flex items-center justify-center transition"
            >
              <Download className="w-4 h-4 mr-1.5 text-[#6B1724]" />
              Save / Copy Digital Receipt
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBookReturn}
              className="py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-[#3B0A11] font-bold text-xs transition"
            >
              Book Return Cab
            </button>
            <button
              onClick={onClose}
              className="py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
