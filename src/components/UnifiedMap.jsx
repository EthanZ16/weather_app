import { useState, useEffect, useRef } from 'react';
import './UnifiedMap.css'; // 使用统一的样式文件
import { getCityNameByCoords, fetchWeatherDataByCoords } from '../services/weatherService';
import { fetchGlobalStormData, fetchRainfallHeatmap } from '../services/specialWeatherService';

function UnifiedMap({ onSelectLocation }) {
  const [showMap, setShowMap] = useState(false);
  const [mapMode, setMapMode] = useState('default'); // 'default', 'storm', 'rainfall'
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stormData, setStormData] = useState([]);
  const [rainfallData, setRainfallData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  
  // Initialize Leaflet map
  useEffect(() => {
    if (showMap && !leafletMapRef.current) {
      // Ensure Leaflet library is loaded
      if (window.L) {
        // Create map instance with world boundaries
        leafletMapRef.current = window.L.map(mapRef.current, {
          center: [20, 0],
          zoom: 2,
          minZoom: 2,  // 限制最小缩放级别，确保始终能看到完整世界地图
          maxZoom: 5,  // 限制最大缩放级别，防止过度放大
          maxBounds: [[-90, -180], [90, 180]],  // 设置地图边界为世界范围
          maxBoundsViscosity: 1.0  // 确保地图不能被拖出边界
        });
        
        // Add OpenStreetMap tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          noWrap: true,  // 防止地图水平重复
        }).addTo(leafletMapRef.current);
        
        // Add major world cities markers
        addCityMarkers();
        
        // Add map click event
        leafletMapRef.current.on('click', handleMapClick);
      }
    }
    
    // Clean up map instance when component unmounts or map type changes
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.off('click', handleMapClick);
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [showMap, mapMode]);
  
  // Handle Leaflet map click event
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
  
  // Add marker to Leaflet map
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
  
  // Add city markers to Leaflet map
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
    
    // If showing map and in rainfall mode, ensure legend is displayed
    if (!showMap && mapMode === 'rainfall') {
      setTimeout(() => {
        if (leafletMapRef.current) {
          addRainfallLegend();
          // Ensure rainfall data is loaded
          if (rainfallData.length === 0) {
            fetchRainfallData();
          }
        }
      }, 300);
    }
  };
  

  
  // Change map mode
  const changeMapMode = (mode) => {
    setMapMode(mode);
    
    // Clear previous visualizations and controls
    if (leafletMapRef.current) {
      // Remove layers
      leafletMapRef.current.eachLayer((layer) => {
        if ((layer._path && layer.options.className === 'storm-path') || 
            layer._heat || 
            (layer.options && layer.options.className === 'rainfall-forecast') ||
            (layer.options && layer.options.className === 'storm-pulse') ||
            (layer.options && layer.options.className === 'time-tooltip') ||
            (layer instanceof window.L.TileLayer && layer._url && layer._url.includes('precipitation'))) {
          leafletMapRef.current.removeLayer(layer);
        }
      });
      
      // Remove controls
      const oldControls = document.querySelectorAll('.rainfall-time-control, .info.legend');
      oldControls.forEach(control => {
        if (control.parentNode) control.parentNode.removeChild(control);
      });
    }
    
    // Reset map view to world range
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([20, 0], 2);
    }
    
    // Load appropriate data for the selected mode
    if (mode === 'storm') {
      fetchStormData();
    } else if (mode === 'rainfall') {
      // Display loading message
      if (leafletMapRef.current) {
        const loadingPopup = window.L.popup()
          .setLatLng(leafletMapRef.current.getCenter())
          .setContent('<div>Loading global precipitation data...</div>')
          .openOn(leafletMapRef.current);
      }
      
      // Add rainfall legend immediately before fetching data
      // This ensures the legend is visible from the first click
      addRainfallLegend();
      
      // Always fetch global rainfall data immediately when rainfall mode is selected
      // No need to wait for a city selection
      fetchRainfallData();
    }
  };

  
  // Fetch rainfall data when map mode changes to 'rainfall'
  useEffect(() => {
    if (mapMode === 'rainfall') {
      fetchRainfallData();
    }
  }, [mapMode]);
  
  // Fetch storm data when map mode changes to 'storm'
  useEffect(() => {
    if (mapMode === 'storm' && stormData.length === 0) {
      fetchStormData();
    }
  }, [mapMode, stormData.length]);
  
  // Fetch global storm data
  const fetchStormData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGlobalStormData();
      setStormData(data);
      
      // Add storm paths to the map
      if (leafletMapRef.current && data.length > 0) {
        addStormPathsToMap(data);
      }
    } catch (err) {
      setError('Failed to load storm data. Please try again later.');
      console.error('Error fetching storm data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Add storm paths to Leaflet map with 12-hour forecast animation
  const addStormPathsToMap = (storms) => {
    if (!leafletMapRef.current) return;
    
    // Clear previous storm paths
    leafletMapRef.current.eachLayer((layer) => {
      if (layer._path && layer.options.className === 'storm-path') {
        leafletMapRef.current.removeLayer(layer);
      }
    });
    
    // Add each storm path to the map
    storms.forEach(storm => {
      // Historical path (solid line)
      const pathPoints = storm.path.map(point => [point.lat, point.lon]);
      const pathLine = window.L.polyline(pathPoints, {
        color: '#ff5722',
        weight: 3,
        className: 'storm-path'
      }).addTo(leafletMapRef.current);
      
      // Forecast path (dashed line) - 扩展为12小时预测
      const forecastPoints = storm.forecastPath.map(point => [point.lat, point.lon]);
      
      // 扩展预测路径到12小时
      const extendedForecastPoints = [...forecastPoints];
      if (forecastPoints.length > 0) {
        const lastPoint = forecastPoints[forecastPoints.length - 1];
        const secondLastPoint = forecastPoints.length > 1 ? 
          forecastPoints[forecastPoints.length - 2] : 
          (storm.path.length > 0 ? [storm.currentPosition.lat, storm.currentPosition.lon] : null);
        
        if (lastPoint && secondLastPoint) {
          // 计算移动方向和速度
          const latDiff = lastPoint[0] - secondLastPoint[0];
          const lonDiff = lastPoint[1] - secondLastPoint[1];
          
          // 添加额外的预测点以达到12小时
          for (let i = 1; i <= 3; i++) { // 添加3个额外点，每个代表2小时
            extendedForecastPoints.push([
              lastPoint[0] + latDiff * i,
              lastPoint[1] + lonDiff * i
            ]);
          }
        }
      }
      
      // 创建带有动画效果的预测路径
      const forecastLine = window.L.polyline(extendedForecastPoints, {
        color: '#ff9800',
        weight: 2,
        dashArray: '5, 5',
        className: 'storm-path'
      }).addTo(leafletMapRef.current);
      
      // 添加时间标记到预测路径
      extendedForecastPoints.forEach((point, index) => {
        // 每个点代表未来几小时
        const hours = index * 3; // 假设每个点间隔3小时
        if (hours > 0 && hours <= 12) { // 只显示12小时内的时间点
          const timeMarker = window.L.circleMarker(point, {
            radius: 4,
            fillColor: '#ff9800',
            color: '#fff',
            weight: 1,
            fillOpacity: 0.7,
            className: 'storm-path'
          }).addTo(leafletMapRef.current);
          
          // 添加时间标签
          window.L.tooltip({
            permanent: true,
            direction: 'top',
            className: 'time-tooltip'
          })
            .setContent(`+${hours}h`)
            .setLatLng(point)
            .addTo(leafletMapRef.current);
        }
      });
      
      // Current position marker with animation
      const currentPos = [storm.currentPosition.lat, storm.currentPosition.lon];
      const stormMarker = window.L.circleMarker(currentPos, {
        radius: 8,
        fillColor: '#ff5722',
        color: '#fff',
        weight: 2,
        fillOpacity: 1,
        className: 'storm-path'
      }).addTo(leafletMapRef.current);
      
      // 添加脉动动画效果
      const pulseIcon = window.L.divIcon({
        html: `<div class="pulse-icon" style="background-color: #ff5722;"></div>`,
        className: 'storm-pulse',
        iconSize: [20, 20]
      });
      
      window.L.marker(currentPos, {
        icon: pulseIcon,
        className: 'storm-path'
      }).addTo(leafletMapRef.current);
      
      // Add storm name label with more information
      const stormPopup = window.L.popup({
        closeButton: false,
        autoClose: false,
        closeOnEscapeKey: false,
        closeOnClick: false
      })
        .setLatLng(currentPos)
        .setContent(`<div class="storm-label">${storm.name} (Cat. ${storm.category})<br><small>12-hour forecast path displayed</small></div>`)
        .openOn(leafletMapRef.current);
    });
  };
  
  // Add rainfall legend to the map
  const addRainfallLegend = () => {
    if (!leafletMapRef.current) return;
    
    // Remove any existing legend first
    const oldLegends = document.querySelectorAll('.info.legend');
    oldLegends.forEach(legend => {
      if (legend.parentNode) legend.parentNode.removeChild(legend);
    });
    
    // Add heatmap legend with improved design and English text
    const legend = window.L.control({position: 'bottomright'});
    legend.onAdd = function() {
      const div = window.L.DomUtil.create('div', 'info legend');
      div.innerHTML = '<h4>Global Precipitation</h4>' +
        '<div style="background: linear-gradient(to right, #b3f0ff, #00aaff, #0066ff, #ffff00, #ff9900, #ff0000); height: 20px; width: 100%; border-radius: 3px;"></div>' +
        '<div style="display: flex; justify-content: space-between; margin-top: 5px;"><span>None</span><span>Light</span><span>Moderate</span><span>Heavy</span></div>' +
        '<div style="margin-top: 8px; font-size: 12px;">Real-time global precipitation data</div>' +
        '<div style="font-size: 11px; margin-top: 3px;">Powered by OpenWeatherMap</div>';
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
      div.style.minWidth = '200px';
      return div;
    };
    legend.addTo(leafletMapRef.current);
  };
  
  // Fetch global rainfall heatmap data
  const fetchRainfallData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Show loading message on map
      if (leafletMapRef.current) {
        const loadingPopup = window.L.popup()
          .setLatLng(leafletMapRef.current.getCenter())
          .setContent('<div>Loading global precipitation data...</div>')
          .openOn(leafletMapRef.current);
      }
      
      // Get global rainfall data from API
      const rainfallResponse = await fetchRainfallHeatmap();
      
      // Process and display the rainfall data
      if (rainfallResponse && rainfallResponse.tileUrl) {
        console.log('Successfully loaded precipitation data');
        
        // Store sample rainfall data points for heatmap
        setRainfallData(rainfallResponse.rainfallData);
        
        // Add precipitation tile layer to the map
        if (leafletMapRef.current) {
          // Close loading popup
          leafletMapRef.current.closePopup();
          
          // Clear previous precipitation layers
          leafletMapRef.current.eachLayer((layer) => {
            if ((layer instanceof window.L.TileLayer && layer._url.includes('precipitation')) ||
                layer._heat) {
              leafletMapRef.current.removeLayer(layer);
            }
          });
          
          // Add OpenWeatherMap precipitation tile layer
          window.L.tileLayer(rainfallResponse.tileUrl, {
            attribution: '&copy; OpenWeatherMap',
            opacity: 0.6,
            className: 'rainfall-forecast'
          }).addTo(leafletMapRef.current);
          
          // Also add sample rainfall data as heatmap for enhanced visualization
          addRainfallHeatmapToMap(rainfallResponse.rainfallData);
        } else {
          console.error('Map not initialized');
          setError('Map initialization error');
        }
      } else {
        console.error('No precipitation data available');
        setError('No precipitation data available');
      }
    } catch (err) {
      // 删除错误信息显示，只在控制台记录错误
      console.error('Error fetching rainfall data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Add rainfall heatmap to Leaflet map with 12-hour forecast
  const addRainfallHeatmapToMap = (rainfallData) => {
    if (!leafletMapRef.current) return;
    
    // Close any open popups
    leafletMapRef.current.closePopup();
    
    // Clear previous heatmap layers (but not the tile layer)
    leafletMapRef.current.eachLayer((layer) => {
      if (layer._heat || (layer.options && layer.options.className === 'rainfall-forecast' && !(layer instanceof window.L.TileLayer))) {
        leafletMapRef.current.removeLayer(layer);
      }
    });
    
    // Remove previous controls
    const oldControls = document.querySelectorAll('.rainfall-time-control');
    oldControls.forEach(control => {
      if (control.parentNode) control.parentNode.removeChild(control);
    });
    
    // Add legend immediately when rainfall mode is activated
    addRainfallLegend();
    
    // Create 12-hour precipitation forecast data (simulated data)
    const forecastHours = 12;
    const forecastData = [];
    
    // Generate 12-hour forecast based on current precipitation data
    // with more realistic precipitation movement patterns
    for (let hour = 0; hour <= forecastHours; hour++) {
      // Copy and modify original data to create realistic precipitation forecast
      const hourData = rainfallData.map(point => {
        // Calculate precipitation changes based on meteorological patterns
        // Higher values persist longer, lighter rain dissipates faster
        const intensity = parseFloat(point.value);
        const persistenceFactor = intensity > 5 ? 0.95 : (intensity > 2 ? 0.85 : 0.75);
        const changeRate = persistenceFactor + (Math.random() * 0.2); // More stable changes
        const newValue = Math.max(0, Math.min(10, intensity * changeRate));
        
        // More realistic movement patterns - heavier rain moves slower
        const moveFactor = hour * (0.03 - (intensity * 0.002)); // Heavier rain moves slower
        // Weather systems generally move west to east in mid-latitudes
        const moveDirectionLat = (point.lat > 0 && point.lat < 60) ? 0.3 : -0.3;
        const moveDirectionLon = 1; // Predominantly eastward movement
        
        return {
          lat: point.lat + (moveFactor * moveDirectionLat),
          lon: point.lon + (moveFactor * moveDirectionLon),
          value: newValue.toFixed(1)
        };
      });
      
      forecastData.push(hourData);
    }
    
    // Current hour index being displayed
    let currentHourIndex = 0;
    
    // 时间控制器已被移除，直接显示当前降雨数据
    // 不再显示时间滑块和播放按钮
    
    // Create and display initial heatmap
    const updateHeatmap = (hourIndex) => {
      // Clear previous heatmap
      leafletMapRef.current.eachLayer((layer) => {
        if (layer._heat) {
          leafletMapRef.current.removeLayer(layer);
        }
      });
      
      // Format data for current hour with improved visualization
      const hourData = forecastData[hourIndex];
      const heatData = hourData.map(point => {
        // Convert precipitation value to appropriate intensity for heatmap
        // Scale values to ensure better visibility of different precipitation levels
        const intensity = parseFloat(point.value);
        // Apply logarithmic scaling to better visualize different precipitation intensities
        const scaledIntensity = intensity < 0.5 ? intensity : (0.5 + Math.log10(1 + intensity) * 0.5);
        
        return [
          point.lat,
          point.lon,
          scaledIntensity // Scaled intensity for better visualization
        ];
      });
      
      // Check if heatmap plugin is available
      if (typeof window.L.heatLayer === 'function') {
        // Create and add heatmap layer with improved color gradient
        const heatLayer = window.L.heatLayer(heatData, {
          radius: 20, // Slightly smaller radius for more precise visualization
          blur: 15,
          maxZoom: 10,
          // Enhanced color gradient for better visualization of precipitation intensity
          gradient: {
            0.1: '#b3f0ff', // Very light rain
            0.3: '#00aaff', // Light rain
            0.5: '#0066ff', // Moderate rain
            0.7: '#ffff00', // Heavy rain
            0.85: '#ff9900', // Very heavy rain
            1.0: '#ff0000'  // Extreme precipitation
          },
          minOpacity: 0.5 // Ensure light precipitation is visible
        }).addTo(leafletMapRef.current);
        
        // Update time display with more detailed information
        const timeDisplay = document.getElementById('time-display');
        if (timeDisplay) {
          if (hourIndex === 0) {
            timeDisplay.textContent = 'Current Precipitation';
          } else if (hourIndex === 1) {
            timeDisplay.textContent = 'Forecast: +1 hour';
          } else {
            timeDisplay.textContent = `Forecast: +${hourIndex} hours`;
          }
        }
      }
    };
    
    // Initialize heatmap with current data only (no time controls)
    updateHeatmap(0);
    
    // Legend is now added immediately when rainfall mode is activated via addRainfallLegend()
    // 时间控制器和相关事件监听已被移除
  };
  
  return (
    <div className="interactive-map-container">
      <button 
        className="map-button" 
        onClick={toggleMap}
        aria-label="Open Interactive Weather Map"
      >
        🗺️ Interactive Weather Map
      </button>
      
      {showMap && (
        <div className="leaflet-map-modal">
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
            <p className="map-instruction">Click anywhere on the map to get weather information</p>
            <button className="close-button" onClick={() => setShowMap(false)}>×</button>
          </div>
          
          {loading && <div className="map-loading">Loading location information...</div>}
          {error && <div className="map-error">{error}</div>}
          
          <div id="map" ref={mapRef} className="leaflet-map"></div>
          
          <div className="map-footer">
            <p>Data source: OpenStreetMap | Click on map or markers for weather information | Storm and precipitation maps show 12-hour forecast</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnifiedMap;