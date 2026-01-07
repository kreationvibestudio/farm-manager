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

    const initializeMap = () => {
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
          // Force resize after a short delay to ensure container is ready
          setTimeout(() => {
            map.current?.resize();
          }, 100);
        });

        map.current.on('error', (e) => {
          console.error('Mapbox error:', e);
        });

        // Handle resize
        const handleResize = () => {
          if (map.current) {
            map.current.resize();
          }
        };
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          map.current?.remove();
        };
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      // Check if container has dimensions
      if (mapContainer.current) {
        const rect = mapContainer.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          initializeMap();
        } else {
          // Wait a bit more if dimensions aren't ready
          setTimeout(initializeMap, 200);
        }
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
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
      
      // Create DOM elements safely instead of using innerHTML to prevent XSS
      const container = document.createElement('div');
      container.className = 'relative w-full h-full';
      
      const circle = document.createElement('div');
      circle.className = `w-full h-full bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center ${isSelected ? 'ring-4 ring-primary ring-offset-2' : ''}`;
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'w-6 h-6 text-white');
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('viewBox', '0 0 20 20');
      
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('d', 'M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z');
      
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('d', 'M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z');
      
      svg.appendChild(path1);
      svg.appendChild(path2);
      circle.appendChild(svg);
      container.appendChild(circle);
      
      // Add heading indicator if available (safely)
      if (heading !== undefined && typeof heading === 'number' && !isNaN(heading)) {
        const headingContainer = document.createElement('div');
        headingContainer.className = 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
        
        const headingArrow = document.createElement('div');
        headingArrow.className = 'w-0 h-0 border-l-4 border-r-4 border-b-8 border-b-primary border-l-transparent border-r-transparent';
        headingArrow.style.transform = `rotate(${heading}deg)`;
        
        headingContainer.appendChild(headingArrow);
        container.appendChild(headingContainer);
      }
      
      el.appendChild(container);

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

      markers.current.set(vehicle.id, marker);
    });

    // Fit bounds to show all vehicles (only if no vehicle is selected)
    if (!selectedVehicle && vehicles.filter(v => v.location).length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      vehicles.forEach(vehicle => {
        if (vehicle.location) {
          bounds.extend([vehicle.location.longitude, vehicle.location.latitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [vehicles, mapLoaded, onVehicleSelect]);

  // Separate effect to handle flying to selected vehicle
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedVehicle) return;

    const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
    if (selectedVehicleData?.location) {
      const { latitude, longitude } = selectedVehicleData.location;
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        duration: 1500, // Smooth 1.5 second animation
        essential: true, // Animation is essential for accessibility
      });
    }
  }, [selectedVehicle, mapLoaded, vehicles]);

  return (
    <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '100%' }} />
  );
}
