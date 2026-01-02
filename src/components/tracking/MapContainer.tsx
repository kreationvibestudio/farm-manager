"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { VehicleWithLocation } from "@/types";

interface MapContainerProps {
  vehicles: VehicleWithLocation[];
  selectedVehicle: string | null;
  onVehicleSelect: (id: string | null) => void;
}

export function MapContainer({ vehicles, selectedVehicle, onVehicleSelect }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Wait for container to have dimensions
    const checkDimensions = () => {
      if (!mapContainer.current) return false;
      const rect = mapContainer.current.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    // Check immediately
    if (!checkDimensions()) {
      // Wait a bit for layout to settle
      const timer = setTimeout(() => {
        if (!checkDimensions() || map.current) return;
        initializeMap();
      }, 100);
      return () => clearTimeout(timer);
    }

    initializeMap();

    function initializeMap() {
      if (!mapContainer.current || map.current) return;

      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoic2Rrb25jZXB0IiwiYSI6ImNtamtvaDNqejIzeHIzZ3F4bXo0bXN3MDgifQ.GAkm6kW5nBlWe8H8RbT0rg';
      
      if (!mapboxToken) {
        console.error('Mapbox token is missing');
        return;
      }

      mapboxgl.accessToken = mapboxToken;
      
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          center: [5.59554, 6.5702], // Plantation location: 6.5702°N, 5.59554°E
          zoom: 13,
          antialias: true,
        });

        map.current.on('load', () => {
          setMapLoaded(true);
          // Force resize to ensure tiles load
          map.current?.resize();
        });

        map.current.on('error', (e) => {
          console.error('Mapbox error:', e);
        });

        // Handle resize
        const handleResize = () => {
          map.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          map.current?.remove();
        };
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove old markers
    markers.current.forEach(marker => marker.remove());
    markers.current.clear();

    // Add markers for vehicles with locations
    vehicles.forEach(vehicle => {
      if (!vehicle.location) return;

      const { latitude, longitude, heading } = vehicle.location;

      const el = document.createElement('div');
      el.className = 'vehicle-marker cursor-pointer';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.position = 'relative';
      
      const isSelected = selectedVehicle === vehicle.id;
      
      el.innerHTML = `
        <div class="relative w-full h-full">
          <div class="w-full h-full bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center ${isSelected ? 'ring-4 ring-primary ring-offset-2' : ''}">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
            </svg>
          </div>
          ${heading !== undefined ? `
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-0 h-0 border-l-4 border-r-4 border-b-8 border-b-primary border-l-transparent border-r-transparent" 
                   style="transform: rotate(${heading}deg);"></div>
            </div>
          ` : ''}
        </div>
      `;

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([longitude, latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onVehicleSelect(vehicle.id);
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
        });
      });

      if (isSelected && map.current) {
        map.current.flyTo({
          center: [longitude, latitude],
          zoom: 15,
        });
      }

      markers.current.set(vehicle.id, marker);
    });

    // Fit bounds to show all vehicles
    if (vehicles.filter(v => v.location).length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      vehicles.forEach(vehicle => {
        if (vehicle.location) {
          bounds.extend([vehicle.location.longitude, vehicle.location.latitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [vehicles, mapLoaded, selectedVehicle, onVehicleSelect]);

  return (
    <div ref={mapContainer} className="w-full h-full min-h-[600px]" />
  );
}
