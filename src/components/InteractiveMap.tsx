import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LocationPoint, DriverInfo } from '../types/travel';
import { 
  createVehicleLeafletIcon, 
  createPickupPulsingIcon, 
  createDropPulsingIcon, 
  createLiveGpsIcon,
  calculateBearing 
} from '../utils/vehicleIcons';
import { WanderingCab, RouteWaypoint } from '../utils/simulationRoutes';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  Crosshair, 
  Sparkles, 
  Loader2, 
  LocateFixed, 
  AlertCircle,
  Globe
} from 'lucide-react';

interface InteractiveMapProps {
  pickup: LocationPoint;
  destination: LocationPoint;
  driver?: DriverInfo;
  driverPosition?: { lat: number; lng: number };
  driverHeading?: number;
  vehicleModel?: string;
  routeWaypoints?: RouteWaypoint[] | { lat: number; lng: number; name?: string }[];
  wanderingCabs?: WanderingCab[];
  liveGpsPosition?: { lat: number; lng: number; accuracy?: number } | null;
  isDraggable?: boolean;
  autoPromptLocation?: boolean;
  onPickupChange?: (newPoint: LocationPoint) => void;
  onDestinationChange?: (newPoint: LocationPoint) => void;
  onLiveLocationAcquired?: (point: LocationPoint) => void;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pickup,
  destination,
  driver,
  driverPosition,
  driverHeading = 0,
  vehicleModel = 'Toyota Etios',
  routeWaypoints = [],
  wanderingCabs = [],
  liveGpsPosition = null,
  isDraggable = true,
  autoPromptLocation = true,
  onPickupChange,
  onDestinationChange,
  onLiveLocationAcquired,
  className = 'h-96 w-full rounded-2xl overflow-hidden'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const hasAutoPromptedRef = useRef<boolean>(false);
  
  // Marker Refs
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const liveGpsMarkerRef = useRef<L.Marker | null>(null);
  const liveGpsCircleRef = useRef<L.Circle | null>(null);
  const wanderingMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routePolylineOuterRef = useRef<L.Polyline | null>(null);
  const routePolylineInnerRef = useRef<L.Polyline | null>(null);
  const milestoneMarkersLayerRef = useRef<L.LayerGroup | null>(null);

  // Local Live Browser Geological GPS State
  const [localLiveGps, setLocalLiveGps] = useState<{ lat: number; lng: number; accuracy?: number; heading?: number | null } | null>(null);
  const [isGpsLocating, setIsGpsLocating] = useState<boolean>(false);
  const [gpsActive, setGpsActive] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const watchGpsIdRef = useRef<number | null>(null);

  // Map Click Interactive Mode
  const [clickSelectionMode, setClickSelectionMode] = useState<'none' | 'pickup' | 'drop'>('none');
  const googleMapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [activeTileType, setActiveTileType] = useState<'voyager' | 'google' | 'osm'>(
    googleMapsApiKey ? 'google' : 'voyager'
  );
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Combined Live GPS Position (either passed via prop or acquired locally by map button)
  const effectiveGps = liveGpsPosition || localLiveGps;

