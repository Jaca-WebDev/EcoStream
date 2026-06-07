import React, { useEffect, useState } from 'react';
import { qualityLevels } from '../services/adaptationEngine';

// Energy calculation function (moved from mockData)
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

const RealBatteryMonitor = ({ battery, charging, currentQuality, isMonitoring }) => {
  const [animatedBattery, setAnimatedBattery] = useState(battery);
  const energyBreakdown = calculateEnergyConsumption(currentQuality);
  
  // Smooth battery animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBattery(battery);
    }, 100);
    return () => clearTimeout(timer);
  }, [battery]);
  
  const getBatteryColor = () => {
    if (battery === null) return '#6b7280';
    if (battery < 20) return '#ef4444';
    if (battery < 50) return '#f59e0b';
    return '#10b981';
  };
  
  const getBatteryIcon = () => {
    if (charging) return '🔌';
    if (battery === null) return '🔋';
    if (battery < 20) return '🪫';
    if (battery < 50) return '🔋';
    return '🔋';
  };
  
  const getBatteryStatus = () => {
    if (battery === null) return 'Reading...';
    if (charging) return 'Charging';
    if (battery < 20) return 'Critical';
    if (battery < 50) return 'Low';
    return 'Good';
  };
  
  return (
    <div className="metric-card">
      <h3>
        <span style={{ fontSize: '1.3rem' }}></span> {/* ⚡ */}
        Real Battery Monitor
      </h3>
      
      {battery === null ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <div>Detecting battery status...</div>
          <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Using Browser Battery Status API
          </div>
        </div>
      ) : (
        <>
          {/* Battery visualization */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              position: 'relative',
              width: '100%',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: `2px solid ${getBatteryColor()}`,
              boxShadow: `0 0 20px ${getBatteryColor()}40`
            }}>
              {/* Battery fill animation */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: `${animatedBattery}%`,
                background: `linear-gradient(180deg, ${getBatteryColor()} 0%, ${getBatteryColor()}cc 100%)`,
                transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 0 20px ${getBatteryColor()}60 inset`
              }} />
              
              {/* Battery percentage overlay */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '2rem',
                fontWeight: '800',
                color: 'white',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                zIndex: 2
              }}>
                {getBatteryIcon()} {battery}%
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                Status
              </div>
              <div style={{ 
                fontSize: '1.1rem', 
                fontWeight: '700',
                color: getBatteryColor(),
                marginTop: '0.25rem'
              }}>
                {getBatteryStatus()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                Source
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600',
                color: 'white',
                marginTop: '0.25rem'
              }}>
                {charging ? 'AC Power' : 'Battery'}
              </div>
            </div>
          </div>
          
          {isMonitoring && (
            <>
              <div className="metric-details">
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontWeight: '600', color: 'white' }}>Total Power:</span>
                    <strong style={{ color: '#10b981' }}>{energyBreakdown.total} mW</strong>
                  </div>
                  <div style={{
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(energyBreakdown.total / 1000) * 100}%`,
                      background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
                      transition: 'width 0.5s ease',
                      boxShadow: '0 0 10px #10b98180'
                    }} />
                  </div>
                </div>
                
                {/* Individual components with progress bars */}
                {[
                  { label: '• Network', value: energyBreakdown.network, max: 400, color: '#3b82f6' },
                  { label: '• CPU (Decoding)', value: energyBreakdown.cpu, max: 200, color: '#8b5cf6' },
                  { label: '• Display', value: energyBreakdown.display, max: 200, color: '#f59e0b' },
                  { label: '• GPU (Rendering)', value: energyBreakdown.gpu, max: 150, color: '#ec4899' }
                ].map((component, idx) => (
                  <div key={idx} style={{ marginBottom: '0.75rem' }}>
                    <div className="metric-row" style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ fontSize: '0.9rem' }}>{component.label}</span>
                      <strong style={{ color: component.color }}>{component.value} mW</strong>
                    </div>
                    <div style={{
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(component.value / component.max) * 100}%`,
                        background: component.color,
                        transition: 'width 0.5s ease',
                        boxShadow: `0 0 8px ${component.color}80`
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {battery !== null && battery < 20 && !charging && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))', 
              borderRadius: '12px',
              fontSize: '0.9rem',
              color: '#ef4444',
              fontWeight: 600,
              border: '1px solid rgba(239, 68, 68, 0.3)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <span>Battery Critical - Reduce Quality to Extend Life</span>
              </div>
            </div>
          )}
          
          {charging && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))', 
              borderRadius: '12px',
              fontSize: '0.9rem',
              color: '#10b981',
              fontWeight: 600,
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🔌</span>
                <span>Charging - Power constraints relaxed</span>
              </div>
            </div>
          )}
        </>
      )}
      
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '8px',
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.8)',
        borderLeft: '3px solid #3b82f6'
      }}>
        <strong>Real-time monitoring:</strong> Using Browser Battery Status API to read actual laptop battery level
      </div>
    </div>
  );
};

export default RealBatteryMonitor;
