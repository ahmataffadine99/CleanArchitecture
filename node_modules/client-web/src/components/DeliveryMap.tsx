import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface DeliveryMapProps {
  restaurant: Coordinate;
  client: Coordinate;
  livreur?: Coordinate;
  mode?: 'RECUPERATION' | 'LIVRAISON' | 'COMPLETE';
}

// Composant pour ajuster le zoom de la carte
const MapBounds = ({ restaurant, client, livreur, mode }: DeliveryMapProps) => {
  const map = useMap();
  useEffect(() => {
    let latLngs: [number, number][] = [];
    
    if (mode === 'RECUPERATION') {
      latLngs = [[restaurant.latitude, restaurant.longitude]];
      if (livreur) latLngs.push([livreur.latitude, livreur.longitude]);
    } else if (mode === 'LIVRAISON') {
      latLngs = [[client.latitude, client.longitude]];
      if (livreur) latLngs.push([livreur.latitude, livreur.longitude]);
      else latLngs.push([restaurant.latitude, restaurant.longitude]); // Default fallback
    } else {
      latLngs = [
        [restaurant.latitude, restaurant.longitude],
        [client.latitude, client.longitude],
      ];
      if (livreur) latLngs.push([livreur.latitude, livreur.longitude]);
    }

    if (latLngs.length > 0) {
      if (latLngs.length === 1) {
        map.setView(latLngs[0], 15);
      } else {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [restaurant, client, livreur, mode, map]);
  return null;
};

// Icônes personnalisées
const createCustomIcon = (emoji: string, bgColor: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${bgColor}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px solid white;">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const restaurantIcon = createCustomIcon('🏪', '#10b981'); // Emerald 500
const clientIcon = createCustomIcon('🏠', '#3b82f6'); // Blue 500
const livreurIcon = createCustomIcon('🚴', '#f59e0b'); // Amber 500

export default function DeliveryMap({ restaurant, client, livreur, mode = 'COMPLETE' }: DeliveryMapProps) {
  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    // Calcul de l'itinéraire OSRM (gratuit)
    const fetchRoute = async () => {
      try {
        let origin = restaurant;
        let dest = client;
        
        if (mode === 'RECUPERATION' && livreur) {
           origin = livreur;
           dest = restaurant;
        } 
        else if (mode === 'LIVRAISON' && livreur) {
           origin = livreur;
           dest = client;
        }

        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates;
          // OSRM retourne [lng, lat], Leaflet veut [lat, lng]
          const latLngs = coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRoute(latLngs);
        }
      } catch (err) {
        console.error("Erreur chargement itinéraire:", err);
      }
    };
    fetchRoute();
  }, [restaurant, client]);

  return (
    <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border mx-auto z-0" style={{ zIndex: 0 }}>
      {/* On force zIndex 0 pour éviter le z-index 400 de leaflet qui passe au dessus des modals Tailwind */}
      <MapContainer 
        center={[restaurant.latitude, restaurant.longitude]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; Google Maps'
        />
        
        {(mode === 'RECUPERATION' || mode === 'COMPLETE' || mode === 'LIVRAISON') && (
           <Marker position={[restaurant.latitude, restaurant.longitude]} icon={restaurantIcon} />
        )}
        
        {(mode === 'LIVRAISON' || mode === 'COMPLETE') && (
           <Marker position={[client.latitude, client.longitude]} icon={clientIcon} />
        )}

        {livreur && <Marker position={[livreur.latitude, livreur.longitude]} icon={livreurIcon} />}
        
        {route.length > 0 && (
          <Polyline 
            positions={route} 
            color="#10b981" 
            weight={6} 
            opacity={0.8} 
            dashArray={mode === 'COMPLETE' ? "10, 10" : undefined}
          />
        )}
        
        <MapBounds restaurant={restaurant} client={client} livreur={livreur} mode={mode} />
      </MapContainer>
    </div>
  );
}
