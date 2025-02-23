import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GpsData } from '../types/GpsData';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/marker-icon-2x.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
});

interface MapProps {
    devices: GpsData[];
}

export const Map = ({ devices }: MapProps) => {
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<{ [key: string]: L.Marker }>({});

    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map('map').setView([46.5197, 6.6323], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            mapRef.current = map;
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        // Update markers
        devices.forEach(device => {
            const marker = markersRef.current[device.deviceId];
            const position = L.latLng(device.latitude, device.longitude);

            if (marker) {
                marker.setLatLng(position);
            } else {
                const newMarker = L.marker(position)
                    .bindPopup(`
                        Device: ${device.deviceId}<br>
                        Speed: ${device.speed.toFixed(1)} km/h<br>
                        Status: ${device.status}
                    `)
                    .addTo(mapRef.current!);
                markersRef.current[device.deviceId] = newMarker;
            }
        });

        // Remove obsolete markers
        Object.keys(markersRef.current).forEach(deviceId => {
            if (!devices.find(d => d.deviceId === deviceId)) {
                markersRef.current[deviceId].remove();
                delete markersRef.current[deviceId];
            }
        });
    }, [devices]);

    return <div id="map" style={{ height: '100%', width: '100%' }} />;
};
