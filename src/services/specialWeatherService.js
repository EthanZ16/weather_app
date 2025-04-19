// Special Weather Service module for fetching advanced weather data

import axios from 'axios';

// OpenWeatherMap API key from environment variables
const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch global storm data
 * @returns {Promise} - Promise returning storm data
 */
export const fetchGlobalStormData = async () => {
  try {
    // Using OpenWeatherMap's One Call API to get global storm data
    // This is a simulated function as the free tier doesn't provide global storm tracking
    // In a real application, you would use a specialized weather API for this data
    
    // Simulated storm data for demonstration
    const stormData = [
      {
        id: 1,
        name: 'Typhoon Maysak',
        category: 4,
        path: [
          { lat: 12.5, lon: 134.2, time: '2023-09-01T00:00:00Z', windSpeed: 120 },
          { lat: 13.2, lon: 133.5, time: '2023-09-01T06:00:00Z', windSpeed: 125 },
          { lat: 14.1, lon: 132.8, time: '2023-09-01T12:00:00Z', windSpeed: 130 },
          { lat: 15.3, lon: 131.9, time: '2023-09-01T18:00:00Z', windSpeed: 140 },
          { lat: 16.5, lon: 130.7, time: '2023-09-02T00:00:00Z', windSpeed: 145 },
        ],
        currentPosition: { lat: 16.5, lon: 130.7 },
        forecastPath: [
          { lat: 17.8, lon: 129.5, time: '2023-09-02T06:00:00Z', windSpeed: 150 },
          { lat: 19.2, lon: 128.3, time: '2023-09-02T12:00:00Z', windSpeed: 145 },
          { lat: 20.7, lon: 127.1, time: '2023-09-02T18:00:00Z', windSpeed: 140 },
        ]
      },
      {
        id: 2,
        name: 'Hurricane Elsa',
        category: 3,
        path: [
          { lat: 18.1, lon: -60.5, time: '2023-09-01T00:00:00Z', windSpeed: 110 },
          { lat: 18.5, lon: -62.1, time: '2023-09-01T06:00:00Z', windSpeed: 115 },
          { lat: 19.0, lon: -63.7, time: '2023-09-01T12:00:00Z', windSpeed: 120 },
          { lat: 19.6, lon: -65.2, time: '2023-09-01T18:00:00Z', windSpeed: 125 },
          { lat: 20.3, lon: -66.8, time: '2023-09-02T00:00:00Z', windSpeed: 130 },
        ],
        currentPosition: { lat: 20.3, lon: -66.8 },
        forecastPath: [
          { lat: 21.1, lon: -68.4, time: '2023-09-02T06:00:00Z', windSpeed: 125 },
          { lat: 22.0, lon: -70.0, time: '2023-09-02T12:00:00Z', windSpeed: 120 },
          { lat: 23.0, lon: -71.5, time: '2023-09-02T18:00:00Z', windSpeed: 115 },
        ]
      }
    ];
    
    return stormData;
  } catch (error) {
    console.error('Failed to fetch global storm data:', error);
    throw new Error('Unable to fetch global storm data. Please try again later.');
  }
};

/**
 * Fetch global rainfall heatmap data using OpenWeatherMap API
 * @param {number} lat - Center latitude (optional, for viewport centering)
 * @param {number} lon - Center longitude (optional, for viewport centering)
 * @returns {Promise} - Promise returning global rainfall heatmap data
 */
