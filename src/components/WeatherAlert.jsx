import React from 'react'
import './WeatherAlert.css'

function WeatherAlert({ alert }) {
  if (!alert) return null

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
    <div className="weather-alert">
      <div className="alert-header">
        <h3 className="alert-title">{alert.event}</h3>
        <span className="alert-source">Source: {alert.sender_name}</span>
      </div>
      
      <div className="alert-time">
        <div className="alert-start">Start Time: {formatDateTime(alert.start)}</div>
        <div className="alert-end">End Time: {formatDateTime(alert.end)}</div>
      </div>
      
      <div className="alert-description">{alert.description}</div>
      
      {alert.tags && alert.tags.length > 0 && (
        <div className="alert-tags">
          {alert.tags.map((tag, index) => (
            <span key={index} className="alert-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default WeatherAlert