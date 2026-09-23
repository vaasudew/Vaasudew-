import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { RideBooking, RideStatus } from './types/ride';

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Cloud Firestore (support custom database id from config)
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

const RIDES_COLLECTION = 'rides';

/**
 * Saves a new ride booking into Firestore
 */
export async function createRideBooking(
  data: Omit<RideBooking, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
    status?: RideStatus;
  }
): Promise<string> {
  const now = new Date().toISOString();
  const rideData = {
    ...data,
    status: data.status || 'pending',
    createdAt: now,
    updatedAt: now
  };

  const docRef = await addDoc(collection(db, RIDES_COLLECTION), rideData);
  return docRef.id;
}

/**
 * Real-time listener for all rides (ordered by creation descending)
 */
export function subscribeToRides(
  callback: (rides: RideBooking[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(collection(db, RIDES_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const rides: RideBooking[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<RideBooking, 'id'>)
      }));
      callback(rides);
    },
    (err) => {
      console.error('Firestore subscribeToRides error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Updates ride status (approve, cancel, complete)
 */
export async function updateRideStatus(
  rideId: string,
  status: RideStatus,
  adminNotes?: string
): Promise<void> {
  const rideRef = doc(db, RIDES_COLLECTION, rideId);
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: new Date().toISOString()
  };
  if (adminNotes !== undefined) {
    updateData.adminNotes = adminNotes;
  }
  await updateDoc(rideRef, updateData);
}

/**
 * Deletes a ride document from Firestore
 */
export async function deleteRide(rideId: string): Promise<void> {
  const rideRef = doc(db, RIDES_COLLECTION, rideId);
  await deleteDoc(rideRef);
}
