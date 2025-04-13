import { useState, useEffect } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import HourlyForecast from './components/HourlyForecast'
import WeatherAlert from './components/WeatherAlert'
import SeasonalInfo from './components/SeasonalInfo'
import WeatherMap from './components/WeatherMap'
import InteractiveMap from './components/InteractiveMap'
import DailyFunFacts from './components/DailyFunFacts'
import { 
  fetchWeatherData, 
  fetchForecastData, 
  fetchWeatherAlerts, 
  fetchHourlyForecastData,
  getCurrentLocation,
  fetchWeatherDataByCoords,
  fetchForecastDataByCoords,
  fetchHourlyForecastDataByCoords
} from './services/weatherService'
import { FaSun, FaMoon, FaLocationArrow } from 'react-icons/fa'

function App() {
  const [city, setCity] = useState('')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [hourlyForecast, setHourlyForecast] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [recentCities, setRecentCities] = useState(() => {
    const saved = localStorage.getItem('recentCities')
    return saved ? JSON.parse(saved) : []
  })
  
  // Try to get user's current location and load weather data
  useEffect(() => {
    const loadLocationWeather = async () => {
      try {
        setLocationLoading(true)
        const coords = await getCurrentLocation()
        
        // Get current location weather data
        const weatherData = await fetchWeatherDataByCoords(coords.lat, coords.lon)
        setCurrentWeather(weatherData)
        
        // Get current location forecast data
        const forecastData = await fetchForecastDataByCoords(coords.lat, coords.lon)
        setForecast(forecastData)
        
        // Get current location hourly forecast data
        const hourlyData = await fetchHourlyForecastDataByCoords(coords.lat, coords.lon)
        setHourlyForecast(hourlyData)
        
        // Get current location weather alerts
        const alertsData = await fetchWeatherAlerts(coords.lat, coords.lon)
        setAlerts(alertsData)
        
        // Set city name
        if (weatherData.name) {
          setCity(weatherData.name)
        }
      } catch (err) {
        console.error('Error loading location weather:', err)
        // Not displaying error because this is just auto-loading, user can still search manually
      } finally {
        setLocationLoading(false)
      }
    }
    
    loadLocationWeather()
  }, []) // Only run once when component mounts

  const handleSearch = async (searchCity) => {
    setCity(searchCity)
    setLoading(true)
    setError(null)
    
    // Add to recent search cities list
    if (searchCity.trim() && !recentCities.includes(searchCity.trim())) {
      const updatedCities = [searchCity.trim(), ...recentCities.slice(0, 4)]
      setRecentCities(updatedCities)
      localStorage.setItem('recentCities', JSON.stringify(updatedCities))
    }
    
    try {
      // Get current weather data
      const weatherData = await fetchWeatherData(searchCity)
      // Add the user input city name to the weather data
      weatherData.userInputCity = searchCity.trim()
      setCurrentWeather(weatherData)
      
      // Get forecast data
      const forecastData = await fetchForecastData(searchCity)
      setForecast(forecastData)
      
      // Get hourly forecast data
      const hourlyData = await fetchHourlyForecastData(searchCity)
      setHourlyForecast(hourlyData)
      
      // Get weather alerts data
      if (weatherData.coord) {
        const { lat, lon } = weatherData.coord
        const alertsData = await fetchWeatherAlerts(lat, lon)
        setAlerts(alertsData)
      } else {
        setAlerts([])
      }
    } catch (err) {
      // Display specific error message instead of a generic one
      setError(err.message || 'Unable to fetch weather data. Please check the city name or try again later.')
      setCurrentWeather(null)
      setForecast(null)
      setHourlyForecast(null)
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }
  
  // Get current location weather
  const handleGetCurrentLocation = async () => {
    try {
      setLocationLoading(true)
      setLoading(true)
      setError(null)
      
      const coords = await getCurrentLocation()
      
      // Get current location weather data
      const weatherData = await fetchWeatherDataByCoords(coords.lat, coords.lon)
      setCurrentWeather(weatherData)
      
      // Get current location forecast data
      const forecastData = await fetchForecastDataByCoords(coords.lat, coords.lon)
      setForecast(forecastData)
      
      // Get current location hourly forecast data
      const hourlyData = await fetchHourlyForecastDataByCoords(coords.lat, coords.lon)
      setHourlyForecast(hourlyData)
      
      // Get current location weather alerts
      const alertsData = await fetchWeatherAlerts(coords.lat, coords.lon)
      setAlerts(alertsData)
      
      // Set city name
      if (weatherData.name) {
        setCity(weatherData.name)
      }
    } catch (err) {
      setError(err.message || 'Unable to get your location. Please check your browser settings or search manually.')
      setCurrentWeather(null)
      setForecast(null)
      setHourlyForecast(null)
      setAlerts([])
    } finally {
      setLocationLoading(false)
      setLoading(false)
    }
  }

  // Toggle theme mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }
  
  // Use useEffect to monitor theme changes and apply to body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])
  
  // Select city from recent cities list
  const selectRecentCity = (city) => {
    handleSearch(city)
  }
  
  // Handle location selection from the map
  const handleMapLocationSelect = (locationName) => {
    handleSearch(locationName)
  }
  
  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <header>
        <div className="header-top">
          <h1>Weather Forecast</h1>
          <div className="header-controls">
            <button 
              className="location-btn" 
              onClick={handleGetCurrentLocation} 
              disabled={locationLoading}
              aria-label="Get current location weather"
            >
              <FaLocationArrow /> {locationLoading ? 'Loading...' : 'Current Location'}
            </button>
            <button 
              className="theme-toggle" 
              onClick={toggleDarkMode} 
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
        <SearchBar onSearch={handleSearch} />
        
        {recentCities.length > 0 && (
          <div className="recent-cities">
            <p>Recent searches:</p>
            <div className="city-tags">
              {recentCities.map((recentCity, index) => (
                <button 
                  key={index} 
                  className="city-tag" 
                  onClick={() => selectRecentCity(recentCity)}
                >
                  {recentCity}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
      
      <main>
        {loading && <div className="loading-message">Loading weather data...</div>}
        
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {currentWeather && (
          <div className="weather-container">
            <CurrentWeather data={currentWeather} />
            
            <SeasonalInfo />
            
            <InteractiveMap onSelectLocation={handleMapLocationSelect} />
            
            {hourlyForecast && (
              <div className="hourly-forecast-section">
                <HourlyForecast data={hourlyForecast} />
              </div>
            )}
            
            {alerts.length > 0 && (
              <div className="alerts-section">
                <h2>Weather Alerts</h2>
                <div className="alerts-container">
                  {alerts.map((alert, index) => (
                    <WeatherAlert key={index} alert={alert} />
                  ))}
                </div>
              </div>
            )}
            
            {forecast && (
              <div className="forecast-section">
                <Forecast data={forecast} />
              </div>
            )}
            
            <DailyFunFacts city={city} />
          </div>
        )}
      </main>
      
      <footer>
        <p>© 2023 Weather Forecast | Data Source: OpenWeatherMap</p>
      </footer>
    </div>
  )
}

export default App