  // Cleanup GPS watcher on unmount
  useEffect(() => {
    return () => {
      if (watchGpsIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchGpsIdRef.current);
        watchGpsIdRef.current = null;
      }
    };
  }, []);

  // Handler to request / toggle live geological location access directly on the map
  const handleRequestLiveLocation = () => {
    if (gpsActive) {
      // Toggle off
      if (watchGpsIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchGpsIdRef.current);
        watchGpsIdRef.current = null;
      }
      setGpsActive(false);
      setLocalLiveGps(null);
      return;
    }

    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your browser or device.');
      return;
    }

    setIsGpsLocating(true);
    setGpsError(null);

    // Initial instant fix
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy || 15);
        const heading = position.coords.heading;

        const gpsData = { lat, lng, accuracy, heading };
        setLocalLiveGps(gpsData);
        setGpsActive(true);
        setIsGpsLocating(false);

        // Center map onto user's geological location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15, { animate: true });
        }

        // Notify parent if callback provided
        if (onLiveLocationAcquired) {
          onLiveLocationAcquired({
            name: `📍 My Current Location (GPS ±${accuracy}m)`,
            category: 'live',
            lat,
            lng,
            address: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)} (Live Geological GPS)`,
            notes: `Accurate within ~${accuracy} meters`,
            accuracy
          });
        }

        // Start continuous geological watch
        if (watchGpsIdRef.current === null) {
          watchGpsIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
              const updatedGps = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: Math.round(pos.coords.accuracy || 15),
                heading: pos.coords.heading
              };
              setLocalLiveGps(updatedGps);
            },
            () => {},
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
          );
        }
      },
      (err) => {
        setIsGpsLocating(false);
        setGpsActive(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Location permission denied. Please allow location access in your browser to view your live position.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError('Geological GPS signal unavailable. Please ensure location services are enabled.');
        } else {
          setGpsError('Unable to acquire geological location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const hasPickup = pickup && pickup.lat !== 0 && pickup.lng !== 0 && pickup.category !== 'none';
    const hasDest = destination && destination.lat !== 0 && destination.lng !== 0 && destination.category !== 'none';

    let centerLat = 13.655;
    let centerLng = 79.385;
    if (hasPickup && hasDest) {
      centerLat = (pickup.lat + destination.lat) / 2;
      centerLng = (pickup.lng + destination.lng) / 2;
    } else if (hasPickup) {
      centerLat = pickup.lat;
      centerLng = pickup.lng;
    } else if (hasDest) {
      centerLat = destination.lat;
      centerLng = destination.lng;
    }

    const defaultCenter: [number, number] = [centerLat, centerLng];

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: false,
      attributionControl: true
    });

    // Base Tile layers (Google Maps layer if API key granted, CartoDB Voyager, or OSM)
    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let tileAttribution = '© OpenStreetMap, © CARTO • Hari Travels GPS';

    if (activeTileType === 'google') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      tileAttribution = '© Google Maps Platform • Hari Travels GPS';
    } else if (activeTileType === 'osm') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      tileAttribution = '© OpenStreetMap contributors • Hari Travels GPS';
    }

    const baseTileLayer = L.tileLayer(tileUrl, {
      maxZoom: 20,
      attribution: tileAttribution
    }).addTo(map);
    tileLayerRef.current = baseTileLayer;

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Click handler for interactive location picking
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (clickSelectionMode === 'pickup' && onPickupChange) {
        onPickupChange({
          name: `Custom Location (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          address: 'Selected on map',
          category: 'custom'
        });
        setClickSelectionMode('none');
      } else if (clickSelectionMode === 'drop' && onDestinationChange) {
        onDestinationChange({
          name: `Custom Destination (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          address: 'Selected on map',
          category: 'custom'
        });
        setClickSelectionMode('none');
      }
    });

    // Milestone Layer
    milestoneMarkersLayerRef.current = L.layerGroup().addTo(map);

    // Add Pulsing Pickup Marker (if set)
    if (hasPickup) {
      const pickupMarker = L.marker([pickup.lat, pickup.lng], {
        icon: createPickupPulsingIcon(pickup.name.split(',')[0]),
        draggable: isDraggable
      }).addTo(map);

      pickupMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; min-width: 140px;">
          <strong style="color: #6B1724; font-size: 13px;">Pickup Location</strong><br/>
          <span style="font-size: 11px; color: #444;">${pickup.name}</span>
          ${isDraggable ? '<br/><span style="font-size: 9px; color: #888;">(Drag pin to adjust pickup)</span>' : ''}
        </div>
      `);

      if (isDraggable && onPickupChange) {
        pickupMarker.on('dragend', (e) => {
          const marker = e.target as L.Marker;
          const pos = marker.getLatLng();
          onPickupChange({
            ...pickup,
            lat: pos.lat,
            lng: pos.lng,
            address: `Lat: ${pos.lat.toFixed(4)}, Lng: ${pos.lng.toFixed(4)}`
          });
        });
      }
      pickupMarkerRef.current = pickupMarker;
    }

    // Add Sacred Drop Marker (if set)
    if (hasDest) {
      const destMarker = L.marker([destination.lat, destination.lng], {
        icon: createDropPulsingIcon(destination.name.split(',')[0]),
        draggable: isDraggable
      }).addTo(map);

      destMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; min-width: 140px;">
          <strong style="color: #8C6D28; font-size: 13px;">Destination</strong><br/>
          <span style="font-size: 11px; color: #444;">${destination.name}</span>
          ${isDraggable ? '<br/><span style="font-size: 9px; color: #888;">(Drag pin to adjust drop)</span>' : ''}
        </div>
      `);

      if (isDraggable && onDestinationChange) {
        destMarker.on('dragend', (e) => {
          const marker = e.target as L.Marker;
          const pos = marker.getLatLng();
          onDestinationChange({
            ...destination,
            lat: pos.lat,
            lng: pos.lng,
            address: `Lat: ${pos.lat.toFixed(4)}, Lng: ${pos.lng.toFixed(4)}`
          });
        });
      }
      destMarkerRef.current = destMarker;
    }

    // Initial driver position
    const currentDriverPos = driverPosition || {
      lat: (hasPickup ? pickup.lat : 13.655) + 0.008,
      lng: (hasPickup ? pickup.lng : 79.385) + 0.005
    };

    // Realistic Vehicle Icon with dynamic heading
    const initialVehicle = vehicleModel || driver?.vehicleModel || 'Toyota Etios';
    const driverIcon = createVehicleLeafletIcon(initialVehicle, driverHeading);
    const driverMarker = L.marker([currentDriverPos.lat, currentDriverPos.lng], { icon: driverIcon }).addTo(map);
    
    driverMarker.bindPopup(`
      <div style="font-family: inherit; padding: 6px;">
        <strong style="color: #6B1724; font-size: 13px;">${driver?.name || 'Ravi Kumar'}</strong><br/>
        <span style="font-size: 11px; font-weight: 600; color: #222;">${initialVehicle} • ${driver?.vehicleNumber || 'AP 03 TX 4821'}</span><br/>
        <span style="font-size: 10px; color: #059669;">★ ${driver?.rating || 4.9} • TTD Fastag Verified</span>
      </div>
    `);
    driverMarkerRef.current = driverMarker;

    // Draw Route Polylines only if we have both points or waypoints
    const pathCoords: [number, number][] = routeWaypoints.length > 0
      ? routeWaypoints.map(wp => [wp.lat, wp.lng])
      : (hasPickup && hasDest ? [[pickup.lat, pickup.lng], [destination.lat, destination.lng]] : []);

    if (pathCoords.length > 0) {
      // Outer primary polyline
      const polylineOuter = L.polyline(pathCoords, {
        color: '#6B1724',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      routePolylineOuterRef.current = polylineOuter;

      // Inner glowing dashed gold line
      const polylineInner = L.polyline(pathCoords, {
        color: '#D4AF37',
        weight: 2.5,
        opacity: 0.95,
        dashArray: '8, 8'
      }).addTo(map);
      routePolylineInnerRef.current = polylineInner;
    }

    // Add Waypoint Milestone markers along ghat road
    if (routeWaypoints.length > 2) {
      routeWaypoints.forEach((wp, idx) => {
        // Only mark intermediate checkpoints
        if (idx > 0 && idx < routeWaypoints.length - 1 && (idx % 2 === 1 || (wp as RouteWaypoint).landmarkType === 'hairpin' || (wp as RouteWaypoint).landmarkType === 'toll')) {
          const isTollOrHairpin = (wp as RouteWaypoint).landmarkType === 'toll' || (wp as RouteWaypoint).landmarkType === 'hairpin';
          const milestoneIcon = L.divIcon({
            className: 'milestone-pin',
            html: `
              <div class="w-4 h-4 rounded-full ${isTollOrHairpin ? 'bg-[#D4AF37] border-2 border-[#3B0A11]' : 'bg-white border-2 border-[#6B1724]'} shadow-sm flex items-center justify-center text-[8px] font-bold">
                ${isTollOrHairpin ? '⚠️' : idx}
              </div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          const mMarker = L.marker([wp.lat, wp.lng], { icon: milestoneIcon });
          mMarker.bindTooltip(wp.name || `Waypoint ${idx}`, { direction: 'top', offset: [0, -8] });
          milestoneMarkersLayerRef.current?.addLayer(mMarker);
        }
      });
    }

    // Fit map bounds safely
    const pointsToFit: [number, number][] = [];
    if (hasPickup) pointsToFit.push([pickup.lat, pickup.lng]);
    if (hasDest) pointsToFit.push([destination.lat, destination.lng]);
    if (currentDriverPos) pointsToFit.push([currentDriverPos.lat, currentDriverPos.lng]);

    if (pointsToFit.length > 1) {
      const bounds = L.latLngBounds(pointsToFit);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (pointsToFit.length === 1) {
      map.setView(pointsToFit[0], 13);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [pickup.lat, pickup.lng, destination.lat, destination.lng, activeTileType, routeWaypoints.length]);

  // Automatically prompt user for Geolocation permission on component mount and center map
  useEffect(() => {
    if (!autoPromptLocation || hasAutoPromptedRef.current) return;
    if (!('geolocation' in navigator)) return;

    hasAutoPromptedRef.current = true;
    setIsGpsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy || 15);
        const heading = position.coords.heading;

        const gpsData = { lat, lng, accuracy, heading };
        setLocalLiveGps(gpsData);
        setGpsActive(true);
        setIsGpsLocating(false);

        // Center map immediately on user's live geological coordinates
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15, { animate: true });
        }

        // Notify parent callback
        if (onLiveLocationAcquired) {
          onLiveLocationAcquired({
            name: `📍 My Current Location (GPS ±${accuracy}m)`,
            category: 'live',
            lat,
            lng,
            address: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)} (Live Geological GPS)`,
            notes: `Accurate within ~${accuracy} meters`,
            accuracy
          });
        }

        // Start continuous watchPosition stream
        if (watchGpsIdRef.current === null) {
          watchGpsIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
              const updatedGps = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: Math.round(pos.coords.accuracy || 15),
                heading: pos.coords.heading
              };
              setLocalLiveGps(updatedGps);
            },
            () => {},
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
          );
        }
      },
      (err) => {
        setIsGpsLocating(false);
        setGpsActive(false);
        // Only set error message if user explicitly denied or position unavailable
        if (err.code === err.PERMISSION_DENIED) {
          // If denied, we can log or keep notice unobtrusive
          console.warn('Geolocation permission denied by user on component mount prompt.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          console.warn('Geolocation position unavailable.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000
      }
    );
  }, [autoPromptLocation, onLiveLocationAcquired]);

  // Update Driver Marker Position & Heading dynamically
  useEffect(() => {
    if (!driverPosition || !driverMarkerRef.current) return;

    driverMarkerRef.current.setLatLng([driverPosition.lat, driverPosition.lng]);
    const activeModel = vehicleModel || driver?.vehicleModel || 'Toyota Etios';
    driverMarkerRef.current.setIcon(createVehicleLeafletIcon(activeModel, driverHeading));
  }, [driverPosition?.lat, driverPosition?.lng, driverHeading, vehicleModel]);

  // Update Pickup & Drop Marker Positions
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const hasPickup = pickup && pickup.lat !== 0 && pickup.lng !== 0 && pickup.category !== 'none';
    const hasDest = destination && destination.lat !== 0 && destination.lng !== 0 && destination.category !== 'none';

    if (hasPickup) {
      if (!pickupMarkerRef.current) {
        const marker = L.marker([pickup.lat, pickup.lng], {
          icon: createPickupPulsingIcon(pickup.name.split(',')[0]),
          draggable: isDraggable
        }).addTo(mapInstanceRef.current);
        if (isDraggable && onPickupChange) {
          marker.on('dragend', (e) => {
            const m = e.target as L.Marker;
            const pos = m.getLatLng();
            onPickupChange({
              ...pickup,
              lat: pos.lat,
              lng: pos.lng,
              address: `Lat: ${pos.lat.toFixed(4)}, Lng: ${pos.lng.toFixed(4)}`
            });
          });
        }
        pickupMarkerRef.current = marker;
      } else {
        pickupMarkerRef.current.setLatLng([pickup.lat, pickup.lng]);
        pickupMarkerRef.current.setIcon(createPickupPulsingIcon(pickup.name.split(',')[0]));
      }
    } else {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
        pickupMarkerRef.current = null;
      }
    }

    if (hasDest) {
      if (!destMarkerRef.current) {
        const marker = L.marker([destination.lat, destination.lng], {
          icon: createDropPulsingIcon(destination.name.split(',')[0]),
          draggable: isDraggable
        }).addTo(mapInstanceRef.current);
        if (isDraggable && onDestinationChange) {
          marker.on('dragend', (e) => {
            const m = e.target as L.Marker;
            const pos = m.getLatLng();
            onDestinationChange({
              ...destination,
              lat: pos.lat,
              lng: pos.lng,
              address: `Lat: ${pos.lat.toFixed(4)}, Lng: ${pos.lng.toFixed(4)}`
            });
          });
        }
        destMarkerRef.current = marker;
      } else {
        destMarkerRef.current.setLatLng([destination.lat, destination.lng]);
        destMarkerRef.current.setIcon(createDropPulsingIcon(destination.name.split(',')[0]));
      }
    } else {
      if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
      }
    }
  }, [pickup.lat, pickup.lng, destination.lat, destination.lng, pickup.name, destination.name, pickup.category, destination.category]);

  // Update Route Polylines when waypoints or endpoints change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const hasPickup = pickup && pickup.lat !== 0 && pickup.lng !== 0 && pickup.category !== 'none';
    const hasDest = destination && destination.lat !== 0 && destination.lng !== 0 && destination.category !== 'none';

    const pathCoords: [number, number][] = routeWaypoints.length > 0
      ? routeWaypoints.map(wp => [wp.lat, wp.lng])
      : (hasPickup && hasDest ? [[pickup.lat, pickup.lng], [destination.lat, destination.lng]] : []);

    if (routePolylineOuterRef.current) {
      routePolylineOuterRef.current.setLatLngs(pathCoords);
    }
    if (routePolylineInnerRef.current) {
      routePolylineInnerRef.current.setLatLngs(pathCoords);
    }
  }, [routeWaypoints, pickup.lat, pickup.lng, destination.lat, destination.lng, pickup.category, destination.category]);

  // Update Wandering Idle Cabs Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    wanderingCabs.forEach((cab) => {
      let marker = wanderingMarkersRef.current.get(cab.id);
      if (!marker) {
        const icon = createVehicleLeafletIcon(cab.vehicleModel, cab.heading);
        marker = L.marker([cab.lat, cab.lng], { icon }).addTo(mapInstanceRef.current!);
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <strong style="color: #6B1724; font-size: 12px;">${cab.driverName}</strong><br/>
            <span style="font-size: 11px; color: #333;">${cab.vehicleModel} • ${cab.vehiclePlate}</span><br/>
            <span style="font-size: 10px; color: #059669;">★ ${cab.rating} • Available Nearby</span>
          </div>
        `);
        wanderingMarkersRef.current.set(cab.id, marker);
      } else {
        marker.setLatLng([cab.lat, cab.lng]);
        marker.setIcon(createVehicleLeafletIcon(cab.vehicleModel, cab.heading));
      }
    });
  }, [wanderingCabs]);

  // Handle switching map tile layer (Google Maps, Carto Voyager, OSM)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let tileAttribution = '© OpenStreetMap, © CARTO • Hari Travels GPS';

    if (activeTileType === 'google') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      tileAttribution = '© Google Maps Platform • Hari Travels GPS';
    } else if (activeTileType === 'osm') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      tileAttribution = '© OpenStreetMap contributors • Hari Travels GPS';
    }

    const newLayer = L.tileLayer(tileUrl, {
      maxZoom: 20,
      attribution: tileAttribution
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [activeTileType]);

  // Update Real Browser Device GPS Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (effectiveGps) {
      if (!liveGpsMarkerRef.current) {
        const icon = createLiveGpsIcon();
        liveGpsMarkerRef.current = L.marker([effectiveGps.lat, effectiveGps.lng], { icon }).addTo(mapInstanceRef.current);
        if (effectiveGps.accuracy) {
          liveGpsCircleRef.current = L.circle([effectiveGps.lat, effectiveGps.lng], {
            radius: Math.min(150, effectiveGps.accuracy),
            color: '#2563EB',
            fillColor: '#3B82F6',
            fillOpacity: 0.18,
            weight: 1.5
          }).addTo(mapInstanceRef.current);
        }
      } else {
        liveGpsMarkerRef.current.setLatLng([effectiveGps.lat, effectiveGps.lng]);
        if (liveGpsCircleRef.current && effectiveGps.accuracy) {
          liveGpsCircleRef.current.setLatLng([effectiveGps.lat, effectiveGps.lng]);
          liveGpsCircleRef.current.setRadius(Math.min(150, effectiveGps.accuracy));
        }
      }
    } else {
      if (liveGpsMarkerRef.current) {
        liveGpsMarkerRef.current.remove();
        liveGpsMarkerRef.current = null;
      }
      if (liveGpsCircleRef.current) {
        liveGpsCircleRef.current.remove();
        liveGpsCircleRef.current = null;
      }
    }
  }, [effectiveGps]);

  // Map Controls
  const handleRecenterDriver = () => {
    if (mapInstanceRef.current && driverPosition) {
      mapInstanceRef.current.setView([driverPosition.lat, driverPosition.lng], 14, { animate: true });
    }
  };

  const handleRecenterLiveGps = () => {
    if (mapInstanceRef.current && effectiveGps) {
      mapInstanceRef.current.setView([effectiveGps.lat, effectiveGps.lng], 15, { animate: true });
    } else {
      handleRequestLiveLocation();
    }
  };

  const handleFitRoute = () => {
    if (mapInstanceRef.current) {
      const hasPickup = pickup && pickup.lat !== 0 && pickup.lng !== 0 && pickup.category !== 'none';
      const hasDest = destination && destination.lat !== 0 && destination.lng !== 0 && destination.category !== 'none';

      const points: [number, number][] = [];
      if (hasPickup) points.push([pickup.lat, pickup.lng]);
      if (hasDest) points.push([destination.lat, destination.lng]);
      if (driverPosition) points.push([driverPosition.lat, driverPosition.lng]);
      if (effectiveGps) points.push([effectiveGps.lat, effectiveGps.lng]);

      if (points.length >= 2) {
        const bounds = L.latLngBounds(points);
        mapInstanceRef.current.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
      } else if (points.length === 1) {
        mapInstanceRef.current.setView(points[0], 14, { animate: true });
      }
    }
  };

  return (
    <div className={`relative ${className} border border-[#E8DFC8] shadow-inner bg-[#FAF7F2]`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Geological Location Access Error Alert */}
      {gpsError && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 max-w-sm w-11/12 bg-amber-900/95 text-white px-3.5 py-2 rounded-2xl shadow-xl border border-amber-400 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="text-[11px] leading-tight">{gpsError}</span>
          </div>
          <button
            onClick={() => setGpsError(null)}
            className="text-amber-200 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-white/10"
          >
            ✕
          </button>
        </div>
      )}

      {/* Interactive Selection Alert Banner if click mode active */}
      {clickSelectionMode !== 'none' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#3B0A11] text-[#D4AF37] px-4 py-2 rounded-full shadow-2xl border border-[#D4AF37] text-xs font-bold flex items-center space-x-2 animate-bounce">
          <Crosshair className="w-4 h-4 text-[#D4AF37]" />
          <span>Click anywhere on the map to set {clickSelectionMode === 'pickup' ? 'PICKUP' : 'DROP'} location</span>
          <button
            onClick={() => setClickSelectionMode('none')}
            className="ml-2 bg-white/20 hover:bg-white/30 text-white rounded-full px-2 py-0.5 text-[10px]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Top Left Badge: Active Corridor Info & Map Layer / API Key Indicator */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 max-w-[260px] sm:max-w-xs">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E8DFC8] shadow-sm text-xs font-medium text-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="font-bold text-stone-900 truncate">
              {vehicleModel || 'Toyota Etios'} • Live Telemetry
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#6B1724] bg-red-50 px-1.5 py-0.5 rounded border border-red-100 ml-1">
            Ghat GPS
          </span>
        </div>

        {/* Google Maps Platform API Permission Status & Tile Switcher */}
        <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#E8DFC8] shadow-2xs flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-stone-700">
              {googleMapsApiKey ? 'Google Maps API: Active' : 'Default Map'}
            </span>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <button
              type="button"
              onClick={() => setActiveTileType('google')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                activeTileType === 'google'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
              title="Google Maps Platform Road Layer"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => setActiveTileType('voyager')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                activeTileType === 'voyager'
                  ? 'bg-[#6B1724] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
              title="Luxury Carto Voyager Map Layer"
            >
              Voyager
            </button>
          </div>
        </div>

        {/* Available nearby cabs pill */}
        {wanderingCabs.length > 0 && (
          <div className="bg-stone-900/90 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center space-x-1.5 border border-white/10 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>{wanderingCabs.length} nearby cabs on live radar</span>
          </div>
        )}
      </div>

      {/* Interactive Map Tools (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col space-y-1.5 items-end">
        {/* Dedicated Live Geological Location Access Button */}
        <button
          onClick={handleRequestLiveLocation}
          disabled={isGpsLocating}
          className={`p-2 rounded-xl shadow-md border text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95 ${
            effectiveGps
              ? 'bg-blue-600 text-white border-blue-700 shadow-blue-200'
              : 'bg-white/95 hover:bg-white text-stone-800 border-[#E8DFC8]'
          }`}
          title={effectiveGps ? 'Live Geological GPS Active (Click to toggle/refresh)' : 'Grant live Geological Location access to map'}
        >
          {isGpsLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          ) : (
            <LocateFixed className={`w-3.5 h-3.5 ${effectiveGps ? 'text-white animate-pulse' : 'text-blue-600'}`} />
          )}
          <span className="text-[11px] font-bold">
            {isGpsLocating ? 'Locating...' : effectiveGps ? 'Live GPS Active' : 'Live GPS'}
          </span>
          {effectiveGps && (
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping ml-0.5" />
          )}
        </button>

        {/* Center on Live GPS button if active */}
        {effectiveGps && (
          <button
            onClick={handleRecenterLiveGps}
            className="bg-blue-50 hover:bg-blue-100 text-blue-900 p-2 rounded-xl shadow-md border border-blue-200 text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95"
            title="Center map onto my live geological position"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-700 rotate-45" />
            <span className="hidden sm:inline text-[11px]">Center on Me</span>
          </button>
        )}

        {driverPosition && (
          <button
            onClick={handleRecenterDriver}
            className="bg-white/95 hover:bg-white text-stone-800 p-2 rounded-xl shadow-md border border-[#E8DFC8] text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95"
            title="Center map on driver cab"
          >
            <Navigation className="w-3.5 h-3.5 text-[#6B1724]" />
            <span className="hidden sm:inline text-[11px]">Follow Driver</span>
          </button>
        )}

        <button
          onClick={handleFitRoute}
          className="bg-white/95 hover:bg-white text-stone-800 p-2 rounded-xl shadow-md border border-[#E8DFC8] text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95"
          title="View entire route"
        >
          <Compass className="w-3.5 h-3.5 text-[#8C6D28]" />
          <span className="hidden sm:inline text-[11px]">Fit Route</span>
        </button>

        {isDraggable && onPickupChange && onDestinationChange && (
          <div className="bg-white/95 p-1 rounded-xl shadow-md border border-[#E8DFC8] flex flex-col gap-1">
            <button
              onClick={() => setClickSelectionMode(clickSelectionMode === 'pickup' ? 'none' : 'pickup')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition ${
                clickSelectionMode === 'pickup' ? 'bg-[#6B1724] text-white' : 'hover:bg-stone-100 text-stone-700'
              }`}
              title="Click on map to choose pickup"
            >
              <MapPin className="w-3 h-3 text-red-600" />
              <span>Set Pickup</span>
            </button>
            <button
              onClick={() => setClickSelectionMode(clickSelectionMode === 'drop' ? 'none' : 'drop')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition ${
                clickSelectionMode === 'drop' ? 'bg-[#D4AF37] text-stone-900' : 'hover:bg-stone-100 text-stone-700'
              }`}
              title="Click on map to choose drop"
            >
              <span>🛕 Set Drop</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
