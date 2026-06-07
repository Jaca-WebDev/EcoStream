import React from 'react';
import { qualityLevels } from '../services/adaptationEngine';

const VideoPlayer = ({ isMonitoring, currentQuality, recommendedQuality, onStart, onStop }) => {
  const qualityInfo = qualityLevels[currentQuality];
  const isDifferent = recommendedQuality !== currentQuality;
  
  return (
    <div className="video-container">
      <div className="video-placeholder">
        <div className="video-placeholder-icon" style={{
          fontSize: '5rem',
          filter: isMonitoring ? 'drop-shadow(0 0 30px rgba(16, 185, 129, 0.8))' : 'none'
        }}>
          {isMonitoring ? 'In session' : '🎯'} 
        </div>
        {/* 📊 */}
        
        <h2 style={{
          background: isMonitoring 
            ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #10b981 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Smart Streaming Dashboard
        </h2>
        
        <p style={{
          fontSize: '1.05rem',
          fontWeight: isMonitoring ? '600' : '400',
          color: isMonitoring ? '#10b981' : 'rgba(255, 255, 255, 0.8)',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          {isMonitoring 
            ? `Monitoring Active • Current: ${currentQuality} • Recommended: ${recommendedQuality}`
            : 'Real-time monitoring for Zoom, Teams, and Google Meet streaming sessions'
          }
        </p>
        
        {isMonitoring && isDifferent && (
          <div style={{
            marginTop: '1rem',
            padding: '0.875rem 1.5rem',
            background: 'rgba(59, 130, 246, 0.15)',
            borderRadius: '10px',
            border: '2px solid rgba(59, 130, 246, 0.4)',
            fontSize: '0.95rem',
            color: '#3b82f6',
            fontWeight: '600'
          }}>
            💡 Recommendation: Switch to {recommendedQuality} for better efficiency
          </div>
        )}
        
        {isMonitoring && !isDifferent && (
          <div style={{
            marginTop: '1rem',
            padding: '0.875rem 1.5rem',
            background: 'rgba(16, 185, 129, 0.15)',
            borderRadius: '10px',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            fontSize: '0.95rem',
            color: '#10b981',
            fontWeight: '600'
          }}>
            ✅ Optimal quality - You're using the recommended setting
          </div>
        )}
        
        {!isMonitoring ? (
          <button 
            onClick={onStart} 
            className="btn-primary"
            style={{
              marginTop: '1.5rem',
              fontSize: '1.1rem',
              padding: '1rem 2.5rem'
            }}
          >
            ▶ START 
          </button>
        ) : (
          <button 
            onClick={onStop} 
            className="btn-danger"
            style={{
              marginTop: '1.5rem',
              fontSize: '1.1rem',
              padding: '1rem 2.5rem'
            }}
          >
            ⏹ STOP
          </button>
        )}
      </div>
      
      {isMonitoring && (
        <div className="quality-badge">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '6px',
              height: '6px',
              background: 'white',
              borderRadius: '50%',
              animation: 'pulse 1s ease-in-out infinite'
            }} />
            <span>Current: {currentQuality} • {qualityInfo.bitrate} kbps</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
