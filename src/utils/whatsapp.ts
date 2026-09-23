/**
 * WhatsApp Helper Utilities for Hari Travels
 * Standard customer care contact and pre-filled message generator.
 * Automatically opens WhatsApp in a new browser tab or directly launches the native WhatsApp mobile app.
 */

export const HARI_TRAVELS_PHONE = '919959312174';
export const HARI_TRAVELS_PHONE_DISPLAY = '+91 99593 12174';

/**
 * Builds a direct Google Maps coordinate pin link for viewing location
 */
export function createGoogleMapsGpsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/**
 * Builds a Google Maps 1-Tap Turn-by-Turn Driving Navigation link
 * so the driver/chauffeur can reach out directly to customer's live location pickup point.
 */
export function createGoogleMapsNavigateLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

/**
 * Resolves or builds a GPS link based on coordinates or landmark name
 */
export function resolveLocationGpsLink(locationText: string, lat?: number, lng?: number): string {
  if (lat && lng && (lat !== 0 || lng !== 0)) {
    return createGoogleMapsGpsLink(lat, lng);
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText.trim())}`;
}

/**
 * Resolves or builds a direct turn-by-turn navigation link to reach the customer's pickup point
 */
export function resolveLocationNavigateLink(locationText: string, lat?: number, lng?: number): string {
  if (lat && lng && (lat !== 0 || lng !== 0)) {
    return createGoogleMapsNavigateLink(lat, lng);
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationText.trim())}&travelmode=driving`;
}

export interface AdminBookingWhatsAppPayload {
  bookingId?: string;
  pickupLocation: string;
  pickupGpsLink?: string;
  pickupNavigateLink?: string;
  pickupCoordinates?: { lat: number; lng: number; accuracy?: number };
  dropoffLocation: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  vehicleType?: string;
  passengers?: number | string;
  paymentMode?: string;
  notes?: string;
  tripType?: string;
}

/**
 * Formats a clean, professional booking notification to Admin WhatsApp
 * prominently displaying the pickup location, live location GPS coordinates pin,
 * and direct 1-tap Google Maps Driving Navigation link so the driver can reach out to customer's live location pickup point.
 */
export function buildAdminBookingWhatsAppText(data: AdminBookingWhatsAppPayload): string {
  let pinLink = data.pickupGpsLink;
  let navLink = data.pickupNavigateLink;

  if (data.pickupCoordinates && data.pickupCoordinates.lat && data.pickupCoordinates.lng) {
    pinLink = pinLink || createGoogleMapsGpsLink(data.pickupCoordinates.lat, data.pickupCoordinates.lng);
    navLink = navLink || createGoogleMapsNavigateLink(data.pickupCoordinates.lat, data.pickupCoordinates.lng);
  } else {
    pinLink = pinLink || resolveLocationGpsLink(data.pickupLocation);
    navLink = navLink || resolveLocationNavigateLink(data.pickupLocation);
  }

  const isLiveGps = data.pickupLocation.toLowerCase().includes('live') || 
                    data.pickupLocation.toLowerCase().includes('current') || 
                    Boolean(data.pickupCoordinates && data.pickupCoordinates.lat);

  const lines = [
    `*🚖 NEW CAB BOOKING REQUEST - HARI TRAVELS*`,
    data.bookingId ? `🆔 *Booking Ref:* #${data.bookingId.slice(0, 8).toUpperCase()}` : '',
    ``,
    `📍 *Customer Pickup Point:* ${data.pickupLocation}`,
    isLiveGps ? `🟢 *Live Location Detected:* Customer shared real-time GPS coordinates!` : '',
    `🧭 *DRIVER TURN-BY-TURN NAVIGATION LINK (Reach Customer):*`,
    `${navLink}`,
    `🗺️ *Live Location GPS Pin:* ${pinLink}`,
    ``,
    `🏁 *Drop Destination:* ${data.dropoffLocation}`,
    `📅 *Travel Date & Time:* ${data.date} at ${data.time}`,
    `🚗 *Vehicle Selected:* ${data.vehicleType || 'Sedan (Dzire / Etios)'}`,
    `👥 *Passengers:* ${data.passengers || 4}`,
    `👤 *Passenger Name:* ${data.customerName}`,
    `📞 *Passenger Mobile:* ${data.customerPhone}`,
    data.notes ? `📝 *Special Request:* ${data.notes}` : '',
    ``,
    `💵 *Payment Mode:* ${data.paymentMode === 'driver_pay' ? 'Pay directly to Driver on drop (Zero Advance)' : data.paymentMode || 'Direct Driver Settlement'}`,
    `⚡ *Dispatch Status:* Awaiting Chauffeur Allocation`,
    ``,
    `🚗 *Instruction for Chauffeur:* Tap the Driver Navigation Link above to open Google Maps and drive directly to customer's live pickup point!`
  ].filter(Boolean).join('\n');

  return lines;
}

/**
 * Returns the wa.me link directed to Admin WhatsApp (+91 99593 12174) with the pre-filled booking details & live GPS link.
 */
export function getAdminBookingWhatsAppUrl(data: AdminBookingWhatsAppPayload): string {
  const text = buildAdminBookingWhatsAppText(data);
  return `https://wa.me/${HARI_TRAVELS_PHONE}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds a URL-encoded WhatsApp link using wa.me with pre-filled message text.
 * The message appears in the user's WhatsApp chat input field ready to be sent with one tap.
 */
export function getWhatsAppUrl(messageText?: string, phoneNumber: string = HARI_TRAVELS_PHONE): string {
  const defaultText = "Hello Hari Travels, I would like to inquire about cab booking and temple packages in Tirupati / Tirumala.";
  const text = messageText?.trim() || defaultText;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Directly opens WhatsApp in a new tab / mobile app with the pre-filled text.
 */
export function openWhatsApp(messageText?: string, phoneNumber: string = HARI_TRAVELS_PHONE): void {
  const url = getWhatsAppUrl(messageText, phoneNumber);
  window.open(url, '_blank', 'noopener,noreferrer');
}

