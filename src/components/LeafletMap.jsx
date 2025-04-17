import React, { useState, useEffect, useRef } from 'react';
import './LeafletMap.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// LeafletMap component - Using Leaflet library to implement a real interactive world map
function LeafletMap({ onSelectLocation }) {
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
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

        // 等待 DOM 更新完成
        await new Promise(resolve => setTimeout(resolve, 0));

        const mapContainer = document.querySelector('.map-container');
        if (!mapContainer) {
          console.error('Map container not found');
          return;
        }

        // 如果地图已经存在，先移除
        if (mapRef.current) {
          mapRef.current.remove();
        }

        // 创建新的地图容器
        const mapDiv = document.createElement('div');
        mapDiv.id = 'map';
        mapDiv.style.height = '100%';
        mapDiv.style.width = '100%';
        mapContainer.innerHTML = '';
        mapContainer.appendChild(mapDiv);

        // 初始化地图
        mapRef.current = L.map('map', {
          center: [0, 0],
          zoom: 2,
          maxBounds: L.latLngBounds(
            L.latLng(-90, -180),
            L.latLng(90, 180)
          ),
          maxBoundsViscosity: 1.0
        });

        // 添加地图图层
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(mapRef.current);

        // 尝试获取用户位置
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              mapRef.current.setView([latitude, longitude], 13);
              await updateHeatmap(latitude, longitude);
            },
            (error) => {
              console.log('Geolocation error:', error);
            }
          );
        }

        // 添加点击事件处理
        mapRef.current.on('click', async (e) => {
          const { lat, lng } = e.latlng;
          await updateHeatmap(lat, lng);
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
  }, [showMap]);
  
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
    setSelectedCity(cityName);
    onSelectLocation(cityName);
    // Optional: close map
    // setShowMap(false);
  };
  
  // Toggle map display state
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const fetchRainfallData = async (lat, lng) => {
    try {
      const apiKey = import.meta.env.VITE_APP_WEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('API key is missing');
      }

      // 验证坐标是否有效，如果无效则使用默认值
      const validLat = isNaN(lat) ? 22.2006 : parseFloat(lat);
      const validLng = isNaN(lng) ? 113.5461 : parseFloat(lng);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${validLat}&lon=${validLng}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.list || !Array.isArray(data.list)) {
        throw new Error('Invalid data format received from API');
      }

      // 处理降雨量数据，确保所有值都是有效的数字
      const rainfallData = data.list.map(item => ({
        lat: validLat,
        lng: validLng,
        value: item.rain ? parseFloat(item.rain['3h'] || 0) : 0
      }));

      return rainfallData;
    } catch (error) {
      console.error('Error fetching rainfall data:', error);
      // 返回模拟数据作为后备方案
      return [{
        lat: 22.2006,
        lng: 113.5461,
        value: 0.5
      }];
    }
  };

  const updateHeatmap = async (lat, lng) => {
    try {
      if (!mapRef.current) {
        console.error('Map not initialized');
        return;
      }

      // 验证坐标是否有效，如果无效则使用默认值
      const validLat = isNaN(lat) ? 22.2006 : parseFloat(lat);
      const validLng = isNaN(lng) ? 113.5461 : parseFloat(lng);

      const data = await fetchRainfallData(validLat, validLng);
      
      if (data.length === 0) {
        console.warn('No rainfall data available, using default data');
        data.push({
          lat: validLat,
          lng: validLng,
          value: 0.5
        });
      }

      if (heatmapLayer.current) {
        mapRef.current.removeLayer(heatmapLayer.current);
      }

      heatmapLayer.current = L.heatLayer(data, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        minOpacity: 0.5,
        gradient: {
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red'
        }
      }).addTo(mapRef.current);

      console.log('Heatmap updated successfully');
    } catch (error) {
      console.error('Error updating heatmap:', error);
      // 显示错误信息给用户
      const errorMessage = document.createElement('div');
      errorMessage.className = 'map-error-message';
      errorMessage.textContent = '无法加载降雨数据，请稍后重试';
      document.querySelector('.map-container').appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    }
  };
  
  return (
    <div className="leaflet-map-container">
      <button className="map-button" onClick={toggleMap}>
        {showMap ? '隐藏地图' : '显示地图'}
      </button>
      
      {showMap && (
        <div className="leaflet-map-modal">
          <div className="map-header">
            <h3>世界地图</h3>
            <button className="close-button" onClick={toggleMap}>×</button>
          </div>
          <div className="map-container">
            <div id="map"></div>
          </div>
          <div className="map-footer">
            <p className="map-instruction">
              点击地图上的任意位置查看该地区的降雨情况
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeafletMap;