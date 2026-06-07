import React from 'react';
import { qualityLevels } from '../services/adaptationEngine';

// Energy calculation function
const calculateEnergyConsumption = (quality) => {
  const baseQualityPower = qualityLevels[quality].power;
  const networkPower = 0.15 * qualityLevels[quality].bitrate + 50;
  const cpuPower = quality === '1080p' ? 180 : quality === '720p' ? 120 : 80;
  const displayPower = 150;
  const gpuPower = quality === '1080p' ? 100 : quality === '720p' ? 60 : 40;
  
  return {
    network: Math.round(networkPower),
    cpu: Math.round(cpuPower),
    display: Math.round(displayPower),
    gpu: Math.round(gpuPower),
    total: Math.round(networkPower + cpuPower + displayPower + gpuPower)
  };
};

// Carbon footprint calculation
const calculateCarbonFootprint = (powerMW, carbonIntensity, durationMinutes) => {
  const energyKWh = (powerMW / 1000 / 1000) * (durationMinutes / 60);
  const carbonGrams = energyKWh * carbonIntensity;
  
  return {
    energyKWh: energyKWh.toFixed(4),
    carbonGrams: carbonGrams.toFixed(2),
    carbonKg: (carbonGrams / 1000).toFixed(4)
  };
};

const RealCarbonTracker = ({ carbonIntensity, location, currentQuality, isMonitoring }) => {
  const energyMW = calculateEnergyConsumption(currentQuality).total;
  const carbonData = calculateCarbonFootprint(energyMW, carbonIntensity || 350, 60);
  
  const getCarbonColor = () => {
    if (!carbonIntensity) return '#6b7280';
    if (carbonIntensity > 400) return '#ef4444';
    if (carbonIntensity > 250) return '#f59e0b';
    return '#10b981';
  };
  
  const getCarbonLabel = () => {
    if (!carbonIntensity) return 'Loading...';
    if (carbonIntensity > 400) return 'High (Fossil Fuels)';
    if (carbonIntensity > 250) return 'Medium (Mixed Grid)';
    return 'Low (Clean Energy)';
  };
  
  const getCarbonSource = () => {
    if (!carbonIntensity) return 'Detecting...';
    if (carbonIntensity > 400) return 'Coal/Gas Power';
    if (carbonIntensity > 250) return 'Mixed Sources';
    return 'Renewables';
  };
  
  return (
    <div className="metric-card">
      <h3>
        <span style={{ fontSize: '1.3rem' }}></span>
        Real Carbon Tracker
      </h3>
      
      {!carbonIntensity ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <div>Fetching carbon intensity...</div>
          <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            {location ? `Location: ${location.lat.toFixed(2)}°, ${location.lon.toFixed(2)}°` : 'Getting location...'}
          </div>
        </div>
      ) : (
        <>
          <div className="metric-value" style={{ color: getCarbonColor() }}>
            {carbonIntensity}
          </div>
          <p className="metric-label" style={{ marginBottom: '1.5rem' }}>
            gCO₂e/kWh - {getCarbonLabel()}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                Grid Source
              </div>
              <div style={{ 
                fontSize: '1rem', 
                fontWeight: '700',
                color: getCarbonColor(),
                marginTop: '0.5rem'
              }}>
                {getCarbonSource()}
              </div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                Location
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600',
                color: 'white',
                marginTop: '0.5rem'
              }}>
                {location ? `${location.lat.toFixed(1)}°, ${location.lon.toFixed(1)}°` : 'Unknown'}
              </div>
            </div>
          </div>
          
          {isMonitoring && (
            <div className="metric-details">
              <div className="metric-row">
                <span>Current Power:</span>
                <strong>{energyMW} mW</strong>
              </div>
              <div className="metric-row">
                <span>Hourly Energy:</span>
                <strong>{(energyMW / 1000).toFixed(2)} Wh</strong>
              </div>
              <div className="metric-row">
                <span>Hourly Carbon:</span>
                <strong style={{ color: getCarbonColor() }}>{carbonData.carbonGrams} gCO₂e</strong>
              </div>
              <div className="metric-row">
                <span>Session Impact:</span>
                <strong style={{ color: getCarbonColor() }}>{carbonData.carbonGrams} gCO₂e</strong>
              </div>
              
              {/* Visual carbon bar */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  <span>Carbon Intensity</span>
                  <span style={{ color: getCarbonColor() , fontWeight: '600' }}>
                    {carbonIntensity > 400 ? 'High' : carbonIntensity > 250 ? 'Medium' : 'Low'}
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min((carbonIntensity / 600) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${getCarbonColor()} 0%, ${getCarbonColor()}cc 100%)`,
                    transition: 'width 0.5s ease, background 0.5s ease',
                    boxShadow: `0 0 10px ${getCarbonColor()}80`
                  }} />
                </div>
              </div>
            </div>
          )}
          
          {carbonIntensity > 400 && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))', 
              borderRadius: '12px',
              fontSize: '0.9rem',
              color: '#f59e0b',
              fontWeight: 600,
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🌐</span>
                <span>High Carbon Period - Reduce Quality to Cut Emissions</span>
              </div>
            </div>
          )}
          
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.8)',
            borderLeft: '3px solid #22c55e'
          }}>
            <strong>Live data:</strong> Carbon intensity from {location ? 'CO2Signal API' : 'estimated based on time of day'}
            {location && (
              <div style={{ marginTop: '0.5rem', opacity: 0.8 }}>
                Updates every 15 minutes for your region
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RealCarbonTracker;
