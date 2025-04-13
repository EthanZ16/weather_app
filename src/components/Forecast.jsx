import React from 'react'
import './Forecast.css'

function Forecast({ data }) {
  if (!data || !data.list) return null

  // API returns temperature in Celsius, no conversion needed
  const roundTemperature = (temp) => {
    return Math.round(temp)
  }

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`
  }

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  // Group weather data by day
  const groupForecastByDay = () => {
    const grouped = {}
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US')
      
      if (!grouped[date]) {
        grouped[date] = []
      }
      
      grouped[date].push(item)
    })
    
    return grouped
  }

  // Get daily weather summary
  const getDailySummary = (dayData) => {
    // Calculate average, maximum and minimum temperatures
    let sumTemp = 0
    let maxTemp = -Infinity
    let minTemp = Infinity
    let mostFrequentWeather = {}
    
    dayData.forEach(item => {
      const temp = item.main.temp
      sumTemp += temp
      maxTemp = Math.max(maxTemp, temp)
      minTemp = Math.min(minTemp, temp)
      
      // Count the most frequent weather conditions
      const weather = item.weather[0].main
      mostFrequentWeather[weather] = (mostFrequentWeather[weather] || 0) + 1
    })
    
    // Find the most frequent weather condition
    let mainWeather = ''
    let maxCount = 0
    
    for (const weather in mostFrequentWeather) {
      if (mostFrequentWeather[weather] > maxCount) {
        maxCount = mostFrequentWeather[weather]
        mainWeather = weather
      }
    }
    
    // Find representative weather icon (using noon time icon)
    let iconCode = ''
    for (const item of dayData) {
      const hour = new Date(item.dt * 1000).getHours()
      if (hour >= 11 && hour <= 13) {
        iconCode = item.weather[0].icon
        break
      }
    }
    
    // If noon time icon not found, use the first data point's icon
    if (!iconCode && dayData.length > 0) {
      iconCode = dayData[0].weather[0].icon
    }
    
    return {
      avgTemp: sumTemp / dayData.length,
      maxTemp,
      minTemp,
      mainWeather,
      iconCode,
      description: dayData[0].weather[0].description // Use the first data point's description
    }
  }

  const groupedForecast = groupForecastByDay()
  const forecastDays = Object.keys(groupedForecast).slice(0, 5) // Limit to 5 days

  return (
    <div className="forecast">
      <h2>Weather Forecast</h2>
      <div className="forecast-container">
        {forecastDays.map(day => {
          const dayData = groupedForecast[day]
          const summary = getDailySummary(dayData)
          
          return (
            <div key={day} className="forecast-day">
              <div className="forecast-date">{formatDate(dayData[0].dt)}</div>
              <div className="forecast-icon">
                <img 
                  src={getWeatherIconUrl(summary.iconCode)} 
                  alt={summary.description} 
                />
              </div>
              <div className="forecast-description">{summary.description}</div>
              <div className="forecast-temps">
                <span className="max-temp">{roundTemperature(summary.maxTemp)}°</span>
                <span className="min-temp">{roundTemperature(summary.minTemp)}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Forecast