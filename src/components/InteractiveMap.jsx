import { useState, useEffect, useRef } from 'react';
import './InteractiveMap.css'; // 使用新的样式文件
import { getCityNameByCoords, fetchWeatherDataByCoords } from '../services/weatherService';

function InteractiveMap({ onSelectLocation }) {
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize map
  useEffect(() => {
    if (showMap && !leafletMapRef.current) {
      // Ensure Leaflet library is loaded
      if (window.L) {
        // Create map instance
        leafletMapRef.current = window.L.map(mapRef.current).setView([20, 0], 2);
        
        // Add OpenStreetMap tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(leafletMapRef.current);
        
        // Add major world cities markers
        addCityMarkers();
        
        // Add map click event
        leafletMapRef.current.on('click', handleMapClick);
      }
    }
    
    // Clean up map instance when component unmounts
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.off('click', handleMapClick);
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [showMap]);
  
  // Handle map click event
  const handleMapClick = async (e) => {
    try {
      setLoading(true);
      setError(null);
      
      const { lat, lng } = e.latlng;
      
      // Use reverse geocoding to get city name for clicked location
      const cityName = await getCityNameByCoords(lat, lng);
      
      // Set selected location
      setSelectedLocation({
        lat,
        lng,
        name: cityName
      });
      
      // Add marker to map
      addMarkerToMap(lat, lng, cityName);
      
      // Call parent component callback function with city name
      onSelectLocation(cityName);
      
      // Close map and scroll to top
      setShowMap(false);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error getting location data:', err);
      setError('This city data is not available yet');
    } finally {
      setLoading(false);
    }
  };
  
  // Add marker to map
  const addMarkerToMap = (lat, lng, name) => {
    if (leafletMapRef.current) {
      // Clear previous markers
      leafletMapRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          leafletMapRef.current.removeLayer(layer);
        }
      });
      
      // Add new marker
      window.L.marker([lat, lng])
        .addTo(leafletMapRef.current)
        .bindPopup(name)
        .openPopup();
    }
  };
  
  // Add city markers
  const addCityMarkers = () => {
    // City data imported from world-map-data.js
    const worldCities = {
      'new-york': { name: 'New York', lat: 40.7128, lon: -74.0060 },
      'los-angeles': { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
      'chicago': { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
      'toronto': { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
      'mexico-city': { name: 'Mexico City', lat: 19.4326, lon: -99.1332 },
      'sao-paulo': { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
      'buenos-aires': { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
      'lima': { name: 'Lima', lat: -12.0464, lon: -77.0428 },
      'london': { name: 'London', lat: 51.5074, lon: -0.1278 },
      'paris': { name: 'Paris', lat: 48.8566, lon: 2.3522 },
      'berlin': { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
      'rome': { name: 'Rome', lat: 41.9028, lon: 12.4964 },
      'madrid': { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
      'moscow': { name: 'Moscow', lat: 55.7558, lon: 37.6173 },
      'cairo': { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
      'lagos': { name: 'Lagos', lat: 6.5244, lon: 3.3792 },
      'johannesburg': { name: 'Johannesburg', lat: -26.2041, lon: 28.0473 },
      'nairobi': { name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
      'beijing': { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
      'tokyo': { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
      'delhi': { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
      'mumbai': { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
      'shanghai': { name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
      'hong-kong': { name: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
      'singapore': { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
      'dubai': { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
      'sydney': { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
      'melbourne': { name: 'Melbourne', lat: -37.8136, lon: 144.9631 },
      'auckland': { name: 'Auckland', lat: -36.8509, lon: 174.7645 }
    };
    
    // Add marker for each city
    Object.entries(worldCities).forEach(([key, city]) => {
      const marker = window.L.marker([city.lat, city.lon])
        .addTo(leafletMapRef.current)
        .bindPopup(city.name)
        .on('click', () => {
          handleCitySelect(city.name);
        });
    });
  };
  
  // Handle city selection
  const handleCitySelect = (cityName) => {
    setSelectedLocation({ name: cityName });
    onSelectLocation(cityName);
    // Close the map after selecting a city to show weather information
    setShowMap(false);
    // Scroll to top of the page
    window.scrollTo(0, 0);
  };
  
  // Toggle map display state
  const toggleMap = () => {
    setShowMap(!showMap);
  };
  
  return (
    <div className="interactive-map-container">
      <button 
        className="map-button" 
        onClick={toggleMap}
        aria-label="Open Interactive Map"
      >
        🗺️ Interactive Map
      </button>
      
      {showMap && (
        <div className="leaflet-map-modal">
          <div className="map-header">
            <h3>Interactive World Map</h3>
            <p className="map-instruction">Click anywhere to get weather information</p>
            <button className="close-button" onClick={() => setShowMap(false)}>×</button>
          </div>
          
          {loading && <div className="map-loading">Getting location information...</div>}
          {error && <div className="map-error">{error}</div>}
          
          <div id="map" ref={mapRef} className="leaflet-map"></div>
          
          <div className="map-footer">
            <p>Data source: OpenStreetMap | Click anywhere on the map or on a marker to get weather information</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteractiveMap;