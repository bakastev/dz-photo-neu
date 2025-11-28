'use client';

import { useEffect, useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  zoom?: number;
  className?: string;
}

export default function LocationMap({
  latitude,
  longitude,
  name,
  address,
  zoom = 15,
  className = '',
}: LocationMapProps) {
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Popup, setPopup] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import Leaflet components (client-side only)
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
      
      // Fix for default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      setMapContainer(() => MapContainer);
      setTileLayer(() => TileLayer);
      setMarker(() => Marker);
      setPopup(() => Popup);
      setIsLoaded(true);
    };

    loadLeaflet();
  }, []);

  // Loading state
  if (!isLoaded || !MapContainer) {
    return (
      <div className={`bg-[#1A1A1A] rounded-xl overflow-hidden ${className}`}>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-gold mx-auto mb-2 animate-pulse" />
            <p className="text-gray-400 text-sm">Karte wird geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      {/* Map Container */}
      <div className="relative">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
          integrity="sha512-Zcn6bjR/8RZbLEpLIeOwNtzREBAJnUKESxces60Mpoj+2okopSAcSUIUOseddDm0cxnGQzxIR7vJgsLZbdLE3w=="
          crossOrigin=""
        />
        <MapContainer
          center={[latitude, longitude]}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: '300px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]}>
            <Popup>
              <div className="text-center">
                <strong className="block text-gray-900">{name}</strong>
                {address && <span className="text-sm text-gray-600">{address}</span>}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Map Actions */}
      <div className="bg-[#1A1A1A] border-t border-white/10 p-4">
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>OpenStreetMap</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Route planen</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}



