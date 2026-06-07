import React from 'react';
import { qualityLevels } from '../services/adaptationEngine';

const RecommendationEngine = ({ 
  recommendedQuality, 
  currentQuality, 
  energySavings, 
  carbonSavings,
  isMonitoring 
}) => {
  const isDifferent = recommendedQuality !== currentQuality;
  const recommended = qualityLevels[recommendedQuality];
  const current = qualityLevels[currentQuality];
  
  const getRecommendationColor = () => {
    if (!isDifferent) return '#10b981'; // Green - optimal
    if (energySavings.percentage > 30) return '#ef4444'; // Red - critical change needed
    return '#f59e0b'; // Amber - improvement possible
  };
  
  const getRecommendationIcon = () => {
    if (!isDifferent) return '✅';
    return '💡';
  };
  
  return ( 
    <div className="metric-card">
      <h3>
        <span style={{ fontSize: '1.3rem' }}></span>
        Recommendation Engine
      </h3>
      
      {!isMonitoring ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏸️</div>
          <div>Start monitoring to get recommendations</div>
        </div>
      ) : (
        <>
          {/* Main Recommendation */}
          <div style={{
            padding: '1.5rem',
            background: `linear-gradient(135deg, ${getRecommendationColor()}20, ${getRecommendationColor()}10)`,
            borderRadius: '12px',
            border: `2px solid ${getRecommendationColor()}40`,
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {getRecommendationIcon()}
            </div>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '800',
              color: getRecommendationColor(),
              marginBottom: '0.5rem'
            }}>
              {recommendedQuality}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '600'
            }}>
              {isDifferent ? '⚠️ Recommended Quality' : '✅ Optimal Quality'}
            </div>
          </div>
          
          {/* Current vs Recommended Comparison */}
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
              textAlign: 'center',
              border: isDifferent ? '2px solid rgba(245, 158, 11, 0.3)' : '2px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
                Current
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                color: isDifferent ? '#f59e0b' : '#10b981'
              }}>
                {currentQuality}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                {current.bitrate} kbps
              </div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
                Optimal
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                color: '#10b981'
              }}>
                {recommendedQuality}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                {recommended.bitrate} kbps
              </div>
            </div>
          </div>
          
          {/* Savings Information */}
          {isDifferent && (
            <div style={{
              padding: '1.25rem',
              background: 'rgba(16, 185, 129, 0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              marginBottom: '1rem'
            }}>
              <div style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600',
                color: '#10b981',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                💰 Potential Savings by Switching:
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: '800',
                    color: '#10b981'
                  }}>
                    {energySavings.percentage}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.25rem' }}>
                    Energy Saved
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                    {energySavings.mW} mW less
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: '800',
                    color: '#10b981'
                  }}>
                    {carbonSavings.percentage}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.25rem' }}>
                    Carbon Reduced
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                    {carbonSavings.grams}g CO₂/hr
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Action needed message */}
          {isDifferent ? (
            <div style={{ 
              padding: '1rem', 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))', 
              borderRadius: '10px',
              fontSize: '0.875rem',
              color: '#3b82f6',
              fontWeight: 600,
              border: '1px solid rgba(59, 130, 246, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🎬</div>
              <div>
                Change Zoom/Teams quality to <strong>{recommendedQuality}</strong> 
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.9 }}>
                Then update "Current Quality" dropdown above
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '1rem', 
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))', 
              borderRadius: '10px',
              fontSize: '0.875rem',
              color: '#10b981',
              fontWeight: 600,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>✅</div>
              <div>You're using the optimal quality!</div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.9 }}>
                No changes needed right now
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecommendationEngine;
