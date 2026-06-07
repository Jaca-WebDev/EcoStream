import React from 'react';

const NetworkMonitor = ({ speed, connectionType }) => {
  const getSpeedColor = () => {
    if (!speed) return '#6b7280';
    if (speed < 1) return '#ef4444';
    if (speed < 3) return '#f59e0b';
    return '#10b981';
  };
  
  const getSpeedLabel = () => {
    if (!speed) return 'Detecting...';
    if (speed < 1) return 'Slow';
    if (speed < 3) return 'Medium';
    if (speed < 8) return 'Fast';
    return 'Very Fast';
  };
  
  const getConnectionIcon = () => {
    if (!connectionType) return '📡';
    if (connectionType.includes('wifi')) return '📶';
    if (connectionType.includes('4g') || connectionType.includes('5g')) return '📱';
    return '🌐';
  };
  
  return (
    <div className="metric-card">
      <h3>
        <span style={{ fontSize: '1.3rem' }}></span>
        Network Monitor
      </h3>
      
      {!speed ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <div>Detecting network...</div>
        </div>
      ) : (
        <>
          <div className="metric-value" style={{ color: getSpeedColor() }}>
            {speed.toFixed(1)}
          </div>
          <p className="metric-label" style={{ marginBottom: '1.5rem' }}>
            Mbps - {getSpeedLabel()}
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
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {getConnectionIcon()}
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600',
                color: 'white'
              }}>
                {connectionType || 'Unknown'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                Connection Type
              </div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                color: getSpeedColor(),
                marginBottom: '0.5rem'
              }}>
                {getSpeedLabel()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                Network Speed
              </div>
            </div>
          </div>
          
          {/* Speed bar visualization */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <span>Download Speed</span>
              <span style={{ color: getSpeedColor(), fontWeight: '600' }}>
                {speed.toFixed(1)} Mbps
              </span>
            </div>
            <div style={{
              height: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min((speed / 20) * 100, 100)}%`,
                background: `linear-gradient(90deg, ${getSpeedColor()} 0%, ${getSpeedColor()}cc 100%)`,
                transition: 'width 0.5s ease',
                boxShadow: `0 0 10px ${getSpeedColor()}80`
              }} />
            </div>
          </div>
          
          {/* Quality recommendations based on speed */}
          <div className="metric-details">
            <div style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600',
              color: 'white',
              marginBottom: '0.75rem'
            }}>
              Supported Qualities:
            </div>
            
            {[
              { quality: '360p', minSpeed: 0.5 },
              { quality: '480p', minSpeed: 1 },
              { quality: '720p', minSpeed: 2 },
              { quality: '1080p', minSpeed: 4 }
            ].map(({ quality, minSpeed }) => {
              const supported = speed >= minSpeed;
              return (
                <div key={quality} className="metric-row" style={{
                  background: supported ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem',
                  marginBottom: '0.5rem',
                  opacity: supported ? 1 : 0.5
                }}>
                  <span style={{ fontSize: '0.85rem' }}>
                    {supported ? '✅' : '❌'} {quality}
                  </span>
                  <span style={{ 
                    fontSize: '0.8rem',
                    color: supported ? '#10b981' : 'rgba(255,255,255,0.5)'
                  }}>
                    {minSpeed} Mbps
                  </span>
                </div>
              );
            })}
          </div>
          
          {speed < 2 && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))', 
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#ef4444',
              fontWeight: 600,
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚠️</span>
                <span>Slow network - use 480p or lower to prevent buffering</span>
              </div>
            </div>
          )}
          
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'rgba(147, 51, 234, 0.1)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.8)',
            borderLeft: '3px solid #9333ea'
          }}>
            <strong>Real-time monitoring:</strong> Using Network Information API to detect connection speed and type
          </div>
        </>
      )}
    </div>
  );
};

export default NetworkMonitor;
