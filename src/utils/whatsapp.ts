/**
 * WhatsApp Helper Utilities for Hari Travels
 * Standard customer care contact and pre-filled message generator.
 * Automatically opens WhatsApp in a new browser tab or directly launches the native WhatsApp mobile app.
 */

export const HARI_TRAVELS_PHONE = '919959312174';
export const HARI_TRAVELS_PHONE_DISPLAY = '+91 99593 12174';

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
