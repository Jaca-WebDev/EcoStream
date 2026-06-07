import React, { useMemo } from 'react';

const Dashboard = ({ decisions, battery, carbonIntensity, sessionStart, energySavings, carbonSavings }) => {
  const getSessionDuration = () => {
    if (!sessionStart) return '0:00';
    const now = new Date();
    const diff = Math.floor((now - sessionStart) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const getQualityDistribution = () => {
    if (decisions.length === 0) return [];
    
    const distribution = {};
    decisions.forEach(d => {
      const quality = d.decision.quality;
      distribution[quality] = (distribution[quality] || 0) + 1;
    });
    
    const total = decisions.length;
    return Object.entries(distribution).map(([quality, count]) => ({
      quality,
      count,
      percentage: ((count / total) * 100).toFixed(1)
    }));
  };
  
  const avgPower = useMemo(() => {
    if (decisions.length === 0) return 0;
    const total = decisions.reduce((sum, d) => sum + d.metrics.power, 0);
    return Math.round(total / decisions.length);
  }, [decisions]);
  
  return (
    <div className="dashboard">
      <h2> Session Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">{decisions.length}</div>
          <p className="stat-label">Total Decisions</p>
        </div>
        
        <div className="stat-box">
          <div className="stat-value">{avgPower}</div>
          <p className="stat-label">Avg Power (mW)</p>
        </div>
        
        <div className="stat-box">
          <div className="stat-value">{getSessionDuration()}</div>
          <p className="stat-label">Session Duration</p>
        </div>
        
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {energySavings.percentage}%
          </div>
          <p className="stat-label">Energy Saved</p>
        </div>
        
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {carbonSavings.percentage}%
          </div>
          <p className="stat-label">Carbon Reduced</p>
        </div>
        
        <div className="stat-box">
          <div className="stat-value">{carbonSavings.grams}</div>
          <p className="stat-label">CO₂ Saved (g)</p>
        </div>
      </div>
      
      {getQualityDistribution().length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>
            Quality Distribution
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: '1rem'
          }}>
            {getQualityDistribution().map(({ quality, count, percentage }) => (
              <div 
                key={quality}
                style={{
                  background: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#10b981' }}>
                  {percentage}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {quality} ({count}×)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: '#ecfdf5', 
        borderRadius: '12px',
        borderLeft: '4px solid #10b981'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#065f46' }}>
           Session Summary
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          fontSize: '0.875rem'
        }}>
          <div>
            <strong>Battery Status:</strong>
            <div style={{ color: battery < 20 ? '#dc2626' : '#059669' }}>
              {battery}% {battery < 20 ? '(Critical)' : '(Normal)'}
            </div>
          </div>
          <div>
            <strong>Carbon Intensity:</strong>
            <div style={{ color: carbonIntensity > 400 ? '#dc2626' : '#059669' }}>
              {carbonIntensity} gCO₂e/kWh
            </div>
          </div>
          <div>
            <strong>Energy Efficiency:</strong>
            <div style={{ color: '#059669' }}>
              {energySavings.mW} mW saved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
