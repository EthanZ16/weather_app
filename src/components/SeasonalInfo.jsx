import React, { useState, useEffect } from 'react';
import './SeasonalInfo.css';
import { getCurrentSolarTerm } from '../services/solarTermsService';

function SeasonalInfo() {
  const [solarTerm, setSolarTerm] = useState(null);

  useEffect(() => {
    // Get the current solar term information
    const currentSolarTerm = getCurrentSolarTerm();
    setSolarTerm(currentSolarTerm);
  }, []);

  if (!solarTerm) return null;

  return (
    <div className="seasonal-info">
      <div className="seasonal-header">
        <h2>Solar Term Information</h2>
      </div>

      <div className="seasonal-main">
        <div className="solar-term-name">
          <h3>{solarTerm.name}</h3>
        </div>
        <div className="solar-term-description">
          <p>{solarTerm.description}</p>
        </div>
      </div>

      <div className="seasonal-details">
        <div className="detail-section">
          <h4>Traditional Proverb</h4>
          <p className="proverb">{solarTerm.proverb}</p>
        </div>
      </div>
    </div>
  );
}

export default SeasonalInfo;