export const fetchRainfallHeatmap = async (lat, lon) => {
  try {
    // OpenWeatherMap's precipitation tile layer URL
    // This is a direct tile URL that can be used with Leaflet's TileLayer
    // We'll return this URL for the map component to use
    const precipitationTileUrl = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`;
    
    // For demonstration purposes, we'll also fetch some sample precipitation data points
    // to show in the heatmap until the tile layer loads
    const response = await axios.get(`${BASE_URL}/box/city`, {
      params: {
        bbox: '-180,90,180,-90,10', // Worldwide bounding box
        appid: API_KEY
      }
    });
    
    // Generate rainfall data from cities
    const rainfallData = [];
    
    if (response.data && response.data.list && response.data.list.length > 0) {
      // Process the city data to create rainfall points
      response.data.list.forEach(city => {
        // Only include cities with rain or clouds as precipitation indicators
        if (city.main && (city.rain || city.clouds.all > 30)) {
          const rainValue = city.rain ? 
            (city.rain['1h'] || city.rain['3h'] || Math.random() * 5) : 
            (city.clouds.all / 20); // Convert cloud coverage to approximate rainfall
          
          rainfallData.push({
            lat: city.coord.lat,
            lon: city.coord.lon,
            value: rainValue.toFixed(1) // Precipitation value
          });
        }
      });
    }
    
    // Return both the tile URL and sample data points
    return {
      tileUrl: precipitationTileUrl,
      rainfallData: rainfallData.length > 0 ? rainfallData : generateSimulatedRainfallData()
    };
  } catch (error) {
    console.error('Failed to fetch rainfall data from API:', error);
    // Fall back to simulated data if API call fails
    return generateSimulatedRainfallData();
  }
};

/**
 * Generate simulated rainfall data as a fallback
 * @returns {Array} - Array of rainfall data points
 */
const generateSimulatedRainfallData = () => {
  const rainfallData = [];
  
  // Generate points across the entire world map with more density for better visualization
  for (let latitude = -80; latitude <= 80; latitude += 2) {
    for (let longitude = -180; longitude <= 180; longitude += 2) {
      // Create realistic precipitation patterns
      let basePrecipitation = 0;
      
      // Tropical regions (higher rainfall)
      if (latitude > -23.5 && latitude < 23.5) {
        basePrecipitation = 5 + Math.random() * 5;
      }
      // Temperate regions (moderate rainfall)
      else if ((latitude > -60 && latitude < -23.5) || (latitude > 23.5 && latitude < 60)) {
        basePrecipitation = 2 + Math.random() * 3;
      }
      // Polar regions (lower rainfall)
      else {
        basePrecipitation = Math.random() * 2;
      }
      
      // Add some randomness to create realistic patterns
      const rainfall = Math.max(0, basePrecipitation * (0.5 + Math.random()));
      
      // Only include points with some precipitation
      if (rainfall > 0.1) {
        rainfallData.push({
          lat: latitude,
          lon: longitude,
          value: rainfall.toFixed(1)
        });
      }
    }
  }
  
  return rainfallData;
};


/**
 * Fetch weekly temperature records
 * @param {string} city - City name
 * @returns {Promise} - Promise returning weekly temperature records
 */
export const fetchWeeklyTemperatureRecords = async (city) => {
  try {
    // In a real application, you would use historical weather data API
    // This is a simulated function for demonstration
    
    // Current date
    const now = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Generate simulated weekly temperature records
    const records = {
      highestTemp: {
        value: Math.floor(Math.random() * 15) + 25, // Random between 25-40°C
        day: dayNames[Math.floor(Math.random() * 7)],
        city: city || 'Local area'
      },
      lowestTemp: {
        value: Math.floor(Math.random() * 15) + 5, // Random between 5-20°C
        day: dayNames[Math.floor(Math.random() * 7)],
        city: city || 'Local area'
      }
    };
    
    return records;
  } catch (error) {
    console.error('Failed to fetch weekly temperature records:', error);
    throw new Error('Unable to fetch temperature records. Please try again later.');
  }
};

/**
 * Fetch historical weather data for today's date
 * @param {string} city - City name (default: 'Macau')
 * @returns {Promise} - Promise returning historical weather data
 */
export const fetchHistoricalWeatherData = async (city = 'Macau') => {
  try {
    // In a real application, you would use a historical weather data API
    // This is a simulated function for demonstration
    
    // Current date
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Generate simulated historical data
    const historicalData = {
      city: city,
      date: `${month}/${day}`,
      years: [
        {
          year: now.getFullYear() - 1,
          temperature: Math.floor(Math.random() * 10) + 20,
          conditions: ['Sunny', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 4)]
        },
        {
          year: now.getFullYear() - 5,
          temperature: Math.floor(Math.random() * 10) + 20,
          conditions: ['Sunny', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 4)]
        },
        {
          year: now.getFullYear() - 10,
          temperature: Math.floor(Math.random() * 10) + 20,
          conditions: ['Sunny', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 4)]
        }
      ],
      funFact: [
        `On this day in ${now.getFullYear() - 20}, ${city} experienced the highest rainfall in 50 years.`,
        `${month}/${day} is historically one of the sunniest days of the year in ${city}.`,
        `The average temperature on this day over the last century in ${city} is 24°C.`,
        `The most extreme weather event on this day occurred in ${now.getFullYear() - 35}.`
      ][Math.floor(Math.random() * 4)]
    };
    
    return historicalData;
  } catch (error) {
    console.error('Failed to fetch historical weather data:', error);
    throw new Error('Unable to fetch historical weather data. Please try again later.');
  }
};

/**
 * Fetch next meteor shower prediction
 * @returns {Promise} - Promise returning meteor shower prediction
 */
export const fetchMeteorShowerPrediction = async () => {
  try {
    // In a real application, you would use an astronomy API
    // This is a simulated function with actual meteor shower data
    
    const meteorShowers = [
      { name: 'Quadrantids', peak: 'January 3-4', rate: '40 per hour', constellation: 'Bootes' },
      { name: 'Lyrids', peak: 'April 22-23', rate: '20 per hour', constellation: 'Lyra' },
      { name: 'Eta Aquariids', peak: 'May 5-6', rate: '30 per hour', constellation: 'Aquarius' },
      { name: 'Delta Aquariids', peak: 'July 28-29', rate: '20 per hour', constellation: 'Aquarius' },
      { name: 'Perseids', peak: 'August 11-13', rate: '100 per hour', constellation: 'Perseus' },
      { name: 'Orionids', peak: 'October 21-22', rate: '20 per hour', constellation: 'Orion' },
      { name: 'Leonids', peak: 'November 17-18', rate: '15 per hour', constellation: 'Leo' },
      { name: 'Geminids', peak: 'December 13-14', rate: '150 per hour', constellation: 'Gemini' },
      { name: 'Ursids', peak: 'December 21-22', rate: '10 per hour', constellation: 'Ursa Minor' }
    ];
    
    // Current date
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    
    // Find the next meteor shower
    let nextShower = null;
    
    for (const shower of meteorShowers) {
      const peakParts = shower.peak.split('-');
      const peakMonthDay = peakParts[0].trim().split(' ');
      const peakMonth = getMonthNumber(peakMonthDay[0]);
      const peakDay = parseInt(peakMonthDay[1]);
      
      if (peakMonth > currentMonth || (peakMonth === currentMonth && peakDay > currentDay)) {
        nextShower = shower;
        break;
      }
    }
    
    // If no upcoming shower found this year, return the first one for next year
    if (!nextShower) {
      nextShower = meteorShowers[0];
    }
    
    return {
      name: nextShower.name,
      peak: nextShower.peak,
      rate: nextShower.rate,
      constellation: nextShower.constellation,
      viewingTips: 'Best viewed after midnight in areas with minimal light pollution. Allow 20 minutes for your eyes to adjust to the darkness.'
    };
  } catch (error) {
    console.error('Failed to fetch meteor shower prediction:', error);
    throw new Error('Unable to fetch meteor shower prediction. Please try again later.');
  }
};

// Helper function to convert month name to number
function getMonthNumber(monthName) {
  const months = {
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12
  };
  
  return months[monthName];
}