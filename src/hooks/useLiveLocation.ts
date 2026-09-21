import { useState, useEffect, useCallback, useRef } from 'react';
import { LocationPoint } from '../types/travel';

export interface UseLiveLocationResult {
  liveLocation: LocationPoint | null;
  isLoading: boolean;
  error: string | null;
  permissionState: 'prompt' | 'granted' | 'denied' | 'unsupported';
  isWatching: boolean;
  requestLiveLocation: () => Promise<LocationPoint | null>;
  startWatching: () => void;
  stopWatching: () => void;
  clearLiveLocation: () => void;
}

export const NONE_LOCATION: LocationPoint = {
  name: 'None (Clear / Not Selected)',
  category: 'none',
  lat: 0,
  lng: 0,
  address: 'No location selected',
  notes: 'Please select or search a valid pickup and drop point'
};

export function isNoneLocation(loc: LocationPoint | null | undefined): boolean {
  if (!loc) return true;
  return loc.category === 'none' || loc.name.startsWith('None');
}

export function isLiveLocation(loc: LocationPoint | null | undefined): boolean {
  if (!loc) return false;
  return loc.category === 'live' || loc.name.includes('Live Device GPS') || loc.name.includes('My Current Location');
}

export function useLiveLocation(): UseLiveLocationResult {
  const [liveLocation, setLiveLocation] = useState<LocationPoint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const watchIdRef = useRef<number | null>(null);

  // Check initial permission status if available
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setPermissionState('unsupported');
      return;
    }

    if ('permissions' in navigator && navigator.permissions?.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
          result.onchange = () => {
            setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
          };
        })
        .catch(() => {
          // Permissions API query not supported for geolocation in some environments
        });
    }
  }, []);

  const requestLiveLocation = useCallback(async (): Promise<LocationPoint | null> => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser or device.');
      setPermissionState('unsupported');
      return null;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 15);

          const livePoint: LocationPoint = {
            name: `📍 My Current Location (GPS ±${accuracy}m)`,
            category: 'live',
            lat,
            lng,
            address: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)} (Live Device GPS)`,
            notes: `Accurate within ~${accuracy} meters`,
            accuracy
          };

          setLiveLocation(livePoint);
          setPermissionState('granted');
          setIsLoading(false);
          setError(null);
          resolve(livePoint);
        },
        (err) => {
          let errorMsg = 'Unable to retrieve your live GPS location.';
          if (err.code === err.PERMISSION_DENIED) {
            errorMsg = 'Location permission was denied. Please allow location access in your browser settings to use live GPS.';
            setPermissionState('denied');
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is currently unavailable. Please check your GPS signal.';
          } else if (err.code === err.TIMEOUT) {
            errorMsg = 'Location request timed out. Please try again.';
          }

          setError(errorMsg);
          setIsLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      );
    });
  }, []);

  const startWatching = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser or device.');
      setPermissionState('unsupported');
      return;
    }

    if (watchIdRef.current !== null) {
      return; // Already watching
    }

    setIsLoading(true);
    setIsWatching(true);
    setError(null);

    try {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 15);

          const livePoint: LocationPoint = {
            name: `📍 My Current Location (GPS ±${accuracy}m)`,
            category: 'live',
            lat,
            lng,
            address: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)} (Live Device GPS)`,
            notes: `Accurate within ~${accuracy} meters`,
            accuracy
          };

          setLiveLocation(livePoint);
          setPermissionState('granted');
          setIsLoading(false);
          setError(null);
        },
        (err) => {
          let errorMsg = 'Unable to stream your live GPS location.';
          if (err.code === err.PERMISSION_DENIED) {
            errorMsg = 'Location permission was denied. Please allow location access in your browser.';
            setPermissionState('denied');
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMsg = 'Live GPS signal lost or unavailable.';
          } else if (err.code === err.TIMEOUT) {
            errorMsg = 'Live GPS stream timed out.';
          }
          setError(errorMsg);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000
        }
      );
      watchIdRef.current = id;
    } catch (e) {
      setError('Failed to initiate live geolocation stream.');
      setIsLoading(false);
      setIsWatching(false);
    }
  }, []);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsWatching(false);
  }, []);

  // Cleanup watcher on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  const clearLiveLocation = useCallback(() => {
    stopWatching();
    setLiveLocation(null);
    setError(null);
  }, [stopWatching]);

  return {
    liveLocation,
    isLoading,
    error,
    permissionState,
    isWatching,
    requestLiveLocation,
    startWatching,
    stopWatching,
    clearLiveLocation
  };
}
