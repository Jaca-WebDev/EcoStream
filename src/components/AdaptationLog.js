import React from 'react';

const AdaptationLog = ({ decisions }) => {
  const getLogClass = (mode) => {
    if (mode === 'Battery Critical') return 'log-entry battery-critical';
    if (mode === 'Carbon Conscious') return 'log-entry carbon-conscious';
    return 'log-entry';
  };
  
  const getModeClass = (mode) => {
    if (mode === 'Battery Critical') return 'log-mode battery-critical';
    if (mode === 'Carbon Conscious') return 'log-mode carbon-conscious';
    return 'log-mode multi-objective';
  };
  
  return (
    <div className="metric-card">
      <h3> Decision Log</h3>
      
      <div style={{ 
        background: '#f0fdf4', 
        padding: '0.75rem', 
        borderRadius: '8px',
        marginBottom: '1rem',
        fontSize: '0.875rem'
      }}>
        <strong>Total Decisions:</strong> {decisions.length}
      </div>
      
      <div className="log-container">
        {decisions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Start monitoring to see decisions...
          </div>
        ) : (
          decisions.slice().reverse().map((decision, idx) => (
            <div key={idx} className={getLogClass(decision.decision.mode)}>
              <div className="log-time">
                ⏰ {decision.timestamp}
              </div>
              <div className="log-decision">
                <strong>Quality:</strong> {decision.decision.quality} ({decision.metrics.bitrate} kbps)
              </div>
              <div className="log-decision">
                <strong>Power:</strong> {decision.metrics.power} mW
              </div>
              <div className="log-decision" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {decision.decision.reasoning}
              </div>
              <div className={getModeClass(decision.decision.mode)}>
                {decision.decision.mode}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdaptationLog;
