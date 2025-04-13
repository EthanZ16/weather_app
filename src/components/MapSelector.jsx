import { useState, useEffect } from 'react';
import './MapSelector.css';
import { worldMapData, worldCityCoordinates } from '../assets/world-map-data.js';

// World map component, allows users to click on locations to get weather information
function MapSelector({ onSelectLocation }) {
  const [showMap, setShowMap] = useState(false);
  
  // Using imported world city coordinates from world-map-data.js
  // No need to redefine city coordinates here

  // Handle map click event
  const handleMapClick = (e) => {
    // Get click position relative to SVG coordinates
    const svgElement = e.currentTarget;
    const rect = svgElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find the city closest to the click position
    let closestCity = null;
    let minDistance = Infinity;
    
    Object.values(worldCityCoordinates).forEach(city => {
      const distance = Math.sqrt(Math.pow(x - city.x, 2) + Math.pow(y - city.y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });
    
    // If click position is within a reasonable range (not more than 50 pixels from the nearest city), select that city
    if (minDistance < 50 && closestCity) {
      onSelectLocation(closestCity.name);
      setShowMap(false);
    }
  };

  // Toggle map display state
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="map-selector">
      <button 
        className="map-button" 
        onClick={toggleMap}
        aria-label="Open World Map"
      >
        🗺️ World Map
      </button>
      
      {showMap && (
        <div className="map-container">
          <div className="map-header">
            <h3>Click on the world map to select a city</h3>
            <button className="close-button" onClick={() => setShowMap(false)}>×</button>
          </div>
          <div className="map-content">
            <svg 
              viewBox="0 0 1000 600" 
              onClick={handleMapClick}
              className="world-map"
            >
              {/* World map outline */}
              <path 
                d={worldMapData.outline}
                fill="#f8f9fa"
                stroke="#4a6cf7"
                strokeWidth="1.5"
              />
              
              {/* North America */}
              <path 
                d={worldMapData.continents.northAmerica}
                fill="#f8f9fa" 
                stroke="#4a6cf7" 
                strokeWidth="1.5" 
              />
              
              {/* South America */}
              <path 
                d={worldMapData.continents.southAmerica}
                fill="#f8f9fa" 
                stroke="#4a6cf7" 
                strokeWidth="1.5" 
              />
              
              {/* Europe */}
              <path 
                d={worldMapData.continents.europe}
                fill="#f8f9fa" 
                stroke="#4a6cf7" 
                strokeWidth="1.5" 
              />
              
              {/* Africa */}
              <path 
                d={worldMapData.continents.africa}
                fill="#f8f9fa" 
                stroke="#4a6cf7" 
                strokeWidth="1.5" 
              />
              
              {/* Asia */}
              <path 
                d={worldMapData.continents.asia}
                fill="#f8f9fa" 
                stroke="#4a6cf7" 
                strokeWidth="1.5" 
              />
              
              {/* Oceania */}
              <path 
                d={worldMapData.continents.oceania}
                fill="#f8f9fa" 
                stroke="#4a6cf7" 
                strokeWidth="1.5" 
              />
              
              {/* Render major city markers */}
              {Object.entries(worldCityCoordinates).map(([key, city]) => (
                <g key={key}>
                  <circle 
                    cx={city.x} 
                    cy={city.y} 
                    r="5" 
                    fill="#4a6cf7" 
                  />
                  <text 
                    x={city.x} 
                    y={city.y - 10} 
                    fontSize="12" 
                    textAnchor="middle" 
                    fill="#333"
                  >
                    {city.name}
                  </text>
                </g>
              ))}
            </svg>
            <p className="map-instruction">Click on a city or region to get global weather information</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapSelector;