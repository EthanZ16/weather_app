import { useState, useEffect } from 'react';
import './DailyFunFacts.css';
import { 
  fetchWeeklyTemperatureRecords, 
  fetchHistoricalWeatherData, 
  fetchMeteorShowerPrediction 
} from '../services/specialWeatherService';

function DailyFunFacts({ city }) {
  const [weeklyRecords, setWeeklyRecords] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [meteorShower, setMeteorShower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch all fun facts data when component mounts or city changes
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data in parallel for better performance
        const [recordsData, historyData, meteorData] = await Promise.all([
          fetchWeeklyTemperatureRecords(city),
          fetchHistoricalWeatherData(city || 'Macau'),
          fetchMeteorShowerPrediction()
        ]);
        
        setWeeklyRecords(recordsData);
        setHistoricalData(historyData);
        setMeteorShower(meteorData);
      } catch (err) {
        console.error('Error fetching fun facts data:', err);
        setError('Unable to load daily fun facts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
    
    // Set up daily refresh
    const refreshInterval = setInterval(() => {
      fetchAllData();
    }, 24 * 60 * 60 * 1000); // Refresh every 24 hours
    
    return () => clearInterval(refreshInterval);
  }, [city]);
  
  if (loading) {
    return <div className="fun-facts-loading">Loading daily fun facts...</div>;
  }
  
  if (error) {
    return <div className="fun-facts-error">{error}</div>;
  }
  
  return (
    <div className="daily-fun-facts">
      <h2>Daily Weather Fun Facts</h2>
      
      <div className="fun-facts-container">
        {weeklyRecords && (
          <div className="fun-fact-card temperature-records">
            <h3>This Week's Temperature Records</h3>
            <div className="record-item">
              <span className="record-label">Highest:</span>
              <span className="record-value">{weeklyRecords.highestTemp.value}°C</span>
              <span className="record-detail">
                on {weeklyRecords.highestTemp.day} in {weeklyRecords.highestTemp.city}
              </span>
            </div>
            <div className="record-item">
              <span className="record-label">Lowest:</span>
              <span className="record-value">{weeklyRecords.lowestTemp.value}°C</span>
              <span className="record-detail">
                on {weeklyRecords.lowestTemp.day} in {weeklyRecords.lowestTemp.city}
              </span>
            </div>
          </div>
        )}
        
        {historicalData && (
          <div className="fun-fact-card historical-weather">
            <h3>On This Day in {historicalData.city}</h3>
            <div className="historical-data">
              <p className="date-info">Historical weather for {historicalData.date}:</p>
              <ul className="historical-list">
                {historicalData.years.map(yearData => (
                  <li key={yearData.year}>
                    <span className="year">{yearData.year}:</span> 
                    <span className="temp">{yearData.temperature}°C</span>, 
                    <span className="conditions">{yearData.conditions}</span>
                  </li>
                ))}
              </ul>
              <p className="fun-fact-text">{historicalData.funFact}</p>
            </div>
          </div>
        )}
        
        {meteorShower && (
          <div className="fun-fact-card meteor-shower">
            <h3>Next Meteor Shower</h3>
            <div className="meteor-info">
              <p className="meteor-name">{meteorShower.name}</p>
              <p className="meteor-peak">
                <span className="info-label">Peak:</span> 
                <span className="info-value">{meteorShower.peak}</span>
              </p>
              <p className="meteor-rate">
                <span className="info-label">Expected Rate:</span> 
                <span className="info-value">{meteorShower.rate}</span>
              </p>
              <p className="meteor-constellation">
                <span className="info-label">Look toward:</span> 
                <span className="info-value">{meteorShower.constellation} constellation</span>
              </p>
              <p className="meteor-tips">{meteorShower.viewingTips}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyFunFacts;