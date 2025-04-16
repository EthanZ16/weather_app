import { useState, useEffect, useRef } from 'react';
import './WeatherMap.css';
import { worldMapData, worldCityCoordinates } from '../assets/world-map-data';
import { fetchGlobalStormData, fetchRainfallHeatmap } from '../services/specialWeatherService';

function WeatherMap({ onSelectLocation }) {
  const [showMap, setShowMap] = useState(false);
  const [mapMode, setMapMode] = useState('default'); // 'default', 'storm', 'rainfall'
  const [stormData, setStormData] = useState([]);
  const [rainfallData, setRainfallData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const mapRef = useRef(null);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  
  // Fetch storm data when map mode changes to 'storm'
  useEffect(() => {
    if (mapMode === 'storm' && stormData.length === 0) {
      fetchStormData();
    }
  }, [mapMode]);
  
  // Fetch rainfall data when a city is selected and map mode is 'rainfall'
  useEffect(() => {
    if (mapMode === 'rainfall' && selectedCity) {
      fetchRainfallData(selectedCity);
    }
  }, [mapMode, selectedCity]);
  
  // Fetch global storm data
  const fetchStormData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGlobalStormData();
      setStormData(data);
    } catch (err) {
      setError('Failed to load storm data. Please try again later.');
      console.error('Error fetching storm data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch rainfall heatmap data for a specific city
  const fetchRainfallData = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const cityData = worldCityCoordinates[city] || 
                      Object.values(worldCityCoordinates).find(c => c.name === city);
      
      if (!cityData) {
        throw new Error(`City data not found for ${city}`);
      }
      
      const data = await fetchRainfallHeatmap(cityData.lat, cityData.lon);
      setRainfallData(data);
    } catch (err) {
      setError('Failed to load rainfall data. Please try again later.');
      console.error('Error fetching rainfall data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle map click event
  const handleMapClick = (e) => {
    if (isDragging) return; // Don't select city if dragging
    
    // Get click position relative to SVG
    const svgElement = mapRef.current;
    const rect = svgElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find closest city
    let closestCity = null;
    let minDistance = Infinity;
    
    Object.entries(worldCityCoordinates).forEach(([key, city]) => {
      const distance = Math.sqrt(Math.pow(x - city.x, 2) + Math.pow(y - city.y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = { key, ...city };
      }
    });
    
    // If click is within reasonable range of a city (50 pixels), select it
    if (minDistance < 50 && closestCity) {
      setSelectedCity(closestCity.key);
      onSelectLocation(closestCity.name);
      
      // If in rainfall mode, fetch rainfall data for this city
      if (mapMode === 'rainfall') {
        fetchRainfallData(closestCity.key);
      }
    }
  };

  // Start dragging the map
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartDragPosition({
      x: e.clientX - mapPosition.x,
      y: e.clientY - mapPosition.y
    });
  };

  // Drag the map
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setMapPosition({
      x: e.clientX - startDragPosition.x,
      y: e.clientY - startDragPosition.y
    });
  };

  // Stop dragging the map
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Toggle map display
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Change map mode
  const changeMapMode = (mode) => {
    setMapMode(mode);
  };

  return (
    <div className="weather-map">
      <button 
        className="map-button" 
        onClick={toggleMap}
        aria-label="Open Interactive Weather Map"
      >
        🗺️ Interactive Weather Map
      </button>
      
      {showMap && (
        <div className="map-container">
          <div className="map-header">
            <h3>Interactive Weather Map</h3>
            <div className="map-controls">
              <button 
                className={`mode-button ${mapMode === 'default' ? 'active' : ''}`}
                onClick={() => changeMapMode('default')}
              >
                Standard View
              </button>
              <button 
                className={`mode-button ${mapMode === 'storm' ? 'active' : ''}`}
                onClick={() => changeMapMode('storm')}
              >
                Global Storm Paths
              </button>
              <button 
                className={`mode-button ${mapMode === 'rainfall' ? 'active' : ''}`}
                onClick={() => changeMapMode('rainfall')}
              >
                Rainfall Heatmap
              </button>
            </div>
            <button className="close-button" onClick={() => setShowMap(false)}>×</button>
          </div>
          
          <div className="map-content">
            {loading && <div className="map-loading">Loading weather data...</div>}
            {error && <div className="map-error">{error}</div>}
            
            <div 
              className="map-draggable-container"
              style={{
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              <svg 
                ref={mapRef}
                viewBox="0 0 1000 600" 
                onClick={handleMapClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="world-map"
                style={{
                  transform: `translate(${mapPosition.x}px, ${mapPosition.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease'
                }}
              >
                {/* World map outline */}
                <path 
                  d={worldMapData.outline}
                  fill="#f8f9fa"
                  stroke="#4a6cf7"
                  strokeWidth="1.5"
                />
                
                {/* Continents */}
                {Object.entries(worldMapData.continents).map(([key, path]) => (
                  <path 
                    key={key}
                    d={path}
                    fill="#f8f9fa" 
                    stroke="#4a6cf7" 
                    strokeWidth="1.5" 
                  />
                ))}
                
                {/* Rainfall heatmap overlay */}
                {mapMode === 'rainfall' && rainfallData.length > 0 && (
                  <g className="rainfall-heatmap">
                    {rainfallData.map((point, index) => {
                      // Convert lat/lon to x/y coordinates (simplified)
                      const x = ((point.lon + 180) / 360) * 1000;
                      const y = ((90 - point.lat) / 180) * 600;
                      
                      // Calculate color based on rainfall value (0-10)
                      const value = parseFloat(point.value);
                      const intensity = Math.min(value / 10, 1);
                      const blue = Math.floor(255 * intensity);
                      
                      return (
                        <circle 
                          key={index}
                          cx={x}
                          cy={y}
                          r={Math.max(2, value * 1.5)}
                          fill={`rgba(0, 100, ${blue}, ${intensity * 0.7})`}
                          opacity="0.7"
                        />
                      );
                    })}
                  </g>
                )}
                
                {/* Storm paths overlay */}
                {mapMode === 'storm' && stormData.length > 0 && (
                  <g className="storm-paths">
                    {stormData.map(storm => {
                      // Create path points from storm data
                      const pathPoints = storm.path.map(point => {
                        // Convert lat/lon to x/y coordinates (simplified)
                        const x = ((point.lon + 180) / 360) * 1000;
                        const y = ((90 - point.lat) / 180) * 600;
                        return `${x},${y}`;
                      }).join(' ');
                      
                      // Create forecast path points
                      const forecastPoints = storm.forecastPath.map(point => {
                        const x = ((point.lon + 180) / 360) * 1000;
                        const y = ((90 - point.lat) / 180) * 600;
                        return `${x},${y}`;
                      }).join(' ');
                      
                      // Get current position
                      const currentX = ((storm.currentPosition.lon + 180) / 360) * 1000;
                      const currentY = ((90 - storm.currentPosition.lat) / 180) * 600;
                      
                      return (
                        <g key={storm.id} className="storm">
                          {/* Historical path */}
                          <polyline 
                            points={pathPoints} 
                            fill="none" 
                            stroke="#ff5722" 
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Forecast path (dashed) */}
                          <polyline 
                            points={forecastPoints} 
                            fill="none" 
                            stroke="#ff9800" 
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Current position */}
                          <circle 
                            cx={currentX} 
                            cy={currentY} 
                            r="8" 
                            fill="#ff5722" 
                            stroke="#fff"
                            strokeWidth="2"
                          />
                          
                          {/* Storm name */}
                          <text 
                            x={currentX} 
                            y={currentY - 15} 
                            fontSize="12" 
                            fontWeight="bold"
                            fill="#333"
                            textAnchor="middle"
                          >
                            {storm.name} (Cat. {storm.category})
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
                
                {/* City markers */}
                {Object.entries(worldCityCoordinates).map(([key, city]) => (
                  <g key={key} className={selectedCity === key ? 'city selected' : 'city'}>
                    <circle 
                      cx={city.x} 
                      cy={city.y} 
                      r={selectedCity === key ? "7" : "4"} 
                      fill={selectedCity === key ? "#ff5722" : "#4a6cf7"} 
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <text 
                      x={city.x} 
                      y={city.y - 10} 
                      fontSize="12" 
                      textAnchor="middle" 
                      fill="#333"
                      opacity={selectedCity === key ? "1" : "0.7"}
                      fontWeight={selectedCity === key ? "bold" : "normal"}
                    >
                      {city.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            
            <div className="map-instructions">
              {mapMode === 'default' && (
                <p>Click on a city to get weather information. Drag to explore the map.</p>
              )}
              {mapMode === 'storm' && (
                <p>Viewing global storm paths. Red lines show historical paths, orange dashed lines show forecasted paths.</p>
              )}
              {mapMode === 'rainfall' && (
                <p>Click on a city to view rainfall intensity in the surrounding region. Darker blue indicates heavier rainfall.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherMap;