import { useState, useEffect, useRef } from 'react';
import './WeatherMap.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { worldMapData, worldCityCoordinates } from '../assets/world-map-data';
import { fetchGlobalStormData, fetchRainfallHeatmap } from '../services/specialWeatherService';

// 动态加载 leaflet.heat
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js';
  script.async = true;
  document.body.appendChild(script);
  
  return () => {
    document.body.removeChild(script);
  };
}, []);

function WeatherMap({ onSelectLocation }) {
  const [showMap, setShowMap] = useState(false);
  const [mapMode, setMapMode] = useState('default'); // 'default', 'storm', 'rainfall'
  const [stormData, setStormData] = useState([]);
  const [rainfallData, setRainfallData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const mapRef = useRef(null);
  const heatmapLayer = useRef(null);
  
  // Initialize map
  useEffect(() => {
    if (!showMap) return;

    const initializeMap = async () => {
      try {
        if (!L) {
          console.error('Leaflet library not loaded');
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 0));

        const mapContainer = document.querySelector('.map-container');
        if (!mapContainer) {
          console.error('Map container not found');
          return;
        }

        if (mapRef.current) {
          mapRef.current.remove();
        }

        const mapDiv = document.createElement('div');
        mapDiv.id = 'map';
        mapDiv.style.height = '100%';
        mapDiv.style.width = '100%';
        mapContainer.innerHTML = '';
        mapContainer.appendChild(mapDiv);

        mapRef.current = L.map('map', {
          center: [0, 0],
          zoom: 2,
          maxBounds: L.latLngBounds(
            L.latLng(-90, -180),
            L.latLng(90, 180)
          ),
          maxBoundsViscosity: 1.0
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(mapRef.current);

        // Add city markers
        Object.entries(worldCityCoordinates).forEach(([key, city]) => {
          const marker = L.marker([city.lat, city.lon])
            .addTo(mapRef.current)
            .bindPopup(city.name)
            .on('click', () => {
              handleCitySelect(city.name);
            });
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              mapRef.current.setView([latitude, longitude], 13);
              if (mapMode === 'rainfall') {
                await updateHeatmap(latitude, longitude);
              }
            },
            (error) => {
              console.log('Geolocation error:', error);
            }
          );
        }

        mapRef.current.on('click', async (e) => {
          const { lat, lng } = e.latlng;
          if (mapMode === 'rainfall') {
            await updateHeatmap(lat, lng);
          }
        });

        console.log('Map initialized successfully');
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showMap, mapMode]);

  // Fetch storm data when map mode changes to 'storm'
  useEffect(() => {
    if (mapMode === 'storm' && stormData.length === 0) {
      fetchStormData();
    }
  }, [mapMode]);

  // Fetch rainfall data when map mode changes to 'rainfall'
  useEffect(() => {
    if (mapMode === 'rainfall' && mapRef.current) {
      const center = mapRef.current.getCenter();
      updateHeatmap(center.lat, center.lng);
    }
  }, [mapMode]);

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

  const updateHeatmap = async (lat, lng) => {
    try {
      if (!mapRef.current) {
        console.error('Map not initialized');
        return;
      }

      const data = await fetchRainfallHeatmap(lat, lng);
      
      if (heatmapLayer.current) {
        mapRef.current.removeLayer(heatmapLayer.current);
      }

      // 使用 Leaflet 的 CircleMarker 来模拟热图效果
      const markers = data.map(point => {
        const value = parseFloat(point.value);
        const radius = Math.max(5, value * 5);
        const opacity = Math.min(0.7, value / 10);
        
        return L.circleMarker([point.lat, point.lng], {
          radius: radius,
          fillColor: getColor(value),
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: opacity
        });
      });

      heatmapLayer.current = L.layerGroup(markers).addTo(mapRef.current);

      console.log('Heatmap updated successfully');
    } catch (error) {
      console.error('Error updating heatmap:', error);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'map-error-message';
      errorMessage.textContent = '无法加载降雨数据，请稍后重试';
      document.querySelector('.map-container').appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    }
  };

  // 根据降雨量值获取颜色
  const getColor = (value) => {
    if (value <= 2) return '#0000ff'; // 蓝色
    if (value <= 4) return '#00ffff'; // 青色
    if (value <= 6) return '#00ff00'; // 绿色
    if (value <= 8) return '#ffff00'; // 黄色
    return '#ff0000'; // 红色
  };

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    onSelectLocation(cityName);
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const changeMapMode = (mode) => {
    setMapMode(mode);
    if (mode === 'rainfall' && mapRef.current) {
      const center = mapRef.current.getCenter();
      updateHeatmap(center.lat, center.lng);
    } else if (heatmapLayer.current) {
      mapRef.current.removeLayer(heatmapLayer.current);
      heatmapLayer.current = null;
    }
  };
  
  return (
    <div className="weather-map-container">
      <button className="map-button" onClick={toggleMap}>
        {showMap ? '隐藏地图' : '显示地图'}
      </button>
      
      {showMap && (
        <div className="weather-map-modal">
          <div className="map-header">
            <h3>交互式天气地图</h3>
            <div className="map-controls">
              <button 
                className={`mode-button ${mapMode === 'default' ? 'active' : ''}`}
                onClick={() => changeMapMode('default')}
              >
                标准视图
              </button>
              <button 
                className={`mode-button ${mapMode === 'storm' ? 'active' : ''}`}
                onClick={() => changeMapMode('storm')}
              >
                全球风暴路径
              </button>
              <button 
                className={`mode-button ${mapMode === 'rainfall' ? 'active' : ''}`}
                onClick={() => changeMapMode('rainfall')}
              >
                降雨热图
              </button>
            </div>
            <button className="close-button" onClick={toggleMap}>×</button>
          </div>
          <div className="map-container">
            <div id="map"></div>
          </div>
          <div className="map-footer">
            <p className="map-instruction">
              {mapMode === 'default' 
                ? '点击地图上的城市查看天气信息' 
                : mapMode === 'storm'
                ? '查看全球风暴路径。红色线条显示历史路径，橙色虚线显示预测路径。'
                : '点击地图上的任意位置查看该地区的降雨情况。深蓝色表示降雨量较大。'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherMap;