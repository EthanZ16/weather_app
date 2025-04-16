import React from 'react'
import './CurrentWeather.css'

function CurrentWeather({ data }) {
  if (!data) return null

  // API returns temperature in Celsius, no conversion needed
  const roundTemperature = (temp) => {
    return Math.round(temp)
  }

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  // Format date and time
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="current-weather">
      <div className="weather-header">
        <h2>{data.userInputCity || `${data.name}, ${data.sys.country}`}</h2>
        <p className="datetime">{formatDateTime(data.dt)}</p>
      </div>

      <div className="weather-main">
        <div className="temperature-container">
          <div className="temperature">
            <span className="temp-value">{roundTemperature(data.main.temp)}</span>
            <span className="temp-unit">°C</span>
          </div>
          <div className="feels-like">
            Feels like: {roundTemperature(data.main.feels_like)}°C
          </div>
        </div>

        <div className="weather-icon-container">
          <img 
            src={getWeatherIconUrl(data.weather[0].icon)} 
            alt={data.weather[0].description} 
            className="weather-icon" 
          />
          <p className="weather-description">{data.weather[0].description}</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{data.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{data.main.pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">{data.wind.speed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind Direction</span>
          <span className="detail-value">{data.wind.deg}°</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Visibility</span>
          <span className="detail-value">{(data.visibility / 1000).toFixed(1)} km</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Cloudiness</span>
          <span className="detail-value">{data.clouds.all}%</span>
        </div>
      </div>

      <div className="sun-times">
        <div className="sun-item">
          <span className="sun-label">Sunrise</span>
          <span className="sun-value">{new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <div className="sun-item">
          <span className="sun-label">Sunset</span>
          <span className="sun-value">{new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>
    </div>
  )
}

export default CurrentWeather