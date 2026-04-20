import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useReportContext } from '../../context/ReportContext';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: null,
  iconUrl: null,
  shadowUrl: null
});

const createNeonMarker = (status, severity) => {
  const isResolved = status === 'Resolved';
  
  let color = '#F59E0B'; // Amber default
  let shadowColor = 'rgba(245, 158, 11, 0.5)';
  
  if (isResolved) {
    color = '#10B981'; // Emerald
    shadowColor = 'rgba(16, 185, 129, 0.5)';
  } else if (severity === 'High') {
    color = '#EF4444'; // Red
    shadowColor = 'rgba(239, 68, 68, 0.5)';
  } else if (severity === 'Low') {
    color = '#3B82F6'; // Blue
    shadowColor = 'rgba(59, 130, 246, 0.5)';
  }

  return L.divIcon({
    className: 'custom-neon-marker',
    html: `<div style="
      width: 16px; height: 16px; 
      background-color: ${color}; 
      border-radius: 50%;
      border: 2px solid white;
      --marker-shadow: ${shadowColor};
    " class="marker-core"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const IncidentMap = ({ isModal = false, onMapClick = null, issues: propIssues }) => {
  const { issues: contextIssues } = useReportContext();
  const issues = propIssues || contextIssues;
  const mapRef = useRef(null);

  // Click handler wrapper for modal mapping
  const MapEvents = () => {
    const map = useMap();
    useEffect(() => {
      if (onMapClick) {
        map.on('click', (e) => onMapClick(e.latlng));
      }
      return () => {
        if (onMapClick) map.off('click');
      }
    }, [map]);
    return null;
  };

  const center = [12.9716, 77.5946];

  return (
    <div className={`rounded-2xl overflow-hidden glass-panel shadow-[0_0_30px_rgba(16,185,129,0.15)] border border-primary/20 ${isModal ? 'h-[300px]' : 'h-[600px] w-full lg:w-2/3'}`}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: '#0F172A' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        />
        
        {!isModal && issues.map(issue => {
          if (issue.latitude && issue.longitude) {
            return (
              <Marker 
                key={issue.id} 
                position={[parseFloat(issue.latitude), parseFloat(issue.longitude)]}
                icon={createNeonMarker(issue.status, issue.severity)}
              >
                <Popup className="glass-popup">
                  <div className="text-[#0F172A] font-medium p-1">
                    <strong>{issue.type}</strong><br/>
                    <span className="text-xs text-gray-500">{issue.location}</span>
                  </div>
                </Popup>
              </Marker>
            )
          }
          return null;
        })}
        
        <MapEvents />
      </MapContainer>
    </div>
  );
};

export default IncidentMap;
