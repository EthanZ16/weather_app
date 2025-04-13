import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './HourlyForecast.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HourlyForecast({ data }) {
  const [viewMode, setViewMode] = useState('numbers'); // 'numbers' or 'chart'
  
  if (!data || !data.list) return null;

  // Get forecast data for the next 24 hours
  // OpenWeatherMap API returns one data point every 3 hours, we need to process this data to display a 24-hour forecast
  // Only get data points for the next 24 hours (maximum 8 data points)
  const rawHourlyData = data.list.slice(0, 8);
  
  // Generate 24-hour data (using interpolation algorithm)
  const hourlyData = generateHourlyData(rawHourlyData);

  // Generate hourly data based on 3-hour interval data
  function generateHourlyData(rawData) {
    if (!rawData || rawData.length === 0) return [];
    
    const result = [];
    const now = new Date();
    const currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0);
    const currentTimestamp = Math.floor(currentHour.getTime() / 1000);
    
    // Generate timestamps for the next 24 hours
    const hourlyTimestamps = [];
    for (let i = 0; i < 24; i++) {
      const timestamp = currentTimestamp + (i * 3600); // Add 3600 seconds for each hour
      hourlyTimestamps.push(timestamp);
    }
    
    // Generate weather data for each hour (using linear interpolation)
    hourlyTimestamps.forEach(timestamp => {
      // Find the two closest original data points
      let beforeIndex = -1;
      let afterIndex = -1;
      
      for (let i = 0; i < rawData.length; i++) {
        if (rawData[i].dt <= timestamp && (beforeIndex === -1 || rawData[i].dt > rawData[beforeIndex].dt)) {
          beforeIndex = i;
        }
        if (rawData[i].dt >= timestamp && (afterIndex === -1 || rawData[i].dt < rawData[afterIndex].dt)) {
          afterIndex = i;
        }
      }
      
      // If no suitable data point is found, use the closest one
      if (beforeIndex === -1) beforeIndex = afterIndex;
      if (afterIndex === -1) afterIndex = beforeIndex;
      
      // If it's the same data point, use it directly
      if (beforeIndex === afterIndex || rawData[beforeIndex].dt === rawData[afterIndex].dt) {
        result.push({
          ...rawData[beforeIndex],
          dt: timestamp // Use the target timestamp
        });
        return;
      }
      
      // Calculate interpolation weight
      const beforeTime = rawData[beforeIndex].dt;
      const afterTime = rawData[afterIndex].dt;
      const weight = (timestamp - beforeTime) / (afterTime - beforeTime);
      
      // Linear interpolation to calculate temperature and feels-like temperature
      const temp = rawData[beforeIndex].main.temp + (rawData[afterIndex].main.temp - rawData[beforeIndex].main.temp) * weight;
      const feelsLike = rawData[beforeIndex].main.feels_like + (rawData[afterIndex].main.feels_like - rawData[beforeIndex].main.feels_like) * weight;
      
      // Use the weather description and icon from the closest data point
      const closestIndex = Math.abs(timestamp - beforeTime) < Math.abs(timestamp - afterTime) ? beforeIndex : afterIndex;
      
      // Create the interpolated data point
      result.push({
        dt: timestamp,
        main: {
          temp: temp,
          feels_like: feelsLike,
          ...rawData[closestIndex].main
        },
        weather: rawData[closestIndex].weather,
        // Copy other needed properties
        clouds: rawData[closestIndex].clouds,
        wind: rawData[closestIndex].wind,
        pop: rawData[closestIndex].pop
      });
    });
    
    return result;
  }
  
  // Format hour and date
  const formatHour = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if the date is today, tomorrow, or another date
    let prefix = '';
    if (date.toDateString() === today.toDateString()) {
      prefix = 'Today ';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      prefix = 'Tomorrow ';
    } else {
      // For other dates, show month and day
      prefix = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }) + ' ';
    }
    
    // Only show hour, not minutes
    return prefix + date.getHours() + 'h';
  };

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'numbers' ? 'chart' : 'numbers');
  };

  // Prepare chart data
  const chartData = {
    labels: hourlyData.map(item => formatHour(item.dt)),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: hourlyData.map(item => Math.round(item.main.temp)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Feels Like (°C)',
        data: hourlyData.map(item => Math.round(item.main.feels_like)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      title: {
        display: true,
        text: '24-Hour Temperature Forecast',
        font: {
          size: 16
        },
        padding: 10
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        displayColors: true
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
          font: {
            size: 14
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time',
          font: {
            size: 14
          }
        },
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="hourly-forecast">
      <div className="hourly-forecast-header">
        <h2>24-Hour Weather Forecast</h2>
        <button 
          className="view-toggle-btn" 
          onClick={toggleViewMode}
          aria-label={`Switch to ${viewMode === 'numbers' ? 'chart' : 'data'} view`}
        >
          {viewMode === 'numbers' ? 'Show Chart' : 'Show Data'}
        </button>
      </div>
      
      {viewMode === 'numbers' ? (
        <div className="hourly-forecast-container">
          {hourlyData.map((item, index) => (
            <div key={index} className="hourly-item">
              <div className="hourly-time">{formatHour(item.dt)}</div>
              <div className="hourly-icon">
                <img 
                  src={getWeatherIconUrl(item.weather[0].icon)} 
                  alt={item.weather[0].description} 
                />
              </div>
              <div className="hourly-temp">{Math.round(item.main.temp)}°C</div>
              <div className="hourly-description">{item.weather[0].description}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="hourly-chart-container">
          <Line options={chartOptions} data={chartData} />
        </div>
      )}
    </div>
  );
}

export default HourlyForecast;